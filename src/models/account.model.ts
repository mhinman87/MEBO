export interface Account {
    uid: string;
    username: string;
    email: string;
    password: string;
    isVendor: boolean;
    profilePic: string;
    profilePicName: string;
    aura: number;
    eventCheckInTimer: number;
}