import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditBeaconPage } from './edit-beacon';

@NgModule({
  declarations: [
    EditBeaconPage,
  ],
  imports: [
    IonicPageModule.forChild(EditBeaconPage),
  ],
})
export class EditBeaconPageModule {}
