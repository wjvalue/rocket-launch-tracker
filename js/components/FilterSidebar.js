window.RT = window.RT || {};
RT.FilterSidebar = {
  name: 'FilterSidebar',
  props: ['store'],
  template: `
    <div class="h-full flex flex-col">
      <div class="rt-eyebrow mb-2">// PROVIDERS</div>
      <input v-model="search" placeholder="search..." class="rt-input w-full mb-3">
      <div class="flex-1 overflow-y-auto">
        <div v-for="group in providerGroups" :key="group.country" class="mb-3">
          <div class="flex items-center gap-1.5 mt-1 mb-1 pb-1" style="border-bottom: 1px solid var(--rt-border);">
            <span class="rt-text-tertiary text-[8px]">▸</span>
            <span class="rt-eyebrow" :style="{ color: group.color }">{{ group.name_zh }}</span>
            <span class="rt-text-faint text-[9px] ml-auto">[{{ group.providers.length }}]</span>
          </div>
          <div v-for="p in group.providers" :key="p.id"
            @click="store.toggleProvider(p.id)"
            class="cursor-pointer py-1 px-1 flex items-center gap-2 text-xs rt-row"
            :class="isProviderChecked(p.id) ? 'rt-text' : 'rt-text-secondary'">
            <span :style="{ color: getProviderColor(p.id), opacity: isProviderChecked(p.id) ? 1 : 0.4 }">●</span>
            <span class="truncate">{{ getProviderName(p.id) }}</span>
            <span class="rt-text-faint ml-auto text-[10px]">{{ countByProvider(p.id) }}</span>
          </div>
        </div>
      </div>

      <div class="rt-eyebrow mt-3 mb-2 pt-3" style="border-top: 1px solid var(--rt-border);">// STATUS</div>
      <div>
        <div v-for="s in statusOptions" :key="s.value"
          @click="store.toggleStatus(s.value)"
          class="cursor-pointer py-1 px-1 flex items-center gap-2 text-xs rt-row"
          :class="isStatusChecked(s.value) ? 'rt-text' : 'rt-text-secondary'">
          <span :style="{ color: s.color, opacity: isStatusChecked(s.value) ? 1 : 0.4 }">●</span>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      search: '',
      statusOptions: [
        { value: 'TBD', label: 'TBD 计划中', color: 'var(--rt-warning)' },
        { value: 'Go', label: 'GO 倒计时', color: 'var(--rt-success)' },
        { value: 'In Flight', label: 'FLIGHT 发射中', color: 'var(--rt-danger)' },
        { value: 'Success', label: 'OK 已完成', color: 'var(--rt-success)' },
        { value: 'Failure', label: 'FAIL 失败', color: 'var(--rt-danger)' },
        { value: 'Partial Failure', label: 'PART 部分失败', color: 'var(--rt-warning)' },
        { value: 'Hold', label: 'HOLD 暂停', color: 'var(--rt-hold)' }
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
      // 冷白灰底:用深蓝黑透明度作为分组标题色,中国组最强调
      const colors = {
        China: 'rgba(15, 23, 42, 0.95)', USA: 'rgba(15, 23, 42, 0.78)', Europe: 'rgba(15, 23, 42, 0.68)',
        Russia: 'rgba(15, 23, 42, 0.68)', Japan: 'rgba(15, 23, 42, 0.58)', India: 'rgba(15, 23, 42, 0.58)',
        Korea: 'rgba(15, 23, 42, 0.58)', Unknown: 'rgba(15, 23, 42, 0.38)'
      };
      this.allProviders.forEach(p => {
        const mfr = RT.getManufacturer(p.id);
        const country = mfr.country || 'Unknown';
        if (!groups[country]) groups[country] = { country, name_zh: this.countryNameZh(country), color: colors[country] || 'rgba(15, 23, 42, 0.48)', providers: [] };
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
      return mfr.color || 'rgba(15, 23, 42, 0.5)';
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
