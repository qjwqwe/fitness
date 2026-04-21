// Fitness API Client
// 与后端 API 通信的客户端

import { SITE } from '../config';

class FitnessAPI {
  constructor() {
    this.baseUrl = SITE.apiBaseUrl;
    this.token = localStorage.getItem('fitness_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
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
  
  async register(username, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  }

  async login(username, password) {
    const data = await this.request('/auth/login', {
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
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  isAuthenticated() {
    return !!this.token;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('fitness_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // ========== 训练相关 ==========

  async getWorkouts() {
    return this.request('/workouts', { method: 'GET' });
  }

  async createWorkout(workout) {
    return this.request('/workouts', {
      method: 'POST',
      body: JSON.stringify(workout),
    });
  }

  async updateWorkout(id, workout) {
    return this.request(`/workouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(workout),
    });
  }

  async deleteWorkout(id) {
    return this.request(`/workouts/${id}`, { method: 'DELETE' });
  }

  // ========== 健康记录相关 ==========

  async getHealthRecords() {
    return this.request('/health', { method: 'GET' });
  }

  async createHealthRecord(record) {
    return this.request('/health', {
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
window.fitnessAPI = new FitnessAPI();

// 派发加载完成事件，通知页面脚本可以使用了
window.dispatchEvent(new CustomEvent('fitnessAPIReady'));

export default window.fitnessAPI;
