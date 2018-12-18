import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Account } from '../../models/account.model';
import { ToastController, Events, AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../database/database';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthService {

  authState: boolean;

  constructor(private afAuth: AngularFireAuth,
              private toast: ToastController,
              private events: Events,
              private database: DatabaseProvider,
              private alertCtrl: AlertController) {
    
  }

  //Sign in a user with a registered email and password
  async signInWithEmailAndPassword(account: Account){

    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(account.email, account.password);

      console.log(result);
      this.events.publish('user:login');
      this.toast.create({
        message: "Welcome to MEBO!",
        duration: 3000
      }).present();
      return true
    }
    catch(e){
      console.error(e);
      this.toast.create({
        message: e.message,
        duration: 3000
      }).present();
      return false
    }
  }


  //Create a new user with an email and password
  async register(account: Account){

    try {
      await this.afAuth.auth.createUserWithEmailAndPassword(account.email, account.password).then(()=>{
      let user = this.afAuth.auth.currentUser;
      user.sendEmailVerification()
      account.uid = user.uid;
      this.database.createProfile(user, account);
    })
      this.toast.create({
        message: "Nice work bro! You're in!",
        duration: 3000
      }).present().then(()=>{
        this.events.publish('user:login');
      })
    } 
      catch(e){
        console.error(e);
        this.toast.create({
          message: e.message,
          duration: 3000
        }).present();
    }
  }


  //Return the uid for the current user as a string
  async getUid(){
    const uid = await this.afAuth.auth.currentUser.uid as string;
    return uid;
  }


  getAuthenticatedUser() {
    return this.afAuth.authState
  }

  async logOut(){
    try {
      const result = await this.afAuth.auth.signOut();
      console.log(result);
      this.events.publish('user:logout')
      this.toast.create({
        message: "Goodbye!",
        duration: 3000
      }).present();
    }
    catch(e){
      console.error(e);
      this.toast.create({
        message: e.message,
        duration: 3000
      }).present();
    }
  }

  showEmailVerificationDialog(account: Account){
    this.alertCtrl.create({
      title: 'A verification email will be sent',
      subTitle: "You must verify your email to access your profile",
      buttons: [
        {
          text: 'Naw breh... That aint me',
          role: 'Cancel'
        },
        {
          text: 'Cool :)',
          handler: data => {
            this.register(account);
            
          }
        }
      ]
    }).present();
  }

  sendPasswordResetEmail(accountEmail){
    return this.afAuth.auth.sendPasswordResetEmail(accountEmail);
  }
    
  


}
