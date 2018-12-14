import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MissionControlPage } from './mission-control';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MissionControlPage,
  ],
  imports: [
    IonicPageModule.forChild(MissionControlPage),
    ComponentsModule
  ],
})
export class MissionControlPageModule {}
