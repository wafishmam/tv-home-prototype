import { devFlags } from './dev/flags';
import { TokenSpecimen } from './dev/TokenSpecimen';
import { Stage } from './stage/Stage';

export function App() {
  if (devFlags.tokens) return <TokenSpecimen />;

  // The stage is empty for now. Rails and the hero arrive in later steps.
  return <Stage showGuides={devFlags.guides} />;
}
