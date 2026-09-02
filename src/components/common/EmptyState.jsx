export default function EmptyState({ title = "No records found", subtitle }) {
  return (
    <div className="text-center py-5">
      <h5>{title}</h5>
      {subtitle && <p className="text-muted mb-0">{subtitle}</p>}
    </div>
  );
}
