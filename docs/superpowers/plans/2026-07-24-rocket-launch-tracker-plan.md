# 火箭发射追踪网页 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一个纯静态 HTML 火箭发射追踪网页,从 Launch Library 2 API 拉取数据,以三栏仪表盘布局展示日历/列表/历史视图,支持厂商筛选与火箭规格查询。

**Architecture:** 全局变量模式(`window.RT`)+ `<script>` 顺序加载,Vue 3 / Tailwind 经 CDN 引入,localStorage 缓存。逻辑层(cache/ll2-client/store/time)走 TDD,使用原生 JS 极简测试运行器(零依赖);UI 组件用 DevTools 手工验证。

**Tech Stack:** Vue 3 (CDN) · Tailwind CSS (CDN) · 原生 JS (ES2015+) · Launch Library 2 API · localStorage

**Spec:** [docs/superpowers/specs/2026-07-24-rocket-launch-tracker-design.md](../specs/2026-07-24-rocket-launch-tracker-design.md)

---

## 测试策略说明

设计文档明确"不引入测试框架,保持零依赖"。本计划的折中方案:

- **逻辑层 TDD**:实现一个极简测试运行器(`tests.html` + `run.js`),仅用原生 JS,无任何外部依赖。双击 `tests.html` 在浏览器打开,自动运行所有 `tests/*.test.js`,展示 PASS/FAIL 列表。逻辑模块包括:`cache.js`、`ll2-client.js`、`store.js`、`time.js`。
- **UI 组件验证**:无单元测试,每个组件实现后用 DevTools 手工验证(计划中列出具体验证步骤)。
- **端到端验收**:最终在 `index.html` 中完成集成,按设计文档 §13 测试策略全流程验证。

> 注:测试运行器使用 `<script>` 标签加载,不依赖 ESM,与生产代码模式一致。

---

## 文件结构总览

```
火箭追踪/
├─ index.html                          入口
├─ css/app.css                          自定义样式
├─ js/
│  ├─ app.js                           Vue 应用挂载 + 数据加载
│  ├─ store.js                         响应式 store ★TDD
│  ├─ utils/time.js                    时区/倒计时工具 ★TDD
│  ├─ components/
│  │  ├─ TopBar.js
│  │  ├─ FilterSidebar.js
│  │  ├─ MainPanel.js
│  │  ├─ CalendarView.js
│  │  ├─ ListView.js
│  │  ├─ HistoryView.js
│  │  └─ DetailDrawer.js
│  ├─ services/
│  │  ├─ ll2-client.js                 API 封装 ★TDD
│  │  └─ cache.js                      localStorage 封装 ★TDD
│  └─ data/
│     ├─ manufacturers.js              厂商元数据
│     └─ rocket-specs.js               火箭规格库
├─ tests/
│  ├─ tests.html                       测试运行器入口
│  ├─ run.js                           测试框架核心
│  ├─ cache.test.js
│  ├─ ll2-client.test.js
│  ├─ store.test.js
│  └─ time.test.js
└─ docs/superpowers/
   ├─ specs/2026-07-24-rocket-launch-tracker-design.md
   └─ plans/2026-07-24-rocket-launch-tracker-plan.md   (本文件)
```

---

## Task 1: 项目骨架与 index.html

**Files:**
- Create: `index.html`
- Create: `css/app.css`
- Create: `js/app.js`(占位)

- [ ] **Step 1: 创建 `index.html` 骨架**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🚀 火箭发射追踪</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
  <link rel="stylesheet" href="css/app.css">
</head>
<body>
  <div id="cdn-fallback" style="display:none; padding: 2rem; text-align: center; font-family: sans-serif;">
    <h1>⚠️ 基础库加载失败</h1>
    <p>请检查网络连接后刷新页面。Vue 3 与 Tailwind CSS 需通过 CDN 加载。</p>
  </div>
  <div id="app"></div>

  <script src="js/data/manufacturers.js"></script>
  <script src="js/data/rocket-specs.js"></script>
  <script src="js/services/cache.js"></script>
  <script src="js/services/ll2-client.js"></script>
  <script src="js/utils/time.js"></script>
  <script src="js/store.js"></script>
  <script src="js/components/TopBar.js"></script>
  <script src="js/components/FilterSidebar.js"></script>
  <script src="js/components/CalendarView.js"></script>
  <script src="js/components/ListView.js"></script>
  <script src="js/components/HistoryView.js"></script>
  <script src="js/components/MainPanel.js"></script>
  <script src="js/components/DetailDrawer.js"></script>
  <script src="js/app.js"></script>

  <script>
    if (typeof Vue === 'undefined') {
      document.getElementById('cdn-fallback').style.display = 'block';
      document.getElementById('app').style.display = 'none';
    }
  </script>
</body>
</html>
```

- [ ] **Step 2: 创建 `css/app.css` 占位**

```css
html, body {
  margin: 0; padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", sans-serif;
}
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: #f1f5f9; }
::-webkit-scrollbar-thumb { background: #94a3b8; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #64748b; }
```

- [ ] **Step 3: 创建 `js/app.js` 占位**

```js
window.RT = window.RT || {};
console.log('[RT] app.js loaded — Vue available:', typeof Vue !== 'undefined');
```

- [ ] **Step 4: 验证骨架**

双击 `index.html`。预期:页面空白,Console 输出 `[RT] app.js loaded — Vue available: true`。

- [ ] **Step 5: 验证 CDN fallback**

DevTools Network → Offline,刷新。预期:显示「⚠️ 基础库加载失败」。

- [ ] **Step 6: Commit**

```bash
git add index.html css/app.css js/app.js
git commit -m "feat: 项目骨架与 index.html 入口"
```

---

## Task 2: 测试运行器

**Files:**
- Create: `tests/tests.html`
- Create: `tests/run.js`

- [ ] **Step 1: 创建 `tests/run.js` 极简测试框架**

```js
window.RT_TESTS = {
  results: [],
  register(name, fn) { this.results.push({ name, fn, status: 'pending' }); },
  async run() {
    const output = document.getElementById('test-output');
    let pass = 0, fail = 0;
    for (const t of this.results) {
      try {
        await t.fn();
        t.status = 'pass'; pass++;
        output.innerHTML += `<div class="pass">✓ ${t.name}</div>`;
      } catch (e) {
        t.status = 'fail'; fail++;
        output.innerHTML += `<div class="fail">✗ ${t.name}<pre>${e.stack || e.message}</pre></div>`;
      }
    }
    output.innerHTML += `<div class="summary">总计: ${this.results.length} · 通过: ${pass} · 失败: ${fail}</div>`;
  }
};
window.assert = {
  equal(actual, expected, msg) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`${msg || ''}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`);
    }
  },
  truthy(value, msg) { if (!value) throw new Error(msg || `expected truthy, got ${value}`); },
  falsy(value, msg) { if (value) throw new Error(msg || `expected falsy, got ${value}`); },
  throws(fn, msg) {
    let threw = false;
    try { fn(); } catch (e) { threw = true; }
    if (!threw) throw new Error(msg || 'expected function to throw');
  }
};
```

- [ ] **Step 2: 创建 `tests/tests.html`**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>RT 测试运行器</title>
  <style>
    body { font-family: monospace; padding: 1rem; max-width: 900px; margin: 0 auto; }
    .pass { color: #10b981; padding: 4px 0; }
    .fail { color: #dc2626; padding: 4px 0; }
    .fail pre { background: #fef2f2; padding: 8px; border-radius: 4px; margin: 4px 0; font-size: 12px; }
    .summary { margin-top: 16px; padding-top: 12px; border-top: 2px solid #e2e8f0; font-weight: bold; }
    h1 { color: #1e293b; }
  </style>
</head>
<body>
  <h1>🚀 火箭追踪 · 测试运行器</h1>
  <div id="test-output"></div>
  <script src="run.js"></script>
  <script src="../js/data/manufacturers.js"></script>
  <script src="../js/data/rocket-specs.js"></script>
  <script src="../js/services/cache.js"></script>
  <script src="../js/services/ll2-client.js"></script>
  <script src="../js/utils/time.js"></script>
  <script src="../js/store.js"></script>
  <script src="cache.test.js"></script>
  <script src="ll2-client.test.js"></script>
  <script src="time.test.js"></script>
  <script src="store.test.js"></script>
  <script>RT_TESTS.run();</script>
</body>
</html>
```

- [ ] **Step 3: 验证测试运行器启动**

在 DevTools Console 中:

```js
RT_TESTS.register('sanity check', () => { assert.equal(1 + 1, 2, 'math works'); });
RT_TESTS.run();
```

预期:页面显示 `✓ sanity check`。

- [ ] **Step 4: Commit**

```bash
git add tests/tests.html tests/run.js
git commit -m "test: 极简测试运行器(零依赖)"
```

---

## Task 3: 数据层 — manufacturers.js

**Files:** Create: `js/data/manufacturers.js`

- [ ] **Step 1: 创建厂商元数据文件**

```js
window.RT = window.RT || {};
RT.MANUFACTURERS = {
  // ID 待 Task 17 从首次 LL2 响应中核对填入
};

RT.getManufacturer = function(id) {
  if (RT.MANUFACTURERS[id]) return RT.MANUFACTURERS[id];
  return { name: '其他', name_zh: '其他', country: 'Unknown', color: '#94a3b8', isFallback: true };
};

RT.PRESET_MANUFACTURERS = [
  { name: 'SpaceX',          name_zh: 'SpaceX',          country: 'USA',     color: '#3b82f6' },
  { name: 'CASC',            name_zh: '中国航天科技集团', country: 'China',   color: '#dc2626' },
  { name: 'CASIC',           name_zh: '中国航天科工集团', country: 'China',   color: '#f43f5e' },
  { name: 'LandSpace',       name_zh: '蓝箭航天',         country: 'China',   color: '#10b981' },
  { name: 'iSpace',          name_zh: '星际荣耀',         country: 'China',   color: '#14b8a6' },
  { name: 'Galactic Energy', name_zh: '星河动力',         country: 'China',   color: '#a855f7' },
  { name: 'Orienspace',      name_zh: '东方空间',         country: 'China',   color: '#ec4899' },
  { name: 'Rocket Lab',      name_zh: '火箭实验室',       country: 'USA',     color: '#f97316' },
  { name: 'ULA',             name_zh: '联合发射联盟',     country: 'USA',     color: '#0ea5e9' },
  { name: 'Blue Origin',     name_zh: '蓝色起源',         country: 'USA',     color: '#6366f1' },
  { name: 'ArianeGroup',     name_zh: '阿丽亚娜集团',     country: 'Europe',  color: '#facc15' },
  { name: 'Roscosmos',       name_zh: '俄罗斯航天局',     country: 'Russia',  color: '#ef4444' },
];
```

- [ ] **Step 2: 验证**

DevTools Console:

```js
RT.getManufacturer(99999)  // 预期: {name: "其他", ...isFallback: true}
RT.PRESET_MANUFACTURERS.length  // 预期: 12
```

- [ ] **Step 3: Commit**

```bash
git add js/data/manufacturers.js
git commit -m "feat(data): 厂商元数据预置清单"
```

---

## Task 4: 数据层 — rocket-specs.js

**Files:** Create: `js/data/rocket-specs.js`

- [ ] **Step 1: 创建火箭规格库(18 个预置型号)**

