window.RT = window.RT || {};
RT.HistoryView = {
  name: 'HistoryView',
  props: ['store'],
  template: `
    <div class="p-4 bg-rt-bg h-full overflow-y-auto">
      <div class="rt-card p-3 mb-3 rt-text-mono text-xs">
        <div class="flex items-center gap-2 mb-2 rt-eyebrow">
          <span class="rt-text-accent">▸</span> HISTORY · STATISTICS
        </div>
        <div class="grid grid-cols-4 gap-3">
          <div>
            <div class="rt-text-dim text-[9px] uppercase tracking-wider">总数</div>
            <div class="rt-text text-lg">{{ historyList.length }}</div>
          </div>
          <div>
            <div class="rt-text-dim text-[9px] uppercase tracking-wider">成功</div>
            <div class="text-lg" style="color: var(--rt-cyan);">{{ successCount }}</div>
          </div>
          <div>
            <div class="rt-text-dim text-[9px] uppercase tracking-wider">失败</div>
            <div class="text-lg" style="color: var(--rt-red);">{{ failureCount }}</div>
          </div>
          <div>
            <div class="rt-text-dim text-[9px] uppercase tracking-wider">成功率</div>
            <div class="text-lg" :style="{ color: successRate >= 90 ? 'var(--rt-green)' : successRate >= 70 ? 'var(--rt-yellow)' : 'var(--rt-red)' }">
              {{ successRate }}<span class="text-xs">%</span>
            </div>
            <div class="rt-meter mt-1">
              <div class="rt-meter-fill" :style="{ width: successRate + '%', background: successRate >= 90 ? 'var(--rt-green)' : successRate >= 70 ? 'var(--rt-yellow)' : 'var(--rt-red)' }"></div>
            </div>
          </div>
        </div>
      </div>
      <table class="w-full text-xs rt-text-mono">
        <thead class="sticky top-0 bg-rt-bg z-10">
          <tr class="border-b border-rt-border-bright rt-eyebrow">
            <th class="text-left py-2">▸ 日期</th>
            <th class="text-left py-2">火箭</th>
            <th class="text-left py-2">厂商</th>
            <th class="text-left py-2">载荷</th>
            <th class="text-left py-2">结果</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in historyList" :key="l.id"
            @click="store.selectLaunch(l.id)"
            :class="store.selectedLaunchId === l.id ? 'rt-selected' : 'rt-row'"
            class="cursor-pointer border-b border-rt-border">
            <td class="py-2 rt-text-muted">{{ formatTime(l.net) }}</td>
            <td class="py-2 rt-text">{{ l.rocket_config ? l.rocket_config.name : '—' }}</td>
            <td class="py-2"><span :style="{ color: providerColor(l) }">●</span> <span class="rt-text-muted">{{ providerName(l) }}</span></td>
            <td class="py-2 rt-text-dim">{{ l.mission ? l.mission.name : '—' }}</td>
            <td class="py-2" :class="resultClass(l.status)" style="font-weight: 500;">{{ resultBadge(l.status) }}</td>
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
    resultClass(s) {
      if (s === 'Success') return 'rt-text-cyan';
      if (s === 'Failure' || s === 'Partial Failure') return 'text-red-400';
      if (s === 'In Flight') return 'text-red-400 rt-flight-pulse';
      return 'rt-text-dim';
    },
    resultBadge(s) {
      const map = { 'Success':'✓ OK','Failure':'✗ FAIL','Partial Failure':'▲ PART','In Flight':'◉ FLIGHT' };
      return map[s] || '— TBD';
    }
  }
};
