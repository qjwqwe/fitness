// 主题切换功能
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('theme-icon-sun');
const moonIcon = document.getElementById('theme-icon-moon');

// 获取当前主题
function getCurrentTheme() {
  if (localStorage.theme === 'dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    return 'dark';
  }
  return 'light';
}

// 应用主题
function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
    if (sunIcon && moonIcon) {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    }
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
    if (sunIcon && moonIcon) {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  }
}

// 初始化
applyTheme(getCurrentTheme());

// 绑定切换事件
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = getCurrentTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  });
}
