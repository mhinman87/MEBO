import { NgModule } from '@angular/core';
import { GoogleMapsComponent } from './google-maps/google-maps';
import { ProgressBarComponent } from './progress-bar/progress-bar';


@NgModule({
	declarations: [GoogleMapsComponent,
    ProgressBarComponent],
	imports: [],
	exports: [GoogleMapsComponent,
    ProgressBarComponent]
})
export class ComponentsModule {}
