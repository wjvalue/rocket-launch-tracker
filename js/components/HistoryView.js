window.RT = window.RT || {};
RT.HistoryView = {
  name: 'HistoryView',
  props: ['store'],
  template: `
    <div class="p-4 h-full overflow-y-auto">
      <div class="rt-card p-3 mb-4 rt-text-mono text-xs">
        <div class="flex items-center gap-2 mb-3 rt-eyebrow">
          <span class="rt-text-tertiary">▸</span> HISTORY · STATISTICS
        </div>
        <div class="grid grid-cols-4 gap-4">
          <div>
            <div class="rt-text-faint text-[9px] uppercase tracking-wider">TOTAL</div>
            <div class="rt-text text-lg" style="font-weight: 300;">{{ historyList.length }}</div>
          </div>
          <div>
            <div class="rt-text-faint text-[9px] uppercase tracking-wider">SUCCESS</div>
            <div class="text-lg rt-text" style="font-weight: 300;">{{ successCount }}</div>
          </div>
          <div>
            <div class="rt-text-faint text-[9px] uppercase tracking-wider">FAILURE</div>
            <div class="text-lg rt-text" style="font-weight: 300;">{{ failureCount }}</div>
          </div>
          <div>
            <div class="rt-text-faint text-[9px] uppercase tracking-wider">RATE</div>
            <div class="text-lg rt-text" style="font-weight: 300;">{{ successRate }}<span class="text-xs rt-text-tertiary">%</span></div>
            <div class="rt-meter mt-1">
              <div class="rt-meter-fill" :style="{ width: successRate + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
      <table class="w-full text-xs rt-text-mono">
        <thead class="sticky top-0 z-10" style="background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(8px);">
          <tr class="rt-eyebrow" style="border-bottom: 1px solid var(--rt-border-bright);">
            <th class="text-left py-2">▸ DATE</th>
            <th class="text-left py-2">ROCKET</th>
            <th class="text-left py-2">PROVIDER</th>
            <th class="text-left py-2">PAYLOAD</th>
            <th class="text-left py-2">RESULT</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in historyList" :key="l.id"
            @click="store.selectLaunch(l.id)"
            :class="store.selectedLaunchId === l.id ? 'rt-selected' : 'rt-row'"
            class="cursor-pointer" style="border-bottom: 1px solid var(--rt-border);">
            <td class="py-2 rt-text-secondary">{{ formatTime(l.net) }}</td>
            <td class="py-2 rt-text">{{ l.rocket_config ? l.rocket_config.name : '—' }}</td>
            <td class="py-2"><span :style="{ color: providerColor(l), opacity: 0.8 }">●</span> <span class="rt-text-secondary">{{ providerName(l) }}</span></td>
            <td class="py-2 rt-text-tertiary truncate" style="max-width: 120px;">{{ l.mission ? l.mission.name : '—' }}</td>
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
      return p ? p.color : 'rgba(15, 23, 42, 0.4)';
    },
    providerName(l) {
      if (!l.provider) return '—';
      const p = RT.PRESET_MANUFACTURERS.find(m => m.id === l.provider.id);
      return p ? p.name_zh : l.provider.name;
    },
    resultClass(s) {
      if (s === 'Success') return 'rt-text-secondary';
      if (s === 'Failure' || s === 'Partial Failure') return 'rt-text';
      if (s === 'In Flight') return 'rt-flight-pulse rt-text';
      return 'rt-text-tertiary';
    },
    resultBadge(s) {
      const map = { 'Success':'✓ OK','Failure':'✗ FAIL','Partial Failure':'▲ PART','In Flight':'◉ FLIGHT' };
      return map[s] || '— TBD';
    }
  }
};
