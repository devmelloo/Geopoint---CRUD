const caminhos = {
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/></>,
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.6"/></>,
  edit: <><path d="m15.5 5.5 3 3M4 20l4.4-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z"/></>,
  trash: <><path d="M4 7h16M10 11v7M14 11v7M6 7l1 14h10l1-14M9 7V4h6v3"/></>,
  arrow: <path d="M19 12H5m6 6-6-6 6-6"/>,
  check: <path d="m4 12 5 5L20 6"/>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 4 6 4 9s-1 6-4 9M12 3c-3 3-4 6-4 9s1 6 4 9"/></>,
  alert: <><circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/></>,
  list: <><path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/></>,
};

export default function Icon({ name, size = 18, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {caminhos[name] || caminhos.pin}
    </svg>
  );
}
