import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Account } from '../../models/account.model';
import { AuthService } from '../../providers/auth/auth.service';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  account = {} as Account;
  loader: Loading;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private auth: AuthService,
              private loadingCrtl: LoadingController) {
  }

  navigateToRegisterPage(){
    this.navCtrl.push('RegisterPage');
  }

  async login(){
    this.showLoading();
    await this.auth.signInWithEmailAndPassword(this.account);
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



  async getUid(){
    const uid = await this.auth.getUid();
    console.log(uid);
  }

}
