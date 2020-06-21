import { Component, Input } from '@angular/core';
import { Tile } from 'src/app/shared/components/ui/tiles/model/tile/tile.model';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent {
  @Input() tile: Tile;
  @Input() isActive = false;

  constructor() {}
}
