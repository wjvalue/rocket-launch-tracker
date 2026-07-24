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
