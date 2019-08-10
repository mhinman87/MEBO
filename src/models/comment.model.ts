export interface UserComment {
    id: string,
    userId: string,
    username: string,
    text: string,
    parent_id: number,
    hideReplyTextbox: true,
    time: number,
    date: string
}