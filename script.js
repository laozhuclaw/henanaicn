const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const runCounter = (node) => {
    const target = Number(node.dataset.count || "0");
    const duration = prefersReducedMotion ? 1 : 1200;
    const started = performance.now();

    function tick(now) {
      const progress = Math.min((now - started) / duration, 1);
      node.textContent = String(Math.round(target * progress));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      runCounter(entry.target);
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.5 });

  counters.forEach((counter) => observer.observe(counter));
}

function initReveals() {
  const sections = document.querySelectorAll(".section-reveal");
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.classList.add("is-visible");
    }
  }, { threshold: 0.12 });

  sections.forEach((section) => observer.observe(section));
}

function filterProjects(direction) {
  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    const visible = direction === "all" || card.dataset.direction === direction;
    card.classList.toggle("is-hidden", !visible);
  });
}

function initProjectFilters() {
  const buttons = document.querySelectorAll("[data-filter]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      filterProjects(button.dataset.filter || "all");
    });
  });
}

function initActiveNavigation() {
  const links = Array.from(document.querySelectorAll(".nav-links a"));
  if (!links.length) return;

  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!active) return;

    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${active.target.id}`);
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] });

  sections.forEach((section) => observer.observe(section));
}

function initLoginPage() {
  const page = document.querySelector("[data-login-page]");
  if (!page) return;

  const roleButtons = Array.from(page.querySelectorAll("[data-role-select]"));
  const modeButtons = Array.from(page.querySelectorAll("[data-login-mode], [data-register-mode]"));
  const currentRole = page.querySelector("[data-current-role]");
  const currentTitle = page.querySelector("[data-current-title]");
  const currentDesc = page.querySelector("[data-current-desc]");
  const accountLabel = page.querySelector("[data-account-label]");
  const secretLabel = page.querySelector("[data-secret-label]");
  const status = page.querySelector("[data-auth-status]");
  const statusTitle = status ? status.querySelector("strong") : null;
  const statusDetail = status ? status.querySelector("em") : null;
  const form = page.querySelector("[data-auth-form]");

  if (!roleButtons.length || !modeButtons.length) return;

  const state = {
    roleButton: roleButtons[0],
    identity: "human",
    action: window.location.hash === "#register" ? "人类账号注册" : "人类登录"
  };

  function applyModeLabels() {
    const isAgent = state.identity === "agent";
    const isRegister = state.action.includes("注册") || state.action.includes("接入");

    if (accountLabel) {
      accountLabel.textContent = isAgent
        ? "智能体编码 / API 身份标识"
        : isRegister
          ? "注册主体名称 / 统一社会信用代码"
          : "统一社会信用代码 / 单位账号";
    }

    if (secretLabel) {
      secretLabel.textContent = isAgent
        ? isRegister
          ? "接入密钥 / 回调校验码"
          : "智能体密钥 / 授权令牌"
        : isRegister
          ? "联系人手机号 / 授权校验码"
          : "登录密码 / 一次性验证码";
    }
  }

  function updateAuthPanel(submitted = false) {
    const role = state.roleButton.dataset.roleSelect || "学校入口";
    const humanTitle = state.roleButton.dataset.humanTitle || "学校管理员";
    const agentTitle = state.roleButton.dataset.agentTitle || "学校智能体";
    const desc = state.roleButton.dataset.roleDesc || "成果、专家、实验室和课程资源接入";
    const title = state.identity === "agent" ? agentTitle : humanTitle;
    const identityLabel = state.identity === "agent" ? "智能体身份" : "人类账号";

    roleButtons.forEach((button) => button.classList.toggle("is-selected", button === state.roleButton));
    modeButtons.forEach((button) => button.classList.toggle("is-selected", button.textContent.trim() === state.action));

    if (currentRole) currentRole.textContent = role;
    if (currentTitle) currentTitle.textContent = title;
    if (currentDesc) currentDesc.textContent = desc;
    if (statusTitle) statusTitle.textContent = `${role} · ${state.action}`;
    if (statusDetail) {
      statusDetail.textContent = submitted
        ? `${title}的${identityLabel}请求已进入河南省与长三角协同权限链，等待 AICN 调度智能体校验。`
        : `${title}通过${identityLabel}确认责任边界，进入 AICN 协同任务链。`;
    }

    applyModeLabels();
  }

  roleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.roleButton = button;
      updateAuthPanel();
    });
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.identity = button.dataset.loginMode || button.dataset.registerMode || "human";
      state.action = button.textContent.trim();
      updateAuthPanel();
    });
  });

  if (window.location.hash === "#register") {
    const registerButton = modeButtons.find((button) => button.dataset.registerMode === "human");
    if (registerButton) {
      state.identity = "human";
      state.action = registerButton.textContent.trim();
    }
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      updateAuthPanel(true);
    });
  }

  updateAuthPanel();
}

function initNetworkCanvas() {
  const canvas = document.getElementById("networkCanvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  const nodeLabels = [
    "河南省科学技术厅",
    "AICN 调度智能体",
    "浙江清华长三角研究院",
    "河南人才集团",
    "学校智能体",
    "成果智能体",
    "企业智能体",
    "人才智能体",
    "技术经纪人智能体",
    "政策智能体",
    "资本智能体",
    "长三角资源域"
  ];

  const nodes = nodeLabels.map((label, index) => ({
    label,
    angle: (Math.PI * 2 * index) / nodeLabels.length,
    radius: index % 3 === 0 ? 0.34 : index % 3 === 1 ? 0.25 : 0.42,
    phase: index * 0.7
  }));

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(canvas.clientWidth * ratio);
    canvas.height = Math.floor(canvas.clientHeight * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function position(node, time) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const cx = width * 0.67;
    const cy = height * 0.48;
    const orbit = Math.min(width, height) * node.radius;
    const drift = prefersReducedMotion ? 0 : Math.sin(time / 1300 + node.phase) * 18;
    return {
      x: cx + Math.cos(node.angle + time / 18000) * (orbit + drift),
      y: cy + Math.sin(node.angle + time / 16000) * (orbit * 0.62 + drift * 0.35)
    };
  }

  function draw(time = 0) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    context.clearRect(0, 0, width, height);

    const points = nodes.map((node) => position(node, time));
    const hub = points[1];

    context.lineWidth = 1;
    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      const gradient = context.createLinearGradient(hub.x, hub.y, point.x, point.y);
      gradient.addColorStop(0, "rgba(24, 214, 255, 0.52)");
      gradient.addColorStop(1, "rgba(216, 167, 63, 0.16)");
      context.strokeStyle = gradient;
      context.beginPath();
      context.moveTo(hub.x, hub.y);
      context.lineTo(point.x, point.y);
      context.stroke();
    }

    points.forEach((point, index) => {
      const isHub = index === 1 || index === 2;
      context.beginPath();
      context.fillStyle = isHub ? "rgba(24, 214, 255, 0.95)" : "rgba(255, 255, 255, 0.78)";
      context.arc(point.x, point.y, isHub ? 5.5 : 3.5, 0, Math.PI * 2);
      context.fill();
      context.font = "12px PingFang SC, Microsoft YaHei, sans-serif";
      context.fillStyle = isHub ? "rgba(255, 255, 255, 0.96)" : "rgba(255, 255, 255, 0.58)";
      context.fillText(nodes[index].label, point.x + 10, point.y - 8);
    });

    if (!prefersReducedMotion) requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize);
}

document.addEventListener("DOMContentLoaded", () => {
  animateCounters();
  initReveals();
  initProjectFilters();
  initLoginPage();
  initActiveNavigation();
  initNetworkCanvas();
});
