import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/core/user/model/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

@Component({
  selector: 'app-settings-account',
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.scss']
})
export class SettingsAccountComponent implements OnInit, OnDestroy {
  private userSubscription: Subscription;

  public user: User;
  public isError: boolean;

  public newName = new FormControl('', [CustomValidators.requiredValue, CustomValidators.singleWord]);

  constructor(private userFacade: UserFacade) {}

  public ngOnInit(): void {
    this.userSubscription = this.userFacade.selectUser().subscribe((user: User) => {
      if (user) {
        this.user = user;
        this.newName.setValue(user.name);
      }
    });

    // this.requestStateSubscription = this.guiFacade.selectBackendState().subscribe((backendState: BackendState) => {
    //   if (backendState && backendState.failure) {
    //     this.newName.setErrors({ backend: { valid: false } });
    //   }

    //   if (backendState && backendState.success) {
    //     this.newName.setErrors(null);
    //   }
    // });
  }

  public ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  public onNameChanged(): void {
    if (this.newName.valid) {
      this.userFacade.updateName(this.user.id, this.newName.value);
    }
  }
}
