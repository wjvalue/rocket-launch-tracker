window.RT = window.RT || {};
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Vue === 'undefined') return;
  const store = RT.store.create();
  RT._store = store;

  async function loadData(force = false) {
    if (!force) {
      const cached = RT.cache.load();
      if (cached && cached.launches) {
        store.setLaunches(cached.launches);
        store.meta.lastFetchedAt = cached.fetched_at;
      }
    }
    if (!force && RT.cache.isFresh()) return;
    if (Date.now() < store.meta.cooldownUntil) return;

    store.meta.loading = true;
    store.meta.error = null;
    try {
      const [upcoming, previous] = await Promise.all([
        RT.ll2Client.fetchUpcoming(),
        RT.ll2Client.fetchPrevious()
      ]);
      RT.cache.incrementQuota(2);
      store.meta.quotaRemaining = RT.cache.getQuotaRemaining(25);
      const all = upcoming.concat(previous);
      const filtered = RT.ll2Client.filterByDateRange(all, Date.now(), 30, 90);
      store.setLaunches(filtered);
      RT.cache.save({ launches: filtered, fetched_at: Date.now(), source: 'll2' });
      store.meta.lastFetchedAt = Date.now();
      store.meta.cooldownUntil = Date.now() + 5 * 60 * 1000;
    } catch (e) {
      store.meta.error = e;
      if (e.name === 'RateLimitError') {
        store.meta.error = new Error('LL2 限速中,使用缓存数据');
        // 限速时:若无缓存数据,加载种子数据兜底
        if (store.launches.length === 0 && RT.SEED_LAUNCHES) {
          store.setLaunches(RT.SEED_LAUNCHES);
        }
      }
      else if (e.name === 'FetchError') {
        store.meta.online = false;
        // 离线时:若无缓存数据,加载种子数据兜底
        if (store.launches.length === 0 && RT.SEED_LAUNCHES) {
          store.setLaunches(RT.SEED_LAUNCHES);
        }
      }
    } finally {
      store.meta.loading = false;
    }
  }

  function onRefresh() { loadData(true); }
  RT.refresh = loadData;

  window.addEventListener('online', () => { store.meta.online = true; });
  window.addEventListener('offline', () => { store.meta.online = false; });

  loadData();
  setInterval(() => loadData(), 60 * 60 * 1000);

  const app = Vue.createApp({
    setup() { return { store }; },
    template: `
      <div class="flex flex-col h-screen">
        <top-bar :store="store" @refresh="onRefresh" />
        <div class="flex flex-1 overflow-hidden relative">
          <filter-sidebar v-if="store.ui.screenWidth >= 1024" :store="store" />
          <teleport to="body" v-else>
            <div v-if="store.ui.sidebarOpen" class="fixed inset-0 z-40" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);" @click="store.ui.sidebarOpen = false">
              <div class="absolute left-0 top-0 bottom-0" @click.stop><filter-sidebar :store="store" /></div>
            </div>
          </teleport>
          <main-panel :store="store" />
          <detail-drawer v-if="store.ui.screenWidth >= 1024 && !store.ui.drawerFullscreen" :store="store" />
          <teleport to="body" v-else>
            <div v-if="store.ui.drawerOpen" class="fixed inset-0 z-50 overflow-y-auto" style="background: var(--rt-bg-panel);">
              <detail-drawer :store="store" :fullscreen="true" />
            </div>
          </teleport>
        </div>
        <div v-if="store.meta.loading" class="fixed top-16 right-4 z-50 px-3 py-1.5 text-xs rt-text-mono flex items-center gap-2"
          style="background: var(--rt-bg-card); border: 1px solid var(--rt-accent); color: var(--rt-accent);">
          <span class="rt-pulse-dot rt-pulse-amber"></span>
          <span>SYNCING...</span>
        </div>
        <div v-if="store.meta.error && !store.meta.online" class="fixed top-16 right-4 z-50 px-3 py-1.5 text-xs rt-text-mono flex items-center gap-2"
          style="background: var(--rt-bg-card); border: 1px solid var(--rt-red); color: var(--rt-red);">
          <span class="rt-pulse-dot rt-pulse-red"></span>
          <span>OFFLINE · LAST SYNC {{ formatTime(store.meta.lastFetchedAt) }}</span>
        </div>
        <div v-else-if="store.meta.error" class="fixed top-16 right-4 z-50 px-3 py-1.5 text-xs rt-text-mono flex items-center gap-2"
          style="background: var(--rt-bg-card); border: 1px solid var(--rt-yellow); color: var(--rt-yellow);">
          <span class="rt-pulse-dot rt-pulse-amber"></span>
          <span>{{ store.meta.error.message }}</span>
        </div>
      </div>
    `,
    methods: {
      onRefresh,
      formatTime(ts) { return ts ? RT.time.formatLocal(ts, this.store.timezone) : 'NEVER'; }
    }
  });

  app.component('top-bar', RT.TopBar);
  app.component('filter-sidebar', RT.FilterSidebar);
  app.component('main-panel', RT.MainPanel);
  app.component('calendar-view', RT.CalendarView);
  app.component('list-view', RT.ListView);
  app.component('history-view', RT.HistoryView);
  app.component('detail-drawer', RT.DetailDrawer);
  app.mount('#app');
});
