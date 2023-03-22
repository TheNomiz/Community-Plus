import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IChatRoom, NewChatRoom } from '../chat-room.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChatRoom for edit and NewChatRoomFormGroupInput for create.
 */
type ChatRoomFormGroupInput = IChatRoom | PartialWithRequiredKeyOf<NewChatRoom>;

type ChatRoomFormDefaults = Pick<NewChatRoom, 'id' | 'events' | 'businesses' | 'lostitems'>;

type ChatRoomFormGroupContent = {
  id: FormControl<IChatRoom['id'] | NewChatRoom['id']>;
  name: FormControl<IChatRoom['name']>;
  events: FormControl<IChatRoom['events']>;
  businesses: FormControl<IChatRoom['businesses']>;
  lostitems: FormControl<IChatRoom['lostitems']>;
};

export type ChatRoomFormGroup = FormGroup<ChatRoomFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChatRoomFormService {
  createChatRoomFormGroup(chatRoom: ChatRoomFormGroupInput = { id: null }): ChatRoomFormGroup {
    const chatRoomRawValue = {
      ...this.getFormDefaults(),
      ...chatRoom,
    };
    return new FormGroup<ChatRoomFormGroupContent>({
      id: new FormControl(
        { value: chatRoomRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(chatRoomRawValue.name, {
        validators: [Validators.required, Validators.maxLength(50)],
      }),
      events: new FormControl(chatRoomRawValue.events ?? []),
      businesses: new FormControl(chatRoomRawValue.businesses ?? []),
      lostitems: new FormControl(chatRoomRawValue.lostitems ?? []),
    });
  }

  getChatRoom(form: ChatRoomFormGroup): IChatRoom | NewChatRoom {
    return form.getRawValue() as IChatRoom | NewChatRoom;
  }

  resetForm(form: ChatRoomFormGroup, chatRoom: ChatRoomFormGroupInput): void {
    const chatRoomRawValue = { ...this.getFormDefaults(), ...chatRoom };
    form.reset(
      {
        ...chatRoomRawValue,
        id: { value: chatRoomRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChatRoomFormDefaults {
    return {
      id: null,
      events: [],
      businesses: [],
      lostitems: [],
    };
  }
}
