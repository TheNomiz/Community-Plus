import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChatRoom, NewChatRoom } from '../chat-room.model';

export type PartialUpdateChatRoom = Partial<IChatRoom> & Pick<IChatRoom, 'id'>;

export type EntityResponseType = HttpResponse<IChatRoom>;
export type EntityArrayResponseType = HttpResponse<IChatRoom[]>;

@Injectable({ providedIn: 'root' })
export class ChatRoomService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/chat-rooms');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(chatRoom: NewChatRoom): Observable<EntityResponseType> {
    return this.http.post<IChatRoom>(this.resourceUrl, chatRoom, { observe: 'response' });
  }

  update(chatRoom: IChatRoom): Observable<EntityResponseType> {
    return this.http.put<IChatRoom>(`${this.resourceUrl}/${this.getChatRoomIdentifier(chatRoom)}`, chatRoom, { observe: 'response' });
  }

  partialUpdate(chatRoom: PartialUpdateChatRoom): Observable<EntityResponseType> {
    return this.http.patch<IChatRoom>(`${this.resourceUrl}/${this.getChatRoomIdentifier(chatRoom)}`, chatRoom, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChatRoom>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChatRoom[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getChatRoomIdentifier(chatRoom: Pick<IChatRoom, 'id'>): number {
    return chatRoom.id;
  }

  compareChatRoom(o1: Pick<IChatRoom, 'id'> | null, o2: Pick<IChatRoom, 'id'> | null): boolean {
    return o1 && o2 ? this.getChatRoomIdentifier(o1) === this.getChatRoomIdentifier(o2) : o1 === o2;
  }

  addChatRoomToCollectionIfMissing<Type extends Pick<IChatRoom, 'id'>>(
    chatRoomCollection: Type[],
    ...chatRoomsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const chatRooms: Type[] = chatRoomsToCheck.filter(isPresent);
    if (chatRooms.length > 0) {
      const chatRoomCollectionIdentifiers = chatRoomCollection.map(chatRoomItem => this.getChatRoomIdentifier(chatRoomItem)!);
      const chatRoomsToAdd = chatRooms.filter(chatRoomItem => {
        const chatRoomIdentifier = this.getChatRoomIdentifier(chatRoomItem);
        if (chatRoomCollectionIdentifiers.includes(chatRoomIdentifier)) {
          return false;
        }
        chatRoomCollectionIdentifiers.push(chatRoomIdentifier);
        return true;
      });
      return [...chatRoomsToAdd, ...chatRoomCollection];
    }
    return chatRoomCollection;
  }
}
