import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTeamDialogComponent } from './change-team-dialog.component';

describe('ChangeTeamDialogComponent', () => {
  let component: ChangeTeamDialogComponent;
  let fixture: ComponentFixture<ChangeTeamDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeTeamDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTeamDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
