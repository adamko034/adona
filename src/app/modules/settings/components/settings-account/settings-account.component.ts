import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from 'src/app/core/user/model/user/user.model';
import { UserFacade } from 'src/app/core/user/user.facade';
import { UnsubscriberService } from 'src/app/shared/services/infrastructure/unsubscriber/unsubscriber.service';
import { CustomValidators } from 'src/app/shared/utils/forms/custom-validators.validator';

@Component({
  selector: 'app-settings-account',
  templateUrl: './settings-account.component.html',
  styleUrls: ['./settings-account.component.scss']
})
export class SettingsAccountComponent implements OnInit, OnDestroy {
  private destroyed$: Subject<void>;

  public user: User;
  public isError: boolean;

  public form = new FormGroup({
    newName: new FormControl('', [CustomValidators.requiredValue, CustomValidators.singleWord])
  });

  constructor(private userFacade: UserFacade, private unsubscriberService: UnsubscriberService) {
    this.destroyed$ = this.unsubscriberService.create();
  }

  public ngOnInit(): void {
    this.userFacade
      .selectUser()
      .pipe(takeUntil(this.destroyed$))
      .subscribe((user: User) => {
        if (user) {
          this.user = user;
          this.form.get('newName').setValue(user.name);
        }
      });
  }

  public ngOnDestroy(): void {
    this.unsubscriberService.complete(this.destroyed$);
  }

  public udpateName(): void {
    if (this.form.valid) {
      this.userFacade.updateName(this.user.id, this.form.get('newName').value);
    }
  }
}