```js
// 数据截至: 2026-07-01
// 来源: SpaceX 官方 Falcon User Guide Rev 2 (2024)、CASC 官网、Wikipedia 各型号条目
window.RT = window.RT || {};
RT.ROCKET_SPECS = {
  'falcon-9-block-5': { name: 'Falcon 9 Block 5', stages: 2, boosters: 0, height_m: 70, diameter_m: 3.7, liftoff_mass_t: 549, leo_kg: 22800, gto_kg: 8300, thrust_kn: 7607, engines: '9 × Merlin 1D+', first_flight: '2018-05-11', success_rate: 0.99, total_flights: 280, country: 'USA', manufacturer: 'SpaceX' },
  'falcon-heavy': { name: 'Falcon Heavy', stages: 2, boosters: 2, height_m: 70, diameter_m: 3.7, liftoff_mass_t: 1420, leo_kg: 63800, gto_kg: 26700, thrust_kn: 22819, engines: '27 × Merlin 1D+', first_flight: '2018-02-06', success_rate: 1.00, total_flights: 8, country: 'USA', manufacturer: 'SpaceX' },
  'long-march-2c': { name: '长征二号丙', stages: 2, boosters: 0, height_m: 43, diameter_m: 3.35, liftoff_mass_t: 245, leo_kg: 4100, gto_kg: 0, thrust_kn: 2962, engines: '4 × YF-21C', first_flight: '1982-09-09', success_rate: 0.97, total_flights: 65, country: 'China', manufacturer: 'CASC' },
  'long-march-2d': { name: '长征二号丁', stages: 2, boosters: 0, height_m: 41, diameter_m: 3.35, liftoff_mass_t: 250, leo_kg: 4000, gto_kg: 0, thrust_kn: 2962, engines: '4 × YF-21C', first_flight: '1992-08-09', success_rate: 0.98, total_flights: 70, country: 'China', manufacturer: 'CASC' },
  'long-march-3b': { name: '长征三号乙', stages: 3, boosters: 4, height_m: 54.8, diameter_m: 3.35, liftoff_mass_t: 456, leo_kg: 12000, gto_kg: 5100, thrust_kn: 5923, engines: '4 × YF-25 + 2 × YF-21E', first_flight: '1996-02-15', success_rate: 0.95, total_flights: 80, country: 'China', manufacturer: 'CASC' },
  'long-march-5': { name: '长征五号', stages: 2, boosters: 4, height_m: 56.97, diameter_m: 5.0, liftoff_mass_t: 869, leo_kg: 25000, gto_kg: 14000, thrust_kn: 10622, engines: '2 × YF-100 + 2 × YF-77', first_flight: '2016-11-03', success_rate: 0.90, total_flights: 10, country: 'China', manufacturer: 'CASC' },
  'long-march-7': { name: '长征七号', stages: 2, boosters: 4, height_m: 53.1, diameter_m: 3.35, liftoff_mass_t: 597, leo_kg: 13500, gto_kg: 5500, thrust_kn: 7305, engines: '4 × YF-100 + 2 × YF-115', first_flight: '2016-06-25', success_rate: 1.00, total_flights: 12, country: 'China', manufacturer: 'CASC' },
  'long-march-8': { name: '长征八号', stages: 2, boosters: 2, height_m: 50.3, diameter_m: 3.35, liftoff_mass_t: 331, leo_kg: 8500, gto_kg: 4500, thrust_kn: 4800, engines: '2 × YF-100 + 1 × YF-75D', first_flight: '2020-12-22', success_rate: 1.00, total_flights: 5, country: 'China', manufacturer: 'CASC' },
  'long-march-11': { name: '长征十一号', stages: 4, boosters: 0, height_m: 20.8, diameter_m: 2.0, liftoff_mass_t: 58, leo_kg: 750, gto_kg: 0, thrust_kn: 1176, engines: '固体推进', first_flight: '2015-09-25', success_rate: 1.00, total_flights: 15, country: 'China', manufacturer: 'CASC' },
  'kuaizhou-1a': { name: '快舟一号甲', stages: 3, boosters: 0, height_m: 19.4, diameter_m: 1.4, liftoff_mass_t: 30, leo_kg: 300, gto_kg: 0, thrust_kn: 392, engines: '固体推进', first_flight: '2017-01-09', success_rate: 0.90, total_flights: 20, country: 'China', manufacturer: 'CASIC' },
  'zhuque-2': { name: '朱雀二号', stages: 2, boosters: 0, height_m: 49.5, diameter_m: 3.35, liftoff_mass_t: 219, leo_kg: 4000, gto_kg: 0, thrust_kn: 2680, engines: '液氧甲烷(TQ-12)', first_flight: '2022-12-14', success_rate: 0.67, total_flights: 6, country: 'China', manufacturer: 'LandSpace' },
  'hyperbola-2': { name: '双曲线二号', stages: 2, boosters: 0, height_m: 31, diameter_m: 3.35, liftoff_mass_t: 100, leo_kg: 1900, gto_kg: 0, thrust_kn: 900, engines: '液氧甲烷', first_flight: '2023-11-02', success_rate: 0.80, total_flights: 5, country: 'China', manufacturer: 'iSpace' },
  'gravity-1': { name: '引力一号', stages: 3, boosters: 0, height_m: 31.4, diameter_m: 2.65, liftoff_mass_t: 405, leo_kg: 6500, gto_kg: 0, thrust_kn: 3942, engines: '固体推进', first_flight: '2024-01-11', success_rate: 1.00, total_flights: 3, country: 'China', manufacturer: 'Orienspace' },
  'electron': { name: 'Electron', stages: 2, boosters: 0, height_m: 18, diameter_m: 1.2, liftoff_mass_t: 13, leo_kg: 320, gto_kg: 0, thrust_kn: 192, engines: '9 × Rutherford', first_flight: '2017-05-25', success_rate: 0.92, total_flights: 50, country: 'USA', manufacturer: 'Rocket Lab' },
  'vulcan-vc2': { name: 'Vulcan VC2', stages: 2, boosters: 2, height_m: 61.6, diameter_m: 5.4, liftoff_mass_t: 547, leo_kg: 27200, gto_kg: 14900, thrust_kn: 7838, engines: '2 × BE-4 + 2 × GEM 63', first_flight: '2024-01-08', success_rate: 1.00, total_flights: 2, country: 'USA', manufacturer: 'ULA' },
  'atlas-v': { name: 'Atlas V', stages: 2, boosters: 1, height_m: 58.3, diameter_m: 3.81, liftoff_mass_t: 334, leo_kg: 8123, gto_kg: 3520, thrust_kn: 3827, engines: '1 × RD-180 + 1 × RL10', first_flight: '2002-08-21', success_rate: 0.99, total_flights: 100, country: 'USA', manufacturer: 'ULA' },
  'new-glenn': { name: 'New Glenn', stages: 2, boosters: 0, height_m: 98, diameter_m: 7, liftoff_mass_t: 1500, leo_kg: 45000, gto_kg: 13900, thrust_kn: 17560, engines: '7 × BE-4', first_flight: '2025-01-16', success_rate: 1.00, total_flights: 1, country: 'USA', manufacturer: 'Blue Origin' },
  'ariane-6': { name: 'Ariane 6', stages: 2, boosters: 2, height_m: 63, diameter_m: 5.4, liftoff_mass_t: 860, leo_kg: 21600, gto_kg: 11500, thrust_kn: 13600, engines: '1 × Vulcain 2.1 + 2 × P120C', first_flight: '2024-07-09', success_rate: 1.00, total_flights: 2, country: 'Europe', manufacturer: 'ArianeGroup' },
  'sls-block-1': { name: 'SLS Block 1', stages: 2, boosters: 2, height_m: 111.3, diameter_m: 8.4, liftoff_mass_t: 2608, leo_kg: 95000, gto_kg: 27000, thrust_kn: 39918, engines: '4 × RS-25 + 2 × 五段式助推', first_flight: '2022-11-16', success_rate: 1.00, total_flights: 1, country: 'USA', manufacturer: 'NASA' }
};

RT.getRocketSpec = function(id, name) {
  if (id && RT.ROCKET_SPECS[id]) return RT.ROCKET_SPECS[id];
  if (name) {
    const normalized = name.toLowerCase().replace(/\s+/g, '-');
    if (RT.ROCKET_SPECS[normalized]) return RT.ROCKET_SPECS[normalized];
    for (const key in RT.ROCKET_SPECS) {
      if (RT.ROCKET_SPECS[key].name === name) return RT.ROCKET_SPECS[key];
    }
  }
  return null;
};

RT.ROCKET_SPECS_UPDATED = '2026-07-01';
```

- [ ] **Step 2: 验证**

DevTools Console:

```js
RT.getRocketSpec('falcon-9-block-5').leo_kg  // 预期: 22800
RT.getRocketSpec(null, 'Falcon 9 Block 5').name  // 预期: 'Falcon 9 Block 5'
RT.getRocketSpec(null, '不存在')  // 预期: null
```

- [ ] **Step 3: Commit**

```bash
git add js/data/rocket-specs.js
git commit -m "feat(data): 火箭规格预置库(18 个型号)"
```

---

## Task 5: 服务层 — cache.js (TDD)

**Files:**
- Create: `tests/cache.test.js`
- Create: `js/services/cache.js`

- [ ] **Step 1: 写失败测试 `tests/cache.test.js`**

```js
RT_TESTS.register('cache.save 写入并 cache.load 读取', () => {
  localStorage.clear();
  const data = { launches: [{ id: 't1' }], fetched_at: Date.now(), source: 'll2' };
  RT.cache.save(data);
  const loaded = RT.cache.load();
  assert.equal(loaded.launches.length, 1);
  assert.equal(loaded.launches[0].id, 't1');
});

RT_TESTS.register('cache.load 在无数据时返回 null', () => {
  localStorage.clear();
  assert.equal(RT.cache.load(), null);
});

RT_TESTS.register('cache.isFresh 在 1 小时内返回 true', () => {
  localStorage.clear();
  RT.cache.save({ launches: [], fetched_at: Date.now() - 30 * 60 * 1000, source: 'll2' });
  assert.truthy(RT.cache.isFresh());
});

RT_TESTS.register('cache.isFresh 在 1 小时外返回 false', () => {
  localStorage.clear();
  RT.cache.save({ launches: [], fetched_at: Date.now() - 61 * 60 * 1000, source: 'll2' });
  assert.falsy(RT.cache.isFresh());
});

RT_TESTS.register('cache.isFresh 在无数据时返回 false', () => {
  localStorage.clear();
  assert.falsy(RT.cache.isFresh());
});

RT_TESTS.register('cache.clear 清除数据', () => {
  localStorage.clear();
  RT.cache.save({ launches: [{ id: 't1' }], fetched_at: Date.now(), source: 'll2' });
  RT.cache.clear();
  assert.equal(RT.cache.load(), null);
});

RT_TESTS.register('cache 配额计数 incrementQuota', () => {
  localStorage.clear();
  assert.equal(RT.cache.getQuotaUsed(), 0);
  RT.cache.incrementQuota(2);
  assert.equal(RT.cache.getQuotaUsed(), 2);
  RT.cache.incrementQuota(2);
  assert.equal(RT.cache.getQuotaUsed(), 4);
});

RT_TESTS.register('cache 配额在小时窗口滚动后重置', () => {
  localStorage.clear();
  const oneHourAgo = Date.now() - 61 * 60 * 1000;
  localStorage.setItem('rocket-tracker:quota', JSON.stringify({ used: 10, window_start: oneHourAgo }));
  assert.equal(RT.cache.getQuotaUsed(), 0);
});
```

