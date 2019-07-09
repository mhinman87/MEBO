import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Beacon } from '../../models/beacon.model';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from 'firebase/app';
import { MyApp } from '../../app/app.component';

/**
 * Generated class for the BeaconDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-beacon-details',
  templateUrl: 'beacon-details.html',
})
export class BeaconDetailsPage {

  beacon = {} as Beacon
  accountSubscription: any;
  authenticatedUser = {} as User;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private auth: AuthService,
              public app: MyApp) {
    this.beacon = this.navParams.get('beaconData');
    console.log(this.beacon);
    this.accountSubscription = this.auth.getAuthenticatedUser().subscribe((user: User)=>{
      if (user != null){
        try {
          this.authenticatedUser = user;
        } catch(e) {
          console.error(e);
        }
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BeaconDetailsPage');
  }

  goBack(){
    this.navCtrl.pop();
  }

}
