import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FoodTruck } from '../../models/foodtruck.model';
import { User } from 'firebase/app';
import { AuthService } from '../../providers/auth/auth.service';

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
  accountSubscription: any;
  authenticatedUser = {} as User;
  hideEditButton: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private auth: AuthService) {
                    this.foodtruck = this.navParams.get('truckData');
                    const second = 1000;
                                this.x = setInterval(() => {
                                  this.currentTime = new Date().getTime();
                                    }, second)
                                    setTimeout(()=>{
                                    }, 1000);

                    this.accountSubscription = this.auth.getAuthenticatedUser().subscribe((user: User)=>{
                      if (user != null){
                       try {
                         this.authenticatedUser = user;
                         console.log(this.authenticatedUser);
                       } catch(e) {
                         console.error(e);
                       }
                      }
                      if (this.authenticatedUser.uid == this.foodtruck.ownerId){
                        this.hideEditButton = false;
                      } else {
                        this.hideEditButton = true;
                      }
                     }) 
  }

  ionViewDidLoad() {
    
  }

  goBack(){
    this.navCtrl.pop();
  }

  minsRemaining(time){
    return Math.floor((time + 5*3600000 - this.currentTime)/60000)
  }

  navToEdit(){
    this.navCtrl.push('EditEventPage', {
      truckData: this.foodtruck
      })
  }

}
