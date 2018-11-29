import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, ViewController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../providers/auth/auth.service';
import { User } from 'firebase/app';
import { DatabaseProvider } from '../providers/database/database';
import { Account } from '../models/account.model';
import { HomePage } from '../pages/home/home';
import { AddFoodtruckPage } from '../pages/add-foodtruck/add-foodtruck'



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string;
  pages: Array<{title: string, component: any}>;
  isUser: boolean;
  isVendor: boolean;
  private authenticatedUser: User;
  account = {} as Account;
  latLng: google.maps.LatLng


  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public events: Events,
              public auth: AuthService,
              public database: DatabaseProvider) {

                
                //subscribe to login/logout events
                events.subscribe('user:login', () => {
                  this.nav.setRoot('HomePage')
                });     
                events.subscribe('user:logout', () => {
                  this.nav.setRoot('LoginPage')
                })

                this.pages = [
                  { title: 'TAKE ME HOME', component: 'HomePage'},
                  { title: 'LAUNCH EVENT', component: 'AddFoodtruckPage'},
                  { title: 'MISSION CONTROL', component: 'MissionControlPage'},
                  { title: 'S.O.S. (HELP)', component: 'ProfilePage'}
                ];
                this.rootPage = 'HomePage';

                
                

                

                
                //Check to see if the user is logged in and set menu pages based on user level
                this.auth.getAuthenticatedUser().subscribe((user: User)=>{
                  if (user){
                    this.authenticatedUser = user;
                    this.database.getAccountInfo(user.uid).subscribe((account)=>{
                      this.setAccount(account);
                    })
                    
                  } else {
                    this.rootPage = 'LoginPage'
                  }
                })
                
                this.initializeApp();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(((this.nav.getActive().component == HomePage) && page.component == 'HomePage') || ((this.nav.getActive().component == AddFoodtruckPage) && page.component == 'AddFoodtruckPage')){

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
