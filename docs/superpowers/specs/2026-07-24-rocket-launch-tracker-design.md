# 火箭发射追踪网页 · 设计文档

- **日期**: 2026-07-24
- **作者**: 与用户协作产出
- **状态**: 已确认,可进入实现
- **目标用户**: 单一用户(航天分析师,个人使用)

## 1. 概述

一个纯静态 HTML 网页,用于追踪全球火箭发射日程。从 Launch Library 2(LL2)公共 API 拉取发射数据,本地维护火箭规格库,以仪表盘式三栏布局呈现日历视图、列表视图、历史结果视图,支持按厂商/国家筛选。零构建、零部署,双击 `index.html` 即可运行。

## 2. 已确认决策

| 维度 | 选择 |
|---|---|
| 数据源 | Launch Library 2 API(The Space Devs) |
| 技术栈 | Vue 3 + Tailwind CSS,均通过 CDN 引入,无构建步骤。**JS 使用全局变量 + `<script>` 顺序加载**(非 ESM),以确保 `file://` 协议下双击 `index.html` 即可运行。组件以 `template` 字符串编写(CDN 版 Vue 含 runtime compiler) |
| 运行方式 | 纯静态 HTML,浏览器直接打开 |
| 页面架构 | 方案 C:三栏仪表盘分区布局 |
| 核心功能 | 日历视图 / 列表+倒计时 / 厂商筛选 / 历史结果记录 / 火箭规格展示 |
| 缓存范围 | 未来 90 天 + 过去 30 天 |
| 火箭规格库 | 预置 15-20 个主流型号(SpaceX、CASC、蓝箭、Ariane、Rocket Lab、ULA、Blue Origin 等) |
| 时区 | 默认 Asia/Shanghai,可切换(UTC / Asia/Shanghai / America/New_York / America/Cayenne 库鲁) |

## 3. 架构

### 3.1 分层

```
┌─────────────────────────────────────────────────┐
│  UI 层 (Vue 3 Components)                       │
│  ├─ TopBar        (视图切换/时区/刷新/状态)       │
│  ├─ FilterSidebar (厂商+状态筛选)                 │
│  ├─ MainPanel     (日历/列表/历史三视图切换)      │
│  └─ DetailDrawer  (发射详情+火箭规格+历史)        │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  应用状态层 (Vue reactive store)                │
│  ├─ launches[]     当前过滤后的发射列表           │
│  ├─ filters        选中的厂商/状态                │
│  ├─ view           当前视图 + 选中月份/发射       │
│  └─ meta           时区/最后同步时间/在线状态     │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  数据层                                          │
│  ├─ ll2-client     封装 LL2 API 调用 + 限速      │
│  ├─ rocket-specs   本地火箭规格库 (静态 JS 对象)  │
│  └─ cache          localStorage 持久化缓存       │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  外部                                            │
│  └─ Launch Library 2 REST API                   │
│     https://ll.thespacedevs.com/2.2.0/launch/  │
└─────────────────────────────────────────────────┘
```

### 3.2 文件结构

```
火箭追踪/
├─ index.html              入口,引入所有 CDN 与模块
├─ css/
│  └─ app.css              少量自定义样式(Tailwind 之外)
├─ js/
│  ├─ app.js               Vue 应用挂载与根组件
│  ├─ store.js             响应式 store(reactive)
│  ├─ components/
│  │  ├─ TopBar.js
│  │  ├─ FilterSidebar.js
│  │  ├─ MainPanel.js
│  │  ├─ CalendarView.js
│  │  ├─ ListView.js
│  │  ├─ HistoryView.js
│  │  └─ DetailDrawer.js
│  ├─ services/
│  │  ├─ ll2-client.js     API 调用 + 限速 + 重试
│  │  └─ cache.js          localStorage 封装
│  └─ data/
│     ├─ rocket-specs.js   本地火箭规格库
│     └─ manufacturers.js  厂商元数据(国家/颜色/中文名)
└─ docs/superpowers/specs/ 本设计文档
```

