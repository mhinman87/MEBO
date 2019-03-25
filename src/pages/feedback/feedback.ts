import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController  } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Feedback } from '../../models/feedback.model';
import { DatabaseProvider } from '../../providers/database/database';
import { AngularFireAuth } from 'angularfire2/auth';


/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage implements OnInit {
  myForm: FormGroup;
  feedback = {} as Feedback;
  loader: Loading;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseProvider,
              private fb: FormBuilder,
              private loadingCtrl: LoadingController,
              private afAuth: AngularFireAuth,
              private alertCtrl: AlertController) {
  }

  ngOnInit(){
    this.myForm = this.fb.group({
      name: ['',
      Validators.required],
      rating: '',
      utilize: '',
      features: '',
      contact: true
    })

    this.myForm.valueChanges.subscribe(console.log);
  }

  showLoading(){
    this.loader = this.loadingCtrl.create({
      content: `<img src="assets/imgs/loading.gif" />`,
      showBackdrop: false,
      spinner: 'hide'
    })
    this.loader.present();
  }

  presentAlert(err) {
    let alert = this.alertCtrl.create({
      title: 'HOUSTON WE HAVE A PROBLEM',
      subTitle: err,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  async saveFeedback(feedback: Feedback){
    this.showLoading();
    this.feedback.email = this.afAuth.auth.currentUser.email;
    try {
      if (feedback.rating == undefined){
        feedback.rating = "";
      }
      if (feedback.utilize == undefined){
        feedback.utilize = "";
      }
      if (feedback.features == undefined){
        feedback.features = "";
      }
      if (feedback.contact == undefined){
        feedback.contact = false;
      }
      await this.database.saveFeedback(feedback);
      this.loader.dismiss().then(()=>{
        this.navCtrl.setRoot('HomePage');
      })
    } catch(e){
      console.log(e)
      this.presentAlert('We need dat name breh.')
      this.loader.dismiss();
    }

  }

}
