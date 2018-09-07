import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth/auth.service';
import { DatabaseProvider } from '../../providers/database/database';
import { User } from 'firebase/app';
import { Account } from '../../models/account.model';


/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage implements OnDestroy {

  authenticatedUser = {} as User;
  account = {} as Account;
  verifiedEmail = false;
  accountSubscription: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public auth: AuthService,
              public database: DatabaseProvider) {
               
                this.accountSubscription = this.auth.getAuthenticatedUser().subscribe((user: User)=>{

                  //this produces an error when the user logs out
                  //should this be fixed with setting a subscription and unsubscribing?
                  try {
                    this.setEmailVerified(user.emailVerified);
                    this.authenticatedUser = user;
                    console.log(this.authenticatedUser);
                    this.database.getAccountInfo(user.uid).subscribe((account) =>{
                    this.setAccount(account);
                  })
                } catch(e) {
                  console.error(e);
                }
                })
  }


  setAccount(account: Account){
    this.account = account;
  }

  setEmailVerified(verifiedEmail: boolean){
    this.verifiedEmail = verifiedEmail;
  }

  navigateToEditProfile(){
    this.navCtrl.setRoot('EditProfilePage', {account: this.account});
  }

  ngOnDestroy(){
    this.accountSubscription.unsubscribe();
  }


}
