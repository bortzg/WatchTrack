import { useState } from "react";

export default function ReviewList({ reviews, currentUserId, isAdmin, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: "" });

  if (!reviews.length) {
    return <p className="empty-state">No reviews yet. Be the first to write one.</p>;
  }

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (reviewId) => {
    await onUpdate(reviewId, {
      rating: Number(editForm.rating),
      comment: editForm.comment,
    });
    setEditingId(null);
  };

  return (
    <ul className="review-list">
      {reviews.map((review) => {
        const isMine = currentUserId === review.user?._id;
        const isEditing = editingId === review._id;

        return (
          <li key={review._id} className="review-item">
            {isEditing ? (
              <div className="review-edit-form">
                <select
                  value={editForm.rating}
                  onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} star{r > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                />
                <div className="review-edit-actions">
                  <button onClick={() => saveEdit(review._id)}>Save</button>
                  <button className="link-button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="review-header">
                  <strong>{review.user?.name || "Unknown user"}</strong>
                  <span className="review-rating">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p>{review.comment}</p>
                {isMine && (
                  <div className="review-actions">
                    <button className="link-button" onClick={() => startEdit(review)}>
                      Edit
                    </button>
                    {isAdmin && (
                      <button className="link-button" onClick={() => onDelete(review._id)}>
                        Delete
                      </button>
                    )}
                  </div>
                )}
                {!isMine && isAdmin && (
                  <div className="review-actions">
                    <button className="link-button" onClick={() => onDelete(review._id)}>
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
