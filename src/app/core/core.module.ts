import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthFacade } from './auth/auth.facade';
import { AuthGuard } from './auth/guard/auth.guard';
import { AuthService } from './auth/services/auth.service';
import { ErrorFacade } from './error/error.facade';
import { AuthEffects } from './store/effects/auth.effects';
import { metaReducers, reducers } from './store/reducers';
import { ErrorEffects } from 'src/app/core/store/effects/error.effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([AuthEffects, ErrorEffects])
  ],
  providers: [AuthGuard, AuthService, AuthFacade, ErrorFacade]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule has already been loaded. You should only import Core modules in the AppModule only.'
      );
    }
  }
}
