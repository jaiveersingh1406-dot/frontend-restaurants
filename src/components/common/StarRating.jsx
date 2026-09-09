import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function StarRating({ rating, size = 16, showValue = true }) {
  const value = Number(rating) || 0;

  return (
    <span
      className="star-rating d-inline-flex align-items-center gap-1"
      style={{ color: "#ffc107" }}
      aria-label={`Rating ${value.toFixed(1)} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        if (value >= star) {
          return <FaStar key={star} size={size} />;
        }
        if (value >= star - 0.5) {
          return <FaStarHalfAlt key={star} size={size} />;
        }
        return <FaRegStar key={star} size={size} />;
      })}
      {showValue && (
        <span className="ms-1 fw-semibold text-muted" style={{ fontSize: 13 }}>
          {value.toLocaleString(undefined, { maximumFractionDigits: 1 })}
        </span>
      )}
    </span>
  );
}