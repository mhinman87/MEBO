import { Injectable } from '@angular/core';
import { FoodTruck } from '../../models/foodtruck.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '../../../node_modules/angularfire2/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Account } from '../../models/account.model';
import { User } from 'firebase/app';
import { AngularFireStorage } from 'angularfire2/storage';



/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  foodTruckCollection: AngularFirestoreCollection<FoodTruck>;
  foodTrucks: Observable<FoodTruck[]>;
  accountDocument: AngularFirestoreDocument<Account>;
  myUrl: string;

  constructor(private afs: AngularFirestore,
              private afStorage: AngularFireStorage) {
              
  }

  userCheckIn(account: Account, foodtruck: FoodTruck){
   account.aura = account.aura + 1;
   foodtruck.aura ++;
   let now = new Date().getTime()
   this.afs.collection('accounts').doc(account.uid).update({aura: account.aura, eventCheckInTimer: now + 300000})
   this.afs.collection('foodtrucks').doc(foodtruck.id).update({aura: foodtruck.aura});
  }


  saveFoodtruck(foodtruck: FoodTruck){
    this.foodTruckCollection = this.afs.collection('foodtrucks') //reference
    this.foodTruckCollection.add(foodtruck);
  }


  getFoodtrucks(){
    this.foodTruckCollection = this.afs.collection('foodtrucks', ref => {
      return ref.where('eventEnd', '>=', Date.now()- 5*3600000);
    }) //reference
    
    this.foodTrucks = this.foodTruckCollection.snapshotChanges().map(actions => {       
      return actions.map(a => {
        const data = a.payload.doc.data() as FoodTruck;
        data.id = a.payload.doc.id;
        return data;
      });
    });
    

    /* SPECIAL SAUCE BITCH!!!! Perform more filtering on returned results

    this.foodTrucks = this.foodTruckCollection.valueChanges().map(actions =>{
      let data = [] as Array<FoodTruck>;
      for (var i = 0; i < actions.length; i++){
        if (actions[i].name == "test"){
          data.push(actions[i]);
        }
      }
      return data;
    })
    */

    return this.foodTrucks;
  }

  getAccountInfo(uid: string){
    this.accountDocument = this.afs.collection('accounts').doc(uid)//reference
    return this.accountDocument.valueChanges();
  }


  /*
  The commented out section in the below function is me trying to use the id of the foodtruck
  to open the foodtruck details page. I was not able to get this to work so instead I am 
  passing 'eventStart' (labeled id) and matching it to the actual 'eventStart' 
  to uniquely identify the foodtruck - bad idea at scale


  I also went through the trouble to alter the above function to return a foodtruck 
  with an added id element. I am 75% of the way there i just can't get the correct 
  reference name for id

  I have tried 

  "key"
  "id"
  "$key"
  "_key"
  "documentId"
  */

  getFoodtruckFromId(id: number){
    this.foodTruckCollection = this.afs.collection('foodtrucks', ref => {
      return ref.where('eventStart', '==', id);
    }) //reference
    this.foodTrucks = this.foodTruckCollection.valueChanges();
    /*
    this.foodTrucks = this.foodTruckCollection.snapshotChanges().map(actions =>{
      return actions.map(a => {
        const data = a.payload.doc.data() as FoodTruck;
        if (data.id == id){
          return data
        }
      })
    })
    */
    return this.foodTrucks;
  }

  createProfile(user: User, account: Account){
    this.accountDocument = this.afs.collection('accounts').doc(user.uid)//reference
    this.accountDocument.set(account);
  }

  async uploadFile(username: string, file, uid) {
    var fileRef = this.afStorage.storage.ref("profilePics/");
    var dbfile = await fileRef.child(`${uid}/` + file.name).put(file);

    this.myUrl = await dbfile.ref.getDownloadURL();
    
    console.log(this.myUrl)
      return this.myUrl;
  }

  updateAccount(uid: string, account: Account){
    try {
      this.accountDocument = this.afs.collection('accounts').doc(uid);
    this.accountDocument.update(account);
    } catch (e) {
      console.error(e);
    }
  }

  async deleteProfilePic(uid:string, filename: string){
    try {
      await this.afStorage.ref(`profilePics/${uid}/${filename}`).delete();
    } catch(e) {
      console.error(e)
    }
  }

 


}
