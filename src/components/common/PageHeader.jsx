export default function PageHeader({ badge, title, actions }) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        {badge && (
          <span className="text-warning fw-bold text-uppercase">{badge}</span>
        )}
        <h2 className={`mb-0 text-dark ${badge ? "mt-1" : ""}`}>{title}</h2>
      </div>
      {actions && <div className="d-flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
