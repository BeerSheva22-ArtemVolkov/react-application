type ChatType = {
    name: string | undefined
    index: number
    members: string[]
    admins: string[]
    requests: string[]
    class: 'group' | 'to' | undefined
    image: string
}

export default ChatType