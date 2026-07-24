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
