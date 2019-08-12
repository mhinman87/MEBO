import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Beacon } from '../../models/beacon.model';
import { Account } from '../../models/account.model';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from 'firebase/app';
import { MyApp } from '../../app/app.component';
import { UserComment } from '../../models/comment.model';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the BeaconDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-beacon-details',
  templateUrl: 'beacon-details.html',
})
export class BeaconDetailsPage implements OnDestroy {

  beacon = {} as Beacon
  accountSubscription: any;
  commentSubscription: any;
  authenticatedUser = {} as User;
  hideEditButton: boolean;
  hideCommentInput: boolean;
  account: Account;
  commentText: string;
  comments: Array<UserComment> = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private auth: AuthService,
              public app: MyApp,
              public database: DatabaseProvider) {
    this.beacon = this.navParams.get('beaconData');
    console.log(this.beacon);
    this.hideCommentInput = true;
    this.accountSubscription = this.auth.getAuthenticatedUser().subscribe((user: User)=>{
      if (user != null){
        try {
          this.authenticatedUser = user;
        } catch(e) {
          console.error(e);
        }
      }
    })


  }

  ionViewDidLoad() {
    this.commentSubscription = this.database.getBeaconComments(this.beacon).subscribe((data)=>{
      this.comments = this.getAnswers(data, null)
      return data;
    })
  }

  goBack(){
    this.navCtrl.pop();
  }

  setAccount(account: Account){
    this.account = account;
    if (this.authenticatedUser.uid == this.beacon.ownerId || this.account.isVendor){
      this.hideEditButton = false;
    } else {
      this.hideEditButton = true;
    }
  }

  navToEdit(){
    this.navCtrl.push('EditBeaconPage', {
      beaconData: this.beacon
      })
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
    this.database.addUserCommentToBeacon(this.beacon, comment);
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