- [ ] **Step 2: 运行测试验证失败**

打开 `tests/tests.html`,预期 Console 报 `RT.cache is undefined`。

- [ ] **Step 3: 实现 `js/services/cache.js`**

```js
window.RT = window.RT || {};
RT.cache = {
  KEY: 'rocket-tracker:cache:v1',
  QUOTA_KEY: 'rocket-tracker:quota',
  FRESH_MS: 60 * 60 * 1000,
  QUOTA_WINDOW_MS: 60 * 60 * 1000,

  save(data) {
    try { localStorage.setItem(this.KEY, JSON.stringify(data)); }
    catch (e) { console.error('[RT] cache.save failed:', e); }
  },
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { console.error('[RT] cache.load failed:', e); return null; }
  },
  isFresh() {
    const data = this.load();
    if (!data || !data.fetched_at) return false;
    return (Date.now() - data.fetched_at) < this.FRESH_MS;
  },
  clear() { localStorage.removeItem(this.KEY); },

  getQuotaUsed() {
    try {
      const raw = localStorage.getItem(this.QUOTA_KEY);
      if (!raw) return 0;
      const q = JSON.parse(raw);
      if (Date.now() - q.window_start > this.QUOTA_WINDOW_MS) return 0;
      return q.used;
    } catch (e) { return 0; }
  },
  incrementQuota(count) {
    const used = this.getQuotaUsed();
    const windowStart = this.getQuotaWindowStart();
    const q = (windowStart && Date.now() - windowStart <= this.QUOTA_WINDOW_MS)
      ? { used: used + count, window_start: windowStart }
      : { used: count, window_start: Date.now() };
    localStorage.setItem(this.QUOTA_KEY, JSON.stringify(q));
  },
  getQuotaWindowStart() {
    try {
      const raw = localStorage.getItem(this.QUOTA_KEY);
      return raw ? JSON.parse(raw).window_start : null;
    } catch (e) { return null; }
  },
  getQuotaRemaining(limit) { return Math.max(0, limit - this.getQuotaUsed()); }
};
```

- [ ] **Step 4: 运行测试验证通过**

打开 `tests/tests.html`,预期 8 个 cache 测试全部 `✓` 通过。

- [ ] **Step 5: Commit**

```bash
git add js/services/cache.js tests/cache.test.js
git commit -m "feat(services): cache.js + TDD 测试"
```

---

## Task 6: 服务层 — ll2-client.js (TDD)

**Files:**
- Create: `tests/ll2-client.test.js`
- Create: `js/services/ll2-client.js`

- [ ] **Step 1: 写失败测试 `tests/ll2-client.test.js`**

```js
RT_TESTS.register('ll2Client.normalizeLaunch 标准化字段', () => {
  const raw = {
    id: 'll2-1234', name: 'Falcon 9 · Starlink',
    net: '2026-07-24T22:30:00Z',
    window_start: '2026-07-24T22:00:00Z', window_end: '2026-07-25T02:00:00Z',
    status: { name: 'Go', abbrev: 'GO' },
    launch_service_provider: { id: 121, name: 'SpaceX' },
    rocket: { configuration: { id: 164, name: 'Falcon 9 Block 5' } },
    pad: { name: 'SLC-40', location: { name: 'CCSFS, FL, USA' } },
    mission: { name: 'Starlink', type: 'Communications', orbit: { name: 'LEO' }, payload_mass: 17500 }
  };
  const n = RT.ll2Client.normalizeLaunch(raw);
  assert.equal(n.id, 'll2-1234');
  assert.equal(n.status, 'Go');
  assert.equal(n.provider.name, 'SpaceX');
  assert.equal(n.rocket_config.name, 'Falcon 9 Block 5');
  assert.equal(n.mission.orbit, 'LEO');
});

RT_TESTS.register('ll2Client.normalizeLaunch 处理缺失字段', () => {
  const raw = { id: 't1', name: 'Test', net: '2026-01-01T00:00:00Z', status: { name: 'TBD' } };
  const n = RT.ll2Client.normalizeLaunch(raw);
  assert.equal(n.status, 'TBD');
  assert.falsy(n.provider);
  assert.falsy(n.mission);
});

RT_TESTS.register('ll2Client.filterByDateRange 按时间范围筛选', () => {
  const now = Date.UTC(2026, 6, 24);
  const launches = [
    { id: 'old', net: '2026-06-01T00:00:00Z' },
    { id: 'recent', net: '2026-07-10T00:00:00Z' },
    { id: 'future', net: '2026-09-01T00:00:00Z' },
    { id: 'far', net: '2026-12-01T00:00:00Z' }
  ];
  const filtered = RT.ll2Client.filterByDateRange(launches, now, 30, 90);
  assert.equal(filtered.length, 2);
  assert.equal(filtered[0].id, 'recent');
});

RT_TESTS.register('ll2Client.buildUrl 构造完整 URL', () => {
  const url = RT.ll2Client.buildUrl('upcoming', { limit: 100, mode: 'detailed' });
  assert.equal(url, 'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=100&mode=detailed&offset=0');
});

RT_TESTS.register('ll2Client.fetchUpcoming 调用 mock fetch 返回标准化数组', async () => {
  const originalFetch = window.fetch;
  let calledUrl = '';
  window.fetch = async (url) => {
    calledUrl = url;
    return { ok: true, status: 200, json: async () => ({ results: [
      { id: 't1', name: 'Test', net: '2026-08-01T00:00:00Z', status: { name: 'Go' } }
    ] }) };
  };
  try {
    const result = await RT.ll2Client.fetchUpcoming();
    assert.truthy(calledUrl.includes('/launch/upcoming/'));
    assert.truthy(calledUrl.includes('mode=detailed'));
    assert.equal(result.length, 1);
    assert.equal(result[0].status, 'Go');
  } finally { window.fetch = originalFetch; }
});

RT_TESTS.register('ll2Client.fetchUpcoming 429 抛 RateLimitError', async () => {
  const originalFetch = window.fetch;
  window.fetch = async () => ({ ok: false, status: 429, json: async () => ({ detail: 'Rate limit' }) });
  try {
    let threw = false;
    try { await RT.ll2Client.fetchUpcoming(); }
    catch (e) { threw = true; assert.equal(e.name, 'RateLimitError'); }
    assert.truthy(threw);
  } finally { window.fetch = originalFetch; }
});

RT_TESTS.register('ll2Client.fetchUpcoming 网络错误抛 FetchError', async () => {
  const originalFetch = window.fetch;
  window.fetch = async () => { throw new Error('Network down'); };
  try {
    let threw = false;
    try { await RT.ll2Client.fetchUpcoming(); }
    catch (e) { threw = true; assert.equal(e.name, 'FetchError'); }
    assert.truthy(threw);
  } finally { window.fetch = originalFetch; }
});
```

- [ ] **Step 2: 运行测试验证失败**

打开 `tests/tests.html`,预期 7 个 ll2-client 测试报 `RT.ll2Client is undefined`。

- [ ] **Step 3: 实现 `js/services/ll2-client.js`**

```js
window.RT = window.RT || {};
RT.ll2Client = {
  BASE_URL: 'https://ll.thespacedevs.com/2.2.0/',
  MAX_RETRIES: 3,
  RETRY_DELAYS: [2000, 4000, 8000],

  buildUrl(endpoint, params) {
    const p = Object.assign({ limit: 100, mode: 'detailed', offset: 0 }, params || {});
    const query = Object.keys(p).map(k => `${k}=${p[k]}`).join('&');
    return `${this.BASE_URL}launch/${endpoint}/?${query}`;
  },

  normalizeLaunch(raw) {
    return {
      id: raw.id,
      name: raw.name,
      net: raw.net,
      window_start: raw.window_start,
      window_end: raw.window_end,
      status: raw.status ? raw.status.name : null,
      status_abbrev: raw.status ? raw.status.abbrev : null,
      provider: raw.launch_service_provider ? {
        id: raw.launch_service_provider.id, name: raw.launch_service_provider.name
      } : null,
      rocket_config: raw.rocket && raw.rocket.configuration ? {
        id: raw.rocket.configuration.id, name: raw.rocket.configuration.name
      } : null,
      pad: raw.pad ? { name: raw.pad.name, location: raw.pad.location ? raw.pad.location.name : null } : null,
      mission: raw.mission ? {
        name: raw.mission.name, type: raw.mission.type,
        orbit: raw.mission.orbit ? raw.mission.orbit.name : null,
        payload_mass_kg: raw.mission.payload_mass || raw.payload_mass || null
      } : null
    };
  },

  filterByDateRange(launches, nowMs, pastDays, futureDays) {
    const start = nowMs - pastDays * 24 * 60 * 60 * 1000;
    const end = nowMs + futureDays * 24 * 60 * 60 * 1000;
    return launches.filter(l => {
      const t = new Date(l.net).getTime();
      return t >= start && t <= end;
    });
  },

  async fetchUpcoming() { return this._fetchWithRetry(this.buildUrl('upcoming')); },
  async fetchPrevious() { return this._fetchWithRetry(this.buildUrl('previous')); },

  async _fetchWithRetry(url) {
    let lastError;
    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const resp = await fetch(url);
        if (resp.status === 429) {
          const err = new Error('Rate limited by LL2');
          err.name = 'RateLimitError'; err.status = 429;
          throw err;
        }
        if (!resp.ok) {
          const err = new Error(`LL2 returned ${resp.status}`);
          err.name = 'HttpError'; err.status = resp.status;
          throw err;
        }
        const data = await resp.json();
        return data.results.map(l => this.normalizeLaunch(l));
      } catch (e) {
        lastError = e;
        if (e.name === 'RateLimitError' || e.name === 'FetchError') throw e;
        if (attempt < this.MAX_RETRIES) {
          await new Promise(r => setTimeout(r, this.RETRY_DELAYS[attempt]));
          continue;
        }
        if (e instanceof TypeError) {
          const err = new Error(e.message);
          err.name = 'FetchError';
          throw err;
        }
        throw e;
      }
    }
    throw lastError;
  }
};
```

- [ ] **Step 4: 运行测试验证通过**

打开 `tests/tests.html`,预期 15 个测试全部通过(8 cache + 7 ll2-client)。

- [ ] **Step 5: Commit**

```bash
git add js/services/ll2-client.js tests/ll2-client.test.js
git commit -m "feat(services): ll2-client.js + TDD 测试(mock fetch)"
```

---

## Task 7: 工具层 — time.js (TDD)

**Files:**
- Create: `tests/time.test.js`
- Create: `js/utils/time.js`

- [ ] **Step 1: 写失败测试 `tests/time.test.js`**

