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
