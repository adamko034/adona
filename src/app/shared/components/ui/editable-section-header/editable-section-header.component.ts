import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-editable-section-header',
  templateUrl: './editable-section-header.component.html',
  styleUrls: ['./editable-section-header.component.scss']
})
export class EditableSectionHeaderComponent {
  @Input() title: string;
  @Input() showEditMode = true;
  @Input() mode: 'display' | 'edit' = 'display';

  @Output() toggleMode = new EventEmitter<'display' | 'edit'>();

  public get icon() {
    return this.mode === 'display' ? 'settings' : 'cancel';
  }

  constructor() {}

  public onToggleMode() {
    this.mode = this.mode === 'display' ? 'edit' : 'display';
    this.toggleMode.emit(this.mode);
  }
}