```js
RT_TESTS.register('time.formatCountdown >1h 显示 T-Xd Yh Zm', () => {
  const now = Date.UTC(2026, 6, 24, 12, 0, 0);
  const net = Date.UTC(2026, 6, 27, 15, 30, 0);
  assert.equal(RT.time.formatCountdown(net, now), 'T-3d 3h 30m');
});

RT_TESTS.register('time.formatCountdown ≤1h 显示秒级', () => {
  const now = Date.UTC(2026, 6, 24, 12, 0, 0);
  const net = Date.UTC(2026, 6, 24, 12, 58, 32);
  assert.equal(RT.time.formatCountdown(net, now), 'T-58m 32s');
});

RT_TESTS.register('time.formatCountdown 进入发射窗口显示提示', () => {
  const now = Date.UTC(2026, 6, 24, 12, 30, 0);
  const net = Date.UTC(2026, 6, 24, 13, 0, 0);
  const ws = Date.UTC(2026, 6, 24, 12, 0, 0);
  assert.equal(RT.time.formatCountdown(net, now, ws), '发射窗口已开启');
});

RT_TESTS.register('time.formatCountdown 已过去显示已完成', () => {
  const now = Date.UTC(2026, 6, 25, 12, 0, 0);
  const net = Date.UTC(2026, 6, 24, 12, 0, 0);
  assert.equal(RT.time.formatCountdown(net, now), '已完成');
});

RT_TESTS.register('time.formatLocal 按时区格式化', () => {
  const utc = Date.UTC(2026, 6, 24, 22, 30, 0);
  const sh = RT.time.formatLocal(utc, 'Asia/Shanghai');
  assert.truthy(sh.includes('06:30'));
  const ny = RT.time.formatLocal(utc, 'America/New_York');
  assert.truthy(ny.includes('18:30'));
});

RT_TESTS.register('time.getUpcomingStatus 推断发射状态', () => {
  const now = Date.UTC(2026, 6, 24, 12, 0, 0);
  assert.equal(RT.time.getUpcomingStatus(Date.UTC(2026, 6, 26, 14, 0, 0), now), 'go');
  assert.equal(RT.time.getUpcomingStatus(Date.UTC(2026, 6, 26, 14, 0, 0), now, Date.UTC(2026, 6, 24, 10, 0, 0)), 'window_open');
  assert.equal(RT.time.getUpcomingStatus(Date.UTC(2026, 6, 23, 12, 0, 0), now), 'done');
});
```

- [ ] **Step 2: 运行测试验证失败**

预期 `RT.time is undefined`。

- [ ] **Step 3: 实现 `js/utils/time.js`**

```js
window.RT = window.RT || {};
RT.time = {
  formatCountdown(netMs, nowMs, windowStartMs) {
    const diff = netMs - nowMs;
    if (diff <= 0) return '已完成';
    if (windowStartMs && nowMs >= windowStartMs) return '发射窗口已开启';
    if (diff < 60 * 60 * 1000) {
      const totalSec = Math.floor(diff / 1000);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return `T-${m}m ${s}s`;
    }
    const totalMin = Math.floor(diff / 60000);
    const d = Math.floor(totalMin / (60 * 24));
    const h = Math.floor((totalMin % (60 * 24)) / 60);
    const m = totalMin % 60;
    return `T-${d}d ${h}h ${m}m`;
  },

  formatLocal(ms, timezone) {
    try {
      const d = new Date(ms);
      const fmt = new Intl.DateTimeFormat('zh-CN', {
        timeZone: timezone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
      });
      return fmt.format(d).replace(/\//g, '-');
    } catch (e) {
      return new Date(ms).toISOString().slice(0, 16).replace('T', ' ');
    }
  },

  getUpcomingStatus(netMs, nowMs, windowStartMs) {
    if (netMs <= nowMs) return 'done';
    if (windowStartMs && nowMs >= windowStartMs) return 'window_open';
    return 'go';
  },

  isWithin72h(netMs, nowMs) {
    const diff = netMs - nowMs;
    return diff > 0 && diff < 72 * 60 * 60 * 1000;
  }
};
```

- [ ] **Step 4: 运行测试验证通过**

预期 21 个测试全部通过(8 cache + 7 ll2-client + 6 time)。

- [ ] **Step 5: Commit**

```bash
git add js/utils/time.js tests/time.test.js
git commit -m "feat(utils): time.js 时区与倒计时工具 + TDD"
```

---

## Task 8: 状态层 — store.js (TDD)

**Files:**
- Create: `tests/store.test.js`
- Create: `js/store.js`

- [ ] **Step 1: 写失败测试 `tests/store.test.js`**

```js
RT_TESTS.register('store 初始状态正确', () => {
  const s = RT.store.create();
  assert.equal(s.launches.length, 0);
  assert.equal(s.view, 'calendar');
  assert.equal(s.timezone, 'Asia/Shanghai');
  assert.equal(s.filters.providerIds.length, 0);
  assert.equal(s.filters.statuses.length, 2);
  assert.equal(s.filters.statuses.includes('Go'), true);
  assert.equal(s.filters.statuses.includes('In Flight'), true);
  assert.falsy(s.selectedLaunchId);
});

RT_TESTS.register('store.setLaunches 写入并去重', () => {
  const s = RT.store.create();
  s.setLaunches([
    { id: 't1', net: '2026-07-25T00:00:00Z', status: 'Go' },
    { id: 't2', net: '2026-07-26T00:00:00Z', status: 'Success' }
  ]);
  assert.equal(s.launches.length, 2);
  s.setLaunches([{ id: 't1', net: '2026-07-25T00:00:00Z', status: 'Go' }]);
  assert.equal(s.launches.length, 2);
});

RT_TESTS.register('store.filteredLaunches 按厂商筛选', () => {
  const s = RT.store.create();
  s.setLaunches([
    { id: 't1', net: '2026-07-25T00:00:00Z', status: 'Go', provider: { id: 121, name: 'SpaceX' } },
    { id: 't2', net: '2026-07-26T00:00:00Z', status: 'Go', provider: { id: 88, name: 'CASC' } }
  ]);
  s.setFilterProviderIds([121]);
  assert.equal(s.filteredLaunches.length, 1);
});

RT_TESTS.register('store.filteredLaunches 按状态筛选', () => {
  const s = RT.store.create();
  s.setLaunches([
    { id: 't1', net: '2026-07-25T00:00:00Z', status: 'Go' },
    { id: 't2', net: '2026-07-20T00:00:00Z', status: 'Success' },
    { id: 't3', net: '2026-07-26T00:00:00Z', status: 'In Flight' }
  ]);
  assert.equal(s.filteredLaunches.length, 2);
  s.setFilterStatuses(['Success']);
  assert.equal(s.filteredLaunches.length, 1);
});

RT_TESTS.register('store.toggleProvider 切换厂商选中', () => {
  const s = RT.store.create();
  s.toggleProvider(121);
  assert.equal(s.filters.providerIds.includes(121), true);
  s.toggleProvider(121);
  assert.equal(s.filters.providerIds.includes(121), false);
});

RT_TESTS.register('store.selectLaunch 设置选中发射', () => {
  const s = RT.store.create();
  s.setLaunches([{ id: 't1', net: '2026-07-25T00:00:00Z', status: 'Go' }]);
  s.selectLaunch('t1');
  assert.equal(s.selectedLaunchId, 't1');
  assert.equal(s.selectedLaunch.id, 't1');
  s.selectLaunch(null);
  assert.falsy(s.selectedLaunch);
});

RT_TESTS.register('store.setTimezone / setView 切换', () => {
  const s = RT.store.create();
  s.setTimezone('America/New_York');
  assert.equal(s.timezone, 'America/New_York');
  s.setView('list');
  assert.equal(s.view, 'list');
});

RT_TESTS.register('store.providersFromLaunches 动态提取厂商', () => {
  const s = RT.store.create();
  s.setLaunches([
    { id: 't1', net: '2026-07-25T00:00:00Z', status: 'Go', provider: { id: 121, name: 'SpaceX' } },
    { id: 't2', net: '2026-07-26T00:00:00Z', status: 'Go', provider: { id: 88, name: 'CASC' } },
    { id: 't3', net: '2026-07-27T00:00:00Z', status: 'Go', provider: { id: 121, name: 'SpaceX' } }
  ]);
  assert.equal(s.providersFromLaunches().length, 2);
});
```

- [ ] **Step 2: 运行测试验证失败**

预期 `RT.store is undefined`。

- [ ] **Step 3: 实现 `js/store.js`**

```js
window.RT = window.RT || {};
RT.store = {
  create() {
    const { reactive, computed } = Vue;
    const state = reactive({
      launches: [],
      view: 'calendar',
      timezone: 'Asia/Shanghai',
      selectedLaunchId: null,
      filters: {
        providerIds: [],
        statuses: ['Go', 'In Flight']
      },
      meta: {
        online: (typeof navigator !== 'undefined') ? navigator.onLine : true,
        lastFetchedAt: null,
        quotaRemaining: 25,
        cooldownUntil: 0,
        loading: false,
        error: null
      },
      ui: {
        calendarMonth: new Date().getMonth(),
        calendarYear: new Date().getFullYear(),
        screenWidth: (typeof window !== 'undefined') ? window.innerWidth : 1280,
        sidebarOpen: false,
        drawerFullscreen: false
      }
    });

    state.filteredLaunches = computed(() => {
      const ids = new Set(state.filters.providerIds);
      const statuses = new Set(state.filters.statuses);
      return state.launches.filter(l => {
        if (ids.size > 0 && (!l.provider || !ids.has(l.provider.id))) return false;
        if (statuses.size > 0 && !statuses.has(l.status)) return false;
        return true;
      });
    });

    state.selectedLaunch = computed(() => {
      if (!state.selectedLaunchId) return null;
      return state.launches.find(l => l.id === state.selectedLaunchId) || null;
    });

    state.setLaunches = (items) => {
      const map = new Map();
      state.launches.forEach(l => map.set(l.id, l));
      items.forEach(l => map.set(l.id, l));
      state.launches = Array.from(map.values());
      state.launches.sort((a, b) => new Date(a.net) - new Date(b.net));
    };

    state.setFilterProviderIds = (ids) => { state.filters.providerIds = ids.slice(); };
    state.setFilterStatuses = (statuses) => { state.filters.statuses = statuses.slice(); };

    state.toggleProvider = (id) => {
      const i = state.filters.providerIds.indexOf(id);
      if (i >= 0) state.filters.providerIds.splice(i, 1);
      else state.filters.providerIds.push(id);
    };

    state.toggleStatus = (status) => {
      const i = state.filters.statuses.indexOf(status);
      if (i >= 0) state.filters.statuses.splice(i, 1);
      else state.filters.statuses.push(status);
    };

    state.selectLaunch = (id) => {
      state.selectedLaunchId = id;
      state.ui.drawerOpen = !!id;
    };

    state.setTimezone = (tz) => { state.timezone = tz; };
    state.setView = (v) => { state.view = v; };

    state.providersFromLaunches = () => {
      const map = new Map();
      state.launches.forEach(l => {
        if (l.provider) map.set(l.provider.id, l.provider);
      });
      return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
    };

    // 屏幕宽度监听(窄屏检测)
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        state.ui.screenWidth = window.innerWidth;
        state.ui.drawerFullscreen = window.innerWidth < 1024;
      });
      state.ui.drawerFullscreen = window.innerWidth < 1024;
    }

    return state;
  }
};
```

- [ ] **Step 4: 运行测试验证通过**

预期 29 个测试全部通过(8 cache + 7 ll2-client + 6 time + 8 store)。

- [ ] **Step 5: Commit**