所有 JS 文件使用全局变量模式(`window.RT = window.RT || {}`,然后挂载到 `RT.store`、`RT.TopBar` 等),在 `index.html` 中以普通 `<script>` 标签按依赖顺序加载。Vue 与 Tailwind 通过 CDN `<script>` 标签引入,无需 npm,也无需 ESM,确保 `file://` 协议下双击即可运行。组件以 `template` 字符串编写(CDN 版 Vue 含 runtime compiler,支持运行时模板编译)。

**`index.html` 中的 `<script>` 加载顺序(硬性依赖,不可调整):**

```html
<!-- 1. 外部 CDN:Vue + Tailwind -->
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<script src="https://cdn.tailwindcss.com"></script>

<!-- 2. 数据层:静态数据 -->
<script src="js/data/manufacturers.js"></script>
<script src="js/data/rocket-specs.js"></script>

<!-- 3. 服务层:依赖数据层 -->
<script src="js/services/cache.js"></script>
<script src="js/services/ll2-client.js"></script>

<!-- 4. 状态层:依赖服务层 -->
<script src="js/store.js"></script>

<!-- 5. 组件层:依赖 store(顺序按组件间引用关系) -->
<script src="js/components/TopBar.js"></script>
<script src="js/components/FilterSidebar.js"></script>
<script src="js/components/CalendarView.js"></script>
<script src="js/components/ListView.js"></script>
<script src="js/components/HistoryView.js"></script>
<script src="js/components/MainPanel.js"></script>
<script src="js/components/DetailDrawer.js"></script>

<!-- 6. 应用入口:最后挂载 Vue 应用 -->
<script src="js/app.js"></script>
```

## 4. 数据源

### 4.1 Launch Library 2 API

- 基础 URL: `https://ll.thespacedevs.com/2.2.0/`
- 关键端点:
  - `GET /launch/upcoming/?limit=100&offset=0&mode=detailed` — 即将发射
  - `GET /launch/previous/?limit=100&offset=0&mode=detailed` — 历史发射(含结果)
- **`mode=detailed` 说明**:LL2 支持 `mode=list`(精简)与 `mode=detailed`(完整)。`payload_mass_kg`、`mission.orbit`、`mission.type` 等字段在 `mode=list` 下可能缺失,因此默认使用 `mode=detailed`。若后续发现响应体积过大影响缓存写入,可切换为 `mode=list` 并在 DetailDrawer 打开时按需查询 `/launch/{id}/?mode=detailed`(代价:每次打开详情多 1 次配额)
- 匿名限速: 25 req/hour
- 支持 CORS,可直接从浏览器调用

### 4.2 拉取策略

应用启动时:
1. 读 localStorage 缓存,立即渲染(秒开)
2. 后台并行调用 `upcoming` 与 `previous`,各 limit=100
3. 在客户端按 `net`(预计发射时间)筛选至 [now-30d, now+90d]
4. 合并新数据,写回 localStorage,触发响应式更新
5. 设置 1 小时定时器自动刷新

**关于 limit=100 的覆盖说明:** SpaceX 年发射 100+ 次,加上其他厂商,100 条 upcoming 在密集期可能只覆盖未来 3-4 周,无法保证完整覆盖 90 天。接受这一限制,UI 在数据末尾显示「数据覆盖至 YYYY-MM-DD(N 条)」提示用户。分页拉取受 25 req/hour 配额限制,权衡后不启用(后续可在扩展点中接入 API key 提升配额再启用分页)。

### 4.3 限速与错误处理

- 单次启动最多 2 个 API 调用(2/25 配额)
- 失败重试:指数退避,最多 3 次(2s/4s/8s)
- 429 Too Many Requests:不重试,使用缓存,顶部条显示「限速中,使用缓存」
- 网络错误:离线模式,显示「⚠ 离线 · 最后同步 [时间]」

## 5. 数据模型

### 5.1 发射条目(来自 LL2,客户端标准化)

```js
{
  id: "ll2-xxxx",
  name: "Falcon 9 · Starlink Group 6-15",
  net: "2026-07-24T22:30:00Z",          // ISO,UTC
  window_start: "...",
  window_end: "...",
  status: "Go",                           // Go/TBD/Hold/In Flight/Success/Failure/Partial Failure
  provider: { name: "SpaceX", id: 121 },
  rocket_config: { name: "Falcon 9 Block 5", id: 164 },
  pad: { name: "SLC-40", location: { name: "CCSFS, FL" } },
  mission: {
    name: "Starlink Group 6-15",
    type: "Communications",
    orbit: "LEO"
  },
  payload_mass_kg: 17500,
}
```

