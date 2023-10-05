import { Dayjs } from "dayjs"

type ChatFilterType = {
    includeFrom: boolean
    from: string
    dateTimeFrom: Dayjs | null
    dateTimeTo: Dayjs | null
}

export default ChatFilterType