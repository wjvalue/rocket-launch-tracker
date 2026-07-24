window.RT = window.RT || {};
RT.HistoryView = {
  name: 'HistoryView',
  props: ['store'],
  template: `
    <div class="p-4 bg-white h-full overflow-y-auto">
      <div class="text-xs text-slate-500 mb-3 p-3 bg-slate-50 rounded">
        共 {{ historyList.length }} 次 · 成功 {{ successCount }} · 失败 {{ failureCount }} · 成功率 {{ successRate }}%
      </div>
      <table class="w-full text-xs">
        <thead class="sticky top-0 bg-white">
          <tr class="border-b border-slate-200 text-slate-600">
            <th class="text-left py-2">日期</th>
            <th class="text-left py-2">火箭</th>
            <th class="text-left py-2">厂商</th>
            <th class="text-left py-2">载荷</th>
            <th class="text-left py-2">结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in historyList" :key="l.id"
            @click="store.selectLaunch(l.id)"
            class="cursor-pointer hover:bg-slate-50 border-b border-slate-100">
            <td class="py-2">{{ formatTime(l.net) }}</td>
            <td class="py-2">{{ l.rocket_config ? l.rocket_config.name : '—' }}</td>
            <td class="py-2"><span :style="{ color: providerColor(l) }">●</span> {{ providerName(l) }}</td>
            <td class="py-2">{{ l.mission ? l.mission.name : '—' }}</td>
            <td class="py-2">{{ resultBadge(l.status) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  computed: {
    historyList() {
      const now = Date.now();
      return this.store.filteredLaunches.filter(l => new Date(l.net).getTime() < now);
    },
    successCount() { return this.historyList.filter(l => l.status === 'Success').length; },
    failureCount() { return this.historyList.filter(l => l.status === 'Failure' || l.status === 'Partial Failure').length; },
    successRate() {
      if (this.historyList.length === 0) return 0;
      return Math.round((this.successCount / this.historyList.length) * 100);
    }
  },
  methods: {
    formatTime(iso) { return RT.time.formatLocal(new Date(iso).getTime(), this.store.timezone); },
    providerColor(l) {
      const p = l.provider ? RT.PRESET_MANUFACTURERS.find(m => m.id === l.provider.id) : null;
      return p ? p.color : '#94a3b8';
    },
    providerName(l) {
      if (!l.provider) return '—';
      const p = RT.PRESET_MANUFACTURERS.find(m => m.id === l.provider.id);
      return p ? p.name_zh : l.provider.name;
    },
    resultBadge(s) {
      const map = { 'Success':'✓ 成功','Failure':'✗ 失败','Partial Failure':'▲ 部分失败','In Flight':'🔴 进行中' };
      return map[s] || '— 待确认';
    }
  }
};
