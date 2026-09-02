import { ApiError } from "../../api/client";

export default function ErrorAlert({ error, onRetry }) {
  if (!error) return null;

  let message;

  if (typeof error === "string") {
    message = error;
  } else if (error instanceof ApiError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    message = "Something went wrong. Please try again.";
  }

  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-center">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
