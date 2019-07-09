import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FoodTruck } from '../../models/foodtruck.model';
import { Account } from '../../models/account.model';

/**
 * Generated class for the SchedulePostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schedule-post',
  templateUrl: 'schedule-post.html',
})
export class SchedulePostPage implements OnInit {

  foodtruck = {} as FoodTruck;
  account = {} as Account;
  loader: Loading;
  picInput = undefined;
  inputFileName = "" as string;
  myForm: FormGroup;
  times: Array<{title: string, length: number}>;
  eventDate: string;
  eventTime: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseProvider,
              private loadingCtrl: LoadingController,
              private fb: FormBuilder,
              private alertCtrl: AlertController) {

                this.foodtruck.lat = this.navParams.get('lat');
                this.foodtruck.long = this.navParams.get('lng');
                this.foodtruck.image = 'FoodTruck'; 
                this.foodtruck.duration = 1;
                this.account = this.navParams.get('account');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SchedulePostPage');
  }

  ngOnInit(){

    this.myForm = this.fb.group({
      title: ['',
      Validators.required],
      type: '',
      duration: '',
      details: '',
      startDate: '',
      startTime: ''
    })

    this.myForm.valueChanges.subscribe(console.log);
  }

  async saveFoodtruck(foodtruck: FoodTruck){
    this.showLoading();
    this.foodtruck.type = "foodtruck";
    this.foodtruck.aura = 0;
    this.foodtruck.ownerId = this.account.uid;
    this.foodtruck.ownerName = this.account.username;
    // var date = new Date(this.eventDate); // some mock date
    // var milliseconds = date.getTime();
    
    

    // var file = (document.getElementById('file') as HTMLInputElement).files[0];
    // this.account.profilePicName = file.name;
    // this.foodtruck.imgName = file.name;
    // var url = await this.database.eventUploadFile(this.account.username, file, this.foodtruck.name);
    // this.foodtruck.img = url;
    //this.presentAlert(Date.parse(this.eventDate));

    this.foodtruck.eventStart = Date.parse(this.eventDate); //- 5*3600000;
    this.foodtruck.eventEnd = this.foodtruck.eventStart + (this.foodtruck.duration*3600000/2);
    this.foodtruck.eventDate = this.formatDate(new Date(Date.parse(this.eventDate)+5*3600000));
    await this.database.saveFoodtruck(foodtruck);
    
    this.loader.dismiss().then(()=>{
      this.navCtrl.setRoot('HomePage');
    })
    
  }

  submit(){
      this.saveFoodtruck(this.foodtruck)
  }

  showLoading(){
    this.loader = this.loadingCtrl.create({
      content: `<img src="assets/imgs/loading.gif" />`,
      showBackdrop: false,
      spinner: 'hide'
    })
    this.loader.present();
  }
  presentAlert(string) {
    let alert = this.alertCtrl.create({
      title: 'Too Far in Advance',
      subTitle: string,
      buttons: ['Dismiss']
    });
    alert.present();
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

  goBack(){
    this.navCtrl.pop();
  }

}
