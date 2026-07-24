window.RT = window.RT || {};
RT.cache = {
  KEY: 'rocket-tracker:cache:v1',
  QUOTA_KEY: 'rocket-tracker:quota',
  FRESH_MS: 60 * 60 * 1000,
  QUOTA_WINDOW_MS: 60 * 60 * 1000,

  save(data) {
    try { localStorage.setItem(this.KEY, JSON.stringify(data)); }
    catch (e) { console.error('[RT] cache.save failed:', e); }
  },
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { console.error('[RT] cache.load failed:', e); return null; }
  },
  isFresh() {
    const data = this.load();
    if (!data || !data.fetched_at) return false;
    return (Date.now() - data.fetched_at) < this.FRESH_MS;
  },
  clear() { localStorage.removeItem(this.KEY); },

  getQuotaUsed() {
    try {
      const raw = localStorage.getItem(this.QUOTA_KEY);
      if (!raw) return 0;
      const q = JSON.parse(raw);
      if (Date.now() - q.window_start > this.QUOTA_WINDOW_MS) return 0;
      return q.used;
    } catch (e) { return 0; }
  },
  incrementQuota(count) {
    const used = this.getQuotaUsed();
    const windowStart = this.getQuotaWindowStart();
    const q = (windowStart && Date.now() - windowStart <= this.QUOTA_WINDOW_MS)
      ? { used: used + count, window_start: windowStart }
      : { used: count, window_start: Date.now() };
    localStorage.setItem(this.QUOTA_KEY, JSON.stringify(q));
  },
  getQuotaWindowStart() {
    try {
      const raw = localStorage.getItem(this.QUOTA_KEY);
      return raw ? JSON.parse(raw).window_start : null;
    } catch (e) { return null; }
  },
  getQuotaRemaining(limit) { return Math.max(0, limit - this.getQuotaUsed()); }
};
