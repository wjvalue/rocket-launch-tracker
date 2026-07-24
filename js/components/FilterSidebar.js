window.RT = window.RT || {};
RT.FilterSidebar = {
  name: 'FilterSidebar',
  props: ['store'],
  template: `
    <aside class="bg-rt-panel border-r border-rt-border p-3 overflow-y-auto" style="width: 220px;">
      <div class="rt-eyebrow mb-2">// PROVIDERS</div>
      <input v-model="search" placeholder="search..." class="rt-input w-full mb-3">
      <div class="rt-card p-2">
        <div v-for="group in providerGroups" :key="group.country" class="mb-2">
          <div class="flex items-center gap-1.5 mt-1.5 mb-1">
            <span class="text-[8px]" :style="{ color: group.color }">▶</span>
            <span class="rt-eyebrow" :style="{ color: group.color }">{{ group.name_zh }}</span>
            <span class="rt-text-dim text-[9px] ml-auto">[{{ group.providers.length }}]</span>
          </div>
          <div v-for="p in group.providers" :key="p.id"
            @click="store.toggleProvider(p.id)"
            class="cursor-pointer py-0.5 px-1 flex items-center gap-1.5 text-xs rt-row"
            :class="isProviderChecked(p.id) ? 'rt-text-accent' : 'rt-text-muted'">
            <span :style="{ color: getProviderColor(p.id) }">{{ isProviderChecked(p.id) ? '◆' : '◇' }}</span>
            <span class="truncate">{{ getProviderName(p.id) }}</span>
            <span class="rt-text-dim ml-auto text-[10px]">{{ countByProvider(p.id) }}</span>
          </div>
        </div>
      </div>

      <div class="rt-eyebrow mt-4 mb-2">// STATUS</div>
      <div class="rt-card p-2">
        <div v-for="s in statusOptions" :key="s.value"
          @click="store.toggleStatus(s.value)"
          class="cursor-pointer py-0.5 px-1 flex items-center gap-1.5 text-xs rt-row"
          :class="isStatusChecked(s.value) ? 'rt-text-accent' : 'rt-text-muted'">
          <span :style="{ color: s.color }">{{ isStatusChecked(s.value) ? '◆' : '◇' }}</span>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </aside>
  `,
  data() {
    return {
      search: '',
      statusOptions: [
        { value: 'TBD', label: 'TBD 计划中', color: '#fbbf24' },
        { value: 'Go', label: 'GO 倒计时', color: '#10b981' },
        { value: 'In Flight', label: 'FLIGHT 发射中', color: '#ef4444' },
        { value: 'Success', label: 'OK 已完成', color: '#22d3ee' },
        { value: 'Failure', label: 'FAIL 失败', color: '#dc2626' },
        { value: 'Partial Failure', label: 'PART 部分失败', color: '#f97316' },
        { value: 'Hold', label: 'HOLD 暂停', color: '#a855f7' }
      ]
    };
  },
  computed: {
    allProviders() {
      const list = this.store.providersFromLaunches();
      if (!this.search) return list;
      const s = this.search.toLowerCase();
      return list.filter(p => {
        const mfr = RT.getManufacturer(p.id);
        const names = [p.name, mfr.name_zh || '', mfr.name || ''].join(' ').toLowerCase();
        return names.includes(s);
      });
    },
    providerGroups() {
      const groups = {};
      const colors = {
        China: '#dc2626', USA: '#3b82f6', Europe: '#fbbf24', Russia: '#ef4444',
        Japan: '#06b6d4', India: '#f59e0b', Korea: '#0d9488', Unknown: '#5a6a85'
      };
      this.allProviders.forEach(p => {
        const mfr = RT.getManufacturer(p.id);
        const country = mfr.country || 'Unknown';
        if (!groups[country]) groups[country] = { country, name_zh: this.countryNameZh(country), color: colors[country] || '#5a6a85', providers: [] };
        groups[country].providers.push(p);
      });
      const order = ['China', 'USA', 'Europe', 'Russia', 'Japan', 'India', 'Korea', 'Unknown'];
      return order.map(c => groups[c]).filter(g => g && g.providers.length > 0);
    }
  },
  methods: {
    countryNameZh(code) {
      return {
        China: '中国 CN', USA: '美国 US', Europe: '欧洲 EU', Russia: '俄罗斯 RU',
        Japan: '日本 JP', India: '印度 IN', Korea: '韩国 KR', Unknown: '其他 ??'
      }[code] || code;
    },
    isProviderChecked(id) { return this.store.filters.providerIds.includes(id); },
    isStatusChecked(s) { return this.store.filters.statuses.includes(s); },
    getProviderColor(id) {
      const mfr = RT.getManufacturer(id);
      return mfr.color || '#94a3b8';
    },
    getProviderName(id) {
      const p = this.allProviders.find(x => x.id === id);
      if (!p) return '未知';
      const mfr = RT.getManufacturer(p.id);
      return mfr.isFallback ? p.name : (mfr.name_zh || p.name);
    },
    countByProvider(id) {
      return this.store.launches.filter(l => l.provider && l.provider.id === id).length;
    }
  }
};
