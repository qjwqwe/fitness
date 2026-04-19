// Fitness API Client
// 与后端 API 通信的客户端

import { SITE } from '../config';

class FitnessAPI {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = SITE.apiBaseUrl;
    this.token = localStorage.getItem('fitness_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '请求失败' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ========== 认证相关 ==========
  
  async register(username: string, email: string, password: string) {
    return this.request<{ token: string; user: { id: number; username: string; email: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(username: string, password: string) {
    const data = await this.request<{ token: string; user: { id: number; username: string; email: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    this.token = data.token;
    localStorage.setItem('fitness_token', data.token);
    localStorage.setItem('fitness_user', JSON.stringify(data.user));
    
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('fitness_token');
    localStorage.removeItem('fitness_user');
    window.location.reload();
  }

  async getMe() {
    return this.request<{ user: { id: number; username: string; email: string } }>('/auth/me', {
      method: 'GET',
    });
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('fitness_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // ========== 训练相关 ==========

  async getWorkouts() {
    return this.request<{ workouts: any[] }>('/workouts', { method: 'GET' });
  }

  async createWorkout(workout: any) {
    return this.request<{ workout: any }>('/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
    });
  }

  async updateWorkout(id: number, workout: any) {
    return this.request<{ workout: any }>(`/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workout),
    });
  }

  async deleteWorkout(id: number) {
    return this.request(`/workouts/${id}`, { method: 'DELETE' });
  }

  // ========== 健康记录相关 ==========

  async getHealthRecords() {
    return this.request<{ records: any[] }>('/health', { method: 'GET' });
  }

  async createHealthRecord(record: any) {
    return this.request<{ record: any }>('/health', {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  // ========== 预置训练数据（不需要认证） ==========

  async getPresetWorkouts() {
    // 预置训练数据从本地 data 加载
    // 这里留空，实际由页面直接导入
    return [];
  }
}

// 全局单例
declare global {
  interface Window {
    fitnessAPI: FitnessAPI;
  }
}

window.fitnessAPI = new FitnessAPI();
export default window.fitnessAPI;
