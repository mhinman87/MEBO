import { FoodTruck } from './foodtruck.model';

export class FoodTruckMarker extends google.maps.Marker {
    truckData: FoodTruck;

    constructor(theTruckData: FoodTruck){
        super();
        this.truckData = theTruckData;
    }
}