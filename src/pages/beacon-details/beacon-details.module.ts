import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeaconDetailsPage } from './beacon-details';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    BeaconDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BeaconDetailsPage),
    ComponentsModule
  ],
})
export class BeaconDetailsPageModule {}
