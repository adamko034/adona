import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterFacade } from 'src/app/core/router/router.facade';
import { Tile } from 'src/app/shared/components/ui/tiles/model/tile/tile.model';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss']
})
export class TilesComponent implements OnInit {
  @Input() tiles: Tile[];
  @Input() isNavigation = false;

  public currentRoute$: Observable<string>;

  constructor(private routerFacade: RouterFacade) {}

  public ngOnInit(): void {
    if (this.isNavigation) {
      this.currentRoute$ = this.routerFacade.selectCurrentRute();
    }
  }
}
