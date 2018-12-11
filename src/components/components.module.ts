import { NgModule } from '@angular/core';
import { GoogleMapsComponent } from './google-maps/google-maps';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { UpvoteButtonComponent } from './upvote-button/upvote-button';
import {IonicModule} from 'ionic-angular'


@NgModule({
	declarations: [GoogleMapsComponent,
    ProgressBarComponent,
    UpvoteButtonComponent],
	imports: [IonicModule],
	exports: [GoogleMapsComponent,
    ProgressBarComponent,
    UpvoteButtonComponent]
})
export class ComponentsModule {}
