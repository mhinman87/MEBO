import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Observable } from 'rxjs';
import { FoodTruck } from '../../models/foodtruck.model';

/**
 * Generated class for the MissionControlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mission-control',
  templateUrl: 'mission-control.html',
})
export class MissionControlPage {

  events$: Observable<FoodTruck[]>;
  x: any;
  currentTime: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private dbProvider: DatabaseProvider) {

                this.events$ = this.dbProvider.getUpcomingEvents().map((data)=>{
                  data.sort(this.auraDescending);
                  return data;
                })
                const second = 1000;
                this.x = setInterval(() => {
                  this.currentTime = new Date().getTime();
                    }, second)
                    setTimeout(()=>{
                    }, 1000);
                
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad MissionControlPage');
  }

  auraDescending(a, b) {
    return a.aura > b.aura ? -1 : 1
  }

  navToDetails(foodtruck: FoodTruck){
    this.navCtrl.push('UpcomingDetailsPage', {
      truckData: foodtruck
      })
  }

  minsRemaining(time){
    return Math.floor((time + 5*3600000 - this.currentTime)/60000)
  }

}
