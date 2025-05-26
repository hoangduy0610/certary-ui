import type React from "react"
import { useState } from "react"
import "./forum.scss"
import TopicDetail from "../ForumDetail/forum-detail"
import Footer from "../../components/Footer/footer"

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

export default function Forum() {
    const [currentView, setCurrentView] = useState<"forum" | "topic">("forum")
    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null)
    const [activeCategory, setActiveCategory] = useState("all")
    const [searchQuery, setSearchQuery] = useState("")
    const [showNewTopicForm, setShowNewTopicForm] = useState(false)
    const [newTopic, setNewTopic] = useState({
        title: "",
        category: "general",
        content: "",
        tags: "",
    })
    const [comments, setComments] = useState<Comment[]>([
        {
            id: 1,
            topicId: 1,
            author: "Alice Smith",
            avatar: "AS",
            content:
                "You can verify certificates by checking the digital signature and comparing it with the issuer's public key. Make sure to use official verification tools.",
            createdAt: "2024-01-15T11:15:00Z",
            likes: 5,
        },
        {
            id: 2,
            topicId: 1,
            author: "Bob Johnson",
            avatar: "BJ",
            content:
                "I recommend using the official Certary verification portal. It's the most reliable way to ensure authenticity.",
            createdAt: "2024-01-15T12:30:00Z",
            likes: 3,
        },
        {
            id: 3,
            topicId: 1,
            author: "Carol Davis",
            avatar: "CD",
            content:
                "Also check the certificate metadata and ensure all required fields are properly filled. Invalid or missing information is often a red flag.",
            createdAt: "2024-01-15T13:45:00Z",
            likes: 7,
        },
    ])

    const categories = [
        { id: "all", name: "All Topics", count: 156 },
        { id: "general", name: "General Discussion", count: 45 },
        { id: "certificates", name: "Certificate Help", count: 38 },
        { id: "technical", name: "Technical Support", count: 29 },
        { id: "announcements", name: "Announcements", count: 12 },
        { id: "feedback", name: "Feedback & Suggestions", count: 32 },
    ]

    const forumTopics: Topic[] = [
        {
            id: 1,
            title: "How to verify certificate authenticity?",
            author: "John Doe",
            avatar: "JD",
            category: "certificates",
            replies: 12,
            views: 245,
            lastActivity: "2 hours ago",
            isPinned: true,
            tags: ["verification", "security"],
            content:
                "I'm having trouble verifying the authenticity of my certificates. Can someone guide me through the process? What are the best practices for certificate verification?",
            createdAt: "2024-01-15T10:30:00Z",
        },
        {
            id: 2,
            title: "Welcome to Certary Community Forum!",
            author: "Admin",
            avatar: "AD",
            category: "announcements",
            replies: 28,
            views: 892,
            lastActivity: "1 day ago",
            isPinned: true,
            tags: ["welcome", "community"],
            content:
                "Welcome to our community forum! This is a place where you can ask questions, share knowledge, and connect with other users. Please read our community guidelines before posting.",
            createdAt: "2024-01-10T09:00:00Z",
        },
        {
            id: 3,
            title: "Best practices for certificate management",
            author: "Sarah Wilson",
            avatar: "SW",
            category: "general",
            replies: 15,
            views: 367,
            lastActivity: "3 hours ago",
            isPinned: false,
            tags: ["best-practices", "management"],
            content:
                "What are the best practices for managing certificates in a large organization? I'm looking for tips on organization, storage, and renewal tracking.",
            createdAt: "2024-01-12T14:20:00Z",
        },
        {
            id: 4,
            title: "Issue with certificate upload - getting error 500",
            author: "Mike Johnson",
            avatar: "MJ",
            category: "technical",
            replies: 8,
            views: 156,
            lastActivity: "5 hours ago",
            isPinned: false,
            tags: ["bug", "upload", "error"],
            content:
                "I'm getting a 500 error when trying to upload my certificate. The file size is under the limit and the format is correct. Has anyone experienced this issue?",
            createdAt: "2024-01-14T08:15:00Z",
        },
        {
            id: 5,
            title: "Feature request: Dark mode support",
            author: "Emily Chen",
            avatar: "EC",
            category: "feedback",
            replies: 23,
            views: 445,
            lastActivity: "1 day ago",
            isPinned: false,
            tags: ["feature-request", "ui"],
            content:
                "It would be great to have dark mode support for the application. Many users prefer dark themes, especially when working late hours.",
            createdAt: "2024-01-13T16:45:00Z",
        },
        {
            id: 6,
            title: "How to export certificates in bulk?",
            author: "David Brown",
            avatar: "DB",
            category: "certificates",
            replies: 6,
            views: 189,
            lastActivity: "2 days ago",
            isPinned: false,
            tags: ["export", "bulk"],
            content:
                "Is there a way to export multiple certificates at once? I need to download all my certificates for backup purposes.",
            createdAt: "2024-01-12T11:30:00Z",
        },
    ]

    const filteredTopics = forumTopics.filter((topic) => {
        const matchesCategory = activeCategory === "all" || topic.category === activeCategory
        const matchesSearch =
            topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.author.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const selectedTopic = forumTopics.find((topic) => topic.id === selectedTopicId)
    const topicComments = comments.filter((comment) => comment.topicId === selectedTopicId)

    const handleTopicClick = (topicId: number) => {
        setSelectedTopicId(topicId)
        setCurrentView("topic")
    }

    const handleBackToForum = () => {
        setCurrentView("forum")
        setSelectedTopicId(null)
    }

    const handleSubmitTopic = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("New topic:", newTopic)
        setNewTopic({ title: "", category: "general", content: "", tags: "" })
        setShowNewTopicForm(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setNewTopic((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddComment = (newComment: Comment) => {
        setComments([...comments, newComment])
    }

    const renderForumView = () => (
        <>
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
                                        className={`categoryItem ${activeCategory === category.id ? "active" : ""}`}
                                        onClick={() => setActiveCategory(category.id)}
                                    >
                                        <span className="categoryName">{category.name}</span>
                                        <span className="categoryCount">{category.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="sidebarCard">
                            <h3>Forum Stats</h3>
                            <div className="statsList">
                                <div className="statItem">
                                    <span className="statLabel">Total Topics</span>
                                    <span className="statValue">156</span>
                                </div>
                                <div className="statItem">
                                    <span className="statLabel">Total Posts</span>
                                    <span className="statValue">1,247</span>
                                </div>
                                <div className="statItem">
                                    <span className="statLabel">Active Members</span>
                                    <span className="statValue">342</span>
                                </div>
                                <div className="statItem">
                                    <span className="statLabel">Online Now</span>
                                    <span className="statValue">28</span>
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
                                <h3>Create New Topic</h3>
                                <form onSubmit={handleSubmitTopic}>
                                    <div className="formRow">
                                        <div className="formGroup">
                                            <label htmlFor="title">Topic Title *</label>
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                value={newTopic.title}
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
                                                value={newTopic.category}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="general">General Discussion</option>
                                                <option value="certificates">Certificate Help</option>
                                                <option value="technical">Technical Support</option>
                                                <option value="feedback">Feedback & Suggestions</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="formGroup">
                                        <label htmlFor="tags">Tags (optional)</label>
                                        <input
                                            type="text"
                                            id="tags"
                                            name="tags"
                                            value={newTopic.tags}
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
                                            value={newTopic.content}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            placeholder="Write your topic content here..."
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
                                            Post Topic
                                        </button>
                                        <button type="button" onClick={() => setShowNewTopicForm(false)} className="btn btn-secondary">
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
                            {filteredTopics.map((topic) => (
                                <div key={topic.id} className={`topicCard ${topic.isPinned ? "pinned" : ""}`}>
                                    <div className="topicHeader">
                                        <div className="topicMeta">
                                            <div className="authorInfo">
                                                <div className="authorAvatar">{topic.avatar}</div>
                                                <div className="authorDetails">
                                                    <span className="authorName">{topic.author}</span>
                                                    <span className="topicTime">{topic.lastActivity}</span>
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
                                    </div>

                                    <div className="topicContent">
                                        <h3 className="topicTitle" onClick={() => handleTopicClick(topic.id)}>
                                            {topic.title}
                                        </h3>
                                        <div className="topicTags">
                                            {topic.tags.map((tag) => (
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
                                            <span>{topic.replies}</span>
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
                                            <span>{topic.views}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pagination">
                            <button className="paginationBtn" disabled>
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
                                <button className="pageBtn active">1</button>
                                <button className="pageBtn">2</button>
                                <button className="pageBtn">3</button>
                            </div>
                            <button className="paginationBtn">
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
            <header className="header">
                <button
                    onClick={handleBackToForum}
                    className="logo"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                    Certary
                </button>
                <nav className="navigation">
                    <a href="/my-certificates" className="navLink">
                        My Certificate
                    </a>
                    <a href="/forum" className="navLink active">
                        Forum
                    </a>
                    <a href="/contact" className="navLink">
                        Contact
                    </a>
                    <a href="/login" className="navLink">
                        Login
                    </a>
                </nav>
            </header>

            {currentView === "forum" ? (
                renderForumView()
            ) : (
                <TopicDetail
                    topic={selectedTopic}
                    comments={topicComments}
                    onBackToForum={handleBackToForum}
                    onAddComment={handleAddComment}
                />
            )}

            <Footer />
        </div>
    )
}
