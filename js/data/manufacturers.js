window.RT = window.RT || {};

// 真实 LL2 厂商 ID（从 /agencies/ 端点核对，2026-07-24）
RT.MANUFACTURERS = {
  // 预设 12 家（核心关注）
  121:  { name: 'SpaceX',          name_zh: 'SpaceX',          country: 'USA',    color: '#3b82f6' },
  88:   { name: 'CASC',            name_zh: '中国航天科技集团', country: 'China',  color: '#dc2626' },
  184:  { name: 'CASIC',           name_zh: '中国航天科工集团', country: 'China',  color: '#f43f5e' },
  259:  { name: 'LandSpace',       name_zh: '蓝箭航天',         country: 'China',  color: '#10b981' },
  274:  { name: 'iSpace',          name_zh: '星际荣耀',         country: 'China',  color: '#14b8a6' },
  1021: { name: 'Galactic Energy', name_zh: '星河动力',         country: 'China',  color: '#a855f7' },
  1080: { name: 'Orienspace',      name_zh: '东方空间',         country: 'China',  color: '#ec4899' },
  147:  { name: 'Rocket Lab',      name_zh: '火箭实验室',       country: 'USA',    color: '#f97316' },
  124:  { name: 'ULA',             name_zh: '联合发射联盟',     country: 'USA',    color: '#0ea5e9' },
  141:  { name: 'Blue Origin',     name_zh: '蓝色起源',         country: 'USA',    color: '#6366f1' },
  1044: { name: 'ArianeGroup',     name_zh: '阿丽亚娜集团',     country: 'Europe', color: '#facc15' },
  63:   { name: 'Roscosmos',       name_zh: '俄罗斯航天局',     country: 'Russia', color: '#ef4444' },
  // 补充厂商（LL2 数据中常见）
  1040: { name: 'CAS Space',       name_zh: '中科宇航',         country: 'China',  color: '#8b5cf6' },
  265:  { name: 'Firefly Aerospace', name_zh: '萤火虫航天',     country: 'USA',    color: '#84cc16' },
  31:   { name: 'ISRO',            name_zh: '印度空间研究组织', country: 'India',  color: '#f59e0b' },
  98:   { name: 'Mitsubishi Heavy Industries', name_zh: '三菱重工', country: 'Japan', color: '#06b6d4' },
  1046: { name: 'Isar Aerospace',  name_zh: '伊萨尔航天',       country: 'Europe', color: '#a3e635' },
  1045: { name: 'Rocket Factory Augsburg', name_zh: '奥格斯堡火箭工厂', country: 'Europe', color: '#65a30d' },
  159:  { name: 'Avio S.p.A',      name_zh: '阿维奥',           country: 'Europe', color: '#ca8a04' },
  41:   { name: 'KARI',            name_zh: '韩国航空宇宙研究院', country: 'Korea', color: '#0d9488' },
  27:   { name: 'ESA',             name_zh: '欧洲航天局',       country: 'Europe', color: '#1e40af' },
  1099: { name: 'Skyroot Aerospace', name_zh: '斯凯罗特航天',   country: 'India',  color: '#d97706' },
  257:  { name: 'Northrop Grumman', name_zh: '诺斯罗普·格鲁曼', country: 'USA',    color: '#475569' },
  1079: { name: 'ADD',             name_zh: '韩国国防发展局',   country: 'Korea', color: '#0f766e' },
};

// 关联实体别名（子公司/发射服务运营商 → 母厂商 ID）
// 在 normalize 阶段转换 provider.id，确保筛选与分组一致
RT.MANUFACTURER_ALIASES = {
  194: 184,   // ExPace → CASIC（快舟系列由 ExPace 运营）
  115: 1044,  // Arianespace → ArianeGroup（Ariane 火箭由 Arianespace 发射）
};

RT.getManufacturer = function(id) {
  if (RT.MANUFACTURERS[id]) return RT.MANUFACTURERS[id];
  return { name: '其他', name_zh: '其他', country: 'Unknown', color: '#94a3b8', isFallback: true };
};

RT.PRESET_MANUFACTURERS = [
  { id: 121,  name: 'SpaceX',          name_zh: 'SpaceX',          country: 'USA',     color: '#3b82f6' },
  { id: 88,   name: 'CASC',            name_zh: '中国航天科技集团', country: 'China',   color: '#dc2626' },
  { id: 184,  name: 'CASIC',           name_zh: '中国航天科工集团', country: 'China',   color: '#f43f5e' },
  { id: 259,  name: 'LandSpace',       name_zh: '蓝箭航天',         country: 'China',   color: '#10b981' },
  { id: 274,  name: 'iSpace',          name_zh: '星际荣耀',         country: 'China',   color: '#14b8a6' },
  { id: 1021, name: 'Galactic Energy', name_zh: '星河动力',         country: 'China',   color: '#a855f7' },
  { id: 1080, name: 'Orienspace',      name_zh: '东方空间',         country: 'China',   color: '#ec4899' },
  { id: 147,  name: 'Rocket Lab',      name_zh: '火箭实验室',       country: 'USA',     color: '#f97316' },
  { id: 124,  name: 'ULA',             name_zh: '联合发射联盟',     country: 'USA',     color: '#0ea5e9' },
  { id: 141,  name: 'Blue Origin',     name_zh: '蓝色起源',         country: 'USA',     color: '#6366f1' },
  { id: 1044, name: 'ArianeGroup',     name_zh: '阿丽亚娜集团',     country: 'Europe',  color: '#facc15' },
  { id: 63,   name: 'Roscosmos',       name_zh: '俄罗斯航天局',     country: 'Russia',  color: '#ef4444' },
];
