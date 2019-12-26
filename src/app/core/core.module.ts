import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule, Optional, SkipSelf} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {ErrorEffects} from 'src/app/core/store/effects/error.effects';
import {SharedModule} from '../shared/shared.module';
import {AuthFacade} from './auth/auth.facade';
import {AuthGuard} from './auth/guard/auth.guard';
import {AuthService} from './auth/services/auth.service';
import {ErrorFacade} from './error/error.facade';
import {CustomIconsService} from './services/angular-material/custom-icons/custom-icons.service';
import {AuthEffects} from './store/effects/auth.effects';
import {metaReducers, reducers} from './store/reducers';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    HttpClientModule,
    EffectsModule.forRoot([AuthEffects, ErrorEffects]),
    DeviceDetectorModule.forRoot()
  ],
  providers: [AuthGuard, AuthService, AuthFacade, ErrorFacade, CustomIconsService]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule has already been loaded. You should only import Core modules in the AppModule only.');
    }
  }
}
