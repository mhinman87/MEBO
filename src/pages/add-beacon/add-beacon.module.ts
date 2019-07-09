import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBeaconPage } from './add-beacon';

@NgModule({
  declarations: [
    AddBeaconPage,
  ],
  imports: [
    IonicPageModule.forChild(AddBeaconPage),
  ],
})
export class AddBeaconPageModule {}
