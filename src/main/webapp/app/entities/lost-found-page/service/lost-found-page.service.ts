import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILostFoundPage, NewLostFoundPage } from '../lost-found-page.model';

export type PartialUpdateLostFoundPage = Partial<ILostFoundPage> & Pick<ILostFoundPage, 'id'>;

export type EntityResponseType = HttpResponse<ILostFoundPage>;
export type EntityArrayResponseType = HttpResponse<ILostFoundPage[]>;

@Injectable({ providedIn: 'root' })
export class LostFoundPageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lost-found-pages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(lostFoundPage: NewLostFoundPage): Observable<EntityResponseType> {
    return this.http.post<ILostFoundPage>(this.resourceUrl, lostFoundPage, { observe: 'response' });
  }

  update(lostFoundPage: ILostFoundPage): Observable<EntityResponseType> {
    return this.http.put<ILostFoundPage>(`${this.resourceUrl}/${this.getLostFoundPageIdentifier(lostFoundPage)}`, lostFoundPage, {
      observe: 'response',
    });
  }

  partialUpdate(lostFoundPage: PartialUpdateLostFoundPage): Observable<EntityResponseType> {
    return this.http.patch<ILostFoundPage>(`${this.resourceUrl}/${this.getLostFoundPageIdentifier(lostFoundPage)}`, lostFoundPage, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILostFoundPage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILostFoundPage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLostFoundPageIdentifier(lostFoundPage: Pick<ILostFoundPage, 'id'>): number {
    return lostFoundPage.id;
  }

  compareLostFoundPage(o1: Pick<ILostFoundPage, 'id'> | null, o2: Pick<ILostFoundPage, 'id'> | null): boolean {
    return o1 && o2 ? this.getLostFoundPageIdentifier(o1) === this.getLostFoundPageIdentifier(o2) : o1 === o2;
  }

  addLostFoundPageToCollectionIfMissing<Type extends Pick<ILostFoundPage, 'id'>>(
    lostFoundPageCollection: Type[],
    ...lostFoundPagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const lostFoundPages: Type[] = lostFoundPagesToCheck.filter(isPresent);
    if (lostFoundPages.length > 0) {
      const lostFoundPageCollectionIdentifiers = lostFoundPageCollection.map(
        lostFoundPageItem => this.getLostFoundPageIdentifier(lostFoundPageItem)!
      );
      const lostFoundPagesToAdd = lostFoundPages.filter(lostFoundPageItem => {
        const lostFoundPageIdentifier = this.getLostFoundPageIdentifier(lostFoundPageItem);
        if (lostFoundPageCollectionIdentifiers.includes(lostFoundPageIdentifier)) {
          return false;
        }
        lostFoundPageCollectionIdentifiers.push(lostFoundPageIdentifier);
        return true;
      });
      return [...lostFoundPagesToAdd, ...lostFoundPageCollection];
    }
    return lostFoundPageCollection;
  }
}
