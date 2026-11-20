/**
 * The RSDP Live credit: RSDP Live's own "RSDP Live!" wordmark, on its own, as
 * John asked (see docs/ART.md, "RSDP Live logo"). It links to RSDP Live.
 */
const brand = (file: string) => `${import.meta.env.BASE_URL}brand/${file}`;

export function PoweredBy() {
  return (
    <a className="powered-by" href="https://rsdp-poker-live.fly.dev" target="_blank" rel="noreferrer" title="Powered by RSDP Live">
      <img className="powered-by-wordmark" src={brand('rsdp-live-wordmark.svg')} alt="Powered by RSDP Live" />
    </a>
  );
}
