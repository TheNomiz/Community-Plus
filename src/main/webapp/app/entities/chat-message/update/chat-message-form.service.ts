import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IChatMessage, NewChatMessage } from '../chat-message.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChatMessage for edit and NewChatMessageFormGroupInput for create.
 */
type ChatMessageFormGroupInput = IChatMessage | PartialWithRequiredKeyOf<NewChatMessage>;

type ChatMessageFormDefaults = Pick<NewChatMessage, 'id'>;

type ChatMessageFormGroupContent = {
  id: FormControl<IChatMessage['id'] | NewChatMessage['id']>;
  content: FormControl<IChatMessage['content']>;
  sentDate: FormControl<IChatMessage['sentDate']>;
  room: FormControl<IChatMessage['room']>;
};

export type ChatMessageFormGroup = FormGroup<ChatMessageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChatMessageFormService {
  createChatMessageFormGroup(chatMessage: ChatMessageFormGroupInput = { id: null }): ChatMessageFormGroup {
    const chatMessageRawValue = {
      ...this.getFormDefaults(),
      ...chatMessage,
    };
    return new FormGroup<ChatMessageFormGroupContent>({
      id: new FormControl(
        { value: chatMessageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      content: new FormControl(chatMessageRawValue.content, {
        validators: [Validators.required],
      }),
      sentDate: new FormControl(chatMessageRawValue.sentDate, {
        validators: [Validators.required],
      }),
      room: new FormControl(chatMessageRawValue.room),
    });
  }

  getChatMessage(form: ChatMessageFormGroup): IChatMessage | NewChatMessage {
    return form.getRawValue() as IChatMessage | NewChatMessage;
  }

  resetForm(form: ChatMessageFormGroup, chatMessage: ChatMessageFormGroupInput): void {
    const chatMessageRawValue = { ...this.getFormDefaults(), ...chatMessage };
    form.reset(
      {
        ...chatMessageRawValue,
        id: { value: chatMessageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChatMessageFormDefaults {
    return {
      id: null,
    };
  }
}
