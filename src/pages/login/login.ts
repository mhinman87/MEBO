import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';
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
              private loadingCrtl: LoadingController,
              private alertCtrl: AlertController,
              private toast: ToastController) {
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

  passwordReset(){
    this.alertCtrl.create({
      title: 'Forgot Password?',
      subTitle: 'A password reset email will be sent to your email address.',
      buttons: [{
        text:'Send Email',
        handler: data =>{
          try {
            this.auth.sendPasswordResetEmail(this.account.email).then(()=>{
            this.toast.create({
              message: 'A Password Reset Email has been Sent',
              duration: 3000
            }).present();
          }, (err)=>{
            this.toast.create({
              message: 'That email is not registered',
              duration: 3000
            }).present();
          })
          } catch(e){
            this.toast.create({
              message: 'You must enter a valid email',
              duration: 3000
            }).present();
          }
        }
      }, 
      {
          text: 'Cancel',
          role: 'Cancel'
        }]
    }).present();
    }


  async getUid(){
    const uid = await this.auth.getUid();
    console.log(uid);
  }

}
