"use client"

import moment from "moment"
import type React from "react"
import { useState } from "react"
import type { ForumComment, ForumPost } from "../../services/forumAPI"
import "./forum-detail.scss"

interface TopicDetailProps {
  topic: ForumPost | undefined
  comments: ForumComment[]
  onBackToForum: () => void
  onAddComment: (comment: Partial<ForumComment>) => void
  onLikePost: (postId: number) => void
  onDeleteComment: (commentId: number) => void
}

export default function TopicDetail({
  topic,
  comments,
  onBackToForum,
  onAddComment,
  onLikePost,
  onDeleteComment,
}: TopicDetailProps) {
  const [newComment, setNewComment] = useState("")

  if (!topic) {
    return (
      <div className="forumContainer" style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Topic not found</h1>
        <button onClick={onBackToForum} className="btn btn-primary">
          Back to Forum
        </button>
      </div>
    )
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Partial<ForumComment> = {
      postId: topic.id,
      content: newComment,
    }

    onAddComment(comment)
    setNewComment("")
  }

  return (
    <div className="forumContainer" style={{ marginTop: "2rem" }}>
      <div className="topicDetailContainer">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button onClick={onBackToForum} className="breadcrumbLink">
            Forum
          </button>
          <span className="breadcrumbSeparator">/</span>
          <span className="breadcrumbCurrent">{topic.title}</span>
        </div>

        {/* Topic Content */}
        <div className="topicDetailCard">
          <div className="topicDetailHeader">
            <div className="authorInfo" style={{ flex: 1 }}>
              <div className="authorAvatar">
                {topic.author?.avatar ? (
                  <img
                    className="avatar-circle"
                    src={topic.author.avatar || "/placeholder.svg"}
                    alt={`${topic.author.firstName} ${topic.author.lastName}`}
                  />
                ) : (
                  topic.author.firstName?.substring(0, 1) || "U"
                )}
              </div>
              <div className="authorDetails" style={{ flex: 1 }}>
                <span className="authorName">
                  {topic.author.firstName} {topic.author.lastName}
                </span>
                <span className="topicTime">Posted on {moment(topic.createdAt).format("DD-MM-YYYY")}</span>
              </div>
              <div>
                <button className="likeButton" onClick={() => onLikePost(topic.id)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={
                      topic.forumInteractions.some((interaction) => interaction.userId === topic.author.id)
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                  </svg>
                  <span>{topic.forumInteractions.length}</span>
                </button>
              </div>
            </div>
            {topic.isPinned && (
              <div className="pinnedBadge">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 17l-5-5h3V5h4v7h3l-5 5z"></path>
                </svg>
                Pinned
              </div>
            )}
          </div>

          <h1 className="topicDetailTitle">{topic.title}</h1>

          <div className="topicTags">
            {topic?.tags?.map((tag) => (
              <span key={tag} className="topicTag">
                {tag}
              </span>
            ))}
          </div>

          <div className="topicDetailContent">
            <p>{topic.content}</p>

            {/* Display images if any */}
            {topic.images && topic.images.length > 0 && (
              <div className="topicImages">
                {topic.images.map((image, index) => (
                  <img
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`Topic image ${index + 1}`}
                    className="topicImage"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="topicDetailStats">
            <div className="statItem">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>{topic.forumComments.length} replies</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="commentsSection">
          <h2 className="commentsTitle">Comments ({comments.length})</h2>

          {/* Comment Form */}
          <div className="commentForm">
            <h3>Add a Comment</h3>
            <form onSubmit={handleSubmitComment}>
              <div className="formGroup">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment here..."
                  rows={4}
                  required
                />
              </div>
              <div className="formActions">
                <button type="submit" className="btn btn-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Post Comment
                </button>
              </div>
            </form>
          </div>

          {/* Comments List */}
          <div className="commentsList">
            {comments.map((comment) => (
              <div key={comment.id} className="commentCard">
                <div className="commentHeader">
                  <div className="authorInfo">
                    <div className="authorAvatar">
                      {comment.user?.avatar ? (
                        <img
                          className="avatar-circle"
                          src={comment.user.avatar || "/placeholder.svg"}
                          alt={`${comment.user.firstName} ${comment.user.lastName}`}
                        />
                      ) : (
                        comment.user.firstName?.substring(0, 1) || "U"
                      )}
                    </div>
                    <div className="authorDetails">
                      <span className="authorName">
                        {comment.user.firstName} {comment.user.lastName}
                      </span>
                      <span className="commentTime">{moment(comment.createdAt).format("DD-MM-YYYY")}</span>
                    </div>
                  </div>
                  <div className="commentActions">
                    <button
                      className="actionButton deleteButton"
                      onClick={() => onDeleteComment(comment.id)}
                      title="Delete comment"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="commentContent">
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
