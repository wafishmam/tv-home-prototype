/*
 * Shapes of the mock catalog. Everything here is fictional.
 */

/** The poster art styles. Each genre maps to one style. */
export type ArtStyle = 'orbit' | 'noir' | 'horizon' | 'pop' | 'field';

/** Four colours. What each slot means depends on the art style. */
export type Palette = readonly [string, string, string, string];

export interface PosterSpec {
  style: ArtStyle;
  /** Picks one of the compositions within a style. */
  variant: number;
  palette: Palette;
  /** Colour of the title lettering on the poster. */
  ink: string;
}

export interface Progress {
  /** How much has been watched, from 0 to 1. */
  fraction: number;
  /** For example "S2 E4 · 18 min left". */
  label: string;
}

/** A film or series. */
export interface TitleItem {
  kind: 'title';
  id: string;
  title: string;
  genre: string;
  year: number;
  rating: string;
  /** For example "2 seasons" or "1h 48m". */
  length: string;
  synopsis: string;
  poster: PosterSpec;
  progress?: Progress;
}

export type Sport = 'hoops' | 'ice' | 'football';

export interface League {
  id: string;
  name: string;
  sport: Sport;
}

export interface Team {
  id: string;
  name: string;
  /** Three letter code shown on cards. */
  abbr: string;
  primary: string;
  secondary: string;
  /** Text colour that reads on top of `primary`. */
  ink: string;
}

/** A live game. Scores and the clock come from the live feed, not from here. */
export interface GameItem {
  kind: 'game';
  id: string;
  league: League;
  home: Team;
  away: Team;
  venue: string;
  synopsis: string;
}

export type CatalogItem = TitleItem | GameItem;

export interface RailData {
  id: string;
  title: string;
  items: readonly CatalogItem[];
}
