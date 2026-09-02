export default function Spinner({ label = "Loading...", center = true }) {
  return (
    <div className={center ? "text-center py-5" : ""}>
      <div className="spinner-border text-warning" role="status">
        <span className="visually-hidden">Loading</span>
      </div>
      {label && <p className="mt-3">{label}</p>}
    </div>
  );
}
