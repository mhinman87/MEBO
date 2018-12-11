import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, IonicFormInput } from 'ionic-angular';
import { Account } from '../../models/account.model';
import { AuthService } from '../../providers/auth/auth.service';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { map, take, debounceTime } from 'rxjs/operators';


/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage implements OnInit {

  account = {} as Account;
  loader: Loading;
  myForm: FormGroup;
  passwordConfirm: string;
  DOBType: string = 'text';
  //passwordIcon: string = 'eye-outline';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private loadingCrtl: LoadingController,
              private auth: AuthService,
              private fb: FormBuilder,
              private afs: AngularFirestore) {
                
  }

  ngOnInit(){
    this.myForm = this.fb.group({
      username: ['',
      Validators.required,
      CustomValidator.username(this.afs)],
      email: '',
      password: '',
      dob: ''
    })

    this.myForm.valueChanges.subscribe(console.log);
  }

  navigateToLogin(){
    this.navCtrl.push("LoginPage");
    this.navCtrl.remove(0);
  }

  hideShowPassword() {
    this.DOBType = this.DOBType === 'text' ? 'date' : 'date';
   // this.passwordIcon = this.passwordIcon === 'eye-off-outline' ? 'eye-outline' : 'eye-off-outline';
}

  get email() {
    return this.myForm.get('email')
  }

  get username() {
    return this.myForm.get('username')
  }



  async register(){
    this.showLoading();
      this.account.isVendor = false;
      await this.auth.showEmailVerificationDialog(this.account);
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

}

export class CustomValidator {
  static username(afs: AngularFirestore) {
    return (control: AbstractControl) => {
      
      // return an observable here....
      
  
        const username = control.value.toLowerCase();
        
        return afs.collection('accounts', ref => ref.where('username', '==', username) )
                  
          .valueChanges().pipe(
            debounceTime(500),
            take(1),
            map(arr => arr.length ? { usernameAvailable: false } : null ),
          )
      

    }
  }
}
