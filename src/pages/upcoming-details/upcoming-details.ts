import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FoodTruck } from '../../models/foodtruck.model';
import { User } from 'firebase/app';
import { MyApp } from '../../app/app.component';
import { AuthService } from '../../providers/auth/auth.service';
import { DatabaseProvider } from '../../providers/database/database';
import { UserComment } from '../../models/comment.model';

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
export class UpcomingDetailsPage implements OnDestroy {

  foodtruck: FoodTruck;
  x: any;
  currentTime: number;
  accountSubscription: any;
  authenticatedUser = {} as User;
  hideEditButton: boolean;
  commentText: string;
  comments: Array<UserComment> = [];
  commentSubscription: any;
  hideCommentInput: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public app: MyApp,
              private database: DatabaseProvider,
              private auth: AuthService) {
                this.foodtruck = this.navParams.get('truckData');
                this.hideCommentInput = true;

                    this.accountSubscription = this.auth.getAuthenticatedUser().subscribe((user: User)=>{
                      if (user != null){
                       try {
                         this.authenticatedUser = user;
                         console.log(this.authenticatedUser);
                       } catch(e) {
                         console.error(e);
                       }
                      }
                      if (this.authenticatedUser.uid == this.foodtruck.ownerId || this.app.account.isVendor){
                        this.hideEditButton = false;
                      } else {
                        this.hideEditButton = true;
                      }
                     }) 
  }

  ionViewDidLoad() {
    
    this.foodtruck = this.navParams.get('truckData');
    //this.getFoodtruck(this.foodtruck.eventStart);
    const second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;

    let countDown = this.foodtruck.eventStart + 5*3600000;
    this.x = setInterval(() => {
    this.currentTime = new Date().getTime();
    let now = new Date().getTime(),
      distance = countDown - now;

        document.getElementById('days').innerText = Math.floor(distance / (day)).toString();
        document.getElementById('hours').innerText = Math.floor((distance % (day)) / (hour)).toString()
        document.getElementById('minutes').innerText = Math.floor((distance % (hour)) / (minute)).toString()
        //document.getElementById('seconds').innerText = Math.floor((distance % (minute)) / second).toString()

        
        //popToRoot page when foodtruck is no longer active
        if (distance < 0) {
          this.navCtrl.popToRoot();
        }
      }, second)
      setTimeout(()=>{
      }, 1500);

      this.commentSubscription = this.database.getFoodtruckComments(this.foodtruck).subscribe((data)=>{
        this.comments = this.getAnswers(data, null)
        return data;
      })
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

  ionViewDidLeave(){
    clearInterval(this.x);
    this.accountSubscription.unsubscribe();
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
    this.accountSubscription.unsubscribe();
    this.commentSubscription.unsubscribe();
  }

}