```bash
git add js/store.js tests/store.test.js
git commit -m "feat(state): store.js 响应式状态 + TDD"
```

---

## Task 9: 组件 — TopBar.js

**Files:**
- Create: `js/components/TopBar.js`
- Modify: `js/app.js`(挂载测试)

- [ ] **Step 1: 实现 TopBar 组件**

```js
window.RT = window.RT || {};
RT.TopBar = {
  name: 'TopBar',
  props: ['store'],
  emits: ['refresh'],
  template: `
    <header class="bg-slate-800 text-white px-4 py-3 flex justify-between items-center text-sm">
      <div class="flex items-center gap-4">
        <strong class="text-base">🚀 火箭发射追踪</strong>
        <div class="bg-slate-700 rounded p-1 flex gap-1">
          <button
            v-for="v in viewOptions"
            :key="v[0]"
            @click="store.setView(v[0])"
            :class="store.view === v[0] ? 'bg-blue-500' : 'text-slate-300'"
            class="px-3 py-1 rounded transition">{{ v[1] }}</button>
        </div>
        <button
          v-if="store.ui.screenWidth < 1024"
          @click="store.ui.sidebarOpen = !store.ui.sidebarOpen"
          class="bg-slate-700 px-3 py-1 rounded text-xs">⚙ 筛选</button>
      </div>
      <div class="flex items-center gap-3 text-xs">
        <select
          :value="store.timezone"
          @change="store.setTimezone($event.target.value)"
          class="bg-slate-700 px-2 py-1 rounded">
          <option v-for="tz in timezones" :key="tz.id" :value="tz.id">{{ tz.label }}</option>
        </select>
        <span :class="store.meta.online ? 'bg-emerald-500' : 'bg-slate-600'" class="px-2 py-1 rounded">
          ● {{ store.meta.online ? '在线' : '离线' }}
        </span>
        <button
          @click="$emit('refresh')"
          :disabled="isCooling"
          :class="isCooling ? 'bg-slate-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600'"
          class="px-3 py-1 rounded"
          :title="'本小时剩余 ~' + store.meta.quotaRemaining + ' 次配额'">
          {{ isCooling ? '↻ 冷却 ' + cooldownText : '↻ 刷新' }}
        </button>
      </div>
    </header>
  `,
  data() {
    return {
      timezones: [
        { id: 'UTC', label: 'UTC' },
        { id: 'Asia/Shanghai', label: '北京 UTC+8' },
        { id: 'America/New_York', label: '纽约 UTC-5' },
        { id: 'America/Cayenne', label: '库鲁 UTC-3' }
      ],
      nowMs: Date.now(),
      timer: null
    };
  },
  computed: {
    viewOptions() {
      // 窄屏隐藏「日历」选项
      return this.store.ui.screenWidth < 1024
        ? [['list','列表'],['history','历史']]
        : [['calendar','日历'],['list','列表'],['history','历史']];
    },
    isCooling() { return this.nowMs < this.store.meta.cooldownUntil; },
    cooldownText() {
      const sec = Math.ceil((this.store.meta.cooldownUntil - this.nowMs) / 1000);
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}m ${s}s`;
    }
  },
  mounted() { this.timer = setInterval(() => { this.nowMs = Date.now(); }, 1000); },
  unmounted() { if (this.timer) clearInterval(this.timer); }
};
```

- [ ] **Step 2: 临时挂载验证**

修改 `js/app.js`:

```js
window.RT = window.RT || {};
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Vue === 'undefined') return;
  const store = RT.store.create();
  const app = Vue.createApp({
    setup() { return { store }; },
    template: `<top-bar :store="store" @refresh="onRefresh" />`,
    methods: {
      onRefresh() {
        console.log('[RT] refresh clicked');
        store.meta.cooldownUntil = Date.now() + 5 * 60 * 1000;
      }
    }
  });
  app.component('top-bar', RT.TopBar);
  app.mount('#app');
  RT._store = store;
});
```

- [ ] **Step 3: 验证**

双击 `index.html`。预期:顶部条含视图切换、时区下拉(默认北京)、在线状态、刷新按钮。点击刷新,按钮变「↻ 冷却 4m 59s」并递减。

- [ ] **Step 4: Commit**

```bash
git add js/components/TopBar.js js/app.js
git commit -m "feat(component): TopBar 视图切换/时区/刷新冷却"
```

---

## Task 10: 组件 — FilterSidebar.js

**Files:**
- Create: `js/components/FilterSidebar.js`
- Modify: `js/app.js`

- [ ] **Step 1: 实现 FilterSidebar**

```js
window.RT = window.RT || {};
RT.FilterSidebar = {
  name: 'FilterSidebar',
  props: ['store'],
  template: `
    <aside class="bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto" style="width: 220px;">
      <div class="text-xs text-slate-500 uppercase tracking-wide mb-2">厂商筛选</div>
      <input v-model="search" placeholder="搜索厂商..."
        class="w-full mb-3 px-2 py-1 text-xs border border-slate-200 rounded">
      <div class="bg-white border border-slate-200 rounded p-2 text-xs">
        <div v-for="group in providerGroups" :key="group.country">
          <div class="font-semibold text-slate-700 mt-2 mb-1">{{ group.name_zh }}</div>
          <div v-for="p in group.providers" :key="p.id"
            @click="store.toggleProvider(p.id)"
            class="cursor-pointer py-0.5 flex items-center gap-1">
            <span :style="{ color: getProviderColor(p.id) }">{{ isProviderChecked(p.id) ? '☑' : '☐' }}</span>
            <span>{{ getProviderName(p.id) }}</span>
            <span class="text-slate-400 ml-auto">({{ countByProvider(p.id) }})</span>
          </div>
        </div>
        <div v-if="otherProviders.length > 0">
          <div class="font-semibold text-slate-700 mt-2 mb-1">其他</div>
          <div v-for="p in otherProviders" :key="p.id"
            @click="store.toggleProvider(p.id)"
            class="cursor-pointer py-0.5 flex items-center gap-1">
            <span :style="{ color: getProviderColor(p.id) }">{{ isProviderChecked(p.id) ? '☑' : '☐' }}</span>
            <span>{{ p.name }}</span>
          </div>
        </div>
      </div>

      <div class="text-xs text-slate-500 uppercase tracking-wide mt-4 mb-2">状态</div>
      <div class="bg-white border border-slate-200 rounded p-2 text-xs">
        <div v-for="s in statusOptions" :key="s.value"
          @click="store.toggleStatus(s.value)"
          class="cursor-pointer py-0.5 flex items-center gap-1">
          <span>{{ isStatusChecked(s.value) ? '☑' : '☐' }}</span>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </aside>
  `,
  data() {
    return {
      search: '',
      statusOptions: [
        { value: 'TBD', label: '计划中' },
        { value: 'Go', label: '倒计时' },
        { value: 'In Flight', label: '发射中' },
        { value: 'Success', label: '已完成' },
        { value: 'Failure', label: '失败' },
        { value: 'Partial Failure', label: '部分失败' },
        { value: 'Hold', label: '暂停' }
      ]
    };
  },
  computed: {
    allProviders() {
      const list = this.store.providersFromLaunches();
      if (!this.search) return list;
      const s = this.search.toLowerCase();
      return list.filter(p => p.name.toLowerCase().includes(s));
    },
    providerGroups() {
      const groups = {};
      this.allProviders.forEach(p => {
        const preset = RT.PRESET_MANUFACTURERS.find(m => m.name === p.name);
        const country = preset ? preset.country : 'Unknown';
        if (!groups[country]) groups[country] = { country, name_zh: this.countryNameZh(country), providers: [] };
        groups[country].providers.push(p);
      });
      const order = ['USA', 'China', 'Europe', 'Russia', 'Unknown'];
      return order.map(c => groups[c]).filter(g => g && g.providers.length > 0);
    },
    otherProviders() {
      return this.allProviders.filter(p => !RT.PRESET_MANUFACTURERS.find(m => m.name === p.name));
    }
  },
  methods: {
    countryNameZh(code) {
      return { USA: '美国', China: '中国', Europe: '欧洲', Russia: '俄罗斯', Unknown: '其他' }[code] || code;
    },
    isProviderChecked(id) { return this.store.filters.providerIds.includes(id); },
    isStatusChecked(s) { return this.store.filters.statuses.includes(s); },
    getProviderColor(id) {
      const p = this.allProviders.find(x => x.id === id);
      const preset = p ? RT.PRESET_MANUFACTURERS.find(m => m.name === p.name) : null;
      return preset ? preset.color : '#94a3b8';
    },
    getProviderName(id) {
      const p = this.allProviders.find(x => x.id === id);
      if (!p) return '未知';
      const preset = RT.PRESET_MANUFACTURERS.find(m => m.name === p.name);
      return preset ? preset.name_zh : p.name;
    },
    countByProvider(id) {
      return this.store.launches.filter(l => l.provider && l.provider.id === id).length;
    }
  }
};
```

- [ ] **Step 2: 临时挂载 + 注入测试数据**

修改 `js/app.js`,在 `RT.store.create()` 后加入:

```js
store.setLaunches([
  { id: 't1', net: '2026-07-25T00:00:00Z', status: 'Go', provider: { id: 121, name: 'SpaceX' } },
  { id: 't2', net: '2026-07-26T00:00:00Z', status: 'Go', provider: { id: 88, name: 'CASC' } },
  { id: 't3', net: '2026-07-27T00:00:00Z', status: 'In Flight', provider: { id: 154, name: 'LandSpace' } }
]);
```

模板改为:

```html
<div class="flex flex-col h-screen">
  <top-bar :store="store" @refresh="()=>{}" />
  <div class="flex flex-1 overflow-hidden">
    <filter-sidebar :store="store" />
    <main class="flex-1 p-4">主区域占位</main>
  </div>
