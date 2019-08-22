import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthService } from '../../providers/auth/auth.service'
import { FoodTruck } from '../../models/foodtruck.model';
import { User } from 'firebase/app';

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
export class MissionControlPage implements OnDestroy {

  events: FoodTruck[];
  $events: any;
  x: any;
  currentTime: number;
  loader: Loading;
  accountSubscription: any;
  eventsSubscription: any;
  authenticatedUser = {} as User;
  

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private dbProvider: DatabaseProvider,
              private loadingCtrl: LoadingController,
              private auth: AuthService) {
                this.showLoading()

                this.accountSubscription = this.auth.getAuthenticatedUser().subscribe((user: User)=>{
                  if (user != null){
                   try {
                     this.authenticatedUser = user;
                   } catch(e) {
                     console.error(e);
                   }
                  }
                 }) 

                this.getEvents()
                

                // this.eventsSubscription = this.dbProvider.getUpcomingEvents().subscribe((data)=>{
                //   this.events = data
                //   return this.events
                // })


                const second = 1000;
                this.x = setInterval(() => {
                  this.currentTime = new Date().getTime();
                    }, second)
                    setTimeout(()=>{
                    }, 1000);

                    
                setTimeout(()=>{
                  if(this.events != undefined){
                    this.sortEventsByAura()
                    this.loader.dismiss();
                  } else {
                    this.loader.dismiss();
                  }
                },3000)
                

  }
  

  ionViewDidLoad() {
    
  }

  async getEvents(){
    await this.dbProvider.getUpcomingEvents().map((data) => {
      this.events = data.sort((a, b) => {
          return a.aura < b.aura ? -1 : 1;
       });
      return data;
   }).toPromise();
  }

  auraDescending(a, b) {
    return a.aura > b.aura ? -1 : 1
  }

  timeDescending(a, b){
    return a.eventStart < b.eventStart ? -1 : 1;
  }

  navToDetails(foodtruck: FoodTruck){
    this.navCtrl.push('UpcomingDetailsPage', {
      truckData: foodtruck
      })
  }

  navToAddFlag(){
    this.navCtrl.push('AddFoodtruckPage');
  }

  minsRemaining(time){
    let second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    distance = time + 5*3600000 - this.currentTime;


    return Math.floor(distance / (day)).toString() + " Day " + Math.floor((distance % (day)) / (hour)).toString() + " Hour " 
            + Math.floor((distance % (hour)) / (minute)).toString() + " Min"
  }

  sortEventsByAura(){
    this.events.sort(this.auraDescending)
  }

  sortUntilLaunch(){
    this.events.sort(this.timeDescending)
  }

  sortFFFreshness(){

  }

  showLoading(){
    this.loader = this.loadingCtrl.create({
      content: `<img src="assets/imgs/loading.gif" />`,
      showBackdrop: false,
      spinner: 'hide'
    })
    this.loader.present();
  }

  truncateText(text, maxlength) {
    if (text.length > maxlength) {
        text = text.substr(0,maxlength) + '...';
    }
    return text;
  }

  ngOnDestroy(){
    this.accountSubscription.unsubscribe();
    //this.eventsSubscription.unsubscribe();
  }

}
