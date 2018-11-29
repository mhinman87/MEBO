import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpcomingDetailsPage } from './upcoming-details';

@NgModule({
  declarations: [
    UpcomingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(UpcomingDetailsPage),
  ],
})
export class UpcomingDetailsPageModule {}
