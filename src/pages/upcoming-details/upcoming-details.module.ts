import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpcomingDetailsPage } from './upcoming-details';
import { ComponentsModule} from '../../components/components.module';

@NgModule({
  declarations: [
    UpcomingDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(UpcomingDetailsPage),
    ComponentsModule
  ],
})
export class UpcomingDetailsPageModule {}
