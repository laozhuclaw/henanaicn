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
  initActiveNavigation();
  initNetworkCanvas();
});
