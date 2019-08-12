export interface UserComment {
    id: string,
    userId: string,
    username: string,
    text: string,
    parent_id: number,
    hideReplyTextbox: boolean,
    hideInputTextbox: boolean,
    time: number,
    date: string
}