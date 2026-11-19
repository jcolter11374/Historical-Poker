/** The small "Powered by RSDP Live" credit. The chip logo is RSDP Live's own (apps/web/public/icon.svg in that repo). */
export function PoweredBy() {
  return (
    <a className="powered-by" href="https://rsdp-poker-live.fly.dev" target="_blank" rel="noreferrer">
      <svg width="24" height="24" viewBox="56 56 400 400" role="img" aria-label="RSDP Live logo">
        <circle cx="256" cy="256" r="200" fill="#c0392b" />
        <circle cx="256" cy="256" r="134" fill="none" stroke="#fff" strokeWidth="26" strokeDasharray="52 40" />
        <circle cx="256" cy="256" r="104" fill="#a93226" />
        <text x="256" y="312" fontSize="160" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fill="#fff" textAnchor="middle">
          R
        </text>
      </svg>
      <span>
        Powered by <strong>RSDP Live</strong>
      </span>
    </a>
  );
}