### 5.2 本地火箭规格库(`data/rocket-specs.js`)

以 LL2 `rocket_config.id` 为键:

```js
// data/rocket-specs.js
// 数据截至: 2026-07-01
// 来源: SpaceX 官方 Falcon User Guide Rev 2 (2024)、Wikipedia
window.RT = window.RT || {};
RT.ROCKET_SPECS = {
  164: {  // Falcon 9 Block 5
    name: "Falcon 9 Block 5",
    stages: 2,
    boosters: 0,
    height_m: 70,
    diameter_m: 3.7,
    liftoff_mass_t: 549,
    leo_kg: 22800,
    gto_kg: 8300,
    thrust_kn: 7607,
    engines: "9 × Merlin 1D+",
    first_flight: "2018-05-11",
    success_rate: 0.99,
    total_flights: 280,
    country: "USA",
    manufacturer_id: 121
  },
  // 预置型号见 §5.3
};
```

未知 `rocket_config.id` 时,UI 显示「规格数据待补充」,不影响其他功能。

### 5.3 预置火箭规格清单(15-20 个)

| 厂商 | 型号 |
|---|---|
| SpaceX | Falcon 9 Block 5、Falcon Heavy |
| CASC | 长征二号丙/丁/三号乙/三号丙、长征五号/五号乙、长征七号/七号甲、长征八号、长征十一号 |
| CASIC(航天科工) | 快舟一号甲 |
| 蓝箭航天 | 朱雀二号 |
| iSpace | 双曲线二号 |
| 东方空间 | 引力一号 |
| Rocket Lab | Electron |
| ULA | Vulcan VC2、Atlas V |
| ArianeGroup | Ariane 6 |
| Blue Origin | New Glenn |
| NASA | SLS Block 1 |

每个型号包含完整字段(级数、运力、推力、发动机、首飞、成功率等),数据来源于厂商官方手册与 Wikipedia,在 `rocket-specs.js` 顶部注释中标注每个数字的来源与时间点(符合用户对来源可追溯的要求)。

**数据时效性:** `total_flights` 和 `success_rate` 是静态值,会随时间过期(如 Falcon 9 的 280 次很快变成 300+)。处理方式:
- `rocket-specs.js` 顶部注释标注全局数据截止日期(如 `// 数据截至: 2026-07-01`)
- DetailDrawer 规格表底部小字显示「规格数据更新于 2026-07」(取自截止日期)
- 用户需定期手动更新该文件(后续可在扩展点中提供编辑 UI)

### 5.4 厂商元数据(`data/manufacturers.js`)

以 LL2 `launch_service_provider.id` 为键。具体 ID 在实现时从首次 API 响应中核对填入(下表 ID 为占位值,以 LL2 实际返回为准):

```js
// data/manufacturers.js
window.RT = window.RT || {};
RT.MANUFACTURERS = {
  // ID 在实现时核对 LL2 实际响应后填入,确保无重复
  // 结构示例:
  [id]: { name: "SpaceX", name_zh: "SpaceX", country: "USA", color: "#3b82f6" },
};
```

预置厂商清单(中文名 + 国家 + 主题色已定,ID 待核对):

| 厂商 | 中文名 | 国家 | 主题色 |
|---|---|---|---|
| SpaceX | SpaceX | USA | `#3b82f6` 蓝 |
| CASC | 中国航天科技集团 | China | `#dc2626` 红 |
| CASIC | 中国航天科工集团 | China | `#f43f5e` 玫红(与 CASC 红区分) |
| LandSpace | 蓝箭航天 | China | `#10b981` 绿 |
| iSpace | 星际荣耀 | China | `#14b8a6` 青绿 |
| Galactic Energy | 星河动力 | China | `#a855f7` 紫 |
| Orienspace | 东方空间 | China | `#ec4899` 粉 |
| Rocket Lab | 火箭实验室 | USA | `#f97316` 橙 |
| ULA | 联合发射联盟 | USA | `#0ea5e9` 天蓝 |
| Blue Origin | 蓝色起源 | USA | `#6366f1` 靛蓝 |
| ArianeGroup | 阿丽亚娜集团 | Europe | `#facc15` 黄 |
| Roscosmos | 俄罗斯航天局 | Russia | `#ef4444` 亮红 |

