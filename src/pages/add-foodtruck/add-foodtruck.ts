import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Loading, LoadingController, AlertController } from 'ionic-angular';
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
  campusOverlay: any;
  bounds = new google.maps.LatLngBounds( 
    new google.maps.LatLng(37.715370977172995, -97.29908267172995),
    new google.maps.LatLng(37.72261431997561, -97.28076715924516)
   );

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private database: DatabaseProvider,
              private platform: Platform,
              private loadingCtrl: LoadingController,
              private auth: AuthService,
              private alertCtrl: AlertController) {

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

  async ionViewDidLoad() {
    this.showLoading();
      let latLng = new google.maps.LatLng(37.71814898706639, -97.28986489422863 );
      this.platform.ready().then(() => {
        this.initializeMap(latLng);
        var imageBounds = {
          north: 37.72375,
          south: 37.71365,
          east: -97.28048505979406,
          west: -97.30031
        };
        this.campusOverlay = new google.maps.GroundOverlay(
          '../../assets/imgs/MEBO-Map.gif',
          imageBounds);
        this.campusOverlay.setMap(this.map);
      })
    this.loader.dismiss();
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Outside Campus',
      subTitle: "Breh... You can't launch events outside campus",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  setAccount(account: Account){
    this.account = account;
  }

  navigateToSubmitPage(){
    let lat = this.map.getCenter().lat();
    let lng = this.map.getCenter().lng();
    let markerPos = new google.maps.LatLng(lat, lng)
    if (this.bounds.contains(markerPos)){
      this.navCtrl.push('SubmitPostPage', {lat: lat,
        lng: lng,
        account: this.account});
    } else {
      this.presentAlert();
    }
   
  }

  navigateToSchedulePostPage(){
    let lat = this.map.getCenter().lat();
    let lng = this.map.getCenter().lng();
    let markerPos = new google.maps.LatLng(lat, lng)
    if (this.bounds.contains(markerPos)){
      this.navCtrl.push('SchedulePostPage', {lat: lat,
        lng: lng,
        account: this.account});
    } else {
      this.presentAlert();
    }
   
  }



  initializeMap(latLng: google.maps.LatLng){
    let zoomLevel = 16;

    var styledMapType = new google.maps.StyledMapType(
      
      [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "elementType": "labels",
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
              "color": "#8ec3b9"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1a3646"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#4b6878"
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
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#64779e"
            }
          ]
        },
        {
          "featureType": "administrative.neighborhood",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.province",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#4b6878"
            }
          ]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#334e87"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#023e58"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#283d6a"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#6f9ba5"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#023e58"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#3C7680"
            }
          ]
        },
        {
          "featureType": "road",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#304a7d"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#98a5be"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#2c6675"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#255763"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#b0d5ce"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#023e58"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#98a5be"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#283d6a"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#3a4762"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#0e1626"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#4e6d70"
            }
          ]
        }
      ]
        ,
      {name: 'Styled Map'});

    this.map = new
    google.maps.Map(document.getElementById('map_canvas1'), {
      zoom: zoomLevel,
      center: latLng,
      mapTypeControl: false,
      streetViewControl: false,
      disableDefaultUI: true,
      clickableIcons: false,
      minZoom: 16,
      maxZoom: 19,
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
