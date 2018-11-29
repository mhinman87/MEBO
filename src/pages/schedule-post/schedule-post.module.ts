import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SchedulePostPage } from './schedule-post';

@NgModule({
  declarations: [
    SchedulePostPage,
  ],
  imports: [
    IonicPageModule.forChild(SchedulePostPage),
  ],
})
export class SchedulePostPageModule {}