未列入的厂商 fallback 颜色 `#94a3b8`(灰),中文名用原文,分组至左栏「其他」。

## 6. UI 布局

### 6.1 桌面端(≥1024px)

```
┌───────────────────────────────────────────────────────────────┐
│ TopBar  [🚀 标题] [日历|列表|历史]            [时区▾][状态][↻] │
├──────────┬──────────────────────────────────┬─────────────────┤
│ Sidebar  │ MainPanel                        │ DetailDrawer    │
│          │                                  │                 │
│ 厂商筛选  │  日历视图(默认)                  │  当前选中发射    │
│ ├ 美国   │  ┌─一─二─三─四─五─六─日─┐         │  - 倒计时        │
│ │ ☑ SpaceX│  │ 日历单元格,色块=厂商    │         │  - 发射场        │
│ │ ☐ ULA  │  │ 今日/即将发射高亮        │         │  - 火箭规格表    │
│ ├ 中国   │  └─────────────────────┘         │  - 载荷          │
│ │ ☑ CASC │  [图例]                          │  - 该型号历史    │
│ │ ...    │                                  │                 │
│ 状态筛选  │  (toggle 切到列表/历史)          │  (可关闭)        │
└──────────┴──────────────────────────────────┴─────────────────┘
```

- 左栏 220px,中栏自适应,右栏 340px
- 右栏默认行为:首次启动若缓存中有未来发射,自动选中最近一次未来发射并展开;否则收起。点击日历单元格或列表行时手动展开并切换选中
- 三栏均可独立滚动

**左栏状态筛选 checkbox 枚举(对应 LL2 status):**

- ☐ 计划中(TBD)— 时间或细节未定
- ☐ 倒计时(Go)— 已确认发射
- ☐ 发射中(In Flight)— 火箭已点火升空,任务进行中
- ☐ 已完成(Success)— 发射成功
- ☐ 失败(Failure)— 发射失败
- ☐ 部分失败(Partial Failure)— 部分成功(如载荷未入正确轨道)
- ☐ 暂停(Hold)— 发射暂停(可恢复)

默认勾选「倒计时」「发射中」,其他不勾。

### 6.2 窄屏(<1024px)

- 左栏折叠为顶部「筛选」按钮 → 点击展开全屏覆盖抽屉
- 右栏 DetailDrawer 改为全屏覆盖层
- 主区强制使用列表视图(日历在窄屏不可用,顶部 toggle 隐藏「日历」选项)
- 顶部条简化:状态与刷新折叠进「⋮」菜单

## 7. 视图

### 7.1 日历视图

- 月历网格,7 列(周一至周日)
- 每个单元格显示日期 + 至多 2 条发射名称(色块=厂商色)
- 单元格右下角小圆点表示当日发射数(超过 2 条时)
- 「今日」单元格蓝色高亮
- 「即将发射」(未来 72h 内)单元格琥珀色边框
- 点击单元格展开当日全部发射(列表形式浮于日历下方),再点某条打开 DetailDrawer
- 月份切换:‹ / 今日 / › 按钮,以及键盘左右箭头
- **筛选影响**:日历仅显示当前筛选条件(厂商 + 状态)下的发射;单元格内发射条数与小圆点计数随筛选实时变化。无发射的单元格保持空白
- **跨天窗口归属**:日历按 `net`(预计发射时间)所在日期归属,不考虑 `window_start`/`window_end` 跨天情况

### 7.2 列表视图

表格列:
| 日期(本地时区) | 倒计时/结果 | 火箭 | 厂商 | 发射场 | 载荷 | 状态 |

- 默认按时间升序;列头点击排序
- 倒计时列:已发射显示结果(✓/✗/部分),未发射显示 `T-3d 14h`
- 行点击 → 打开 DetailDrawer
- 滚动到底部自动加载更多(如缓存范围内有更多数据)

### 7.3 历史视图

