import './TokenSpecimen.css';

/*
 * A plain page that renders the tokens so they can be checked by eye.
 * Development aid only: it is not part of the TV home screen.
 */

const colors = [
  '--color-bg',
  '--color-surface',
  '--color-surface-raised',
  '--color-text',
  '--color-text-muted',
  '--color-text-faint',
  '--color-focus',
  '--color-live',
] as const;

const typeSteps = [
  { token: '--type-display', font: 'display', sample: 'Nightjar' },
  { token: '--type-headline', font: 'display', sample: 'Live now' },
  { token: '--type-title', font: 'display', sample: 'Continue watching' },
  { token: '--type-title-sm', font: 'text', sample: 'Harbor City vs Ironvale' },
  { token: '--type-body', font: 'text', sample: 'A short synopsis sits at this size.' },
  { token: '--type-label', font: 'text', sample: '2nd period  08:41' },
  { token: '--type-caption', font: 'text', sample: 'SPOILER FREE' },
] as const;

const spaces = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

const radii = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-pill'] as const;

export function TokenSpecimen() {
  return (
    <main className="specimen">
      <h1 className="specimen__brand">Nightjar</h1>
      <p className="specimen__note">Design tokens. Sizes are TV pixels on a 1920 by 1080 stage.</p>

      <section className="specimen__section">
        <h2 className="specimen__heading">Color</h2>
        <ul className="specimen__swatches">
          {colors.map((token) => (
            <li key={token} className="specimen__swatch">
              <span className="specimen__chip" style={{ background: `var(${token})` }} />
              <code>{token}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className="specimen__section">
        <h2 className="specimen__heading">Type</h2>
        {typeSteps.map(({ token, font, sample }) => (
          <div key={token} className="specimen__type-row">
            <code>{token}</code>
            <span
              className={font === 'display' ? 'specimen__display' : undefined}
              style={{ fontSize: `var(${token})` }}
            >
              {sample}
            </span>
          </div>
        ))}
      </section>

      <section className="specimen__section">
        <h2 className="specimen__heading">Spacing</h2>
        {spaces.map((step) => (
          <div key={step} className="specimen__space-row">
            <code>--space-{step}</code>
            <span className="specimen__bar" style={{ width: `var(--space-${step})` }} />
          </div>
        ))}
      </section>

      <section className="specimen__section">
        <h2 className="specimen__heading">Radius and focus</h2>
        <ul className="specimen__swatches">
          {radii.map((token) => (
            <li key={token} className="specimen__swatch">
              <span className="specimen__chip" style={{ borderRadius: `var(${token})` }} />
              <code>{token}</code>
            </li>
          ))}
          <li className="specimen__swatch">
            <span className="specimen__chip specimen__chip--focused" />
            <code>focus ring</code>
          </li>
        </ul>
      </section>

      <section className="specimen__section">
        <h2 className="specimen__heading">Motion</h2>
        <p className="specimen__note">Hover a block. Each uses --ease-out at a different duration.</p>
        <ul className="specimen__swatches">
          {(['--duration-fast', '--duration-base', '--duration-slow'] as const).map((token) => (
            <li key={token} className="specimen__swatch">
              <span
                className="specimen__chip specimen__chip--motion"
                style={{ transitionDuration: `var(${token})` }}
              />
              <code>{token}</code>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
