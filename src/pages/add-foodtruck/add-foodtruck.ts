import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Loading, LoadingController } from 'ionic-angular';
import { FoodTruck } from '../../models/foodtruck.model';
import { DatabaseProvider } from '../../providers/database/database';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from 'firebase/app';
import { Account } from '../../models/account.model';

/**
 * Generated class for the AddFoodtruckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-foodtruck',
  templateUrl: 'add-foodtruck.html',
})
export class AddFoodtruckPage {

  foodtruck = {} as FoodTruck;
  map: google.maps.Map;
  loader: Loading;
  authenticatedUser: User;
  account: Account;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseProvider,
              private platform: Platform,
              private loadingCtrl: LoadingController,
              private auth: AuthService) {

                this.auth.getAuthenticatedUser().subscribe((user: User)=>{
                  if (user){
                    this.authenticatedUser = user;
                    console.log(this.authenticatedUser);
                    this.database.getAccountInfo(user.uid).subscribe((account) =>{
                    this.setAccount(account);
                  })
                  }
                })
  }

  ionViewDidLoad() {
    
    this.platform.ready().then(() => {
      this.initializeMap();
    })
  }

  setAccount(account: Account){
    this.account = account;
  }

  async saveFoodtruck(foodtruck: FoodTruck){
    this.showLoading();
    this.foodtruck.lat = this.map.getCenter().lat();
    this.foodtruck.long = this.map.getCenter().lng();
    this.foodtruck.name = this.account.username;
    this.foodtruck.type = "foodtruck";
    this.foodtruck.aura = 0;
    this.foodtruck.eventStart = Date.now() - 5*3600000;
    this.foodtruck.eventEnd = this.foodtruck.eventStart + this.foodtruck.duration*3600000;
    await this.database.saveFoodtruck(foodtruck);
    
    this.loader.dismiss().then(()=>{
      this.navCtrl.setRoot('HomePage');
    })
    
  }

  initializeMap(){
    let zoomLevel = 14;

    var styledMapType = new google.maps.StyledMapType(
      [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#212121"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#c20051"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#181818"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1b1b1b"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#373737"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8a8a8a"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#373737"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "stylers": [
            {
              "weight": 1.5
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#3c3c3c"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#0082ca"
            },
            {
              "visibility": "on"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#4e4e4e"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#0082ca"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#000000"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#3d3d3d"
            }
          ]
        }
      ]
        
        ,
      {name: 'Styled Map'});

    this.map = new
    google.maps.Map(document.getElementById('map_canvas1'), {
      zoom: zoomLevel,
      center: new google.maps.LatLng(37.6872, -97.3301),
      mapTypeControl: false,
      streetViewControl: false,
      disableDefaultUI: true,
      clickableIcons: false,
      minZoom: 10,
      backgroundColor: "#1A1E2A",
      mapTypeId: google.maps.MapTypeId.ROADMAP
    })

    this.map.mapTypes.set('styled_map', styledMapType);
    this.map.setMapTypeId('styled_map');
    
  }

  showLoading(){
    this.loader = this.loadingCtrl.create({
      content: `<img src="assets/imgs/loading.gif" />`,
      showBackdrop: false,
      spinner: 'hide'
    })
    this.loader.present();
  }

}
