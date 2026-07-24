window.RT = window.RT || {};
RT.MANUFACTURERS = {
  // ID 待 Task 16 从首次 LL2 响应中核对填入
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
