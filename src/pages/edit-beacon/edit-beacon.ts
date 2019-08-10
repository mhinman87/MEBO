import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Beacon } from '../../models/beacon.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the EditBeaconPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-beacon',
  templateUrl: 'edit-beacon.html',
})
export class EditBeaconPage implements OnInit {

  beacon: Beacon;
  myForm: FormGroup;
  loader: Loading;
  beaconDuration: number;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private fb: FormBuilder,
              private database: DatabaseProvider,
              private loadingCtrl: LoadingController) {
                
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditBeaconPage');
  }

  ngOnInit(){

    this.beacon = this.navParams.get('beaconData');
    this.beaconDuration = this.beacon.duration / 48;
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

  async updateBeacon(beacon: Beacon){
    this.showLoading();
    this.beacon.img = this.beacon.type;
    this.beacon.name = this.beacon.type;
    this.beacon.duration = this.beaconDuration * 48;
    this.beacon.activeEnd = this.beacon.activeStart + (this.beacon.duration*3600000/2);
    this.beacon.eventDate = this.formatDate(new Date(Date.now()));
    await this.database.updateBeacon(beacon).then(()=>{
      this.navCtrl.popToRoot();
    })
    this.loader.dismiss();
  }

  async deleteBeacon(beacon: Beacon){
    await this.database.deleteBeacon(beacon).then(()=>{
      this.navCtrl.popToRoot();
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
