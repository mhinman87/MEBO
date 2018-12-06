import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FoodTruck } from '../../models/foodtruck.model';

/**
 * Generated class for the UpcomingDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upcoming-details',
  templateUrl: 'upcoming-details.html',
})
export class UpcomingDetailsPage {

  foodtruck: FoodTruck;
  x: any;
  currentTime: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
    this.foodtruck = this.navParams.get('truckData');
    const second = 1000;
                this.x = setInterval(() => {
                  this.currentTime = new Date().getTime();
                    }, second)
                    setTimeout(()=>{
                    }, 1000);
  }

  ionViewDidLoad() {
    
  }

  goBack(){
    this.navCtrl.pop();
  }

  minsRemaining(time){
    return Math.floor((time + 5*3600000 - this.currentTime)/60000)
  }
  

}
