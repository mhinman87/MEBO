import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../providers/auth/auth.service';
import { User } from 'firebase/app';
import { DatabaseProvider } from '../providers/database/database';
import { Account } from '../models/account.model';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage';
  pages: Array<{title: string, component: any, icon: string}>;
  isUser: boolean;
  isVendor: boolean;
  private authenticatedUser: User;
  account = {} as Account;

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
                  this.nav.setRoot('HomePage')
                })

                
                //Check to see if the user logged in and set menu pages based on user level
                this.auth.getAuthenticatedUser().subscribe((user: User)=>{
                  this.authenticatedUser = user;
                  console.log(this.authenticatedUser);
                  this.setPages(user);
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
    
    this.nav.setRoot(page.component);
  }

  async logout(){
   await this.auth.logOut();
  }

   setPages(user: User){

    if (user){
      this.database.getAccountInfo(user.uid).subscribe((account) =>{
        this.setAccount(account);
        if(account.isVendor){
    
          this.pages = [
            { title: 'Home', component: 'HomePage', icon: 'ios-home-outline'},
            { title: 'Post', component: 'AddFoodtruckPage', icon: 'ios-pin-outline' }
          ];
    
        } else {
    
          this.pages = [
            { title: 'Home', component: 'HomePage', icon: 'ios-home-outline'}
          ];
    
        } 
      })
    } else {
      this.pages = [
        { title: 'Home', component: 'HomePage', icon: 'ios-home-outline'},
        { title: 'Login', component: 'LoginPage', icon: 'ios-person-outline' },
        { title: 'Register', component: 'RegisterPage', icon: 'ios-create-outline' },
      ];
    }
   

  }

  navToProfile(){
    let profilePage =  { title: 'Profile', component: 'ProfilePage', icon: 'ios-person-outline'}
    this.openPage(profilePage);
  }

  setAccount(account: Account){
    this.account = account;
  }
}
