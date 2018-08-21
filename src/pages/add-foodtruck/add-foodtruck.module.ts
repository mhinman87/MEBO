import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddFoodtruckPage } from './add-foodtruck';

@NgModule({
  declarations: [
    AddFoodtruckPage,
  ],
  imports: [
    IonicPageModule.forChild(AddFoodtruckPage),
  ],
})
export class AddFoodtruckPageModule {}
