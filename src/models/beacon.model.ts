export interface Beacon {
    name: string;
    details: string;
    ownerName?: string;
    ownerId?: string;
    type: string;
    id: string;
    aura: number;
    eventDate?: string;
    img?: string;
    imgName?: string;

    //Operation Hours
    activeStart: number;
    duration: number;
    activeEnd: number;
}