import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { FoodTruck } from '../../models/foodtruck.model';
import { Account } from '../../models/account.model';

/**
 * Generated class for the SubmitPostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-submit-post',
  templateUrl: 'submit-post.html',
})
export class SubmitPostPage {

  foodtruck = {} as FoodTruck;
  account = {} as Account;
  loader: Loading;
  picInput = undefined;
  inputFileName = "" as string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseProvider,
              private loadingCtrl: LoadingController) {
                this.foodtruck.lat = this.navParams.get('lat');
                this.foodtruck.long = this.navParams.get('lng');
                this.account = this.navParams.get('account');
  }

  ionViewDidLoad() {
    
  }

  async saveFoodtruck(foodtruck: FoodTruck){
    this.showLoading();
    this.foodtruck.type = "foodtruck";
    this.foodtruck.aura = 0;
    this.foodtruck.eventStart = Date.now() - 5*3600000;
    var file = (document.getElementById('file') as HTMLInputElement).files[0];
    this.account.profilePicName = file.name;
    this.foodtruck.imgName = file.name;
    var url = await this.database.eventUploadFile(this.account.username, file, this.foodtruck.name);
    this.foodtruck.img = url;
    this.foodtruck.eventEnd = this.foodtruck.eventStart + this.foodtruck.duration*3600000;
    await this.database.saveFoodtruck(foodtruck);
    
    this.loader.dismiss().then(()=>{
      this.navCtrl.setRoot('HomePage');
    })
    
  }

  showLoading(){
    this.loader = this.loadingCtrl.create({
      content: `<img src="assets/imgs/loading.gif" />`,
      showBackdrop: false,
      spinner: 'hide'
    })
    this.loader.present();
  }

  clickFile(){
    this.picInput = (document.getElementById('file') as HTMLInputElement);
    document.getElementById('file').click();
    
  }

  readURL(input) {
    var reader = new FileReader();
    reader.onload = function (e: any) {
      (document.getElementById('post-pic') as any).src = e.target.result;
    };
    var inp = document.getElementById('file') as HTMLInputElement;
    this.inputFileName = inp.files.item(0).name;
    console.log(this.inputFileName);
    reader.readAsDataURL((document.getElementById('file') as HTMLInputElement).files[0]);
}

}
