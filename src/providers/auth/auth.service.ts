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
      
      await this.afAuth.auth.signInWithEmailAndPassword(account.email, account.password)
        .then(() =>{
          this.events.publish('user:login');
        })
      } catch(e){
          console.log(e.message);

          var title = 'Something went wrong 😬';
          var message = '';

          if (e.message === 'signInWithEmailAndPassword failed: First argument "email" must be a valid string.'){
            title = "Nothing in Email"
            message = 'At least enter something in EMAIL. Lawd!'
          } else if (e.message === 'signInWithEmailAndPassword failed: Second argument "password" must be a valid string.'){
            message = 'Uhhh you forgot your PASSOWRD breh...'
            title =  'Nothing in Password'
          } else if (e.message === 'The email address is badly formatted.'){
            title =  'Bad Email'
            message = "What kind of EMAIL is that?? Doesn't look like anything to me 🤖"
          } else if (e.message === 'The password is invalid or the user does not have a password.'){
            title = 'WRONG PASSWORD'
            message = "Who's PASSWORD is that?? Doesn't look like anything to me 🤖"
          } else if (e.message === 'There is no user record corresponding to this identifier. The user may have been deleted.'){
            message = "❌ YOU ARE NOT REAL ❌"
            title = "NO USER RECORD"
          } else {
            message = "I don't even know 🤷🏻‍"
          }

          this.alertCtrl.create({
            title: title,
            subTitle: message,
            buttons: [
              {
                text: 'Oh word. Let me fix that!',
                role: 'Cancel'
              }
            ]
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
      await this.afAuth.auth.signOut();
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
