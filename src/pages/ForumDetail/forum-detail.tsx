import type React from "react"
import { useState } from "react"
import "./forum-detail.scss"

interface Topic {
  id: number
  title: string
  author: string
  avatar: string
  category: string
  replies: number
  views: number
  lastActivity: string
  isPinned?: boolean
  tags: string[]
  content: string
  createdAt: string
}

interface Comment {
  id: number
  topicId: number
  author: string
  avatar: string
  content: string
  createdAt: string
  likes: number
}

interface TopicDetailProps {
  topic: Topic | undefined
  comments: Comment[]
  onBackToForum: () => void
  onAddComment: (comment: Comment) => void
}

export default function TopicDetail({ topic, comments, onBackToForum, onAddComment }: TopicDetailProps) {
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

    const comment: Comment = {
      id: Date.now(), // Simple ID generation
      topicId: topic.id,
      author: "Current User",
      avatar: "CU",
      content: newComment,
      createdAt: new Date().toISOString(),
      likes: 0,
    }

    onAddComment(comment)
    setNewComment("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
            <div className="authorInfo">
              <div className="authorAvatar">{topic.avatar}</div>
              <div className="authorDetails">
                <span className="authorName">{topic.author}</span>
                <span className="topicTime">Posted on {formatDate(topic.createdAt)}</span>
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
            {topic.tags.map((tag) => (
              <span key={tag} className="topicTag">
                {tag}
              </span>
            ))}
          </div>

          <div className="topicDetailContent">
            <p>{topic.content}</p>
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
              <span>{topic.replies} replies</span>
            </div>
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
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>{topic.views} views</span>
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
                    <div className="authorAvatar">{comment.avatar}</div>
                    <div className="authorDetails">
                      <span className="authorName">{comment.author}</span>
                      <span className="commentTime">{formatDate(comment.createdAt)}</span>
                    </div>
                  </div>
                  <div className="commentActions">
                    <button className="likeButton">
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
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                      <span>{comment.likes}</span>
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
