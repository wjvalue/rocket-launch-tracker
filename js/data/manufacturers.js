window.RT = window.RT || {};

// 真实 LL2 厂商 ID（从 /agencies/ 端点核对，2026-07-24）
RT.MANUFACTURERS = {
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
