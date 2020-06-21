import { sortBy } from 'lodash';
import { settingsRoutes } from 'src/app/core/router/constants/routes.constants';
import { TileBuilder } from 'src/app/shared/components/ui/tiles/model/tile/tile.builder';
import { Tile } from 'src/app/shared/components/ui/tiles/model/tile/tile.model';

export class SettingsConstants {
  private static tiles: Tile[];
  public static get Tiles(): Tile[] {
    if (!this.tiles) {
      this.tiles = sortBy(settingsRoutes, 'id').map((settingsRoute) => {
        return TileBuilder.from(settingsRoute.name, settingsRoute.description)
          .withImageUrl(settingsRoute.image)
          .withNavigationLink(settingsRoute.url)
          .build();
      });
    }

    return this.tiles;
  }
}
