import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MissionControlPage } from './mission-control';

@NgModule({
  declarations: [
    MissionControlPage,
  ],
  imports: [
    IonicPageModule.forChild(MissionControlPage),
  ],
})
export class MissionControlPageModule {}
