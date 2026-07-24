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
    setup() {
      Vue.watch(() => store.ui.drawerOpen, (open) => {
        if (RT.ParticleField && window.innerWidth >= 1024) {
          const w = window.innerWidth;
          RT.ParticleField.burst(w - 200, window.innerHeight / 2, { radius: open ? 120 : 100 });
        }
      });
      return { store };
    },
    template: `
      <div class="rt-canvas-stage">
        <top-bar :store="store" @refresh="onRefresh" />

        <!-- 筛选面板: 桌面浮动 / 窄屏滑入 -->
        <filter-sidebar
          v-if="store.ui.screenWidth >= 1024"
          :store="store"
          class="rt-panel rt-panel--filter rt-corner-deco" />
        <teleport to="body" v-else>
          <div
            v-if="store.ui.sidebarOpen"
            class="fixed inset-0 z-40"
            style="background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);"
            @click="store.ui.sidebarOpen = false">
            <filter-sidebar
              :store="store"
              class="rt-panel rt-panel--filter rt-panel--filter--open rt-corner-deco" />
          </div>
        </teleport>

        <!-- 主面板: 中央浮动,详情打开时让出空间 -->
        <main-panel
          :store="store"
          :class="['rt-panel rt-panel--main rt-corner-deco', store.ui.drawerOpen && store.ui.screenWidth >= 1024 ? 'rt-panel--main--with-detail' : '']" />

        <!-- 详情面板: 浮动浮现 -->
        <detail-drawer
          v-if="store.ui.drawerOpen"
          :store="store"
          :fullscreen="store.ui.screenWidth < 1024"
          class="rt-panel rt-panel--detail rt-corner-deco"
          @open="onDetailOpen"
          @close="onDetailClose" />

        <!-- 底部状态栏 -->
        <footer class="rt-statusbar">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5">
              <span class="rt-dot rt-dot-pulse" :style="{ background: store.meta.online ? 'var(--rt-success)' : 'var(--rt-danger)' }"></span>
              <span>{{ store.meta.online ? 'ONLINE' : 'OFFLINE' }}</span>
            </span>
            <span>QUOTA {{ store.meta.quotaRemaining }}/25</span>
            <span>{{ store.launches.length }} LAUNCHES</span>
          </div>
          <div class="flex items-center gap-4">
            <span>FPS {{ fps }}</span>
            <span>{{ clock }}</span>
          </div>
        </footer>

        <!-- 通知(浮动右上) -->
        <div v-if="store.meta.loading" class="fixed top-20 right-6 z-50 px-3 py-1.5 text-xs rt-text-mono flex items-center gap-2"
          style="background: var(--rt-bg-panel); backdrop-filter: var(--rt-blur); border: 1px solid var(--rt-border-glow); color: var(--rt-text);">
          <span class="rt-dot rt-dot-pulse" style="background: var(--rt-warning);"></span>
          <span>SYNCING</span>
        </div>
        <div v-if="store.meta.error && !store.meta.online" class="fixed top-20 right-6 z-50 px-3 py-1.5 text-xs rt-text-mono flex items-center gap-2"
          style="background: var(--rt-bg-panel); backdrop-filter: var(--rt-blur); border: 1px solid var(--rt-danger); color: var(--rt-danger);">
          <span class="rt-dot rt-dot-pulse" style="background: var(--rt-danger);"></span>
          <span>OFFLINE · LAST SYNC {{ formatTime(store.meta.lastFetchedAt) }}</span>
        </div>
        <div v-else-if="store.meta.error" class="fixed top-20 right-6 z-50 px-3 py-1.5 text-xs rt-text-mono flex items-center gap-2"
          style="background: var(--rt-bg-panel); backdrop-filter: var(--rt-blur); border: 1px solid var(--rt-warning); color: var(--rt-warning);">
          <span class="rt-dot rt-dot-pulse" style="background: var(--rt-warning);"></span>
          <span>{{ store.meta.error.message }}</span>
        </div>
      </div>
    `,
    data() {
      return { fps: 60, clock: '--:--:--', fpsTimer: null, clockTimer: null };
    },
    methods: {
      onRefresh,
      formatTime(ts) { return ts ? RT.time.formatLocal(ts, this.store.timezone) : 'NEVER'; },
      onDetailOpen() {
        // 详情打开时触发粒子爆发
        if (RT.ParticleField && window.innerWidth >= 1024) {
          const w = window.innerWidth;
          RT.ParticleField.burst(w - 200, window.innerHeight / 2, { radius: 120 });
        }
      },
      onDetailClose() {
        if (RT.ParticleField && window.innerWidth >= 1024) {
          const w = window.innerWidth;
          RT.ParticleField.burst(w - 200, window.innerHeight / 2, { radius: 100 });
        }
      },
      updateFps() {
        if (RT.ParticleField && RT.ParticleField.getFps) {
          this.fps = RT.ParticleField.getFps();
        }
      },
      updateClock() {
        const d = new Date();
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        const s = String(d.getSeconds()).padStart(2, '0');
        this.clock = h + ':' + m + ':' + s;
      }
    },
    mounted() {
      this.fpsTimer = setInterval(() => this.updateFps(), 1000);
      this.clockTimer = setInterval(() => this.updateClock(), 1000);
      this.updateClock();
    },
    unmounted() {
      if (this.fpsTimer) clearInterval(this.fpsTimer);
      if (this.clockTimer) clearInterval(this.clockTimer);
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
