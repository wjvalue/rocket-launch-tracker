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
