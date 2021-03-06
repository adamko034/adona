import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { NavigationActionTiming, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { InvitationEffects } from 'src/app/core/invitations/store/effects/invitation.effects';
import { RouterEffects } from 'src/app/core/router/store/effects/router.effects';
import { ErrorEffects } from 'src/app/core/store/effects/error.effects';
import { TeamEffects } from 'src/app/core/team/store/effects/team/team.effects';
import { TeamsEffects } from 'src/app/core/team/store/effects/teams/teams.effects';
import { CustomSerializer } from 'src/app/utils/router-store/custom-serializer';
import { SharedModule } from '../shared/shared.module';
import { AuthFacade } from './auth/auth.facade';
import { AuthGuard } from './auth/guard/auth.guard';
import { AuthService } from './auth/services/auth.service';
import { ErrorFacade } from './error/error.facade';
import { CustomIconsService } from './services/angular-material/custom-icons/custom-icons.service';
import { AuthEffects } from './store/effects/auth.effects';
import { UserEffects } from './store/effects/user.effects';
import { metaReducers, reducers } from './store/reducers';
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
    EffectsModule.forRoot([
      AuthEffects,
      ErrorEffects,
      TeamsEffects,
      TeamEffects,
      UserEffects,
      InvitationEffects,
      RouterEffects
    ]),
    DeviceDetectorModule.forRoot(),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      navigationActionTiming: NavigationActionTiming.PostActivation,
      serializer: CustomSerializer
    })
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
