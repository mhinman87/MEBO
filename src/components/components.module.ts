import { NgModule } from '@angular/core';
import { GoogleMapsComponent } from './google-maps/google-maps';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { UpvoteButtonComponent } from './upvote-button/upvote-button';
import { BeaconUpvoteComponent } from './beacon-upvote/beacon-upvote'
import {IonicModule} from 'ionic-angular'


@NgModule({
	declarations: [GoogleMapsComponent,
    ProgressBarComponent,
    UpvoteButtonComponent,
    BeaconUpvoteComponent],
	imports: [IonicModule],
	exports: [GoogleMapsComponent,
    ProgressBarComponent,
    UpvoteButtonComponent,
    BeaconUpvoteComponent]
})
export class ComponentsModule {}
