import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Loading, LoadingController, Events, AlertController } from 'ionic-angular';
import { FoodTruckMarker } from '../../models/foodtruck-marker.model';
import { DatabaseProvider } from '../../providers/database/database';
import { Geolocation } from '@ionic-native/geolocation';
import { Observable } from 'rxjs';
import { FoodTruck } from '../../models/foodtruck.model';

 

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
  markers = [];
  foodtruckSubscription: any;
  loader: Loading;
  userPositionMarker: google.maps.Marker;
  hideMap: boolean;
  trucks$: Observable<FoodTruck[]>;
 
  
  

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private platform: Platform,
              private dbProvider: DatabaseProvider,
              private geolocation: Geolocation,
              private loadingCrtl: LoadingController,
              private events: Events,
              private alertCtrl: AlertController ) {
                this.hideMap = false;
                this.trucks$ = this.dbProvider.getFoodtrucks().map((data)=>{
                  data.sort(this.auraDescending);
                  return data;
                })
                
  }
 
  //Initialize Map on page load
  async ionViewDidLoad() {
    this.showLoading();
    await this.geolocation.getCurrentPosition({
      timeout: 5000
    }).then((position)=>{

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.platform.ready().then(() => {
        this.initializeMap(latLng, 14, true);
        
      })
      
    },(err) => {
      
      this.platform.ready().then(()=>{
        this.presentAlert();
        let LatLng = new google.maps.LatLng(37.6872, -97.3301 );
        this.initializeMap(LatLng, 12,);
      })
      console.log(err);
    });

    
    //subscribe to updated user locations from details pages
    this.events.subscribe('user-location', posData => {
      let LatLng = new google.maps.LatLng(posData[0], posData[1] );
      this.userPositionMarker.setPosition(LatLng);
      console.log('user position updated');
    });

    this.loader.dismiss();
    
    
  }

  async getPositionCenterMap(){
    this.showLoading();
    await this.geolocation.getCurrentPosition({
      timeout: 5000,
      enableHighAccuracy: true
    }).then((position)=>{
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.userPositionMarker = new google.maps.Marker({
        position: latLng,
        map: this.map,
        icon: {
          url: 'assets/imgs/position.png',
          scaledSize: new google.maps.Size(20, 20),
        }
      })
      this.map.setCenter(latLng);
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
      title: 'Location Error',
      subTitle: "Where you at bro? We can't find you",
      buttons: ['Dismiss']
    });
    alert.present();
  }

  toggleMap(){
    console.log(this.markers)
    if (this.hideMap){
      this.hideMap = false;
    } else {
      this.hideMap = true;
    }
  }

  //initialize map, subscribe to foodtrucks, place markers, add click event to markers
  initializeMap(latLng: google.maps.LatLng, zoomLevel, haveUsrPos?: boolean){
    

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
    google.maps.Map(document.getElementById('map_canvas'), {
      zoom: zoomLevel,
      center: latLng,
      mapTypeControl: false,
      streetViewControl: false,
      disableDefaultUI: true,
      fullscreenControl: false,
      clickableIcons: false,
      minZoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
                'styled_map']
      }      
    })

    this.map.mapTypes.set('styled_map', styledMapType);
    this.map.setMapTypeId('styled_map');



   this.foodtruckSubscription = this.dbProvider.getFoodtrucks().subscribe((OBtrucks)=>{
    
    for (let truck of OBtrucks){
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

    this.markers = OBtrucks.sort(this.auraDescending);
    console.log(this.markers);

  })

  if(haveUsrPos){
    this.userPositionMarker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      icon: {
        url: 'assets/imgs/position.png',
        scaledSize: new google.maps.Size(20, 20),
      }
    })
  }


}

setMapOnAll(map) {
  for (var i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(map);
  }
}

auraDescending(a, b) {
  return a.aura > b.aura ? -1 : 1
}

ngOnDestroy(){
  this.foodtruckSubscription.unsubscribe();
  this.events.unsubscribe('user-location', ()=>{
    console.log('Unsubscribed from user location updates');
  });
}

ionViewDidLeave(){
  this.foodtruckSubscription.unsubscribe();
}

navToDetails(foodtruck: FoodTruck){
  this.navCtrl.push('DetailsPage', {
    truckData: foodtruck
    })
}

 
  
  
}
