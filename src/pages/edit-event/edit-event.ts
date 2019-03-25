import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FoodTruck } from '../../models/foodtruck.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the EditEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-event',
  templateUrl: 'edit-event.html',
})
export class EditEventPage implements OnInit {

  foodtruck: FoodTruck
  myForm: FormGroup;
  eventDate: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private fb: FormBuilder,
              private database: DatabaseProvider) {

    
  }

  ngOnInit(){

    this.foodtruck = this.navParams.get('truckData');
    console.log(this.foodtruck)

    this.myForm = this.fb.group({
      title: [this.foodtruck.name,
      Validators.required],
      type: this.foodtruck.type,
      duration: this.foodtruck.duration,
      details: this.foodtruck.details,
      startDate: this.foodtruck.eventStart
    })

    this.myForm.valueChanges.subscribe(console.log);
  }

  goBack(){
    this.navCtrl.pop();
  }

  async updateFoodtruck(foodtruck: FoodTruck){
    if (this.eventDate != undefined){
      this.foodtruck.eventStart = Date.parse(this.eventDate); //- 5*3600000;
      this.foodtruck.eventDate = this.formatDate(new Date(Date.parse(this.eventDate)+5*3600000));
    }
    this.foodtruck.eventEnd = this.foodtruck.eventStart + (this.foodtruck.duration*3600000/2);
    await this.database.updateFoodtruck(foodtruck).then(()=>{
      this.navCtrl.popToRoot();
    })
  }

  async deleteFoodtruck(foodtruck: FoodTruck){
    await this.database.deleteFoodtruck(foodtruck).then(()=>{
      this.navCtrl.popToRoot();
    })
  }

  formatDate(date: Date) {
    var monthNames = [
      "Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul",
      "Aug", "Sep", "Oct",
      "Nov", "Dec"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var time = this.formatAMPM(date);

    console.log(time)
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + time;
  }

  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

}
