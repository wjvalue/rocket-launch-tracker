# 🚀 火箭发射追踪 · Rocket Launch Tracker

冷白灰画布式仪表盘,追踪全球火箭发射日程。基于 Vue 3 + LL2 API,无构建步骤,纯静态站点。

## 特性

- **三种视图**:日历视图 / 列表视图 / 历史统计
- **厂商筛选**:按国家分组(中国优先),支持中文搜索
- **发射详情**:火箭规格、载荷、型号历史与成功率
- **实时倒计时**:T-Xd Xh Xm 格式,发射窗口状态指示
- **画布式布局**:浮动面板 + 粒子背景 + 后现代角落装饰
- **离线兜底**:API 限速或离线时自动回退种子数据
- **响应式**:桌面三栏,窄屏滑入式筛选 + 全屏详情

## 技术栈

- Vue 3 (CDN,无构建)
- Tailwind CSS (CDN)
- JetBrains Mono / 系统字体
- LL2 (Launch Library 2) API
- Canvas 2D 粒子系统

## 本地运行

```bash
python3 -m http.server 8766
# 打开 http://localhost:8766/
```

或任意静态服务器均可。直接 `file://` 打开也可工作(ESM 兼容)。

## 项目结构

```
├── index.html              # 入口 + Tailwind 配置
├── css/app.css             # 主题变量 + 布局 + 组件样式
├── js/
│   ├── app.js              # 应用挂载与数据加载
│   ├── store.js            # 响应式状态管理
│   ├── components/         # Vue 组件(TopBar/Filter/Main/Calendar/List/History/Detail)
│   ├── data/               # 厂商映射 / 火箭规格 / 种子数据
│   ├── services/           # LL2 客户端 + 本地缓存
│   ├── effects/            # 粒子背景
│   └── utils/time.js       # 倒计时与时区格式化
└── tests/                  # 浏览器端测试(run tests.html)
```

## 数据源

- [Launch Library 2](https://ll.thespacedevs.com/) — 全球发射日程
- 厂商 ID 已核对自 LL2 `/agencies/` 端点(2026-07-24)
- 火箭规格为手工维护,映射 LL2 数值 ID 到本地规格库

## 配额说明

LL2 免费版每小时 25 次请求。客户端内置:
- 5 分钟冷却避免浪费配额
- 本地缓存优先(刷新不立即请求)
- 限速/离线时回退种子数据

## 设计

冷白灰底(#eef1f6)+ 深蓝黑文字 + 青色强调(#0891b2),灵感来自任务控制中心的 HUD 可读性,保留克制的技术感。文字透明度梯度按 WCAG 对比度校准。
