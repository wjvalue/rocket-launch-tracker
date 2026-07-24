// 数据截至: 2026-07-01
// 来源: SpaceX 官方 Falcon User Guide Rev 2 (2024)、CASC 官网、Wikipedia 各型号条目
window.RT = window.RT || {};
RT.ROCKET_SPECS = {
  // ===== SpaceX =====
  'falcon-9-block-5': { name: 'Falcon 9 Block 5', stages: 2, boosters: 0, height_m: 70, diameter_m: 3.7, liftoff_mass_t: 549, leo_kg: 22800, gto_kg: 8300, thrust_kn: 7607, engines: '9 × Merlin 1D+', first_flight: '2018-05-11', success_rate: 0.99, total_flights: 280, country: 'USA', manufacturer: 'SpaceX' },
  'falcon-heavy': { name: 'Falcon Heavy', stages: 2, boosters: 2, height_m: 70, diameter_m: 3.7, liftoff_mass_t: 1420, leo_kg: 63800, gto_kg: 26700, thrust_kn: 22819, engines: '27 × Merlin 1D+', first_flight: '2018-02-06', success_rate: 1.00, total_flights: 8, country: 'USA', manufacturer: 'SpaceX' },
  'starship': { name: 'Starship', stages: 2, boosters: 1, height_m: 121, diameter_m: 9, liftoff_mass_t: 5000, leo_kg: 150000, gto_kg: 0, thrust_kn: 74500, engines: '33 × Raptor 2 + 6 × Raptor Vacuum', first_flight: '2023-04-20', success_rate: 0.40, total_flights: 5, country: 'USA', manufacturer: 'SpaceX' },

  // ===== CASC 长征系列 =====
  'long-march-2c': { name: '长征二号丙', stages: 2, boosters: 0, height_m: 43, diameter_m: 3.35, liftoff_mass_t: 245, leo_kg: 4100, gto_kg: 0, thrust_kn: 2962, engines: '4 × YF-21C', first_flight: '1982-09-09', success_rate: 0.97, total_flights: 65, country: 'China', manufacturer: 'CASC' },
  'long-march-2d': { name: '长征二号丁', stages: 2, boosters: 0, height_m: 41, diameter_m: 3.35, liftoff_mass_t: 250, leo_kg: 4000, gto_kg: 0, thrust_kn: 2962, engines: '4 × YF-21C', first_flight: '1992-08-09', success_rate: 0.98, total_flights: 70, country: 'China', manufacturer: 'CASC' },
  'long-march-3b': { name: '长征三号乙', stages: 3, boosters: 4, height_m: 54.8, diameter_m: 3.35, liftoff_mass_t: 456, leo_kg: 12000, gto_kg: 5100, thrust_kn: 5923, engines: '4 × YF-25 + 2 × YF-21E', first_flight: '1996-02-15', success_rate: 0.95, total_flights: 80, country: 'China', manufacturer: 'CASC' },
  'long-march-4b': { name: '长征四号乙', stages: 3, boosters: 0, height_m: 44.1, diameter_m: 3.35, liftoff_mass_t: 248, leo_kg: 4200, gto_kg: 0, thrust_kn: 2962, engines: '4 × YF-21C', first_flight: '1999-05-10', success_rate: 0.97, total_flights: 50, country: 'China', manufacturer: 'CASC' },
  'long-march-5': { name: '长征五号', stages: 2, boosters: 4, height_m: 56.97, diameter_m: 5.0, liftoff_mass_t: 869, leo_kg: 25000, gto_kg: 14000, thrust_kn: 10622, engines: '2 × YF-100 + 2 × YF-77', first_flight: '2016-11-03', success_rate: 0.90, total_flights: 10, country: 'China', manufacturer: 'CASC' },
  'long-march-6a': { name: '长征六号甲', stages: 2, boosters: 4, height_m: 50, diameter_m: 3.35, liftoff_mass_t: 530, leo_kg: 4500, gto_kg: 0, thrust_kn: 7350, engines: '2 × YF-100 + 固体助推', first_flight: '2022-03-29', success_rate: 1.00, total_flights: 8, country: 'China', manufacturer: 'CASC' },
  'long-march-7': { name: '长征七号', stages: 2, boosters: 4, height_m: 53.1, diameter_m: 3.35, liftoff_mass_t: 597, leo_kg: 13500, gto_kg: 5500, thrust_kn: 7305, engines: '4 × YF-100 + 2 × YF-115', first_flight: '2016-06-25', success_rate: 1.00, total_flights: 12, country: 'China', manufacturer: 'CASC' },
  'long-march-7a': { name: '长征七号甲', stages: 3, boosters: 4, height_m: 60.1, diameter_m: 3.35, liftoff_mass_t: 573, leo_kg: 7000, gto_kg: 7000, thrust_kn: 7305, engines: '4 × YF-100 + 2 × YF-115 + YF-75', first_flight: '2020-03-16', success_rate: 0.88, total_flights: 6, country: 'China', manufacturer: 'CASC' },
  'long-march-8': { name: '长征八号', stages: 2, boosters: 2, height_m: 50.3, diameter_m: 3.35, liftoff_mass_t: 331, leo_kg: 8500, gto_kg: 4500, thrust_kn: 4800, engines: '2 × YF-100 + 1 × YF-75D', first_flight: '2020-12-22', success_rate: 1.00, total_flights: 5, country: 'China', manufacturer: 'CASC' },
  'long-march-8a': { name: '长征八号甲', stages: 2, boosters: 2, height_m: 50.3, diameter_m: 3.35, liftoff_mass_t: 373, leo_kg: 7000, gto_kg: 5500, thrust_kn: 5400, engines: '2 × YF-100 + 1 × YF-75D', first_flight: '2025-01-13', success_rate: 1.00, total_flights: 2, country: 'China', manufacturer: 'CASC' },
  'long-march-11': { name: '长征十一号', stages: 4, boosters: 0, height_m: 20.8, diameter_m: 2.0, liftoff_mass_t: 58, leo_kg: 750, gto_kg: 0, thrust_kn: 1176, engines: '固体推进', first_flight: '2015-09-25', success_rate: 1.00, total_flights: 15, country: 'China', manufacturer: 'CASC' },
  'long-march-12': { name: '长征十二号', stages: 2, boosters: 0, height_m: 62, diameter_m: 3.8, liftoff_mass_t: 433, leo_kg: 12000, gto_kg: 0, thrust_kn: 7890, engines: '4 × YF-100K + 1 × YF-115', first_flight: '2024-11-30', success_rate: 1.00, total_flights: 1, country: 'China', manufacturer: 'CASC' },
  'long-march-10b': { name: '长征十号乙', stages: 2, boosters: 0, height_m: 92, diameter_m: 5, liftoff_mass_t: 740, leo_kg: 25000, gto_kg: 0, thrust_kn: 14600, engines: '3 × YF-100K', first_flight: '2025-06-13', success_rate: 0.50, total_flights: 2, country: 'China', manufacturer: 'CASC' },

  // ===== CASIC =====
  'kuaizhou-1a': { name: '快舟一号甲', stages: 3, boosters: 0, height_m: 19.4, diameter_m: 1.4, liftoff_mass_t: 30, leo_kg: 300, gto_kg: 0, thrust_kn: 392, engines: '固体推进', first_flight: '2017-01-09', success_rate: 0.90, total_flights: 20, country: 'China', manufacturer: 'CASIC' },

  // ===== 商业航天 =====
  'zhuque-2': { name: '朱雀二号', stages: 2, boosters: 0, height_m: 49.5, diameter_m: 3.35, liftoff_mass_t: 219, leo_kg: 4000, gto_kg: 0, thrust_kn: 2680, engines: '液氧甲烷(TQ-12)', first_flight: '2022-12-14', success_rate: 0.67, total_flights: 6, country: 'China', manufacturer: 'LandSpace' },
  'zhuque-3': { name: '朱雀三号', stages: 2, boosters: 0, height_m: 76, diameter_m: 4.5, liftoff_mass_t: 660, leo_kg: 15000, gto_kg: 0, thrust_kn: 9000, engines: '液氧甲烷(TQ-12A)', first_flight: '2025-05-13', success_rate: 1.00, total_flights: 1, country: 'China', manufacturer: 'LandSpace' },
  'hyperbola-2': { name: '双曲线二号', stages: 2, boosters: 0, height_m: 31, diameter_m: 3.35, liftoff_mass_t: 100, leo_kg: 1900, gto_kg: 0, thrust_kn: 900, engines: '液氧甲烷', first_flight: '2023-11-02', success_rate: 0.80, total_flights: 5, country: 'China', manufacturer: 'iSpace' },
  'gravity-1': { name: '引力一号', stages: 3, boosters: 0, height_m: 31.4, diameter_m: 2.65, liftoff_mass_t: 405, leo_kg: 6500, gto_kg: 0, thrust_kn: 3942, engines: '固体推进', first_flight: '2024-01-11', success_rate: 1.00, total_flights: 3, country: 'China', manufacturer: 'Orienspace' },
  'kinetica-1': { name: '力箭一号', stages: 3, boosters: 0, height_m: 30, diameter_m: 2.65, liftoff_mass_t: 135, leo_kg: 2000, gto_kg: 0, thrust_kn: 1960, engines: '固体推进', first_flight: '2022-07-27', success_rate: 1.00, total_flights: 6, country: 'China', manufacturer: 'CAS Space' },

  // ===== 美国 =====
  'electron': { name: 'Electron', stages: 2, boosters: 0, height_m: 18, diameter_m: 1.2, liftoff_mass_t: 13, leo_kg: 320, gto_kg: 0, thrust_kn: 192, engines: '9 × Rutherford', first_flight: '2017-05-25', success_rate: 0.92, total_flights: 50, country: 'New Zealand', manufacturer: 'Rocket Lab' },
  'vulcan-vc2': { name: 'Vulcan VC2', stages: 2, boosters: 2, height_m: 61.6, diameter_m: 5.4, liftoff_mass_t: 547, leo_kg: 27200, gto_kg: 14900, thrust_kn: 7838, engines: '2 × BE-4 + 2 × GEM 63', first_flight: '2024-01-08', success_rate: 1.00, total_flights: 2, country: 'USA', manufacturer: 'ULA' },
  'vulcan-vc6l': { name: 'Vulcan VC6L', stages: 2, boosters: 6, height_m: 61.6, diameter_m: 5.4, liftoff_mass_t: 762, leo_kg: 27200, gto_kg: 14900, thrust_kn: 11757, engines: '2 × BE-4 + 6 × GEM 63XL', first_flight: '2024-10-04', success_rate: 1.00, total_flights: 1, country: 'USA', manufacturer: 'ULA' },
  'atlas-v': { name: 'Atlas V', stages: 2, boosters: 1, height_m: 58.3, diameter_m: 3.81, liftoff_mass_t: 334, leo_kg: 8123, gto_kg: 3520, thrust_kn: 3827, engines: '1 × RD-180 + 1 × RL10', first_flight: '2002-08-21', success_rate: 0.99, total_flights: 100, country: 'USA', manufacturer: 'ULA' },
  'new-glenn': { name: 'New Glenn', stages: 2, boosters: 0, height_m: 98, diameter_m: 7, liftoff_mass_t: 1500, leo_kg: 45000, gto_kg: 13900, thrust_kn: 17560, engines: '7 × BE-4', first_flight: '2025-01-16', success_rate: 1.00, total_flights: 1, country: 'USA', manufacturer: 'Blue Origin' },
  'firefly-alpha': { name: 'Firefly Alpha', stages: 2, boosters: 0, height_m: 29, diameter_m: 1.8, liftoff_mass_t: 54, leo_kg: 1000, gto_kg: 0, thrust_kn: 736, engines: '4 × Reaver + Lightning', first_flight: '2021-09-03', success_rate: 0.60, total_flights: 5, country: 'USA', manufacturer: 'Firefly Aerospace' },
  'pegasus-xl': { name: 'Pegasus XL', stages: 3, boosters: 0, height_m: 17.6, diameter_m: 1.27, liftoff_mass_t: 23, leo_kg: 443, gto_kg: 0, thrust_kn: 487, engines: '固体推进', first_flight: '1994-10-19', success_rate: 0.88, total_flights: 45, country: 'USA', manufacturer: 'Northrop Grumman' },
  'sls-block-1': { name: 'SLS Block 1', stages: 2, boosters: 2, height_m: 111.3, diameter_m: 8.4, liftoff_mass_t: 2608, leo_kg: 95000, gto_kg: 27000, thrust_kn: 39918, engines: '4 × RS-25 + 2 × 五段式助推', first_flight: '2022-11-16', success_rate: 1.00, total_flights: 1, country: 'USA', manufacturer: 'NASA' },

  // ===== 欧洲 =====
  'ariane-6': { name: 'Ariane 6', stages: 2, boosters: 2, height_m: 63, diameter_m: 5.4, liftoff_mass_t: 860, leo_kg: 21600, gto_kg: 11500, thrust_kn: 13600, engines: '1 × Vulcain 2.1 + 2 × P120C', first_flight: '2024-07-09', success_rate: 1.00, total_flights: 2, country: 'Europe', manufacturer: 'ArianeGroup' },
  'ariane-62': { name: 'Ariane 62', stages: 2, boosters: 2, height_m: 63, diameter_m: 5.4, liftoff_mass_t: 860, leo_kg: 10350, gto_kg: 5000, thrust_kn: 13600, engines: '1 × Vulcain 2.1 + 2 × P120C', first_flight: '2024-07-09', success_rate: 1.00, total_flights: 2, country: 'Europe', manufacturer: 'ArianeGroup' },
  'ariane-64': { name: 'Ariane 64', stages: 2, boosters: 4, height_m: 63, diameter_m: 5.4, liftoff_mass_t: 870, leo_kg: 21600, gto_kg: 11500, thrust_kn: 15340, engines: '1 × Vulcain 2.1 + 4 × P120C', first_flight: '2024-07-09', success_rate: 1.00, total_flights: 1, country: 'Europe', manufacturer: 'ArianeGroup' },
  'vega-c': { name: 'Vega-C', stages: 3, boosters: 0, height_m: 35, diameter_m: 3, liftoff_mass_t: 210, leo_kg: 2200, gto_kg: 0, thrust_kn: 4500, engines: 'P120C + Z23 + Z9', first_flight: '2022-07-13', success_rate: 0.67, total_flights: 3, country: 'Europe', manufacturer: 'Avio S.p.A' },
  'spectrum': { name: 'Spectrum', stages: 2, boosters: 0, height_m: 28, diameter_m: 2, liftoff_mass_t: 75, leo_kg: 1000, gto_kg: 0, thrust_kn: 750, engines: '液氧甲烷(Aquila)', first_flight: '2025-03-24', success_rate: 0.00, total_flights: 1, country: 'Europe', manufacturer: 'Isar Aerospace' },
  'rfa-one': { name: 'RFA One', stages: 3, boosters: 0, height_m: 30, diameter_m: 2, liftoff_mass_t: 80, leo_kg: 1300, gto_kg: 0, thrust_kn: 750, engines: '液氧煤油(Helios)', first_flight: '2025-01-01', success_rate: 0.00, total_flights: 0, country: 'Europe', manufacturer: 'Rocket Factory Augsburg' },
  'themis': { name: 'Themis Demonstrator', stages: 2, boosters: 0, height_m: 30, diameter_m: 3, liftoff_mass_t: 100, leo_kg: 0, gto_kg: 0, thrust_kn: 1000, engines: 'Prometheus(液氧甲烷)', first_flight: '2025-01-01', success_rate: 0.00, total_flights: 0, country: 'Europe', manufacturer: 'ArianeGroup' },

  // ===== 俄罗斯 =====
  'soyuz-2-1a': { name: 'Soyuz 2.1a', stages: 3, boosters: 4, height_m: 46.1, diameter_m: 2.95, liftoff_mass_t: 312, leo_kg: 7020, gto_kg: 3050, thrust_kn: 4200, engines: '5 × RD-107/108', first_flight: '2004-11-08', success_rate: 0.97, total_flights: 60, country: 'Russia', manufacturer: 'Roscosmos' },
  'soyuz-2-1b': { name: 'Soyuz 2.1b', stages: 3, boosters: 4, height_m: 46.1, diameter_m: 2.95, liftoff_mass_t: 312, leo_kg: 8200, gto_kg: 3550, thrust_kn: 4200, engines: '5 × RD-107/108A', first_flight: '2006-12-27', success_rate: 0.98, total_flights: 70, country: 'Russia', manufacturer: 'Roscosmos' },

  // ===== 日本 =====
  'h3': { name: 'H3', stages: 2, boosters: 2, height_m: 63, diameter_m: 5.2, liftoff_mass_t: 574, leo_kg: 4000, gto_kg: 7900, thrust_kn: 10000, engines: '2 × LE-9 + 2 × SRB-3', first_flight: '2023-03-07', success_rate: 0.50, total_flights: 4, country: 'Japan', manufacturer: 'Mitsubishi Heavy Industries' },

  // ===== 印度 =====
  'gslv-mk2': { name: 'GSLV Mk II', stages: 3, boosters: 4, height_m: 49.1, diameter_m: 4, liftoff_mass_t: 414, leo_kg: 5000, gto_kg: 2500, thrust_kn: 8000, engines: '4 × L40H + 1 × S200', first_flight: '2001-04-18', success_rate: 0.71, total_flights: 15, country: 'India', manufacturer: 'ISRO' },
  'lvm3': { name: 'LVM-3', stages: 3, boosters: 2, height_m: 43.4, diameter_m: 4, liftoff_mass_t: 640, leo_kg: 8000, gto_kg: 4000, thrust_kn: 10400, engines: '2 × S200 + 1 × L110', first_flight: '2014-12-18', success_rate: 1.00, total_flights: 7, country: 'India', manufacturer: 'ISRO' },
  'vikram-1': { name: 'Vikram-I', stages: 4, boosters: 0, height_m: 24, diameter_m: 2, liftoff_mass_t: 50, leo_kg: 480, gto_kg: 0, thrust_kn: 588, engines: '固体推进', first_flight: '2025-01-01', success_rate: 0.00, total_flights: 0, country: 'India', manufacturer: 'Skyroot Aerospace' },

  // ===== 韩国 =====
  'nuri': { name: 'Nuri', stages: 3, boosters: 0, height_m: 47.2, diameter_m: 3.5, liftoff_mass_t: 200, leo_kg: 1500, gto_kg: 0, thrust_kn: 2962, engines: '4 × KRE-075', first_flight: '2021-10-21', success_rate: 0.67, total_flights: 3, country: 'Korea', manufacturer: 'KARI' },
};

