import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController, Events } from 'ionic-angular';
import { FoodTruck } from '../../models/foodtruck.model';
import { DatabaseProvider } from '../../providers/database/database';
import { Observable } from '../../../node_modules/rxjs';
import { AuthService } from '../../providers/auth/auth.service';
import { Account } from '../../models/account.model';
import { User } from 'firebase/app';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { UserComment } from '../../models/comment.model';
import { MyApp } from '../../app/app.component';
//import { sum, values } from 'lodash'

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage implements OnDestroy {

  foodtruck: FoodTruck;
  currentTime: number;
  obFoodtruck: Observable<FoodTruck[]>;
  x: any;
  loader: Loading;
  account: Account;
  account$: Observable<Account>;
  authenticatedUser = {} as User;
  accountSubscription: any;
  checkInCountSubscription;
  userCheckInSubscription;
  checkInCount: number;
  isUserCloseEnough: boolean;
  loactionCd: number;
  authtenticatedUserCheckIns: number;
  hideEditButton: boolean;
  commentText: string;
  comments: Array<UserComment> = [];
  commentSubscription: any;
  hideCommentInput: boolean;
  

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseProvider,
              private loadingCtrl: LoadingController,
              private auth: AuthService,
              private geolocation: Geolocation,
              private alertCtrl: AlertController,
              public app: MyApp,
              private events: Events) {
    this.foodtruck = this.navParams.get('truckData');
    this.showLoading();
    this.hideCommentInput = true;
    this.checkInCountSubscription = this.database.getItemVotes(this.foodtruck.id).subscribe(allUserVotes =>{
     this.checkInCount = allUserVotes['checkIns']
    })
    this.accountSubscription = this.auth.getAuthenticatedUser().subscribe((user: User)=>{
      if (user != null){
        try {
          this.authenticatedUser = user;
          this.account$ = this.database.getAccountInfo(user.uid);
          this.database.getAccountInfo(user.uid).subscribe((account) =>{
          this.setAccount(account);
          this.userCheckInSubscription = this.database.getUserVotes(this.authenticatedUser.uid).subscribe((allVotes) => {
            if (allVotes[this.foodtruck.id + "checkIns"] != undefined){
              this.authtenticatedUserCheckIns = allVotes[this.foodtruck.id + 'checkIns']['checkIns']
              console.log(this.authtenticatedUserCheckIns)
            } else {
              this.authtenticatedUserCheckIns = 0
              console.log(this.authtenticatedUserCheckIns)
            }
            
          //  values(allVotes).forEach(uniqueUsers => {
          //    this.authtenticatedUserCheckIns = sum(values(uniqueUsers))
          //  })
          })
          })
        } catch(e) {
          console.error(e);
        }
      }
    })

   
    
    
    
  }


  

  //there is an error in this code - if position isn't returned
  async canUserCheckIn(){
    this.isUserCloseEnough = undefined;
    let now = new Date().getTime()
        this.loactionCd = now + 30000;
    let position: Geoposition;
    await this.geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 15000
    }).then((resp)=>{
      position = resp
    }), (err) => {
      console.error(err)
    }
    
    if (position != undefined){
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
      this.events.publish('user-location', [lat, lng]);

      let distance = Math.pow((Math.pow((this.foodtruck.lat - lat), 2) + Math.pow((this.foodtruck.long - lng),2)), 0.5);

      if (distance < 0.0012){
        this.isUserCloseEnough = true;
        console.log(this.isUserCloseEnough)
      } else {
        this.isUserCloseEnough = false;
        console.log(this.isUserCloseEnough)
      }
      console.log('distance here', distance);
    }
  }

  setAccount(account: Account){
    this.account = account;
    if (this.authenticatedUser.uid == this.foodtruck.ownerId || this.account.isVendor){
      this.hideEditButton = false;
    } else {
      this.hideEditButton = true;
    }
  }

  ionViewDidEnter(){
    this.canUserCheckIn();
  }

  goBack(){
    this.navCtrl.pop();
  }

  navToEdit(){
    this.navCtrl.push('EditEventPage', {
      truckData: this.foodtruck
      })
  }


  ionViewDidLoad() {
    this.foodtruck = this.navParams.get('truckData');
    //this.getFoodtruck(this.foodtruck.eventStart);
    const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

    let countDown = this.foodtruck.eventEnd + 5*3600000;
    this.x = setInterval(() => {
    this.currentTime = new Date().getTime();
    let now = new Date().getTime(),
      distance = countDown - now;

        //document.getElementById('days').innerText = Math.floor(distance / (day)).toString();
        document.getElementById('hours').innerText = Math.floor((distance % (day)) / (hour)).toString()
        document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute)).toString()
        document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second).toString()

        
        //popToRoot page when foodtruck is no longer active
        if (distance < 0) {
          this.navCtrl.popToRoot();
        }
        let cdDistance = this.account.eventCheckInTimer - now;
        if (document.getElementById('cdseconds')){
          document.getElementById('cdseconds').innerText = Math.floor((cdDistance) / second).toString();
        }

        


      }, second)
      setTimeout(()=>{
        this.loader.dismiss();
      }, 1500);

      this.commentSubscription = this.database.getFoodtruckComments(this.foodtruck).subscribe((data)=>{
        this.comments = this.getAnswers(data, null)
        return data;
      })
      
  }

  ionViewDidLeave(){
    clearInterval(this.x);
    this.isUserCloseEnough = undefined;
    this.accountSubscription.unsubscribe();
    this.checkInCountSubscription.unsubscribe();
    this.userCheckInSubscription.unsubscribe();
  }

  showLoading(){
    this.loader = this.loadingCtrl.create({
      content: `<img src="assets/imgs/loading.gif" />`,
      showBackdrop: false,
      spinner: 'hide'
    })
    this.loader.present();
  }

  getFoodtruck(id: number){
    this.obFoodtruck = this.database.getFoodtruckFromId(id);
    this.database.getFoodtruckFromId(id).subscribe(truck =>{
      console.log(truck);
    })
    console.log(this.obFoodtruck)
  }

  checkIn(){
    if(this.isUserCloseEnough){
     
    this.database.userCheckIn(this.foodtruck.id, this.authenticatedUser.uid, this.foodtruck.ownerId, this.checkInCount, this.authtenticatedUserCheckIns);
    } else {
      this.alertCtrl.create({
        title: 'You are not close enough',
        subTitle: "You must move closer and update location",
        buttons: [
          {
            text: 'Oh word... Lemme try that',
            role: 'Cancel'
          },
        ]
      }).present();
    }
    
  }

  getAnswers(questions:any,id:any)
  {
    return questions
           .filter(i=>i.parent_id==id)
           .map(q=>{
             return {...q,
                     answers:this.getAnswers(questions,q.id)}
           })
  }

  postComment(id: string, username: string, userId: string, text: string){
    let comment: UserComment = {
      id: id,
      userId: userId,
      username: username,
      text: text,
      parent_id: null,
      hideReplyTextbox: true,
      hideInputTextbox: true,
      time: Date.now() - 5*3600000,
      date: this.formatDate(new Date(Date.now()))
    }
    this.database.addUserCommentToEvent(this.foodtruck, comment);
    this.hideCommentInput = true;
    this.commentText = "";
  }

  showCommentInput(){
    this.hideCommentInput = false;
  }

  closeCommentInput(){
    this.hideCommentInput = true;
  }

  logComments(){
    console.log(this.comments)
  }

  formatDate(date: Date) {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var time = this.formatAMPM(date);
  
    console.log(time)
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + time;
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  ngOnDestroy(){
    this.commentSubscription.unsubscribe();
  }

}