</div>
```

注册 `app.component('filter-sidebar', RT.FilterSidebar);`。

- [ ] **Step 3: 验证**

预期:左侧栏显示厂商分组(SpaceX 在美国、CASC/蓝箭在中国),每项右侧显示发射数。状态 checkbox 默认勾选「倒计时」「发射中」。

- [ ] **Step 4: Commit**

```bash
git add js/components/FilterSidebar.js js/app.js
git commit -m "feat(component): FilterSidebar 厂商+状态筛选"
```

---

## Task 11: 组件 — CalendarView.js

**Files:**
- Create: `js/components/CalendarView.js`
- Modify: `js/app.js`

- [ ] **Step 1: 实现 CalendarView**

```js
window.RT = window.RT || {};
RT.CalendarView = {
  name: 'CalendarView',
  props: ['store'],
  template: `
    <div class="p-4 bg-white h-full overflow-y-auto">
      <div class="flex justify-between items-center mb-3">
        <div class="font-semibold text-sm">{{ year }} 年 {{ month + 1 }} 月</div>
        <div class="text-xs flex gap-1">
          <button @click="prevMonth" class="bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">‹</button>
          <button @click="goToday" class="bg-slate-100 px-3 py-1 rounded hover:bg-slate-200">今日</button>
          <button @click="nextMonth" class="bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">›</button>
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1 mb-1 text-xs text-slate-400 text-center">
        <div v-for="d in ['一','二','三','四','五','六','日']" :key="d">{{ d }}</div>
      </div>
      <div class="grid grid-cols-7 gap-1 text-xs">
        <div v-for="cell in calendarCells" :key="cell.key"
          @click="cell.inMonth && selectDay(cell.day)"
          :class="cellClass(cell)"
          class="aspect-square p-1 border cursor-pointer relative">
          <div :class="cell.inMonth ? '' : 'text-slate-300'">{{ cell.day }}</div>
          <div v-for="l in launchesOfDay(cell)" :key="l.id"
            @click.stop="store.selectLaunch(l.id)"
            :style="{ background: providerColor(l) }"
            class="text-white text-[8px] px-1 py-0.5 rounded mt-0.5 truncate">
            {{ shortName(l) }}
          </div>
          <div v-if="extraCount(cell) > 0" class="absolute bottom-0 right-0 text-[8px] text-slate-500">+{{ extraCount(cell) }}</div>
        </div>
      </div>
      <div class="flex gap-3 mt-4 text-[10px] text-slate-600 flex-wrap">
        <span v-for="l in legend" :key="l.name">
          <span :style="{ display: 'inline-block', width: '8px', height: '8px', background: l.color, borderRadius: '2px', marginRight: '4px' }"></span>{{ l.name }}
        </span>
      </div>
    </div>
  `,
  computed: {
    year() { return this.store.ui.calendarYear; },
    month() { return this.store.ui.calendarMonth; },
    calendarCells() {
      const y = this.year, m = this.month;
      const firstDay = new Date(y, m, 1);
      const offset = (firstDay.getDay() + 6) % 7;
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const prevMonthDays = new Date(y, m, 0).getDate();
      const cells = [];
      for (let i = offset - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, inMonth: false, key: `prev-${i}` });
      for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, inMonth: true, key: `cur-${d}` });
      let nextDay = 1;
      while (cells.length < 42) cells.push({ day: nextDay++, inMonth: false, key: `next-${nextDay}` });
      return cells;
    },
    legend() {
      const used = new Set();
      const list = [];
      this.store.filteredLaunches.forEach(l => {
        const preset = this.findPreset(l);
        if (preset && !used.has(preset.name)) {
          used.add(preset.name);
          list.push({ name: preset.name_zh, color: preset.color });
        }
      });
      return list;
    }
  },
  methods: {
    cellClass(cell) {
      if (!cell.inMonth) return 'bg-slate-50';
      const today = new Date();
      const isToday = cell.day === today.getDate() && this.month === today.getMonth() && this.year === today.getFullYear();
      const launches = this.launchesOfDay(cell);
      const isUpcoming72h = launches.some(l => RT.time.isWithin72h(new Date(l.net).getTime(), Date.now()));
      return [
        isToday ? 'bg-blue-100 border-blue-500 border-2 font-semibold' : 'bg-slate-50 border-slate-200',
        isUpcoming72h && !isToday ? 'bg-amber-50 border-amber-400 border-2' : ''
      ].join(' ');
    },
    launchesOfDay(cell) {
      if (!cell.inMonth) return [];
      const y = this.year, m = this.month, d = cell.day;
      return this.store.filteredLaunches.filter(l => {
        const dt = new Date(l.net);
        const local = RT.time.formatLocal(dt.getTime(), this.store.timezone);
        const [datePart] = local.split(' ');
        const [yy, mm, dd] = datePart.split('-').map(Number);
        return yy === y && mm === m + 1 && dd === d;
      });
    },
    extraCount(cell) { return Math.max(0, this.launchesOfDay(cell).length - 2); },
    shortName(l) {
      const parts = l.name.split(' · ');
      return parts.length > 1 ? `${parts[0]} · ${parts[1]}` : l.name;
    },
    providerColor(l) { const p = this.findPreset(l); return p ? p.color : '#94a3b8'; },
    findPreset(l) {
      if (!l.provider) return null;
      return RT.PRESET_MANUFACTURERS.find(m => m.name === l.provider.name);
    },
    selectDay(day) {
      const list = this.launchesOfDay({ day, inMonth: true });
      if (list.length > 0) this.store.selectLaunch(list[0].id);
    },
    prevMonth() {
      let m = this.month - 1, y = this.year;
      if (m < 0) { m = 11; y--; }
      this.store.ui.calendarMonth = m; this.store.ui.calendarYear = y;
    },
    nextMonth() {
      let m = this.month + 1, y = this.year;
      if (m > 11) { m = 0; y++; }
      this.store.ui.calendarMonth = m; this.store.ui.calendarYear = y;
    },
    goToday() {
      const d = new Date();
      this.store.ui.calendarYear = d.getFullYear();
      this.store.ui.calendarMonth = d.getMonth();
    }
  }
};
```

- [ ] **Step 2: 修改 `js/app.js` 挂载 CalendarView**

注入覆盖本月不同日期的测试数据,模板主区改为 `<calendar-view :store="store" />`,注册 `app.component('calendar-view', RT.CalendarView)`。

- [ ] **Step 3: 验证**

预期:月历显示,今日蓝色边框,72h 内琥珀色边框,发射以厂商色块显示。点击发射块选中,点击月份切换按钮可翻月。

- [ ] **Step 4: Commit**

```bash
git add js/components/CalendarView.js js/app.js
git commit -m "feat(component): CalendarView 月历视图"
```

---

## Task 12: 组件 — ListView.js

**Files:**
- Create: `js/components/ListView.js`
- Modify: `js/app.js`

- [ ] **Step 1: 实现 ListView**

```js
window.RT = window.RT || {};
RT.ListView = {
  name: 'ListView',
  props: ['store'],
  template: `
    <div class="p-4 bg-white h-full overflow-y-auto">
      <div class="text-xs text-slate-500 mb-3">
        共 {{ filtered.length }} 条发射 · 数据覆盖至 {{ coverageDate }}
      </div>
      <table class="w-full text-xs">
        <thead class="sticky top-0 bg-white">
          <tr class="border-b border-slate-200 text-slate-600">
            <th class="text-left py-2 cursor-pointer" @click="sortBy('net')">日期</th>
            <th class="text-left py-2">倒计时/结果</th>
            <th class="text-left py-2 cursor-pointer" @click="sortBy('rocket')">火箭</th>
            <th class="text-left py-2">厂商</th>
            <th class="text-left py-2">发射场</th>
            <th class="text-left py-2">载荷</th>
            <th class="text-left py-2">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in sorted" :key="l.id"
            @click="store.selectLaunch(l.id)"
            :class="store.selectedLaunchId === l.id ? 'bg-blue-50' : 'hover:bg-slate-50'"
            class="cursor-pointer border-b border-slate-100">
            <td class="py-2">{{ formatTime(l.net) }}</td>
            <td class="py-2">{{ countdownOrResult(l) }}</td>
            <td class="py-2">{{ l.rocket_config ? l.rocket_config.name : '—' }}</td>
            <td class="py-2"><span :style="{ color: providerColor(l) }">●</span> {{ providerName(l) }}</td>
            <td class="py-2">{{ l.pad ? l.pad.name : '—' }}</td>
            <td class="py-2">{{ l.mission ? l.mission.name : '—' }}</td>
            <td class="py-2">{{ statusBadge(l.status) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  data() { return { sortKey: 'net', sortAsc: true }; },
  computed: {
    filtered() { return this.store.filteredLaunches; },
    sorted() {
      const list = this.filtered.slice();
      const key = this.sortKey;
      const dir = this.sortAsc ? 1 : -1;
      list.sort((a, b) => {
        let va, vb;
        if (key === 'net') { va = new Date(a.net).getTime(); vb = new Date(b.net).getTime(); }
        else { va = a.rocket_config ? a.rocket_config.name : ''; vb = b.rocket_config ? b.rocket_config.name : ''; }
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });
      return list;
    },
    coverageDate() {
      if (this.filtered.length === 0) return '—';
      const last = this.filtered[this.filtered.length - 1];
      return RT.time.formatLocal(new Date(last.net).getTime(), this.store.timezone);
    }
  },
  methods: {
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else { this.sortKey = key; this.sortAsc = true; }
    },
    formatTime(iso) { return RT.time.formatLocal(new Date(iso).getTime(), this.store.timezone); },
    countdownOrResult(l) {
      const net = new Date(l.net).getTime();
      const now = Date.now();
      if (l.status === 'Success') return '✓ 成功';
      if (l.status === 'Failure') return '✗ 失败';
      if (l.status === 'Partial Failure') return '▲ 部分失败';
      if (l.status === 'In Flight') return '🔴 发射中';
      if (l.status === 'Hold') return '⏸ 暂停';
      if (net > now) {
        const ws = l.window_start ? new Date(l.window_start).getTime() : null;
        return RT.time.formatCountdown(net, now, ws);
      }
      return '— 待确认';
    },
    providerColor(l) {
      const p = l.provider ? RT.PRESET_MANUFACTURERS.find(m => m.name === l.provider.name) : null;
      return p ? p.color : '#94a3b8';
    },
    providerName(l) {
      if (!l.provider) return '—';
      const p = RT.PRESET_MANUFACTURERS.find(m => m.name === l.provider.name);
      return p ? p.name_zh : l.provider.name;
    },
    statusBadge(s) {
      const map = { 'Go':'🟢 Go','TBD':'🟡 TBD','Hold':'⏸ Hold','In Flight':'🔴 In Flight','Success':'✓ Success','Failure':'✗ Failure','Partial Failure':'▲ Partial' };
      return map[s] || s;
    }
  }
};
```

- [ ] **Step 2: 修改 `js/app.js` 主区根据 view 切换**

```html
<main class="flex-1 overflow-hidden">
  <calendar-view v-if="store.view === 'calendar'" :store="store" />
  <list-view v-else-if="store.view === 'list'" :store="store" />
</main>
```

注册 `app.component('list-view', RT.ListView)`。

- [ ] **Step 3: 验证**

切换到列表视图。预期:表格显示数据,列头可排序,行点击选中发射。

- [ ] **Step 4: Commit**

```bash
git add js/components/ListView.js js/app.js
git commit -m "feat(component): ListView 列表视图"
```

---

## Task 13: 组件 — HistoryView.js

**Files:**
- Create: `js/components/HistoryView.js`
- Modify: `js/app.js`

- [ ] **Step 1: 实现 HistoryView**

```js
window.RT = window.RT || {};
RT.HistoryView = {
  name: 'HistoryView',
  props: ['store'],
  template: `
    <div class="p-4 bg-white h-full overflow-y-auto">
      <div class="text-xs text-slate-500 mb-3 p-3 bg-slate-50 rounded">
        共 {{ historyList.length }} 次 · 成功 {{ successCount }} · 失败 {{ failureCount }} · 成功率 {{ successRate }}%
      </div>
      <table class="w-full text-xs">
        <thead class="sticky top-0 bg-white">
          <tr class="border-b border-slate-200 text-slate-600">
            <th class="text-left py-2">日期</th>
            <th class="text-left py-2">火箭</th>
            <th class="text-left py-2">厂商</th>
            <th class="text-left py-2">载荷</th>
            <th class="text-left py-2">结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in historyList" :key="l.id"
            @click="store.selectLaunch(l.id)"
            class="cursor-pointer hover:bg-slate-50 border-b border-slate-100">
            <td class="py-2">{{ formatTime(l.net) }}</td>
            <td class="py-2">{{ l.rocket_config ? l.rocket_config.name : '—' }}</td>
            <td class="py-2"><span :style="{ color: providerColor(l) }">●</span> {{ providerName(l) }}</td>
            <td class="py-2">{{ l.mission ? l.mission.name : '—' }}</td>
            <td class="py-2">{{ resultBadge(l.status) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  computed: {
    historyList() {
      const now = Date.now();
      return this.store.filteredLaunches.filter(l => new Date(l.net).getTime() < now);
    },
    successCount() { return this.historyList.filter(l => l.status === 'Success').length; },
    failureCount() { return this.historyList.filter(l => l.status === 'Failure' || l.status === 'Partial Failure').length; },
    successRate() {
      if (this.historyList.length === 0) return 0;
      return Math.round((this.successCount / this.historyList.length) * 100);
    }
  },
  methods: {
    formatTime(iso) { return RT.time.formatLocal(new Date(iso).getTime(), this.store.timezone); },
    providerColor(l) {
      const p = l.provider ? RT.PRESET_MANUFACTURERS.find(m => m.name === l.provider.name) : null;
      return p ? p.color : '#94a3b8';
    },
    providerName(l) {
      if (!l.provider) return '—';
      const p = RT.PRESET_MANUFACTURERS.find(m => m.name === l.provider.name);
      return p ? p.name_zh : l.provider.name;
    },
    resultBadge(s) {
      const map = { 'Success':'✓ 成功','Failure':'✗ 失败','Partial Failure':'▲ 部分失败','In Flight':'🔴 进行中' };
      return map[s] || '— 待确认';
    }
  }
};
```

- [ ] **Step 2: 修改 `js/app.js` 加入历史分支**

```html
<history-view v-else :store="store" />
```

注册 `app.component('history-view', RT.HistoryView)`。

- [ ] **Step 3: 验证**

Console 注入历史数据:

```js
RT._store.setLaunches([
  { id: 'h1', name: 'Falcon 9 · Old', net: '2026-06-01T00:00:00Z', status: 'Success', provider: { id: 121, name: 'SpaceX' }, rocket_config: { id: 164, name: 'Falcon 9 Block 5' } },
  { id: 'h2', name: 'CZ-3B · Fail', net: '2026-06-15T00:00:00Z', status: 'Failure', provider: { id: 88, name: 'CASC' } }
]);
```

切换到「历史」视图。预期:汇总「共 2 次 · 成功 1 · 失败 1 · 成功率 50%」+ 表格 2 行。

- [ ] **Step 4: Commit**

```bash
git add js/components/HistoryView.js js/app.js
git commit -m "feat(component): HistoryView 历史视图+汇总"
```

---

## Task 14: 组件 — DetailDrawer.js

**Files:**
- Create: `js/components/DetailDrawer.js`
- Modify: `js/app.js`

- [ ] **Step 1: 实现 DetailDrawer**

```js
window.RT = window.RT || {};
RT.DetailDrawer = {
  name: 'DetailDrawer',
  props: { store: Object, fullscreen: { default: false } },
  template: `
    <aside
      v-if="store.ui.drawerOpen"
      :class="fullscreen ? 'w-full bg-amber-50' : 'bg-amber-50 border-l border-amber-400'"
      class="p-4 overflow-y-auto"
      :style="fullscreen ? {} : { width: '340px' }">
      <div class="flex justify-between items-center mb-3">
        <div class="text-[10px] text-amber-700 uppercase tracking-wide">发射详情</div>
        <span class="text-amber-700 cursor-pointer" @click="store.selectLaunch(null)">✕</span>
      </div>
      <div v-if="!launch" class="text-slate-400 text-sm">未选中发射</div>
      <div v-else>
        <div class="bg-white border border-amber-200 rounded p-3 mb-3">
          <div class="font-semibold text-sm">{{ launch.name }}</div>
          <div class="text-slate-500 text-xs mt-1">{{ providerName(launch) }} · {{ formatTime(launch.net) }}</div>
          <div class="bg-slate-100 px-2 py-1 rounded mt-2 text-xs">
            <strong :class="statusClass(launch)">{{ statusText(launch) }}</strong>
          </div>
        </div>
        <div class="text-[10px] text-amber-700 uppercase tracking-wide mb-1">发射场</div>
        <div class="bg-white border border-amber-200 rounded p-2 text-xs mb-3">
          <div>{{ launch.pad ? launch.pad.name : '—' }}</div>
          <div class="text-slate-500">{{ launch.pad ? launch.pad.location : '—' }}</div>
        </div>
        <div class="text-[10px] text-amber-700 uppercase tracking-wide mb-1">火箭规格</div>
        <div class="bg-white border border-amber-200 rounded p-2 text-xs mb-1">
          <div v-if="spec">
            <div class="flex justify-between py-0.5"><span class="text-slate-500">级数</span><span>{{ spec.stages }}{{ spec.boosters ? ' + ' + spec.boosters + ' 助推' : '' }}</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">高度</span><span>{{ spec.height_m }} m</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">直径</span><span>{{ spec.diameter_m }} m</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">起飞质量</span><span>{{ spec.liftoff_mass_t }} t</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">LEO 运力</span><span>{{ spec.leo_kg.toLocaleString() }} kg</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">GTO 运力</span><span>{{ spec.gto_kg ? spec.gto_kg.toLocaleString() + ' kg' : '—' }}</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">起飞推力</span><span>{{ spec.thrust_kn.toLocaleString() }} kN</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">发动机</span><span>{{ spec.engines }}</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">首飞</span><span>{{ spec.first_flight }}</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">总发射</span><span>{{ spec.total_flights }} 次</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">成功率</span><span>{{ Math.round(spec.success_rate * 100) }}%</span></div>
          </div>
          <div v-else class="text-slate-400">规格数据待补充,欢迎补充到 <code>rocket-specs.js</code></div>
        </div>
        <div v-if="spec" class="text-[10px] text-slate-400 mb-3">规格数据更新于 {{ RT.ROCKET_SPECS_UPDATED.slice(0, 7) }}</div>
        <div class="text-[10px] text-amber-700 uppercase tracking-wide mb-1">载荷</div>
        <div class="bg-white border border-amber-200 rounded p-2 text-xs mb-3">
          <div v-if="launch.mission">
            <div class="font-semibold">{{ launch.mission.name }}</div>
            <div class="text-slate-500 mt-1">类型: {{ launch.mission.type || '—' }}</div>
            <div class="text-slate-500">轨道: {{ launch.mission.orbit || '—' }}</div>
            <div class="text-slate-500">质量: {{ launch.mission.payload_mass_kg ? launch.mission.payload_mass_kg + ' kg' : '—' }}</div>
          </div>
          <div v-else class="text-slate-400">—</div>
        </div>
        <div class="text-[10px] text-amber-700 uppercase tracking-wide mb-1">该型号历史</div>
        <div class="bg-white border border-amber-200 rounded p-2 text-xs">
          <div v-if="modelHistory.length === 0" class="text-slate-400">缓存范围内共 0 次</div>
          <div v-else>
            <div v-for="h in modelHistory.slice(0, 5)" :key="h.id" class="flex justify-between py-0.5">
              <span class="truncate mr-2">{{ h.name }}</span>
              <span :class="resultClass(h.status)">{{ resultText(h.status) }}</span>
            </div>
            <div class="mt-1 pt-1 border-t border-dashed border-amber-200 text-slate-500">
              缓存范围内共 {{ modelHistory.length }} 次 · 成功率 {{ modelSuccessRate }}%
            </div>
          </div>
        </div>
      </div>
    </aside>
  `,
  computed: {
    launch() { return this.store.selectedLaunch; },
    spec() {
      if (!this.launch || !this.launch.rocket_config) return null;
      return RT.getRocketSpec(this.launch.rocket_config.id, this.launch.rocket_config.name);
    },
    modelHistory() {
      if (!this.launch || !this.launch.rocket_config) return [];
      const name = this.launch.rocket_config.name;
      return this.store.launches.filter(l => l.rocket_config && l.rocket_config.name === name);
    },
    modelSuccessRate() {
      if (this.modelHistory.length === 0) return 0;
      const s = this.modelHistory.filter(l => l.status === 'Success').length;
      return Math.round((s / this.modelHistory.length) * 100);
    }
  },
  methods: {
    formatTime(iso) { return RT.time.formatLocal(new Date(iso).getTime(), this.store.timezone); },
    providerName(l) {
      if (!l.provider) return '—';
      const p = RT.PRESET_MANUFACTURERS.find(m => m.name === l.provider.name);
      return p ? p.name_zh : l.provider.name;
    },
    statusText(l) {
      const net = new Date(l.net).getTime();
      const now = Date.now();
      if (l.status === 'In Flight') return '🔴 发射进行中';
      if (l.status === 'Success') return '✓ 发射成功';
      if (l.status === 'Failure') return '✗ 发射失败';
      if (l.status === 'Partial Failure') return '▲ 部分失败';
      if (l.status === 'Hold') return '⏸ 发射暂停';
      if (net > now) {
        const ws = l.window_start ? new Date(l.window_start).getTime() : null;
        return RT.time.formatCountdown(net, now, ws);
      }
      return '— 待确认';
    },
    statusClass(l) {
      if (l.status === 'Success') return 'text-emerald-600';
      if (l.status === 'Failure' || l.status === 'Partial Failure' || l.status === 'In Flight') return 'text-red-600';
      if (l.status === 'Hold') return 'text-amber-700';
      return 'text-amber-600';
    },
    resultClass(s) {
      if (s === 'Success') return 'text-emerald-600';
      if (s === 'Failure' || s === 'Partial Failure') return 'text-red-600';
      return 'text-slate-500';
    },
    resultText(s) {
      const map = { 'Success':'✓ 成功','Failure':'✗ 失败','Partial Failure':'▲ 部分失败','In Flight':'🔴 进行中','Go':'⏳ 待发射' };
      return map[s] || '—';
    }
  }
};
```

- [ ] **Step 2: 修改 `js/app.js` 加入 DetailDrawer**

主模板加入 `<detail-drawer :store="store" />`,注册 `app.component('detail-drawer', RT.DetailDrawer)`。

- [ ] **Step 3: 验证**

Console 执行 `RT._store.selectLaunch('t1')`(假设 t1 是 SpaceX Falcon 9)。预期:右栏展开,显示倒计时、发射场、Falcon 9 完整规格表、载荷信息、型号历史。

- [ ] **Step 4: Commit**

```bash
git add js/components/DetailDrawer.js js/app.js
git commit -m "feat(component): DetailDrawer 详情抽屉+火箭规格+历史"
```

---

## Task 15: 组件 — MainPanel.js + app.js 完整集成

**Files:**
- Create: `js/components/MainPanel.js`
- Modify: `js/app.js`

- [ ] **Step 1: 实现 MainPanel**

```js
window.RT = window.RT || {};
RT.MainPanel = {
  name: 'MainPanel',
  props: ['store'],
  template: `
    <main class="flex-1 overflow-hidden">
      <calendar-view v-if="store.view === 'calendar'" :store="store" />
      <list-view v-else-if="store.view === 'list'" :store="store" />
      <history-view v-else :store="store" />
    </main>
  `
};
```

- [ ] **Step 2: 实现 app.js 完整集成版(包含数据加载/刷新/离线监听)**

```js
window.RT = window.RT || {};
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Vue === 'undefined') return;
  const store = RT.store.create();
  RT._store = store;

  async function loadData(force = false) {
    if (!force) {
      const cached = RT.cache.load();
      if (cached && cached.launches) {
        store.setLaunches(cached.launches);
        store.meta.lastFetchedAt = cached.fetched_at;
      }
    }
    if (!force && RT.cache.isFresh()) return;
    if (Date.now() < store.meta.cooldownUntil) return;

    store.meta.loading = true;
    store.meta.error = null;
    try {
      const [upcoming, previous] = await Promise.all([
        RT.ll2Client.fetchUpcoming(),
        RT.ll2Client.fetchPrevious()
      ]);
      RT.cache.incrementQuota(2);
      store.meta.quotaRemaining = RT.cache.getQuotaRemaining(25);
      const all = upcoming.concat(previous);
      const filtered = RT.ll2Client.filterByDateRange(all, Date.now(), 30, 90);
      store.setLaunches(filtered);
      RT.cache.save({ launches: filtered, fetched_at: Date.now(), source: 'll2' });
      store.meta.lastFetchedAt = Date.now();
      store.meta.cooldownUntil = Date.now() + 5 * 60 * 1000;
    } catch (e) {
      store.meta.error = e;
      if (e.name === 'RateLimitError') store.meta.error = new Error('LL2 限速中,使用缓存数据');
      else if (e.name === 'FetchError') store.meta.online = false;
    } finally {
      store.meta.loading = false;
    }
  }

  function onRefresh() { loadData(true); }
  RT.refresh = loadData;

  window.addEventListener('online', () => { store.meta.online = true; });
  window.addEventListener('offline', () => { store.meta.online = false; });

  loadData();
  setInterval(() => loadData(), 60 * 60 * 1000);

  const app = Vue.createApp({
    setup() { return { store }; },
    template: `
      <div class="flex flex-col h-screen">
        <top-bar :store="store" @refresh="onRefresh" />
        <div class="flex flex-1 overflow-hidden relative">
          <filter-sidebar v-if="store.ui.screenWidth >= 1024" :store="store" />
          <teleport to="body" v-else>
            <div v-if="store.ui.sidebarOpen" class="fixed inset-0 bg-black bg-opacity-50 z-40" @click="store.ui.sidebarOpen = false">
              <div class="absolute left-0 top-0 bottom-0" @click.stop><filter-sidebar :store="store" /></div>
            </div>
          </teleport>
          <main-panel :store="store" />
          <detail-drawer v-if="store.ui.screenWidth >= 1024 && !store.ui.drawerFullscreen" :store="store" />
          <teleport to="body" v-else>
            <div v-if="store.ui.drawerOpen" class="fixed inset-0 bg-white z-50 overflow-y-auto">
              <detail-drawer :store="store" :fullscreen="true" />
            </div>
          </teleport>
        </div>
        <div v-if="store.meta.loading" class="fixed top-16 right-4 bg-blue-500 text-white px-3 py-1 rounded text-xs">⏳ 加载中...</div>
        <div v-if="store.meta.error && !store.meta.online" class="fixed top-16 right-4 bg-red-500 text-white px-3 py-1 rounded text-xs">⚠ 离线 · 最后同步 {{ formatTime(store.meta.lastFetchedAt) }}</div>
        <div v-else-if="store.meta.error" class="fixed top-16 right-4 bg-amber-500 text-white px-3 py-1 rounded text-xs">⏸ {{ store.meta.error.message }}</div>
      </div>
    `,
    methods: {
      onRefresh,
      formatTime(ts) { return ts ? RT.time.formatLocal(ts, this.store.timezone) : '从未'; }
    }
  });

  app.component('top-bar', RT.TopBar);
  app.component('filter-sidebar', RT.FilterSidebar);
  app.component('main-panel', RT.MainPanel);
  app.component('calendar-view', RT.CalendarView);
  app.component('list-view', RT.ListView);
  app.component('history-view', RT.HistoryView);
  app.component('detail-drawer', RT.DetailDrawer);
  app.mount('#app');
});
```

- [ ] **Step 3: 验证**

清空 localStorage,刷新 `index.html`。预期:
- 右上角短暂「⏳ 加载中...」
- API 成功后真实 LL2 数据填充各视图
- 点击刷新触发冷却,按钮变「↻ 冷却 4m 59s」
- Network 面板可见两次 `ll.thespacedevs.com` 请求

DevTools Network → Offline,刷新。预期:红色「⚠ 离线 · 最后同步 [时间]」,数据仍可浏览。

- [ ] **Step 4: Commit**

```bash
git add js/components/MainPanel.js js/app.js
git commit -m "feat(app): 完整集成 + 数据加载 + 离线模式 + 响应式布局"
```

---

## Task 16: 厂商 ID 核对与 manufacturers.js 完善

**Files:** Modify: `js/data/manufacturers.js`

- [ ] **Step 1: 从 LL2 响应提取实际厂商 ID**

打开 `index.html` 确保数据已加载。DevTools Console 执行:

```js
RT._store.launches
  .map(l => ({ id: l.provider.id, name: l.provider.name }))
  .filter((v, i, a) => a.findIndex(x => x.id === v.id) === i)
  .sort((a, b) => a.name.localeCompare(b.name))
