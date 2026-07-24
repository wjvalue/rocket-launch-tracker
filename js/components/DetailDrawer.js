window.RT = window.RT || {};
RT.DetailDrawer = {
  name: 'DetailDrawer',
  props: { store: Object, fullscreen: { default: false } },
  template: `
    <aside
      v-if="store.ui.drawerOpen"
      :class="fullscreen ? 'w-full' : 'border-l border-rt-border-bright'"
      class="bg-rt-panel p-4 overflow-y-auto"
      :style="fullscreen ? {} : { width: '340px' }">
      <div class="flex justify-between items-center mb-3 pb-2 border-b border-rt-border">
        <div class="rt-eyebrow flex items-center gap-1.5">
          <span class="rt-pulse-dot rt-pulse-red"></span>
          <span>LAUNCH DETAIL</span>
        </div>
        <span class="rt-text-dim cursor-pointer hover:rt-text-accent text-sm" @click="store.selectLaunch(null)">✕</span>
      </div>
      <div v-if="!launch" class="rt-text-dim text-sm rt-text-mono">// 未选中发射</div>
      <div v-else>
        <div class="rt-card p-3 mb-3">
          <div class="rt-text text-sm font-semibold rt-text-mono">{{ launch.name }}</div>
          <div class="rt-text-muted text-xs mt-1 rt-text-mono">{{ providerName(launch) }} · {{ formatTime(launch.net) }}</div>
          <div class="mt-2 inline-block px-2 py-1 border rt-text-mono text-xs" :class="statusBorderClass(launch)">
            <span :class="statusClass(launch)" style="font-weight: 500;">{{ statusText(launch) }}</span>
          </div>
        </div>

        <div class="rt-eyebrow mb-1">// PAD</div>
        <div class="rt-card p-2 text-xs mb-3 rt-text-mono">
          <div class="rt-text">{{ launch.pad ? launch.pad.name : '—' }}</div>
          <div class="rt-text-dim mt-0.5">{{ launch.pad ? launch.pad.location : '—' }}</div>
        </div>

        <div class="rt-eyebrow mb-1">// ROCKET SPEC</div>
        <div class="rt-card p-2 text-xs mb-1 rt-text-mono">
          <div v-if="spec">
            <div class="flex justify-between py-0.5 border-b border-rt-border"><span class="rt-text-dim">型号</span><span class="rt-text">{{ spec.name }}</span></div>
            <div class="flex justify-between py-0.5 border-b border-rt-border"><span class="rt-text-dim">级数</span><span class="rt-text">{{ spec.stages }}{{ spec.boosters ? ' + ' + spec.boosters + ' 助推' : '' }}</span></div>
            <div class="flex justify-between py-0.5 border-b border-rt-border"><span class="rt-text-dim">高度</span><span class="rt-text">{{ spec.height_m }} m</span></div>
            <div class="flex justify-between py-0.5 border-b border-rt-border"><span class="rt-text-dim">直径</span><span class="rt-text">{{ spec.diameter_m }} m</span></div>
            <div class="flex justify-between py-0.5 border-b border-rt-border"><span class="rt-text-dim">起飞质量</span><span class="rt-text">{{ spec.liftoff_mass_t }} t</span></div>
            <div class="flex justify-between py-0.5 border-b border-rt-border"><span class="rt-text-dim">LEO 运力</span><span class="rt-text-accent">{{ spec.leo_kg.toLocaleString() }} kg</span></div>
            <div class="flex justify-between py-0.5 border-b border-rt-border"><span class="rt-text-dim">GTO 运力</span><span class="rt-text-accent">{{ spec.gto_kg ? spec.gto_kg.toLocaleString() + ' kg' : '—' }}</span></div>
            <div class="flex justify-between py-0.5 border-b border-rt-border"><span class="rt-text-dim">起飞推力</span><span class="rt-text">{{ spec.thrust_kn.toLocaleString() }} kN</span></div>
            <div class="flex justify-between py-0.5 border-b border-rt-border"><span class="rt-text-dim">发动机</span><span class="rt-text text-right" style="max-width: 60%;">{{ spec.engines }}</span></div>
            <div class="flex justify-between py-0.5 border-b border-rt-border"><span class="rt-text-dim">首飞</span><span class="rt-text">{{ spec.first_flight }}</span></div>
            <div class="flex justify-between py-0.5 border-b border-rt-border"><span class="rt-text-dim">总发射</span><span class="rt-text">{{ spec.total_flights }} 次</span></div>
            <div class="flex justify-between py-0.5"><span class="rt-text-dim">成功率</span>
              <span :style="{ color: spec.success_rate >= 0.95 ? 'var(--rt-green)' : spec.success_rate >= 0.85 ? 'var(--rt-yellow)' : 'var(--rt-red)', fontWeight: 500 }">
                {{ Math.round(spec.success_rate * 100) }}%
              </span>
            </div>
          </div>
          <div v-else class="rt-text-dim">// 规格数据待补充,欢迎补充到 <code style="color: var(--rt-accent);">rocket-specs.js</code></div>
        </div>
        <div v-if="spec" class="text-[10px] rt-text-dim mb-3 rt-text-mono">// 数据更新于 {{ specsUpdated }}</div>

        <div class="rt-eyebrow mb-1">// PAYLOAD</div>
        <div class="rt-card p-2 text-xs mb-3 rt-text-mono">
          <div v-if="launch.mission">
            <div class="rt-text font-semibold">{{ launch.mission.name }}</div>
            <div class="rt-text-dim mt-1">类型: {{ launch.mission.type || '—' }}</div>
            <div class="rt-text-dim">轨道: {{ launch.mission.orbit || '—' }}</div>
            <div class="rt-text-dim">质量: {{ launch.mission.payload_mass_kg ? launch.mission.payload_mass_kg + ' kg' : '—' }}</div>
          </div>
          <div v-else class="rt-text-dim">—</div>
        </div>

        <div class="rt-eyebrow mb-1">// MODEL HISTORY</div>
        <div class="rt-card p-2 text-xs rt-text-mono">
          <div v-if="modelHistory.length === 0" class="rt-text-dim">// 缓存范围内共 0 次</div>
          <div v-else>
            <div v-for="h in modelHistory.slice(0, 5)" :key="h.id" class="flex justify-between py-0.5 border-b border-rt-border">
              <span class="truncate mr-2 rt-text-muted">{{ h.name }}</span>
              <span :class="resultClass(h.status)">{{ resultText(h.status) }}</span>
            </div>
            <div class="mt-1 pt-1 text-rt-dim flex justify-between">
              <span>// 共 {{ modelHistory.length }} 次</span>
              <span>成功率 {{ modelSuccessRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  `,
  computed: {
    launch() { return this.store.selectedLaunch; },
    specsUpdated() { return (RT.ROCKET_SPECS_UPDATED || '').slice(0, 7); },
    spec() {
      if (!this.launch || !this.launch.rocket_config) return null;
      return RT.getRocketSpec(this.launch.rocket_config.id, this.launch.rocket_config.name);
    },
    modelHistory() {
      if (!this.launch || !this.launch.rocket_config) return [];
      const name = this.launch.rocket_config.name;
      return this.store.launches.filter(l => l.rocket_config && l.rocket_config.name === name);
    },
    modelSuccessRate() {
      if (this.modelHistory.length === 0) return 0;
      const s = this.modelHistory.filter(l => l.status === 'Success').length;
      return Math.round((s / this.modelHistory.length) * 100);
    }
  },
  methods: {
    formatTime(iso) { return RT.time.formatLocal(new Date(iso).getTime(), this.store.timezone); },
    providerName(l) {
      if (!l.provider) return '—';
      const p = RT.PRESET_MANUFACTURERS.find(m => m.id === l.provider.id);
      return p ? p.name_zh : l.provider.name;
    },
    statusText(l) {
      const net = new Date(l.net).getTime();
      const now = Date.now();
      if (l.status === 'In Flight') return '◉ FLIGHT · 发射进行中';
      if (l.status === 'Success') return '✓ OK · 发射成功';
      if (l.status === 'Failure') return '✗ FAIL · 发射失败';
      if (l.status === 'Partial Failure') return '▲ PART · 部分失败';
      if (l.status === 'Hold') return '⏸ HOLD · 发射暂停';
      if (net > now) {
        const ws = l.window_start ? new Date(l.window_start).getTime() : null;
        return '▸ ' + RT.time.formatCountdown(net, now, ws);
      }
      return '— TBD · 待确认';
    },
    statusBorderClass(l) {
      if (l.status === 'Success') return 'border-rt-cyan';
      if (l.status === 'Failure' || l.status === 'Partial Failure' || l.status === 'In Flight') return 'border-red-400';
      if (l.status === 'Hold') return 'border-purple-400';
      return 'border-rt-accent';
    },
    statusClass(l) {
      if (l.status === 'Success') return 'rt-text-cyan';
      if (l.status === 'Failure' || l.status === 'Partial Failure') return 'text-red-400';
      if (l.status === 'In Flight') return 'text-red-400 rt-flight-pulse';
      if (l.status === 'Hold') return 'text-purple-400';
      return 'rt-text-accent';
    },
    resultClass(s) {
      if (s === 'Success') return 'rt-text-cyan';
      if (s === 'Failure' || s === 'Partial Failure') return 'text-red-400';
      return 'rt-text-dim';
    },
    resultText(s) {
      const map = { 'Success':'✓ OK','Failure':'✗ FAIL','Partial Failure':'▲ PART','In Flight':'◉ FLIGHT','Go':'▸ GO' };
      return map[s] || '— TBD';
    }
  }
};
