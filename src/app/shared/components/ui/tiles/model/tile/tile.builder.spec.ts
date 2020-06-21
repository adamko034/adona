import { TileBuilder } from 'src/app/shared/components/ui/tiles/model/tile/tile.builder';
import { Tile } from 'src/app/shared/components/ui/tiles/model/tile/tile.model';

describe('Tile Builder', () => {
  it('should build with required values', () => {
    expect(TileBuilder.from('title', 'desc').build()).toEqual(buildExpected('title', 'desc'));
  });

  it('should build with image url', () => {
    expect(TileBuilder.from('title', 'desc').withImageUrl('imageUrl').build()).toEqual(
      buildExpected('title', 'desc', 'imageUrl')
    );
  });

  it('should build with navigation link', () => {
    expect(TileBuilder.from('title', 'desc').withNavigationLink('navUrl').build()).toEqual(
      buildExpected('title', 'desc', undefined, 'navUrl')
    );
  });
});

function buildExpected(title: string, desc: string, imageUrl?: string, navigationLink?: string): Tile {
  const tile: Tile = { title, description: desc };
  if (imageUrl) {
    tile.imageUrl = imageUrl;
  }

  if (navigationLink) {
    tile.navigationLink = navigationLink;
  }

  return tile;
}
