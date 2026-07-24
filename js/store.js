window.RT = window.RT || {};
RT.store = {
  create() {
    const { reactive, computed } = Vue;
    const state = reactive({
      launches: [],
      view: 'calendar',
      timezone: 'Asia/Shanghai',
      selectedLaunchId: null,
      filters: {
        providerIds: [],
        statuses: ['Go', 'In Flight']
      },
      meta: {
        online: (typeof navigator !== 'undefined') ? navigator.onLine : true,
        lastFetchedAt: null,
        quotaRemaining: 25,
        cooldownUntil: 0,
        loading: false,
        error: null
      },
      ui: {
        calendarMonth: new Date().getMonth(),
        calendarYear: new Date().getFullYear(),
        screenWidth: (typeof window !== 'undefined') ? window.innerWidth : 1280,
        sidebarOpen: false,
        drawerFullscreen: false,
        drawerOpen: false
      }
    });

    state.filteredLaunches = computed(() => {
      const ids = new Set(state.filters.providerIds);
      const statuses = new Set(state.filters.statuses);
      return state.launches.filter(l => {
        if (ids.size > 0 && (!l.provider || !ids.has(l.provider.id))) return false;
        if (statuses.size > 0 && !statuses.has(l.status)) return false;
        return true;
      });
    });

    state.selectedLaunch = computed(() => {
      if (!state.selectedLaunchId) return null;
      return state.launches.find(l => l.id === state.selectedLaunchId) || null;
    });

    state.setLaunches = (items) => {
      const map = new Map();
      state.launches.forEach(l => map.set(l.id, l));
      items.forEach(l => map.set(l.id, l));
      state.launches = Array.from(map.values());
      state.launches.sort((a, b) => new Date(a.net) - new Date(b.net));
    };

    state.setFilterProviderIds = (ids) => { state.filters.providerIds = ids.slice(); };
    state.setFilterStatuses = (statuses) => { state.filters.statuses = statuses.slice(); };

    state.toggleProvider = (id) => {
      const i = state.filters.providerIds.indexOf(id);
      if (i >= 0) state.filters.providerIds.splice(i, 1);
      else state.filters.providerIds.push(id);
    };

    state.toggleStatus = (status) => {
      const i = state.filters.statuses.indexOf(status);
      if (i >= 0) state.filters.statuses.splice(i, 1);
      else state.filters.statuses.push(status);
    };

    state.selectLaunch = (id) => {
      state.selectedLaunchId = id;
      state.ui.drawerOpen = !!id;
    };

    state.setTimezone = (tz) => { state.timezone = tz; };
    state.setView = (v) => { state.view = v; };

    state.providersFromLaunches = () => {
      const map = new Map();
      state.launches.forEach(l => {
        if (l.provider) map.set(l.provider.id, l.provider);
      });
      return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
    };

    // 屏幕宽度监听(窄屏检测)
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        state.ui.screenWidth = window.innerWidth;
        state.ui.drawerFullscreen = window.innerWidth < 1024;
      });
      state.ui.drawerFullscreen = window.innerWidth < 1024;
    }

    return state;
  }
};
