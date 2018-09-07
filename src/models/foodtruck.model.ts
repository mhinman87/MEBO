export interface FoodTruck {
    //General Info 
    name: string;
    details: string;
    ownerName?: string;
    ownerId?: string;
    image: string;
    type: "foodtruck";
    id: string;
    aura: number;

    //Location Info
    lat: number;
    long: number;

    img: string;
    imgName: string;

    //Operation Hours
    eventStart: number;
    duration: number;
    eventEnd: number;


}