const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function readRequired(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function readAsset(file) {
  return fs.readFileSync(path.join(root, file));
}

const sectionImageAssets = [
  "assets/section-network-intelligence.png",
  "assets/section-integration-edu-sci-talent.png",
  "assets/section-agents-matrix.png",
  "assets/section-projects-collaboration.png",
  "assets/section-institutions-partnership.png",
  "assets/section-loop-closed-loop.png"
];

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

test("homepage moves login access to the header and uses regional visual assets", () => {
  const html = readRequired("index.html");
  const requiredText = [
    "统一登录",
    "注册接入",
    "河南省与长三角创新资源对接",
    "河南需求赴长三角",
    "长三角成果入豫"
  ];

  for (const text of requiredText) {
    assert.match(html, new RegExp(text));
  }

  assert.match(html, /class="auth-actions"/);
  assert.match(html, /href="login\.html"/);
  assert.match(html, /src="assets\/henan-yrd-aicn-generated\.png"/);
  assert.match(html, /alt="河南省地图、清华长三角研究院与长三角城市群通过 AICN 连接的主视觉"/);
  assert.doesNotMatch(html, /<section[^>]+id="access"/);
});

test("login page exposes role-based human and agent sign-in scenarios", () => {
  const html = readRequired("login.html");
  const requiredText = [
    "河南省 AICN 统一登录注册",
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
    "人才服务专员",
    "河南省与长三角协同权限链"
  ];

  for (const text of requiredText) {
    assert.match(html, new RegExp(text));
  }

  assert.match(html, /data-login-page/);
  assert.ok((html.match(/data-role-select=/g) || []).length >= 4);
  assert.ok((html.match(/data-login-mode="human"/g) || []).length >= 1);
  assert.ok((html.match(/data-login-mode="agent"/g) || []).length >= 1);
  assert.ok((html.match(/data-register-mode="human"/g) || []).length >= 1);
  assert.ok((html.match(/data-register-mode="agent"/g) || []).length >= 1);
  assert.match(html, /src="assets\/henan-yrd-aicn-generated\.png"/);
});

test("regional connection image is a generated raster asset", () => {
  const png = readAsset("assets/henan-yrd-aicn-generated.png");
  const signature = png.subarray(0, 8).toString("hex");

  assert.equal(signature, "89504e470d0a1a0a");
  assert.ok(png.length > 100000, `expected substantial generated image, got ${png.length} bytes`);
});

test("homepage gives every major section a high-quality visual image", () => {
  const html = readRequired("index.html");

  for (const asset of sectionImageAssets) {
    assert.match(html, new RegExp(`src="${asset.replace(/[./-]/g, "\\$&")}"`));
    const png = readAsset(asset);
    const signature = png.subarray(0, 8).toString("hex");

    assert.equal(signature, "89504e470d0a1a0a", `${asset} must be a PNG`);
    assert.ok(png.length > 100000, `${asset} should be a substantial generated image`);
  }

  assert.ok((html.match(/class="section-figure"/g) || []).length >= sectionImageAssets.length);
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
  assert.match(js, /initLoginPage/);
  assert.match(js, /data-auth-status/);
  assert.match(js, /IntersectionObserver/);
});
