import { Tile } from 'src/app/shared/components/ui/tiles/model/tile/tile.model';

export class TileBuilder {
  private tile: Tile;

  private constructor(title: string, description: string) {
    this.tile = { title, description };
  }

  public static from(title: string, description: string): TileBuilder {
    return new TileBuilder(title, description);
  }

  public withImageUrl(imageUrl: string): TileBuilder {
    this.tile.imageUrl = imageUrl;
    return this;
  }

  public withNavigationLink(url: string): TileBuilder {
    this.tile.navigationLink = url;
    return this;
  }

  public build(): Tile {
    return this.tile;
  }
}
