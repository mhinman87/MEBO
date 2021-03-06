import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Loading, LoadingController, Events, AlertController } from 'ionic-angular';
import { FoodTruckMarker } from '../../models/foodtruck-marker.model';
import { DatabaseProvider } from '../../providers/database/database';
import { Geolocation } from '@ionic-native/geolocation';
import { FoodTruck } from '../../models/foodtruck.model';
import { AuthService } from '../../providers/auth/auth.service';
import { User } from 'firebase/app';


 

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
  trucks: FoodTruck[];
  campusOverlay: any;
  currentTime: number;
  x: any;
  authenticatedUser = {} as User;
  accountSubscription: any;
  bounds = new google.maps.LatLngBounds( 
    new google.maps.LatLng(37.71365, -97.30031),
    new google.maps.LatLng(37.72375, -97.28048505979406)
   );
 
  
  

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
                     this.accountSubscription.unsubscribe();
                   } catch(e) {
                     console.error(e);
                   }
                  } else {
                    this.accountSubscription.unsubscribe();
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
      let latLng = new google.maps.LatLng(37.718115926550766, -97.29444515 );
      this.platform.ready().then(() => {
          this.initializeMap(latLng, 17);
          var imageBounds = {
            north: 37.7269,
            south: 37.7112,
            east: -97.27605,
            west: -97.30445
          };
            this.campusOverlay = new google.maps.GroundOverlay(
              '../../assets/imgs/Map.png',
              imageBounds);
            this.campusOverlay.setMap(this.map);
        })

      //subscribe to updated user locations from details pages
      this.events.subscribe('user-location', posData => {
        let LatLng = new google.maps.LatLng(posData[0], posData[1] );
        this.userPositionMarker.setPosition(LatLng);
        
      });
    this.getPositionCenterMap();
  }

  async getPositionCenterMap(){
    this.showLoading();
    this.deleteMarkers();
    await this.geolocation.getCurrentPosition({
      timeout: 5000,
      enableHighAccuracy: true
    }).then((position)=>{
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      if (this.bounds.contains(latLng)){
        if (this.userPositionMarker){
          this.userPositionMarker.setPosition(latLng);
          this.map.setCenter(latLng);
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

      
      } else {
        //this.presentAlert("Not on Campus")
      }
      this.setMarkers();
    },(err) => {
      this.setMarkers();
      this.presentAlert("You are lost in space!! We can't find you.");
      console.log(err);
    })
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

  navToAddFlag(){
    this.navCtrl.push('AddFoodtruckPage');
  }

  presentAlert(err) {
    let alert = this.alertCtrl.create({
      title: 'HOUSTON WE HAVE A PROBLEM',
      subTitle: err,
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

ffFreshness(a: FoodTruck, b: FoodTruck){
  let time = new Date().getTime();
  let timePasseda = Math.abs(a.eventStart + 5*3600000 - time)
  let signA = Math.abs(a.aura)
  if (signA > 0){
    signA = 1
  } else if (signA < 0){
    signA = -1
  } else {
    signA = 0
  }
  let valueA = Math.abs(a.aura)
  if (a.aura < 0){
    valueA = 1
  }

  let timePassedb = Math.abs(b.eventStart + 5*3600000 - time)
  let signB = Math.abs(b.aura)
  if (signB > 0){
    signB = 1
  } else if (signB < 0){
    signB = -1
  } else {
    signB = 0
  }
  let valueB = Math.abs(b.aura)
  if (b.aura < 0){
    valueB = 1
  }
  
  return (Math.log10(valueA) + 4500000/(timePasseda * signA)) > (Math.log10(valueB) + 4500000/(timePassedb * signB)) ? 1 : -1
}

auraDescending(a: FoodTruck, b: FoodTruck) {
  return a.aura > b.aura ? -1 : 1
}

// fireDescending(a, b) {
//   return a.fireRating > b.fireRating ? -1 : 1
// }

timeDescending(a, b){
  return a.eventEnd < b.eventEnd ? -1 : 1;
}

ngOnDestroy(){
  if (this.foodtruckSubscription){
    this.foodtruckSubscription.unsubscribe();
  }
  this.accountSubscription.unsubscribe();
  this.events.unsubscribe('user-location');
}

ionViewDidLeave(){
  if (this.foodtruckSubscription){
    this.foodtruckSubscription.unsubscribe();
  }
  this.accountSubscription.unsubscribe();
  this.events.unsubscribe('user-location');
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
  document.querySelector('.map-button').classList.toggle('is-flipped');
  document.querySelector('.map').classList.toggle('is-flipped');
  document.querySelector('.add-flag-button').classList.toggle('is-flipped');
  setTimeout(()=>{
    document.querySelector('.map__face--front').classList.toggle('is-flipped');
  }, 500)
  
  // if (this.hideMap){
  //   this.hideMap = false;
  // } else {
  //   var that = this;
  //   setTimeout(function(){
  //     that.hideMap =  true;
  //     }
  //     , 1000)   
  // }
}

setMarkers(){
  this.deleteMarkers();
  this.foodtruckSubscription = this.dbProvider.getFoodtrucks().subscribe((data)=>{
    this.trucks = data.sort(this.auraDescending);
    

    for (let truck of data){
      let truckMarker: google.maps.Marker = new FoodTruckMarker(truck) 
      truckMarker.setOptions({
        position: new google.maps.LatLng(truck.lat, truck.long),
        map: this.map,
        icon: {
          url: `assets/imgs/${truck.image}.png`,
          scaledSize: new google.maps.Size(40, 60),
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
  this.trucks.sort(this.auraDescending)
}

sortUntilLaunch(){
  this.trucks.sort(this.timeDescending)
}

sortFFFreshness(){
  this.trucks.sort(this.ffFreshness)
}

truncateText(text, maxlength) {
  if (text.length > maxlength) {
      text = text.substr(0,maxlength) + '...';
  }
  return text;
}


 
  
  
}
