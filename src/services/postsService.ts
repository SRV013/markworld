import { apiClient } from './apiClient'
import type { Post } from '../types/post'

export const postsService = {
  getAll: () => apiClient.get<Post[]>('/posts').then((r) => r.data),
  getById: (id: number) => apiClient.get<Post>(`/posts/${id}`).then((r) => r.data),
}
