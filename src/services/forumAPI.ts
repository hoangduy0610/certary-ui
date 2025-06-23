import MainApiRequest from "./MainApiRequest";
import { User } from "./userAPI";

// Types and Interfaces
export interface ForumCategory {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    forumPosts: ForumPost[];
}

export interface ForumPost {
    id: number;
    title: string;
    content: string;
    images?: string[];
    tags?: string[];
    userId: number;
    author: User;
    forumInteractions: ForumInteraction[];
    forumComments: ForumComment[];
    categoryId: number;
    category: ForumCategory;
    createdAt: Date;
    updatedAt: Date;
    isPinned?: boolean;
}

export interface ForumInteraction {
    id: number;
    postId: number;
    userId: number;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface ForumComment extends ForumInteraction {
    author: any;
    content: string;
}

// Forum API Service
export const forumAPI = {
    async getAllCategories(): Promise<ForumCategory[]> {
        try {
            const response = await MainApiRequest.get(`/forum/categories`)
            return response.data
        } catch (error: any) {
            console.error("Get forum categories error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async getCategoryById(id: number): Promise<ForumCategory> {
        try {
            const response = await MainApiRequest.get(`/forum/categories/${id}`)
            return response.data
        } catch (error: any) {
            console.error("Get forum category by ID error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async createCategory(category: Partial<ForumCategory>): Promise<ForumCategory> {
        try {
            const response = await MainApiRequest.post(`/forum/categories`, category)
            return response.data
        } catch (error: any) {
            console.error("Create forum category error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async updateCategory(id: number, category: Partial<ForumCategory>): Promise<ForumCategory> {
        try {
            const response = await MainApiRequest.put(`/forum/categories/${id}`, category)
            return response.data
        } catch (error: any) {
            console.error("Update forum category error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async deleteCategory(id: number): Promise<void> {
        try {
            await MainApiRequest.delete(`/forum/categories/${id}`)
        } catch (error: any) {
            console.error("Delete forum category error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async getAllPosts(): Promise<ForumPost[]> {
        try {
            const response = await MainApiRequest.get(`/forum/posts`)
            return response.data
        } catch (error: any) {
            console.error("Get forum posts error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async getPostById(id: number): Promise<ForumPost> {
        try {
            const response = await MainApiRequest.get(`/forum/posts/${id}`)
            return response.data
        } catch (error: any) {
            console.error("Get forum post by ID error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async createPost(post: Partial<ForumPost>): Promise<ForumPost> {
        try {
            const response = await MainApiRequest.post(`/forum/posts`, post)
            return response.data
        } catch (error: any) {
            console.error("Create forum post error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async updatePost(id: number, post: Partial<ForumPost>): Promise<ForumPost> {
        try {
            const response = await MainApiRequest.put(`/forum/posts/${id}`, post)
            return response.data
        } catch (error: any) {
            console.error("Update forum post error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async deletePost(id: number): Promise<void> {
        try {
            await MainApiRequest.delete(`/forum/posts/${id}`)
        } catch (error: any) {
            console.error("Delete forum post error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async toggleInteraction(postId: number): Promise<ForumInteraction> {
        try {
            const response = await MainApiRequest.post(`/forum/posts/${postId}/interaction`)
            return response.data
        } catch (error: any) {
            console.error("Toggle forum interaction error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async createComment(postId: number, content: string): Promise<ForumComment> {
        try {
            const response = await MainApiRequest.post(`/forum/comments`, { postId, content })
            return response.data
        } catch (error: any) {
            console.error("Create forum comment error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async deleteComment(commentId: number): Promise<void> {
        try {
            await MainApiRequest.delete(`/forum/comments/${commentId}`)
        } catch (error: any) {
            console.error("Delete forum comment error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    },
    async togglePinPost(postId: number): Promise<ForumPost> {
        try {
            const response = await MainApiRequest.post(`/forum/posts/${postId}/pin`)
            return response.data
        } catch (error: any) {
            console.error("Toggle pin forum post error:", error)
            throw new Error(error.response?.data?.message || error.message)
        }
    }
}

// Export default
export default forumAPI
