/**
 * The RSDP Live credit: a small "Powered by" followed by RSDP Live's own
 * "RSDP Live!" wordmark, as John asked (see docs/ART.md, "RSDP Live logo"). It links to RSDP Live.
 */
const brand = (file: string) => `${import.meta.env.BASE_URL}brand/${file}`;

export function PoweredBy() {
  return (
    <a className="powered-by" href="https://rsdp-poker-live.fly.dev" target="_blank" rel="noreferrer" title="Powered by RSDP Live">
      <span className="powered-by-label">Powered by</span>
      <img className="powered-by-wordmark" src={brand('rsdp-live-wordmark.svg')} alt="RSDP Live" />
    </a>
  );
}
