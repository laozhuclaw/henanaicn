const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function readRequired(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

test("homepage contains official AICN positioning and stakeholder references", () => {
  const html = readRequired("index.html");
  const requiredText = [
    "河南省 AICN + 教科人一体化智能体协同创新网络平台",
    "河南省科学技术厅",
    "浙江清华长三角研究院",
    "河南人才集团",
    "AICN",
    "教育",
    "科技",
    "人才",
    "学校智能体",
    "成果智能体",
    "企业智能体",
    "人才智能体",
    "技术经纪人智能体",
    "政策智能体",
    "资本智能体",
    "AICN 调度智能体"
  ];

  for (const text of requiredText) {
    assert.match(html, new RegExp(text.replace(/[+]/g, "\\+")));
  }
});

test("homepage avoids internal demo wording and cloud-host labels", () => {
  const html = readRequired("index.html");
  const forbiddenText = [
    "面向省级领导演示",
    "面向领导演示",
    "领导",
    "阿里云",
    "演示站",
    "GitHub 仓库"
  ];

  for (const text of forbiddenText) {
    assert.doesNotMatch(html, new RegExp(text));
  }
});

test("homepage exposes required leadership-demo structure", () => {
  const html = readRequired("index.html");
  const sectionCount = (html.match(/<section\b/g) || []).length;
  const h1Count = (html.match(/<h1\b/g) || []).length;

  assert.match(html, /<nav\b/);
  assert.match(html, /<main\b/);
  assert.match(html, /<footer\b/);
  assert.equal(h1Count, 1);
  assert.ok(sectionCount >= 6, `expected at least 6 sections, got ${sectionCount}`);
  assert.match(html, /<canvas[^>]+id="networkCanvas"/);
  assert.match(html, /data-filter="henan-to-yrd"/);
  assert.match(html, /data-filter="yrd-to-henan"/);
});

test("homepage exposes role-based human and agent access entrances", () => {
  const html = readRequired("index.html");
  const requiredText = [
    "登录注册",
    "学校入口",
    "企业入口",
    "技术经纪人入口",
    "人才入口",
    "人类登录",
    "智能体登录",
    "人类账号注册",
    "智能体接入",
    "学校管理员",
    "企业负责人",
    "真人技术经纪人",
    "人才服务专员"
  ];

  for (const text of requiredText) {
    assert.match(html, new RegExp(text));
  }

  assert.match(html, /<section[^>]+id="access"/);
  assert.ok((html.match(/data-login-mode="human"/g) || []).length >= 4);
  assert.ok((html.match(/data-login-mode="agent"/g) || []).length >= 4);
  assert.ok((html.match(/data-register-mode="human"/g) || []).length >= 4);
  assert.ok((html.match(/data-register-mode="agent"/g) || []).length >= 4);
});

test("styles define responsive civic-tech visual system", () => {
  const css = readRequired("styles.css");
  const requiredTokens = [
    "--official-blue",
    "--signal-cyan",
    "--institution-gold",
    "--henan-green",
    "@media (max-width: 900px)",
    "@media (max-width: 620px)"
  ];

  for (const token of requiredTokens) {
    assert.match(css, new RegExp(token.replace(/[()]/g, "\\$&")));
  }

  assert.doesNotMatch(css, /clamp\(46px,\s*6vw,\s*88px\)/);
  assert.match(css, /--hero-title-size:\s*clamp\(34px,\s*4\.2vw,\s*58px\)/);
});

test("script initializes network canvas and project filtering", () => {
  const js = readRequired("script.js");

  assert.match(js, /networkCanvas/);
  assert.match(js, /requestAnimationFrame/);
  assert.match(js, /filterProjects/);
  assert.match(js, /initAccessEntrances/);
  assert.match(js, /data-access-status/);
  assert.match(js, /IntersectionObserver/);
});
