import { NgModule } from '@angular/core';
import { GoogleMapsComponent } from './google-maps/google-maps';
import { ProgressBarComponent } from './progress-bar/progress-bar';
import { UpvoteButtonComponent } from './upvote-button/upvote-button';
import { BeaconUpvoteComponent } from './beacon-upvote/beacon-upvote'
import { IonicModule } from 'ionic-angular'
import { CommentSectionComponent } from './comment-section/comment-section';


@NgModule({
	declarations: [GoogleMapsComponent,
    ProgressBarComponent,
    UpvoteButtonComponent,
    BeaconUpvoteComponent,
    CommentSectionComponent],
	imports: [IonicModule],
	exports: [GoogleMapsComponent,
    ProgressBarComponent,
    UpvoteButtonComponent,
    BeaconUpvoteComponent,
    CommentSectionComponent]
})
export class ComponentsModule {}