```

记录 SpaceX / CASC / CASIC / LandSpace / iSpace / Galactic Energy / Orienspace / Rocket Lab / ULA / Blue Origin / ArianeGroup / Roscosmos 的真实 ID。

- [ ] **Step 2: 用真实 ID 填充 `RT.MANUFACTURERS`**

修改 `js/data/manufacturers.js` 顶部 `RT.MANUFACTURERS = {}` 改为:

```js
RT.MANUFACTURERS = {
  [实际ID]: { name: 'SpaceX',          name_zh: 'SpaceX',          country: 'USA',     color: '#3b82f6' },
  [实际ID]: { name: 'CASC',            name_zh: '中国航天科技集团', country: 'China',   color: '#dc2626' },
  // ... 其余 10 个厂商,按实际 ID 填入
};
```

- [ ] **Step 3: 验证**

刷新页面。预期:左栏「厂商筛选」按国家分组,预置厂商显示正确中文名与彩色 checkbox,LL2 中其他厂商归入「其他」组(灰色)。

- [ ] **Step 4: Commit**

```bash
git add js/data/manufacturers.js
git commit -m "fix(data): 厂商 ID 与 LL2 实际响应核对"
```

---

## Task 17: 端到端验收测试

**Files:** 无(仅验证)

- [ ] **Step 1: 测试运行器全绿**

打开 `tests/tests.html`,确认 29 个测试全部通过。

- [ ] **Step 2: 启动流程**

`localStorage.clear()` 后刷新 `index.html`。预期:加载提示 → API 数据填充 → localStorage 写入。

- [ ] **Step 3: 缓存秒开**

刷新(不清缓存)。预期:立即显示缓存数据,Console 输出「cache fresh, skip API call」。

- [ ] **Step 4: 日历视图**

当月发射以彩色块显示;今日单元格蓝色边框;72h 内发射琥珀色边框;点击日期/发射块选中;月份切换正常。

- [ ] **Step 5: 列表视图**

切换到列表。表格列:日期 / 倒计时 / 火箭 / 厂商 / 发射场 / 载荷 / 状态。倒计时格式正确(>1h `T-Xd Yh Zm`,≤1h `T-Xm Ys`)。已成功显示「✓ 成功」,失败显示「✗ 失败」。点击表头可排序。

- [ ] **Step 6: 历史视图**

切换到历史。顶部汇总正确,表格仅显示已结束发射。

- [ ] **Step 7: 筛选**

勾选/取消厂商,日历与列表同步更新。勾选/取消状态,数据筛选生效。搜索框输入厂商名,列表过滤。

- [ ] **Step 8: 详情抽屉**

选中任意发射,右栏展开。标题区、发射场、火箭规格表、载荷、型号历史均正确显示。点击 ✕ 关闭。

- [ ] **Step 9: 时区切换**

切换为 UTC / 纽约 / 库鲁,所有时间字段重渲染。

- [ ] **Step 10: 刷新冷却**

点击刷新,按钮变「↻ 冷却 4m 59s」,5 分钟内禁用。

- [ ] **Step 11: 离线模式**

Network → Offline,刷新。右上角红色「⚠ 离线」,数据仍可浏览。

- [ ] **Step 12: 窄屏**

DevTools 切换至 iPhone 14 Pro(393×852)。预期:左栏消失,TopBar 出现「⚙ 筛选」,视图切换无「日历」,筛选抽屉与详情全屏覆盖正常。

- [ ] **Step 13: CDN 失败**

Network 屏蔽 `unpkg.com` 与 `cdn.tailwindcss.com`,刷新。显示「⚠️ 基础库加载失败」。

- [ ] **Step 14: 最终 Commit + Tag**

```bash
git add .
git commit -m "chore: 端到端验收测试通过" --allow-empty
git tag v1.0.0
```

---

## 自检报告

**1. Spec 覆盖核对:**

| Spec 章节 | 覆盖任务 |
|---|---|
| §2 决策表(全局变量 + CDN) | Task 1, 3, 4, 15 |
| §3 架构与文件结构 | Task 1, 3-8, 9-15 |
| §3.2 `<script>` 加载顺序 | Task 1 (index.html) |
| §4 LL2 API + mode=detailed + 拉取策略 + limit=100 说明 | Task 6, 15 |
| §5.1 发射数据模型 | Task 6 (normalizeLaunch) |
| §5.2 火箭规格库(含截止日期) | Task 4 |
| §5.3 预置 18 型号(含 CASIC) | Task 4 |
| §5.4 厂商元数据 | Task 3, 16 |
| §6.1 桌面三栏布局 + 状态枚举 | Task 10, 15 |
| §6.2 窄屏回退 | Task 15 (app.js 模板) |
| §7.1 日历视图(含筛选影响 + 跨天归属) | Task 11 |
| §7.2 列表视图 | Task 12 |
| §7.3 历史视图(含汇总) | Task 13 |
| §8 DetailDrawer(含型号历史缓存限制说明) | Task 14 |
| §9 缓存策略 + 9.3 手动刷新冷却 + 配额计数 | Task 5, 15 |
| §10 时区处理 + 倒计时 60s/1s + In Flight | Task 7, 9 |
| §11 组件分解 | Task 9-15 |
| §12 错误处理(429/5xx/离线/空缓存/未知/CDN失败) | Task 6, 15, 1 |
| §13 测试策略 | Task 2, 17 |

**2. 占位符扫描:** 已检查,无 "TBD"、"TODO"、"稍后实现" 等占位符。唯一「待填入」的是 Task 16 中厂商真实 ID(这是设计文档明确要求"实现时核对 LL2 响应"的环节,不是占位符)。

**3. 类型/方法名一致性:** 已核对 store.js 中所有方法(`setLaunches`/`setFilterProviderIds`/`toggleProvider`/`selectLaunch`/`setTimezone`/`setView`/`providersFromLaunches`)在后续组件中调用一致。`RT.cache.*`、`RT.ll2Client.*`、`RT.time.*`、`RT.getRocketSpec`、`RT.getManufacturer`、`RT.PRESET_MANUFACTURERS`、`RT.ROCKET_SPECS_UPDATED` 命名在所有任务中保持一致。
