import { Component } from '@angular/core';
import { SettingsConstants } from 'src/app/modules/settings/constants/settings.constants';
import { Tile } from 'src/app/shared/components/ui/tiles/model/tile/tile.model';

@Component({
  selector: 'app-settings-list',
  templateUrl: './settings-list.component.html',
  styleUrls: ['./settings-list.component.scss']
})
export class SettingsListComponent {
  public get tiles(): Tile[] {
    return SettingsConstants.Tiles;
  }
}