// LL2 rocket_config.id → 规格库 key 映射表
// 用于通过 LL2 返回的数字 ID 直接查找规格
RT.ROCKET_ID_MAP = {
  164: 'falcon-9-block-5',
  161: 'falcon-heavy',
  522: 'starship',
  49: 'long-march-2c',
  47: 'long-march-2d',
  50: 'long-march-3b',
  10: 'long-march-4b',
  128: 'long-march-5',
  478: 'long-march-6a',
  36: 'long-march-7',
  216: 'long-march-7a',
  35: 'long-march-8',
  518: 'long-march-8a',
  103: 'long-march-11',
  517: 'long-march-12',
  554: 'long-march-10b',
  241: 'kuaizhou-1a',
  215: 'zhuque-2',
  539: 'zhuque-3',
  443: 'hyperbola-2',
  503: 'gravity-1',
  483: 'kinetica-1',
  26: 'electron',
  200: 'vulcan-vc2',
  479: 'vulcan-vc6l',
  27: 'atlas-v',
  51: 'new-glenn',
  551: 'firefly-alpha',
  173: 'pegasus-xl',
  24: 'soyuz-2-1a',
  15: 'soyuz-2-1b',
  486: 'h3',
  168: 'gslv-mk2',
  172: 'lvm3',
  532: 'vikram-1',
  117: 'nuri',
  121: 'ariane-62',
  512: 'ariane-64',
  127: 'vega-c',
  491: 'spectrum',
  488: 'rfa-one',
  523: 'themis',
};

RT.getRocketSpec = function(id, name) {
  // 优先通过 LL2 id 映射查找
  if (id && RT.ROCKET_ID_MAP[id] && RT.ROCKET_SPECS[RT.ROCKET_ID_MAP[id]]) {
    return RT.ROCKET_SPECS[RT.ROCKET_ID_MAP[id]];
  }
  // 通过 slug 查找
  if (id && RT.ROCKET_SPECS[id]) return RT.ROCKET_SPECS[id];
  // 通过名称模糊匹配
  if (name) {
    const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (RT.ROCKET_SPECS[normalized]) return RT.ROCKET_SPECS[normalized];
    for (const key in RT.ROCKET_SPECS) {
      if (RT.ROCKET_SPECS[key].name === name) return RT.ROCKET_SPECS[key];
      // 部分匹配: LL2 返回的 name 可能含变体(如 "Long March 3B/E" vs "长征三号乙")
      const specName = RT.ROCKET_SPECS[key].name.toLowerCase();
      const ll2Name = name.toLowerCase();
      if (ll2Name.includes(specName) || specName.includes(ll2Name)) return RT.ROCKET_SPECS[key];
    }
  }
  return null;
};

RT.ROCKET_SPECS_UPDATED = '2026-07-01';
