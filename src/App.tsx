import { Home } from './components/Home';
import { devFlags } from './dev/flags';
import { PosterSheet } from './dev/PosterSheet';
import { TokenSpecimen } from './dev/TokenSpecimen';
import { Stage } from './stage/Stage';

export function App() {
  if (devFlags.tokens) return <TokenSpecimen />;
  if (devFlags.posters) return <PosterSheet />;

  return (
    <Stage showGuides={devFlags.guides}>
      <Home />
    </Stage>
  );
}
