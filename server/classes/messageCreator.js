export class MessageCreator {
  constructor(messageType, messagePayload) {
    this.messageType = messageType
    this.messagePayload = messagePayload
  }

  toJSON() {
    return JSON.stringify({
      messageType: this.messageType,
      messagePayload: this.messagePayload,
    })
  }
}