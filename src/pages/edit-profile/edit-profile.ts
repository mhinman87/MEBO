import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController } from 'ionic-angular';
import { Account } from '../../models/account.model';
import { DatabaseProvider } from '../../providers/database/database';
 
/**
 * Generated class for the EditProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  account = {} as Account;
  picInput = undefined;
  loader: Loading;
  inputFileName = "" as string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseProvider,
              private loadingCrtl: LoadingController) {
                this.account = this.navParams.get('account');
                console.log(this.account.uid)
  }


  navigateToProfile(){
    this.navCtrl.setRoot('ProfilePage')
  }

  async uploadPic(){
    if (this.account.profilePicName != undefined){
      try {
        await this.database.deleteProfilePic(this.account.uid, this.account.profilePicName);
      } catch (e){
        console.error(e);
      }
    }
    var file = (document.getElementById('file') as HTMLInputElement).files[0];
    this.account.profilePicName = file.name;
    console.log(file);
    var url = await this.database.uploadFile(this.account.username, file, this.account.uid);
    this.account.profilePic = url;
    return url;
  }

  clickFile(){
    this.picInput = (document.getElementById('file') as HTMLInputElement);
    document.getElementById('file').click();
    
  }

  async updateAccount(){
    this.showLoading();
    if (this.inputFileName){
      await this.uploadPic();
    }
    this.database.updateAccount(this.account.uid, this.account);
    this.navCtrl.setRoot('ProfilePage')
    this.loader.dismiss();
  }

  showLoading(){
    this.loader = this.loadingCrtl.create({
      content: `<img src="assets/imgs/loading.gif" />`,
      showBackdrop: false,
      spinner: 'hide'
    })
    this.loader.present();
  }

  readURL(input) {
        var reader = new FileReader();
        reader.onload = function (e: any) {
          (document.getElementById('blah') as any).src = e.target.result;
        };
        var inp = document.getElementById('file') as HTMLInputElement;
        this.inputFileName = inp.files.item(0).name;
        console.log(this.inputFileName);
        reader.readAsDataURL((document.getElementById('file') as HTMLInputElement).files[0]);
}

}
