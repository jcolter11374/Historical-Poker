/**
 * The small "Powered by RSDP Live" credit. Both pictures are RSDP Live's own
 * logo (see docs/ART.md, "RSDP Live logo"): the red chip is that site's
 * favicon, and the wordmark is its "RSDP Live!" title.
 */
const brand = (file: string) => `${import.meta.env.BASE_URL}brand/${file}`;

export function PoweredBy() {
  return (
    <a className="powered-by" href="https://rsdp-poker-live.fly.dev" target="_blank" rel="noreferrer" aria-label="Powered by RSDP Live">
      <span className="powered-by-label">Powered by</span>
      <img className="powered-by-chip" src={brand('rsdp-live-chip.svg')} alt="" />
      <img className="powered-by-wordmark" src={brand('rsdp-live-wordmark.svg')} alt="" />
    </a>
  );
}
