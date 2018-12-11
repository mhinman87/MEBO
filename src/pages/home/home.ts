import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Loading, LoadingController, Events, AlertController } from 'ionic-angular';
import { FoodTruckMarker } from '../../models/foodtruck-marker.model';
import { DatabaseProvider } from '../../providers/database/database';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs';
import { FoodTruck } from '../../models/foodtruck.model';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from 'firebase/app';
import { sum, values } from 'lodash';

 

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnDestroy {

  map: google.maps.Map;
  markers: Array<google.maps.Marker>;
  foodtruckSubscription: any;
  loader: Loading;
  userPositionMarker: google.maps.Marker;
  hideMap: boolean;
  trucks$: Observable<FoodTruck[]>;
  campusOverlay: any;
  currentTime: number;
  x: any;
  authenticatedUser = {} as User;
  accountSubscription: any;
 
  
  

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private dbProvider: DatabaseProvider,
              private geolocation: Geolocation,
              private loadingCrtl: LoadingController,
              private events: Events,
              private alertCtrl: AlertController,
              private auth: AuthService ) {
                this.markers = [];
                this.hideMap = false;
                this.accountSubscription = this.auth.getAuthenticatedUser().subscribe((user: User)=>{
                  if (user != null){
                   try {
                     this.authenticatedUser = user;
                     console.log(this.authenticatedUser);
                   } catch(e) {
                     console.error(e);
                   }
                  }
                 }) 
                const second = 1000;
                this.x = setInterval(() => {
                  this.currentTime = new Date().getTime();
                    }, second)
                    setTimeout(()=>{
                    }, 1000);
                
  }
 
  //Initialize Map on page load
  async ionViewDidLoad() {
    this.showLoading();
      let latLng = new google.maps.LatLng(37.71814898706639, -97.28986489422863 );
      this.platform.ready().then(() => {
          this.initializeMap(latLng, 18);
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

      //subscribe to updated user locations from details pages
      this.events.subscribe('user-location', posData => {
        let LatLng = new google.maps.LatLng(posData[0], posData[1] );
        this.userPositionMarker.setPosition(LatLng);
        console.log('user position updated');
      });

  await this.geolocation.getCurrentPosition({
      timeout: 5000,
      enableHighAccuracy: true
    }).then((position)=>{
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.userPositionMarker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        icon: {
          url: 'assets/imgs/MeboWave.gif',
          scaledSize: new google.maps.Size(37.5, 50),
        }
      })
      if ((37.7224 >= position.coords.latitude && position.coords.latitude >= 37.7156) && (-97.2806 >= position.coords.longitude && position.coords.longitude >= -97.2990 )){
        this.map.setCenter(latLng);
      }
    },(err) => {
      this.presentAlert();
      console.log(err);
    })
    this.loader.dismiss();
  }

  async getPositionCenterMap(){
    this.showLoading();
    this.deleteMarkers();
    await this.geolocation.getCurrentPosition({
      timeout: 5000,
      enableHighAccuracy: true
    }).then((position)=>{
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        if (this.userPositionMarker){
          this.userPositionMarker.setPosition(latLng);
          this.map.setCenter(latLng);
          console.log("no new marker");
        } else {
        this.userPositionMarker = new google.maps.Marker({
          position: latLng,
          map: this.map,
          icon: {
            url: 'assets/imgs/MeboWave.gif',
            scaledSize: new google.maps.Size(37.5, 50),
          }
        })
        this.map.setCenter(latLng);
      }

      this.setMarkers();


    },(err) => {
      this.presentAlert();
      console.log(err);
    });
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

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'HOUSTON WE HAVE A PROBLEM',
      subTitle: "You are lost in space - update your location with refresh button",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  //initialize map, subscribe to foodtrucks, place markers, add click event to markers
  initializeMap(latLng: google.maps.LatLng, zoomLevel){
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
             , {name: 'Styled Map'});

    this.map = new google.maps.Map(document.getElementById('map_canvas'), {
            zoom: zoomLevel,
            center: latLng,
            mapTypeControl: false,
            streetViewControl: false,
            disableDefaultUI: true,
            fullscreenControl: false,
            clickableIcons: false,
            minZoom: 16,
            maxZoom: 19,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                      'styled_map']
            }      
          })

    this.map.mapTypes.set('styled_map', styledMapType);
    this.map.setMapTypeId('styled_map');
    this.setMarkers();

}

setMapOnAll(map) {
  for (var i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(map);
  }
}


deleteMarkers() {
  this.setMapOnAll(null);
  this.markers = [];
}

auraDescending(a: FoodTruck, b: FoodTruck) {
  return a.aura > b.aura ? -1 : 1
}

timeDescending(a, b){
  return a.eventStart < b.eventStart ? -1 : 1;
}

ngOnDestroy(){
  if (this.foodtruckSubscription){
    this.foodtruckSubscription.unsubscribe();
  }
  this.events.unsubscribe('user-location');
}

ionViewDidLeave(){
  if (this.foodtruckSubscription){
    this.foodtruckSubscription.unsubscribe();
  }
  
}

navToDetails(foodtruck: FoodTruck){
  this.navCtrl.push('DetailsPage', {
    truckData: foodtruck
    })
}

minsRemaining(time){
  return Math.floor((time + 5*3600000 - this.currentTime)/60000)
}

flipMap(){
  document.querySelector('.map').classList.toggle('is-flipped');
  if (this.hideMap){
    this.hideMap = false;
  } else {
    this.hideMap = true;
  }
}

setMarkers(){
  this.trucks$ = this.dbProvider.getFoodtrucks().map((data)=>{
    console.log(data)
    data.sort(this.auraDescending);

    for (let truck of data){
      let truckMarker: google.maps.Marker = new FoodTruckMarker(truck) 
      truckMarker.setOptions({
        position: new google.maps.LatLng(truck.lat, truck.long),
        map: this.map,
        icon: {
          url: `assets/imgs/${truck.image}.gif`,
          scaledSize: new google.maps.Size(42, 42),
        },
        animation: google.maps.Animation.DROP
      });

      google.maps.event.addListener(truckMarker, 'click', ()=>{
        let selectedMarker: any = truckMarker;
        this.navCtrl.push('DetailsPage', {
          truckData: selectedMarker.truckData
          }) 
        this.map.setCenter(truckMarker.getPosition());
      })

      this.markers.push(truckMarker);

    }

    return data;
  })

  console.log(this.markers);
}

sortEventsByAura(){
  this.showLoading()
  this.trucks$ = this.dbProvider.getFoodtrucks().map((data)=>{
    data.sort(this.auraDescending);
    return data;
  })
  this.loader.dismiss()
}

sortUntilLaunch(){
  this.showLoading();
  this.trucks$ = this.dbProvider.getFoodtrucks().map((data)=>{
    data.sort(this.timeDescending);
    return data;
  })
  this.loader.dismiss();
}

 
  
  
}
