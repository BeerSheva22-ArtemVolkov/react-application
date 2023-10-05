type MessageType = {
    _id: string
    messageObj: {
        to?: string
        group?: string
        text: string
    }
    from: string
    sendingDateTime: string
}

export default MessageType