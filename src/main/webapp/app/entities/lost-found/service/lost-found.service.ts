import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILostFound, NewLostFound } from '../lost-found.model';

export type PartialUpdateLostFound = Partial<ILostFound> & Pick<ILostFound, 'id'>;

type RestOf<T extends ILostFound | NewLostFound> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestLostFound = RestOf<ILostFound>;

export type NewRestLostFound = RestOf<NewLostFound>;

export type PartialUpdateRestLostFound = RestOf<PartialUpdateLostFound>;

export type EntityResponseType = HttpResponse<ILostFound>;
export type EntityArrayResponseType = HttpResponse<ILostFound[]>;

@Injectable({ providedIn: 'root' })
export class LostFoundService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lost-founds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(lostFound: NewLostFound): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lostFound);
    return this.http
      .post<RestLostFound>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(lostFound: ILostFound): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lostFound);
    return this.http
      .put<RestLostFound>(`${this.resourceUrl}/${this.getLostFoundIdentifier(lostFound)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(lostFound: PartialUpdateLostFound): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(lostFound);
    return this.http
      .patch<RestLostFound>(`${this.resourceUrl}/${this.getLostFoundIdentifier(lostFound)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLostFound>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLostFound[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLostFoundIdentifier(lostFound: Pick<ILostFound, 'id'>): number {
    return lostFound.id;
  }

  compareLostFound(o1: Pick<ILostFound, 'id'> | null, o2: Pick<ILostFound, 'id'> | null): boolean {
    return o1 && o2 ? this.getLostFoundIdentifier(o1) === this.getLostFoundIdentifier(o2) : o1 === o2;
  }

  addLostFoundToCollectionIfMissing<Type extends Pick<ILostFound, 'id'>>(
    lostFoundCollection: Type[],
    ...lostFoundsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const lostFounds: Type[] = lostFoundsToCheck.filter(isPresent);
    if (lostFounds.length > 0) {
      const lostFoundCollectionIdentifiers = lostFoundCollection.map(lostFoundItem => this.getLostFoundIdentifier(lostFoundItem)!);
      const lostFoundsToAdd = lostFounds.filter(lostFoundItem => {
        const lostFoundIdentifier = this.getLostFoundIdentifier(lostFoundItem);
        if (lostFoundCollectionIdentifiers.includes(lostFoundIdentifier)) {
          return false;
        }
        lostFoundCollectionIdentifiers.push(lostFoundIdentifier);
        return true;
      });
      return [...lostFoundsToAdd, ...lostFoundCollection];
    }
    return lostFoundCollection;
  }

  protected convertDateFromClient<T extends ILostFound | NewLostFound | PartialUpdateLostFound>(lostFound: T): RestOf<T> {
    return {
      ...lostFound,
      date: lostFound.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restLostFound: RestLostFound): ILostFound {
    return {
      ...restLostFound,
      date: restLostFound.date ? dayjs(restLostFound.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLostFound>): HttpResponse<ILostFound> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLostFound[]>): HttpResponse<ILostFound[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  filter(filterItem: any, date: string, location: any): Observable<HttpResponse<ILostFound[]>> {
    const options = {
      item: filterItem,
      date,
      location,
    };

    return this.http.get<ILostFound[]>(`${this.resourceUrl}/` + 'filter', {
      params: options,
      observe: 'response',
    });
  }
}
