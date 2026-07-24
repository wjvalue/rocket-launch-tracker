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
