# 河南省 AICN + 教科人一体化智能体协同创新网络平台

河南省科学技术厅牵头建设的 AICN + 教科人一体化智能体协同创新网络平台项目资料与代码仓库。

## Links

- GitHub: https://github.com/laozhuclaw/henanaicn
- Aliyun deployment: http://47.102.216.22/aicn/henan/
- Design spec: [docs/superpowers/specs/2026-05-23-henan-aicn-design.md](docs/superpowers/specs/2026-05-23-henan-aicn-design.md)
- Source proposal: [河南省AICN教科人一体化协同创新网络建设方案_V2.docx](河南省AICN教科人一体化协同创新网络建设方案_V2.docx)

## Deploy

The production static site is served from `/var/www/html/aicn/henan/` and is owned by the `aicn` deploy user. The legacy `/henanaicn/` URL is kept online separately for compatibility; the canonical AICN namespace is `/aicn/henan/`.

```bash
SSHPASS='***' ./deploy.sh
```

## Positioning

The platform highlights:

- Henan Department of Science and Technology as the official leading body.
- AICN as a multi-agent collaboration network.
- Education, science, and talent integration.
- Henan province and Yangtze River Delta two-way collaboration.
- Zhejiang Tsinghua Yangtze River Delta Research Institute as the cross-region transformation hub.
