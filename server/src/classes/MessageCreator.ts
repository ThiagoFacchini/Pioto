import { MessagePayloads, MessageType } from '../../../shared/messageTypes.ts'

export class MessageCreator<T extends MessageType> {
  messageType: T
  messagePayload: MessagePayloads[T]

  constructor( messageType: T, messagePayload: MessagePayloads[T] ) {
    this.messageType = messageType
    this.messagePayload = messagePayload
  }

  toJSON(): string {
    return JSON.stringify({
      messageType: this.messageType,
      messagePayload: this.messagePayload,
    })
  }
}