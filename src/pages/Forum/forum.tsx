"use client"

import { Button, Card, message } from "antd"
import moment from "moment"
import type React from "react"
import { useEffect, useState } from "react"
import Footer from "../../components/Footer/footer"
import { Header } from "../../components/Header/Header"
import { useUserInfo } from "../../hooks/useUserInfo"
import { fileApi } from "../../services/fileApi"
import forumAPI, { type ForumCategory, type ForumComment, type ForumPost } from "../../services/forumAPI"
import TopicDetail from "../ForumDetail/forum-detail"
import "./forum.scss"

export default function Forum() {
  const { userInfo } = useUserInfo();
  const [currentView, setCurrentView] = useState<"forum" | "topic">("forum")
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [activeCategory, setActiveCategory] = useState<ForumCategory>()
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewTopicForm, setShowNewTopicForm] = useState(false)
  const [forumTopics, setForumTopics] = useState<ForumPost[]>([])
  const [newTopic, setNewTopic] = useState({
    title: "",
    category: "",
    tags: "",
    content: "",
    images: [] as string[],
  })
  const [messageApi, contextHolder] = message.useMessage()
  const [page, setPage] = useState(1)
  const [editingTopicId, setEditingTopicId] = useState<number | null>(null)
  const [editingTopic, setEditingTopic] = useState({
    title: "",
    category: "",
    tags: "",
    content: "",
    images: [] as string[],
  })
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const filteredTopics = forumTopics.filter((topic) => {
    const matchesCategory = !activeCategory?.id || topic.categoryId === activeCategory?.id
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic?.author?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic?.author?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    // Sort by pinned topics first, then by created date
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return moment(b.createdAt).diff(moment(a.createdAt));
  });

  const pagedTopics = filteredTopics.slice((page - 1) * 5, page * 5)

  const selectedTopic = forumTopics.find((topic) => topic.id === selectedTopicId)
  const topicComments = selectedTopic?.forumComments || []

  const fetchForumCategories = async () => {
    try {
      const res = await forumAPI.getAllCategories()
      setCategories(res)
    } catch (error) {
      console.error("Error fetching forum categories:", error)
    }
  }

  useEffect(() => {
    fetchForumCategories()
  }, [])

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0])
    }
  }, [categories])

  useEffect(() => {
    const post = activeCategory?.forumPosts || []
    setForumTopics(post)
  }, [activeCategory])

  const handleTopicClick = (topicId: number) => {
    setSelectedTopicId(topicId)
    setCurrentView("topic")
  }

  const handleBackToForum = () => {
    setCurrentView("forum")
    setSelectedTopicId(null)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const fileUrls = await Promise.all(
      files.map(async (file) => {
        if (file instanceof File) {
          return await fileApi.uploadFile(file);
        }
        return "";
      })
    ).then(urls => urls.filter(Boolean));
    setSelectedImages((prev) => [...prev, ...fileUrls])
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleEditTopic = (topic: ForumPost) => {
    setEditingTopicId(topic.id)
    setEditingTopic({
      title: topic.title,
      category: topic.categoryId.toString(),
      tags: topic.tags?.join(", ") || "",
      content: topic.content,
      images: topic.images || [],
    })
    setSelectedImages(topic.images || [])
    setShowNewTopicForm(true)
  }

  const handleDeleteTopic = async (topicId: number) => {
    if (window.confirm("Are you sure you want to delete this topic?")) {
      try {
        await forumAPI.deletePost(topicId)
        fetchForumCategories()
        messageApi.open({
          type: "success",
          content: "Topic deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting topic:", error)
        messageApi.open({
          type: "error",
          content: "Failed to delete topic.",
        })
      }
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await forumAPI.deleteComment(commentId)
        fetchForumCategories()
        messageApi.open({
          type: "success",
          content: "Comment deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting comment:", error)
        messageApi.open({
          type: "error",
          content: "Failed to delete comment.",
        })
      }
    }
  }

  const handleSubmitTopic = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingTopicId) {
        const data = {
          title: editingTopic.title,
          content: editingTopic.content,
          tags: editingTopic.tags.split(",").map((tag) => tag.trim()),
          categoryId: parseInt(editingTopic.category) || activeCategory?.id || 0,
          images: selectedImages,
        }

        await forumAPI.updatePost(editingTopicId, data)
        messageApi.open({
          type: "success",
          content: "Topic updated successfully.",
        })
      } else {
        const data = {
          title: newTopic.title,
          content: newTopic.content,
          tags: newTopic.tags.split(",").map((tag) => tag.trim()),
          categoryId: parseInt(newTopic.category) || activeCategory?.id || 0,
          images: selectedImages,
        }

        await forumAPI.createPost(data)
        messageApi.open({
          type: "success",
          content: "Topic created successfully.",
        })
      }

      fetchForumCategories()
      setNewTopic({ title: "", category: "", tags: "", content: "", images: [] })
      setEditingTopic({ title: "", category: "", tags: "", content: "", images: [] })
      setSelectedImages([])
      setEditingTopicId(null)
      setShowNewTopicForm(false)
    } catch (error) {
      console.error("Error saving topic:", error)
      messageApi.open({
        type: "error",
        content: "Failed to save topic.",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (editingTopicId) {
      setEditingTopic((prev) => ({ ...prev, [name]: value }))
    } else {
      setNewTopic((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddComment = async (newComment: Partial<ForumComment>) => {
    try {
      await forumAPI.createComment(selectedTopicId!, newComment.content || "")
      // Refresh comments after adding a new comment
      fetchForumCategories()
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleLikePost = async (postId: number) => {
    try {
      await forumAPI.toggleInteraction(postId)
      fetchForumCategories()
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const renderForumView = () => (
    <>
      {contextHolder}
      <div className="forumHero">
        <div className="forumHeroContent">
          <h1>Community Forum</h1>
          <p>Connect with other users, share knowledge, and get help from the Certary community</p>
        </div>
        <div className="heroShape"></div>
      </div>

      <div className="forumContainer">
        <div className="forumContent">
          <div className="forumSidebar">
            <div className="sidebarCard">
              <h3>Categories</h3>
              <div className="categoryList">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    className={`categoryItem ${activeCategory?.id === category.id ? "active" : ""}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    <span className="categoryName">{category.name}</span>
                    <span className="categoryCount">{category.forumPosts.length}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebarCard">
              <h3>Forum Stats</h3>
              <div className="statsList">
                <div className="statItem">
                  <span className="statLabel">Total Categories</span>
                  <span className="statValue">{categories.length}</span>
                </div>
                <div className="statItem">
                  <span className="statLabel">Total Posts</span>
                  <span className="statValue">
                    {categories.reduce((a, category) => a + category.forumPosts.length, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="forumMain">
            <div className="forumActions">
              <div className="searchContainer">
                <input
                  type="text"
                  placeholder="Search topics..."
                  className="searchInput"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="searchButton">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
              </div>

              <button className="btn btn-primary newTopicBtn" onClick={() => setShowNewTopicForm(!showNewTopicForm)}>
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
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                {showNewTopicForm ? "Cancel" : "New Topic"}
              </button>
            </div>

            {showNewTopicForm && (
              <div className="newTopicForm">
                <h3>{editingTopicId ? "Edit Topic" : "Create New Topic"}</h3>
                <form onSubmit={handleSubmitTopic}>
                  <div className="formRow">
                    <div className="formGroup">
                      <label htmlFor="title">Topic Title *</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={editingTopicId ? editingTopic.title : newTopic.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your topic title..."
                      />
                    </div>
                    <div className="formGroup">
                      <label htmlFor="category">Category *</label>
                      <select
                        id="category"
                        name="category"
                        value={editingTopicId ? editingTopic.category : newTopic.category}
                        onChange={handleInputChange}
                        required
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="formGroup">
                    <label htmlFor="tags">Tags (optional)</label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={editingTopicId ? editingTopic.tags : newTopic.tags}
                      onChange={handleInputChange}
                      placeholder="Enter tags separated by commas (e.g., help, verification, security)"
                    />
                    <small>Separate multiple tags with commas</small>
                  </div>

                  <div className="formGroup">
                    <label htmlFor="content">Content *</label>
                    <textarea
                      id="content"
                      name="content"
                      value={editingTopicId ? editingTopic.content : newTopic.content}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Write your topic content here..."
                    />
                  </div>

                  <div className="formGroup">
                    <label htmlFor="images">Images (optional)</label>
                    <input
                      type="file"
                      id="images"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="imageInput"
                    />
                    <small>You can upload multiple images (JPG, PNG, GIF)</small>

                    {
                      selectedImages.length > 0 && (
                        <div className="imagePreview d-flex">
                          {
                            selectedImages.map((image, index) => (
                              <Card
                                key={index}
                                hoverable
                                style={{ margin: '10px' }}
                                cover={<img alt={`Preview ${index + 1}`} src={image || "/placeholder.svg"} className="previewImage" />}
                              >
                                <Button
                                  type="primary"
                                  danger
                                  onClick={() => removeImage(index)}
                                  className="removeImageButton"
                                >
                                  Remove
                                </Button>
                              </Card>
                            ))
                          }
                        </div>
                      )
                    }
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
                      {editingTopicId ? "Update Topic" : "Post Topic"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewTopicForm(false)
                        setEditingTopicId(null)
                        setEditingTopic({ title: "", category: "", tags: "", content: "", images: [] })
                        setSelectedImages([])
                      }}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <div className="formNote">
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
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      Please follow community guidelines when posting
                    </div>
                  </div>
                </form>
              </div>
            )}

            <div className="topicsList">
              {!pagedTopics.length && (
                <div className="noTopics">
                  <p>No topics found. Try changing the filters or search criteria.</p>
                </div>
              )}
              {pagedTopics.map((topic) => (
                <div key={topic.id} className={`topicCard ${topic?.isPinned ? "pinned" : ""}`}>
                  <div className="topicHeader">
                    <div className="topicMeta" style={{ flex: 1 }}>
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
                          <span className="topicTime">{moment(topic.updatedAt).format("DD-MM-YYYY")}</span>
                        </div>
                        <div>
                          <button className="likeButton" onClick={() => handleLikePost(topic.id)}>
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

                        {
                          topic.author.id === userInfo.id &&
                          <div className="topicActions">
                            <button
                              className="actionButton editButton"
                              onClick={() => handleEditTopic(topic)}
                              title="Edit topic"
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
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button
                              className="actionButton deleteButton"
                              onClick={() => handleDeleteTopic(topic.id)}
                              title="Delete topic"
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
                        }
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
                  </div>

                  <div className="topicContent">
                    <h3 className="topicTitle" onClick={() => handleTopicClick(topic.id)}>
                      {topic.title}
                    </h3>
                    {/* If has image, get first image as thumbnail */}
                    {topic.images && topic.images.length > 0 && (
                      <div className="topicImage">
                        <img
                          src={topic.images[0] || "/placeholder.svg"}
                          alt={topic.title}
                          className="thumbnail"
                          onClick={() => handleTopicClick(topic.id)}
                        />
                      </div>
                    )}
                    <div className="topicTags">
                      {topic?.tags?.map((tag) => (
                        <span key={tag} className="topicTag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="topicStats">
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
                      <span>{topic.forumComments.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <button
                className="paginationBtn"
                onClick={() => {
                  if (page > 1) {
                    setPage(page - 1)
                  } else {
                    messageApi.open({
                      type: "info",
                      content: "You are already on the first page.",
                    })
                  }
                }}
                disabled={page <= 1}
              >
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
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Previous
              </button>
              <div className="pageNumbers">
                {Array.from({ length: Math.ceil(filteredTopics.length / 5) }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`pageBtn ${page === index + 1 ? "active" : ""}`}
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                className="paginationBtn"
                onClick={() => {
                  if (page < Math.ceil(filteredTopics.length / 5)) {
                    setPage(page + 1)
                  } else {
                    messageApi.open({
                      type: "info",
                      content: "You are already on the last page.",
                    })
                  }
                }}
                disabled={page >= Math.ceil(filteredTopics.length / 5)}
              >
                Next
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
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <div className="forumPage">
      <Header active="forum" />

      {currentView === "forum" ? (
        renderForumView()
      ) : (
        <TopicDetail
          topic={selectedTopic}
          comments={topicComments}
          onBackToForum={handleBackToForum}
          onAddComment={handleAddComment}
          onLikePost={handleLikePost}
          onDeleteComment={handleDeleteComment}
        />
      )}

      <Footer />
    </div>
  )
}