- 与列表视图同结构,但仅显示已结束发射
- 顶部加一行汇总:`共 N 次 · 成功 X · 失败 Y · 成功率 Z%`
- 支持按厂商/火箭型号分组展开

## 8. DetailDrawer 详情抽屉

字段顺序(对应 mockup):

1. **标题区**: 任务名 + 厂商 + 发射时刻(本地时区) + 倒计时/结果
2. **发射场**: pad.name + location.name + 国家
3. **火箭规格**: 从 `ROCKET_SPECS[rocket_config.id]` 查询,以双列表格呈现
   - 级数 / 助推器数
   - 高度 / 直径 / 起飞质量
   - LEO 运力 / GTO 运力
   - 起飞推力 / 发动机
   - 首飞日期 / 总发射次数 / 成功率
4. **载荷**: mission.name + type + orbit + payload_mass_kg
5. **该型号历史**: 基于本地缓存(过去 30 天 + 即将发射)中同 `rocket_config.id` 的发射列表,显示最近 5 次 + 成功率汇总。**数据来源限制**:对低频型号(SLS、Ariane 6 等)30 天内可能不足 5 条,此时显示「缓存范围内共 N 次」,不额外调用 API(避免消耗配额)。如需更完整历史,可在后续扩展点中记录「按型号针对性查询 `/launch/previous/?rocket_config=ID`」。

未知规格字段显示「—」,未知型号整体显示「规格数据待补充,欢迎补充到 `rocket-specs.js`」。

## 9. 缓存策略

### 9.1 localStorage 结构

```js
key: "rocket-tracker:cache:v1"
value: {
  launches: [...],            // 标准化后的发射数组
  fetched_at: 1784879000000,  // 上次成功拉取时间戳
  source: "ll2"               // 数据源标识
}
```

### 9.2 失效规则

- 启动时若 `fetched_at` 距今 < 1 小时,跳过自动刷新(手动刷新仍可用)
- 若 > 1 小时,后台刷新
- 若某发射 `net` 已过去超过 30 天,从缓存清理(下次拉取会重新覆盖)

### 9.3 手动刷新冷却

匿名限速 25 req/hour,每次刷新消耗 2 次配额(upcoming + previous)。为防止误操作耗尽配额:

- 手动刷新增加 **5 分钟冷却**,冷却期间按钮禁用,显示倒计时「↻ 冷却 4m 32s」
- 客户端维护「本小时已用配额」计数(localStorage),在按钮 tooltip 中显示「本小时剩余 ~N 次配额」
- 计数按小时滚动重置(记录 `quota_window_start` 时间戳)

### 9.4 容量估算

200 条发射 × ~1KB = 200KB,远低于 localStorage 5MB 上限。

## 10. 时区处理

- 默认 `Asia/Shanghai`,通过 `Intl.DateTimeFormat` 渲染
- 顶部条可切换:UTC / Asia/Shanghai / America/New_York / America/Cayenne(法属圭亚那库鲁,Ariane 发射场所在时区)
- 切换后立即重渲染所有时间字段
- 倒计时始终基于 UTC `net` 计算,显示规则:
  - 距发射 > 1 小时:格式 `T-Xd Yh Zm`,每 **60 秒** 更新一次(`setInterval`)
  - 距发射 ≤ 1 小时:格式 `T-58m 32s`,每 **1 秒** 更新一次
  - 进入发射窗口(`window_start` 已过):显示「发射窗口已开启」
  - `status === "In Flight"`:倒计时列显示「🔴 发射中」,DetailDrawer 标题区显示「发射进行中」,每 10 秒刷新一次状态(LL2 不会实时推送,需客户端轮询)
  - 发射后(`net` 已过):切换为结果状态(✓ 成功 / ✗ 失败 / ▲ 部分失败 / — 待确认)

## 11. 组件分解

所有组件以 Vue 3 全局组件形式注册(`app.component('top-bar', {...})`),`template` 字段使用字符串模板(CDN 版 Vue 含 runtime compiler,支持运行时编译)。组件间通过共享的响应式 `store` 对象通信(发布/订阅模式由 Vue reactivity 自动完成)。

