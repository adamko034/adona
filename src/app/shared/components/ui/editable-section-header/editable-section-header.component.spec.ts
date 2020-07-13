import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableSectionHeaderComponent } from './editable-section-header.component';

describe('EditableSectionHeaderComponent', () => {
  let component: EditableSectionHeaderComponent;
  let fixture: ComponentFixture<EditableSectionHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableSectionHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableSectionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
