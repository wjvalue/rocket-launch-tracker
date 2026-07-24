window.RT = window.RT || {};
RT.FilterSidebar = {
  name: 'FilterSidebar',
  props: ['store'],
  template: `
    <aside class="bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto" style="width: 220px;">
      <div class="text-xs text-slate-500 uppercase tracking-wide mb-2">厂商筛选</div>
      <input v-model="search" placeholder="搜索厂商..."
        class="w-full mb-3 px-2 py-1 text-xs border border-slate-200 rounded">
      <div class="bg-white border border-slate-200 rounded p-2 text-xs">
        <div v-for="group in providerGroups" :key="group.country">
          <div class="font-semibold text-slate-700 mt-2 mb-1">{{ group.name_zh }}</div>
          <div v-for="p in group.providers" :key="p.id"
            @click="store.toggleProvider(p.id)"
            class="cursor-pointer py-0.5 flex items-center gap-1">
            <span :style="{ color: getProviderColor(p.id) }">{{ isProviderChecked(p.id) ? '☑' : '☐' }}</span>
            <span>{{ getProviderName(p.id) }}</span>
            <span class="text-slate-400 ml-auto">({{ countByProvider(p.id) }})</span>
          </div>
        </div>
        <div v-if="otherProviders.length > 0">
          <div class="font-semibold text-slate-700 mt-2 mb-1">其他</div>
          <div v-for="p in otherProviders" :key="p.id"
            @click="store.toggleProvider(p.id)"
            class="cursor-pointer py-0.5 flex items-center gap-1">
            <span :style="{ color: getProviderColor(p.id) }">{{ isProviderChecked(p.id) ? '☑' : '☐' }}</span>
            <span>{{ p.name }}</span>
          </div>
        </div>
      </div>

      <div class="text-xs text-slate-500 uppercase tracking-wide mt-4 mb-2">状态</div>
      <div class="bg-white border border-slate-200 rounded p-2 text-xs">
        <div v-for="s in statusOptions" :key="s.value"
          @click="store.toggleStatus(s.value)"
          class="cursor-pointer py-0.5 flex items-center gap-1">
          <span>{{ isStatusChecked(s.value) ? '☑' : '☐' }}</span>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </aside>
  `,
  data() {
    return {
      search: '',
      statusOptions: [
        { value: 'TBD', label: '计划中' },
        { value: 'Go', label: '倒计时' },
        { value: 'In Flight', label: '发射中' },
        { value: 'Success', label: '已完成' },
        { value: 'Failure', label: '失败' },
        { value: 'Partial Failure', label: '部分失败' },
        { value: 'Hold', label: '暂停' }
      ]
    };
  },
  computed: {
    allProviders() {
      const list = this.store.providersFromLaunches();
      if (!this.search) return list;
      const s = this.search.toLowerCase();
      return list.filter(p => p.name.toLowerCase().includes(s));
    },
    providerGroups() {
      const groups = {};
      this.allProviders.forEach(p => {
        const preset = RT.PRESET_MANUFACTURERS.find(m => m.name === p.name);
        const country = preset ? preset.country : 'Unknown';
        if (!groups[country]) groups[country] = { country, name_zh: this.countryNameZh(country), providers: [] };
        groups[country].providers.push(p);
      });
      const order = ['USA', 'China', 'Europe', 'Russia', 'Unknown'];
      return order.map(c => groups[c]).filter(g => g && g.providers.length > 0);
    },
    otherProviders() {
      return this.allProviders.filter(p => !RT.PRESET_MANUFACTURERS.find(m => m.name === p.name));
    }
  },
  methods: {
    countryNameZh(code) {
      return { USA: '美国', China: '中国', Europe: '欧洲', Russia: '俄罗斯', Unknown: '其他' }[code] || code;
    },
    isProviderChecked(id) { return this.store.filters.providerIds.includes(id); },
    isStatusChecked(s) { return this.store.filters.statuses.includes(s); },
    getProviderColor(id) {
      const p = this.allProviders.find(x => x.id === id);
      const preset = p ? RT.PRESET_MANUFACTURERS.find(m => m.name === p.name) : null;
      return preset ? preset.color : '#94a3b8';
    },
    getProviderName(id) {
      const p = this.allProviders.find(x => x.id === id);
      if (!p) return '未知';
      const preset = RT.PRESET_MANUFACTURERS.find(m => m.name === p.name);
      return preset ? preset.name_zh : p.name;
    },
    countByProvider(id) {
      return this.store.launches.filter(l => l.provider && l.provider.id === id).length;
    }
  }
};