| 组件 | 职责 | 依赖 |
|---|---|---|
| `app.js` | 挂载 Vue 应用,初始化 store,触发首次数据加载 | store, services |
| `store.js` | 全局响应式状态 + actions(fetch/refresh/setFilter/selectLaunch) | services |
| `TopBar.js` | 视图 toggle / 时区选择 / 在线状态 / 刷新按钮(含冷却倒计时) | store |
| `FilterSidebar.js` | 厂商搜索 + 分组 checkbox + 状态筛选 | store, manufacturers |
| `MainPanel.js` | 根据 `view` 渲染 Calendar/List/History | 三个视图组件 |
| `CalendarView.js` | 月历网格 + 单元格点击 → 选中发射 | store |
| `ListView.js` | 表格 + 排序 + 行点击 | store |
| `HistoryView.js` | 历史列表 + 汇总统计 + 分组 | store |
| `DetailDrawer.js` | 详情卡片 + 火箭规格 + 历史记录 | store, rocket-specs |
| `ll2-client.js` | `fetchUpcoming()` / `fetchPrevious()`,带重试 | — |
| `cache.js` | `load()` / `save()` / `isFresh()` | — |

## 12. 错误处理

| 场景 | 行为 |
|---|---|
| API 429 限速 | 不重试,使用缓存,顶部条提示「⏸ 限速中,使用缓存(N 分钟前)」 |
| API 5xx | 重试 3 次(指数退避),失败后使用缓存 |
| 网络断开 | 显示「⚠ 离线 · 最后同步 [时间]」,所有交互正常,但刷新按钮禁用 |
| 缓存不存在 + API 失败 | 显示空状态卡片「无法加载发射数据,请检查网络后点击刷新」 |
| 未知 rocket_config.id | 详情区显示「规格数据待补充」 |
| 单条发射字段缺失 | 该字段显示「—」 |
| CDN 资源加载失败(Vue/Tailwind)| 在 `index.html` 中预置不依赖 Vue 的纯 HTML `<div id="cdn-fallback" style="display:none">`,内含「基础库加载失败,请联网后刷新」提示;Vue 加载失败时由原生 JS 检测 `typeof Vue === 'undefined'` 并显示该 div。注:完全离线场景下 CDN 不可用,缓存数据也无法渲染 — 完全离线支持不在本次范围,见 §15 扩展点 |

## 13. 测试策略

纯静态 HTML 项目无构建管线,采用手工 + 浏览器 DevTools 验证:

- **数据层**: 在 DevTools Console 中调用 `RT.ll2Client.fetchUpcoming()`,验证返回数据结构
- **缓存层**: 修改 localStorage 时间戳,验证失效逻辑
- **UI 层**:
  - 切换视图 toggle,验证日历/列表/历史正确渲染
  - 勾选不同厂商,验证筛选生效
  - 点击发射条目,验证详情抽屉内容
  - 切换时区,验证时间字段重渲染
  - DevTools 切换窄屏,验证响应式回退
- **离线模拟**: DevTools Network → Offline,验证离线提示与缓存渲染

不引入测试框架,保持零依赖。

## 14. 范围外(YAGNI)

明确不做:
- 多用户/账号系统(个人使用)
- 数据库/后端(纯静态)
- 推送通知(浏览器 API 复杂,个人使用价值低)
- RSS/网页抓取(LL2 已覆盖足够)
- URL hash 路由(无分享需求)
- 自定义主题/暗黑模式(后续可加,初版不做)
- 多语言切换(中文为主,英文型号名原样显示)

## 15. 后续可扩展点(不在本次范围)

- 接入 LL2 高级 API key(1000 req/hour)
- 编辑本地火箭规格库的 UI(目前直接改 JS 文件)
- 收藏/标记关注发射
- 导出 CSV 月度报告
- 部署到 Cloudflare Pages 实现外网访问
- **完全离线支持**:将 Vue 与 Tailwind 内联到 HTML(牺牲单文件大小,换取飞机/无网环境下仍可查看缓存数据)
- **分页拉取**:配额允许时,自动翻页拉取完整 90 天 upcoming 数据
- **按型号历史查询**:点击 DetailDrawer 时按需调用 `/launch/previous/?rocket_config=ID` 获取完整型号历史
