import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { Account } from '../../models/account.model';
import { Beacon } from '../../models/beacon.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth.service';
import { MyApp } from '../../app/app.component';
import { User } from 'firebase/app';
import { sum, values } from 'lodash';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AngularFireStorage } from 'angularfire2/storage';


@IonicPage()
@Component({
  selector: 'page-add-beacon',
  templateUrl: 'add-beacon.html',
})
export class AddBeaconPage implements OnInit, OnDestroy {
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
    type: "MEBOcircle",
    userPhoto: ''
  } as Beacon;
  account = {} as Account;
  myForm: FormGroup;
  loader: Loading;
  authenticatedUser: User;
  beaconDuration: number;
  accountSubscription: any;
  userAura = 0;
  imgFile: File;
  


  image: string; // base64

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseProvider,
              private fb: FormBuilder,
              private loadingCtrl: LoadingController,
              private app: MyApp,
              private camera: Camera,
              private afStorage: AngularFireStorage,
              private auth: AuthService) {
                this.auth.getAuthenticatedUser().subscribe((user: User)=>{
                  if (user){
                    this.authenticatedUser = user;
                    this.database.getAccountInfo(user.uid).subscribe((account) =>{
                    this.setAccount(account);
                  })
                  }
                })

                this.beaconDuration = 1;
  }

  ionViewDidLoad() {
    this.accountSubscription = this.database.getUserVotes(this.app.account.uid)
    .subscribe(upvotes => {
      let auraSum = 0;
      values(upvotes).forEach(uniqueUsers =>{
        auraSum += sum(values(uniqueUsers))
      }) 
      this.userAura = auraSum;
    })
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
    this.beacon.duration = this.beaconDuration * 48;
    this.beacon.img = this.beacon.type;
    this.beacon.name = this.beacon.type;

    this.beacon.activeEnd = this.beacon.activeStart + (this.beacon.duration*3600000/2);
    this.beacon.eventDate = this.formatDate(new Date(Date.now()));
    await this.uploadImage()
    .then(()=>this.database.saveBeacon(beacon))
      .then(()=>{
        this.loader.dismiss()
        .then(()=>{
          this.navCtrl.setRoot('HomePage');
        })
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

  ngOnDestroy(){
    this.accountSubscription.unsubscribe();
  }

  // async takePicture(): Promise<any> {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.DATA_URL,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE
  //   }
  //   try {
  //     this.imgFile = await this.camera.getPicture(options)
  //     let image = 'data:image/jpeg;base64,' + this.imgFile
  //     this.beacon.userPhoto = image
  //   } catch(e){
  //     console.error(e);
  //   }
  // }

  async captureImage() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      correctOrientation: true
    }

    return await this.camera.getPicture(options)
}

async uploadImage() {
  if (this.image != undefined) {
    this.beacon.userPhoto = `${this.app.account.username}/${ new Date().getTime() }.jpg`;
    this.afStorage.ref(this.beacon.userPhoto).putString(this.image, 'data_url')
  }
}

async setFile() {
  const file = await this.captureImage();
  this.image = 'data:image/jpg;base64,' + file;
  
}

}
