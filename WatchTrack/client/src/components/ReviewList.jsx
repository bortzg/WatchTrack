export default function ReviewList({ reviews, currentUserId, onDelete }) {
  if (!reviews.length) {
    return <p className="empty-state">No reviews yet. Be the first to write one.</p>;
  }

  return (
    <ul className="review-list">
      {reviews.map((review) => (
        <li key={review._id} className="review-item">
          <div className="review-header">
            <strong>{review.user?.name || "Unknown user"}</strong>
            <span className="review-rating">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
          </div>
          <p>{review.comment}</p>
          {currentUserId === review.user?._id && (
            <button className="link-button" onClick={() => onDelete(review._id)}>
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}