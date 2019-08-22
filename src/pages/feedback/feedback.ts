import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthService } from '../../providers/auth/auth.service'
import { Beacon } from '../../models/beacon.model';
import { User } from 'firebase/app';


/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage implements OnDestroy {
  events: Beacon[];
  activeEvents: Beacon[];
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

                this.eventsSubscription = this.dbProvider.getActiveBeacons().subscribe((data)=>{
                  this.events = data.sort(this.auraDescending);
                  this.activeEvents = data.sort(this.auraDescending);
                  return data;
                })
                const second = 1000;
                this.x = setInterval(() => {
                  this.currentTime = new Date().getTime();
                    }, second)
                    setTimeout(()=>{
                    }, 1000);

                    setTimeout(()=>{
                      if(this.activeEvents != undefined){
                        this.sortEventsByAura()
                        this.loader.dismiss();
                      } else {
                        this.loader.dismiss();
                      }
                    },3000)

  }
  

  ionViewDidLoad() {
  }

  auraDescending(a, b) {
    return a.aura > b.aura ? -1 : 1
  }

  timeDescending(a, b){
    return a.activeStart > b.activeStart ? -1 : 1;
  }

  navToDetails(beacon: Beacon){
    this.navCtrl.push('BeaconDetailsPage', {
      beaconData: beacon
      })
  }

  navToAddBeacon(){
    this.navCtrl.push('AddBeaconPage');
  }

  minsRemaining(time){
    return Math.floor((time + 5*3600000 - this.currentTime)/60000)
  }

  sortEventsByAura(){
    this.activeEvents.sort(this.auraDescending)
  }

  sortUntilLaunch(){
    this.activeEvents.sort(this.timeDescending)
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
    this.eventsSubscription.unsubscribe();
  }

  filter(any){
    this.activeEvents = this.events.filter(a => a.type == any)
    if (any === "All"){
      this.activeEvents = this.events;
    }
  }
  
}
