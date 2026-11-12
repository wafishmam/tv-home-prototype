import { memo } from 'react';
import type { CatalogItem } from '../../data/types';
import { ART_WIDTH, hashString } from './art';
import { FieldArt } from './FieldArt';
import { HorizonArt } from './HorizonArt';
import { MatchupArt } from './MatchupArt';
import { NoirArt } from './NoirArt';
import { OrbitArt } from './OrbitArt';
import { PopArt } from './PopArt';
import './Poster.css';

const styles = {
  orbit: OrbitArt,
  noir: NoirArt,
  horizon: HorizonArt,
  pop: PopArt,
  field: FieldArt,
} as const;

interface ItemArtProps {
  item: CatalogItem;
  /** True when the art is used as the hero backdrop instead of on a card. */
  backdrop?: boolean;
}

/*
 * The left part of the hero backdrop is hidden behind the text scrim. A game
 * split down the middle would show almost only the away team there, so in
 * the backdrop the seam moves right to give both teams a similar share.
 */
const BACKDROP_SEAM = ART_WIDTH * 0.7;

/**
 * The artwork for any catalog item, with no lettering. It fills its parent,
 * so cards and the hero backdrop can both use it.
 *
 * Memoised because the art never changes for a given item, and it is the
 * most expensive thing on a card to re-render.
 */
export const ItemArt = memo(function ItemArt({ item, backdrop = false }: ItemArtProps) {
  if (item.kind === 'game') {
    return (
      <MatchupArt
        home={item.home}
        away={item.away}
        sport={item.league.sport}
        seam={backdrop ? BACKDROP_SEAM : undefined}
      />
    );
  }
  const Art = styles[item.poster.style];
  return <Art palette={item.poster.palette} variant={item.poster.variant} seed={hashString(item.id)} />;
});
