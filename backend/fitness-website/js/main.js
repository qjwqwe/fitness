// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function() {
      if (mainNav.classList.contains('hidden')) {
        mainNav.classList.remove('hidden');
      } else {
        mainNav.classList.add('hidden');
      }
    });
  }

  // Initialize app after DOM loaded
  initAuthUI();
});

// Utility functions
function printPage() {
  window.print();
}

// LocalStorage helper for progress tracking
function saveProgress(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save progress', e);
    return false;
  }
}

function getProgress(key, defaultValue) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('Failed to get progress', e);
    return defaultValue;
  }
}

// ========== API Client ==========
class FitnessAPI {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  getToken() {
    return localStorage.getItem('fitness_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('fitness_token', token);
    } else {
      localStorage.removeItem('fitness_token');
    }
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  async request(method, path, data = null) {
    const url = `${this.baseUrl}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const token = this.getToken();
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Request failed');
      }
      return { success: true, data: result };
    } catch (error) {
      console.error('API Error:', error);
      return { success: false, error: error.message };
    }
  }

  // Auth methods
  async register(username, email, password) {
    return this.request('POST', '/auth/register', { username, email, password });
  }

  async login(email, password) {
    const result = await this.request('POST', '/auth/login', { email, password });
    if (result.success && result.data.token) {
      this.setToken(result.data.token);
    }
    return result;
  }

  async logout() {
    const result = await this.request('POST', '/auth/logout');
    if (result.success) {
      this.setToken(null);
    }
    return result;
  }

  async getMe() {
    return this.request('GET', '/auth/me');
  }

  // Workout methods
  async getWorkouts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/workouts?${query}`);
  }

  async getWorkout(id) {
    return this.request('GET', `/workouts/${id}`);
  }

  async createWorkout(workoutData) {
    return this.request('POST', '/workouts', workoutData);
  }

  async updateWorkout(id, workoutData) {
    return this.request('PUT', `/workouts/${id}`, workoutData);
  }

  async deleteWorkout(id) {
    return this.request('DELETE', `/workouts/${id}`);
  }

  // Health methods
  async getHealthRecords(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request('GET', `/health?${query}`);
  }

  async getLatestHealth(limit = 1) {
    return this.request('GET', `/health/latest?limit=${limit}`);
  }

  async createHealthRecord(healthData) {
    return this.request('POST', '/health', healthData);
  }

  async updateHealthRecord(id, healthData) {
    return this.request('PUT', `/health/${id}`, healthData);
  }

  async deleteHealthRecord(id) {
    return this.request('DELETE', `/health/${id}`);
  }
}

// Global API instance
const api = new FitnessAPI('/api');

// ========== Auth UI Modal ==========
function createAuthModal() {
  const modalHtml = `
  <div id="auth-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-lg p-6 max-w-md w-full relative">
      <button id="close-modal" class="absolute top-4 right-4 text-gray-500 hover:text-black">&times;</button>
      
      <!-- Login Form -->
      <div id="login-form-container">
        <h3 id="modal-title" class="text-2xl font-bold mb-4">登录</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">邮箱</label>
            <input type="email" id="login-email" class="w-full px-3 py-2 border rounded-md" placeholder="your@email.com">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">密码</label>
            <input type="password" id="login-password" class="w-full px-3 py-2 border rounded-md">
          </div>
          <div id="login-error" class="text-red-500 text-sm hidden"></div>
          <button type="button" id="btn-login" class="btn w-full">登录</button>
          <p class="text-center text-sm text-gray-600">
            没有账号？ <a href="#" id="show-register" class="text-primary hover:underline">注册</a>
          </p>
        </div>
      </div>

      <!-- Register Form -->
      <div id="register-form-container" class="hidden">
        <h3 id="modal-title" class="text-2xl font-bold mb-4">注册</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">用户名</label>
            <input type="text" id="register-username" class="w-full px-3 py-2 border rounded-md" placeholder="你的用户名">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">邮箱</label>
            <input type="email" id="register-email" class="w-full px-3 py-2 border rounded-md" placeholder="your@email.com">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">密码</label>
            <input type="password" id="register-password" class="w-full px-3 py-2 border rounded-md" placeholder="至少8位，包含字母和数字">
          </div>
          <div id="register-error" class="text-red-500 text-sm hidden"></div>
          <button type="button" id="btn-register" class="btn w-full">注册</button>
          <p class="text-center text-sm text-gray-600">
            已有账号？ <a href="#" id="show-login" class="text-primary hover:underline">登录</a>
          </p>
        </div>
      </div>
    </div>
  </div>
  `;

  const div = document.createElement('div');
  div.innerHTML = modalHtml;
  document.body.appendChild(div.firstChild);

  // Bind events
  document.getElementById('close-modal').addEventListener('click', closeAuthModal);
  document.getElementById('show-register').addEventListener('click', showRegister);
  document.getElementById('show-login').addEventListener('click', showLogin);
  document.getElementById('btn-login').addEventListener('click', handleLogin);
  document.getElementById('btn-register').addEventListener('click', handleRegister);

  document.getElementById('auth-modal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeAuthModal();
    }
  });
}

