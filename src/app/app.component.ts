import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../providers/auth/auth.service';
import { User } from 'firebase/app';
import { DatabaseProvider } from '../providers/database/database';
import { Account } from '../models/account.model';
import { HomePage } from '../pages/home/home';
import { AddFoodtruckPage } from '../pages/add-foodtruck/add-foodtruck';
import { sum, values } from 'lodash';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string;
  pages: Array<{title: string, component: any}>;
  isUser: boolean;
  isVendor: boolean;
  account = {} as Account;
  userAura: number = 0;
  subscription;


  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public events: Events,
              public auth: AuthService,
              public database: DatabaseProvider,
              public alertCtrl: AlertController) {

                //subscribe to login/logout events
                // events.subscribe('user:login', () => {
                //   this.nav.setRoot('HomePage')
                //   console.log('set Homepage from events sub')
                // });     
                // events.subscribe('user:logout', () => {
                //   this.nav.setRoot('LoginPage')
                // })

                //Set Pages
                this.pages = [
                  { title: 'TAKE ME HOME', component: 'HomePage'},
                  { title: 'LAUNCH BEACON', component: 'AddFoodtruckPage'},
                  { title: 'UPCOMING EVENTS', component: 'MissionControlPage'},
                  { title: 'MISSION REPORT', component: 'FeedbackPage'}
                ];
                               
                
                this.initializeApp();

  }

 initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      
      
      this.subscription = this.auth.getAuthenticatedUser().subscribe((user: User)=>{
        if (user && user.emailVerified){
          this.rootPage = 'HomePage';
          console.log('set Homepage from app.component.ts subscription')
          this.database.getAccountInfo(user.uid).subscribe((account)=>{
            this.setAccount(account);
            this.subscription = this.database.getUserVotes(user.uid)
            .subscribe(upvotes => {
              let auraSum = 0;
              values(upvotes).forEach(uniqueUsers =>{
                auraSum += sum(values(uniqueUsers))
              }) 
              this.userAura = auraSum;
            })
          })
          // this.subscription.unsubscribe();
        } else if (user && user.emailVerified == false){
          this.rootPage = 'LoginPage';
          this.alertCtrl.create({
            title: 'Email not Verified!',
            subTitle: 'All your bases are belong to us',
            buttons: [{
              text: "WHOOPS!",
              role: 'Cancel'
            }]
          }).present();
        } else {
            this.rootPage = 'LoginPage';
          // this.subscription.unsubscribe();
        }
      })
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(((this.nav.getActive().component == HomePage) && page.component == 'HomePage') || 
    ((this.nav.getActive().component == AddFoodtruckPage) && page.component == 'AddFoodtruckPage')){
    } else {
      this.nav.setRoot(page.component);
    }
    
  }

  async logout(){
   await this.auth.logOut();
  }



  navToProfile(){
 
    document.querySelector('.card').classList.toggle('is-flipped');

    // let profilePage =  { title: 'Profile', component: 'ProfilePage', icon: 'ios-person-outline'}
    // this.openPage(profilePage);
  }

  setAccount(account: Account){
    this.account = account;
  }
}
