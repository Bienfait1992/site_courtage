import React, { useState, memo } from "react";
import { FaThumbsUp } from "react-icons/fa";

const CommentItem = memo(({ comment, token, toggleLike, handleSubmitReply }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replying, setReplying] = useState(false);

  const timeAgo = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diffMs = now - commentDate;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes < 1) return "À l'instant";
    if (diffMinutes < 60) return `${diffMinutes} min`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} h`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} j`;
  };

  return (
    <div className="ml-2 mt-2 pl-2">
      <p className="text-sm font-semibold">{comment.user?.name || "Utilisateur"}</p>
      <p className="text-gray-700">{comment.content}</p>

      <div className="flex items-center gap-2 text-xs mt-1">
        <span className="text-gray-400">{timeAgo(comment.createdAt)}</span>
        {/* <button onClick={() => toggleLike(comment)} className="text-blue-600 text-sm">
          {comment.likedByUser ? "❤️ J'aime" : "J'aime"} {comment.likesCount}
        </button> */}
<button
  onClick={() => toggleLike(comment)}
  className="flex items-center gap-1 text-sm font-medium"
>
  <span className="text-gray-600 cursor-pointer">J'aime</span>
  {comment.likedByUser && (
    <>
      <FaThumbsUp className="text-blue-600" />
      <span className="text-gray-600 font-medium">{comment.likesCount}</span>
    </>
  )}
</button>


        {token && (
          <button
            onClick={() => setReplying((prev) => !prev)}
            className="text-gray-500 cursor-pointer"
          >
            Répondre
          </button>
        )}
        {comment.replies?.length > 0 && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-gray-500 hover:underline"
          >
            {isExpanded
              ? "Masquer les réponses"
              : `Voir les réponses (${comment.replies.length})`}
          </button>
        )}
      </div>

      {/* Champ réponse */}
      {replying && (
        <div className="mt-2 flex gap-2">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Écrire une réponse..."
            className="flex-1 border rounded px-2 py-1 text-sm"
            rows={2}
          />
          <button
            onClick={() => {
              handleSubmitReply(comment.id, replyContent);
              setReplyContent("");
              setReplying(false);
            }}
            className="bg-yellow-500 text-gray-900 px-2 py-1 rounded text-sm hover:bg-yellow-400"
          >
            Envoyer
          </button>
        </div>
      )}

      {/* Réponses récursives */}
      {isExpanded && comment.replies?.length > 0 && (
        <div className="mt-2 ml-4 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              token={token}
              toggleLike={toggleLike}
              handleSubmitReply={handleSubmitReply}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default CommentItem;