function openAuthModal() {
  if (!document.getElementById('auth-modal')) {
    createAuthModal();
  }
  document.getElementById('auth-modal').classList.remove('hidden');
  showLogin();
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function showLogin() {
  document.getElementById('login-form-container').classList.remove('hidden');
  document.getElementById('register-form-container').classList.add('hidden');
}

function showRegister() {
  document.getElementById('login-form-container').classList.add('hidden');
  document.getElementById('register-form-container').classList.remove('hidden');
}

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  if (!email || !password) {
    errorEl.textContent = '请填写邮箱和密码';
    errorEl.classList.remove('hidden');
    return;
  }

  const btn = document.getElementById('btn-login');
  const originalText = btn.textContent;
  btn.textContent = '登录中...';
  btn.disabled = true;

  const result = await api.login(email, password);

  if (result.success) {
    closeAuthModal();
    updateAuthUI();
    if (window.location.reload) {
      setTimeout(() => window.location.reload(), 300);
    }
  } else {
    errorEl.textContent = result.error || '登录失败';
    errorEl.classList.remove('hidden');
  }

  btn.textContent = originalText;
  btn.disabled = false;
}

async function handleRegister() {
  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const errorEl = document.getElementById('register-error');

  if (!username || !email || !password) {
    errorEl.textContent = '请填写所有字段';
    errorEl.classList.remove('hidden');
    return;
  }

  const btn = document.getElementById('btn-register');
  const originalText = btn.textContent;
  btn.textContent = '注册中...';
  btn.disabled = true;

  const result = await api.register(username, email, password);

  if (result.success) {
    // Auto login after register
    const loginResult = await api.login(email, password);
    if (loginResult.success) {
      closeAuthModal();
      updateAuthUI();
      if (window.location.reload) {
        setTimeout(() => window.location.reload(), 300);
      }
    }
  } else {
    errorEl.textContent = result.error || '注册失败';
    errorEl.classList.remove('hidden');
  }

  btn.textContent = originalText;
  btn.disabled = false;
}

async function handleLogout() {
  if (!confirm('确定要退出登录吗？')) {
    return;
  }
  await api.logout();
  updateAuthUI();
  window.location.reload();
}

// ========== Auth UI Update ==========
function initAuthUI() {
  // Add user menu to header
  const header = document.querySelector('header div.container > div');
  if (!header) return;

  const userMenuDiv = document.createElement('div');
  userMenuDiv.id = 'user-menu';

  if (api.isAuthenticated()) {
    api.getMe().then(result => {
      if (result.success && result.data.user) {
        userMenuDiv.innerHTML = `
          <div class="flex items-center gap-2 mt-4 md:mt-0">
            <span class="text-white">欢迎, ${result.data.user.username}</span>
            <button id="btn-logout" class="nav-link border border-white/30">退出</button>
          </div>
        `;
        header.appendChild(userMenuDiv);
        document.getElementById('btn-logout').addEventListener('click', handleLogout);
      } else {
        api.setToken(null);
        userMenuDiv.innerHTML = `
          <div class="mt-4 md:mt-0">
            <button id="btn-login-modal" class="nav-link border border-white/30">登录/注册</button>
          </div>
        `;
        header.appendChild(userMenuDiv);
        document.getElementById('btn-login-modal').addEventListener('click', openAuthModal);
      }
    });
  } else {
    userMenuDiv.innerHTML = `
      <div class="mt-4 md:mt-0">
        <button id="btn-login-modal" class="nav-link border border-white/30">登录/注册</button>
      </div>
    `;
    header.appendChild(userMenuDiv);
    document.getElementById('btn-login-modal')?.addEventListener('click', openAuthModal);
  }
}

function updateAuthUI() {
  const userMenu = document.getElementById('user-menu');
  if (userMenu) {
    userMenu.remove();
  }
  initAuthUI();
}

// ========== Daily Workout Save ==========
function saveCurrentWorkout() {
  if (!api.isAuthenticated()) {
    alert('请先登录才能保存训练记录');
    openAuthModal();
    return;
  }

  if (typeof currentWorkout === 'undefined') {
    alert('无法获取训练信息');
    return;
  }

  // Save to API
  api.createWorkout({
    name: currentWorkout.name,
    type: currentWorkout.type,
    duration: currentWorkout.duration,
    date: new Date().toISOString().split('T')[0],
    completed: true,
    notes: `Saved from daily workout page`
  }).then(result => {
    if (result.success) {
      alert('训练记录已保存！');
    } else {
      alert('保存失败: ' + result.error);
    }
  });
}

// ========== Challenge Tracking ==========
function toggleChallengeDay(dayElement, day) {
  const completed = getProgress(`challenge_${currentChallengeId}_${day}`, false);
  saveProgress(`challenge_${currentChallengeId}_${day}`, !completed);
  if (!completed) {
    dayElement.classList.add('bg-primary', 'text-white');
    dayElement.classList.remove('bg-gray-100');
  } else {
    dayElement.classList.remove('bg-primary', 'text-white');
    dayElement.classList.add('bg-gray-100');
  }
}

// Initialize challenge page
function initChallengeCalendar() {
  document.querySelectorAll('.challenge-day').forEach(dayEl => {
    const day = parseInt(dayEl.dataset.day);
    const completed = getProgress(`challenge_${currentChallengeId}_${day}`, false);
    if (completed) {
      dayEl.classList.add('bg-primary', 'text-white');
      dayEl.classList.remove('bg-gray-100');
    }
    dayEl.addEventListener('click', () => toggleChallengeDay(dayEl, day));
  });
}

// Export for use in HTML pages
window.FitnessAPI = FitnessAPI;
window.api = api;
window.openAuthModal = openAuthModal;
window.saveCurrentWorkout = saveCurrentWorkout;
window.toggleChallengeDay = toggleChallengeDay;
window.initChallengeCalendar = initChallengeCalendar;