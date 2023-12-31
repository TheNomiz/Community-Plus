import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICrimeAlert, NewCrimeAlert } from '../crime-alert.model';

export type PartialUpdateCrimeAlert = Partial<ICrimeAlert> & Pick<ICrimeAlert, 'id'>;

type RestOf<T extends ICrimeAlert | NewCrimeAlert> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestCrimeAlert = RestOf<ICrimeAlert>;

export type NewRestCrimeAlert = RestOf<NewCrimeAlert>;

export type PartialUpdateRestCrimeAlert = RestOf<PartialUpdateCrimeAlert>;

export type EntityResponseType = HttpResponse<ICrimeAlert>;
export type EntityArrayResponseType = HttpResponse<ICrimeAlert[]>;

@Injectable({ providedIn: 'root' })
export class CrimeAlertService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/crime-alerts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  isCrimeIDUnique(crimeID: number): Observable<boolean> {
    const url = `${this.resourceUrl}/crime-alerts/exists/${crimeID}`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.http.get<boolean>(url).pipe(map((response: any) => response.isUnique));
  }

  create(crimeAlert: NewCrimeAlert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(crimeAlert);
    return this.http
      .post<RestCrimeAlert>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(crimeAlert: ICrimeAlert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(crimeAlert);
    return this.http
      .put<RestCrimeAlert>(`${this.resourceUrl}/${this.getCrimeAlertIdentifier(crimeAlert)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }
  // In your crime-alert.service.ts or similar service file
  getCrimeAlerts(params: any): Observable<EntityArrayResponseType> {
    return this.http.get<ICrimeAlert[]>(this.resourceUrl, { params, observe: 'response' });
  }

  partialUpdate(crimeAlert: PartialUpdateCrimeAlert): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(crimeAlert);
    return this.http
      .patch<RestCrimeAlert>(`${this.resourceUrl}/${this.getCrimeAlertIdentifier(crimeAlert)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCrimeAlert>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCrimeAlert[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  querypag(params?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(params);

    // Add pagination parameters to the query string
    if (params.page !== undefined && params.size !== undefined) {
      options.set('page', params.page.toString());
      options.set('size', params.size.toString());
    }

    return this.http.get<ICrimeAlert[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCrimeAlertIdentifier(crimeAlert: Pick<ICrimeAlert, 'id'>): number {
    return crimeAlert.id;
  }

  compareCrimeAlert(o1: Pick<ICrimeAlert, 'id'> | null, o2: Pick<ICrimeAlert, 'id'> | null): boolean {
    return o1 && o2 ? this.getCrimeAlertIdentifier(o1) === this.getCrimeAlertIdentifier(o2) : o1 === o2;
  }

  addCrimeAlertToCollectionIfMissing<Type extends Pick<ICrimeAlert, 'id'>>(
    crimeAlertCollection: Type[],
    ...crimeAlertsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const crimeAlerts: Type[] = crimeAlertsToCheck.filter(isPresent);
    if (crimeAlerts.length > 0) {
      const crimeAlertCollectionIdentifiers = crimeAlertCollection.map(crimeAlertItem => this.getCrimeAlertIdentifier(crimeAlertItem)!);
      const crimeAlertsToAdd = crimeAlerts.filter(crimeAlertItem => {
        const crimeAlertIdentifier = this.getCrimeAlertIdentifier(crimeAlertItem);
        if (crimeAlertCollectionIdentifiers.includes(crimeAlertIdentifier)) {
          return false;
        }
        crimeAlertCollectionIdentifiers.push(crimeAlertIdentifier);
        return true;
      });
      return [...crimeAlertsToAdd, ...crimeAlertCollection];
    }
    return crimeAlertCollection;
  }

  protected convertDateFromClient<T extends ICrimeAlert | NewCrimeAlert | PartialUpdateCrimeAlert>(crimeAlert: T): RestOf<T> {
    return {
      ...crimeAlert,
      date: crimeAlert.date?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCrimeAlert: RestCrimeAlert): ICrimeAlert {
    return {
      ...restCrimeAlert,
      date: restCrimeAlert.date ? dayjs(restCrimeAlert.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCrimeAlert>): HttpResponse<ICrimeAlert> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCrimeAlert[]>): HttpResponse<ICrimeAlert[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}

import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getCrimeData = async () => {
  const response = await axios.get('https://data.police.uk/api/crimes-street/all-crime?poly=52.268,0.543:52.794,0.238:52.130,0.478');

  const crimeAlerts: NewCrimeAlert[] = response.data.map((crime: any) => {
    const date = dayjs(crime.month);

    return {
      id: null,
      title: crime.category,
      description: null,
      lat: crime.location.latitude,
      lon: crime.location.longitude,
      date,
      postedby: 'admin',
    };
  });

  return crimeAlerts;
};

export default getCrimeData;
