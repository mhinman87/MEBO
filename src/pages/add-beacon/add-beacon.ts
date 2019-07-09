import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Account } from '../../models/account.model';
import { Beacon } from '../../models/beacon.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from 'firebase/app';

/**
 * Generated class for the AddBeaconPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-beacon',
  templateUrl: 'add-beacon.html',
})
export class AddBeaconPage implements OnInit {
  ngOnInit(): void {
    this.myForm = this.fb.group({
      title: [''],
      type: ['',
      Validators.required],
      duration: '',
      details: ['',
      Validators.required]
    })
    this.myForm.valueChanges.subscribe(console.log);
  }

  beacon = {
    type: "MEBOcircle"
  } as Beacon;
  account = {} as Account;
  myForm: FormGroup;
  loader: Loading;
  authenticatedUser: User;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseProvider,
              private fb: FormBuilder,
              private loadingCtrl: LoadingController,
              private auth: AuthService) {
                this.auth.getAuthenticatedUser().subscribe((user: User)=>{
                  if (user){
                    this.authenticatedUser = user;
                    this.database.getAccountInfo(user.uid).subscribe((account) =>{
                    this.setAccount(account);
                  })
                  }
                })
  }

  ionViewDidLoad() {
  }

  setAccount(account: Account){
    this.account = account;
  }

  async saveBeacon(beacon: Beacon){
    this.showLoading();
    this.beacon.aura = 0;
    this.beacon.activeStart = Date.now() - 5*3600000;
    this.beacon.ownerId = this.account.uid;
    this.beacon.ownerName = this.account.username;
    this.beacon.duration = 48;
    this.beacon.img = this.beacon.type;
    this.beacon.name = this.beacon.type;
    // var file = (document.getElementById('file') as HTMLInputElement).files[0];
    // this.account.profilePicName = file.name;
    // this.foodtruck.imgName = file.name;
    // var url = await this.database.eventUploadFile(this.account.username, file, this.foodtruck.name);
    // this.foodtruck.img = url;
    this.beacon.activeEnd = this.beacon.activeStart + (this.beacon.duration*3600000/2);
    this.beacon.eventDate = this.formatDate(new Date(Date.now()));
    await this.database.saveBeacon(beacon);
    
    this.loader.dismiss().then(()=>{
      this.navCtrl.setRoot('HomePage');
    })
    
  }

  goBack(){
    this.navCtrl.pop();
  }

  showLoading(){
    this.loader = this.loadingCtrl.create({
      content: `<img src="assets/imgs/loading.gif" />`,
      showBackdrop: false,
      spinner: 'hide'
    })
    this.loader.present();
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

}
