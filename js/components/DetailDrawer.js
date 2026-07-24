window.RT = window.RT || {};
RT.DetailDrawer = {
  name: 'DetailDrawer',
  props: { store: Object, fullscreen: { default: false } },
  template: `
    <div class="h-full flex flex-col">
      <div class="flex justify-between items-center mb-4 pb-2" style="border-bottom: 1px solid var(--rt-border);">
        <div class="rt-eyebrow flex items-center gap-2">
          <span class="rt-dot rt-dot-pulse" style="background: var(--rt-text);"></span>
          <span>LAUNCH DETAIL</span>
        </div>
        <span class="rt-text-faint cursor-pointer hover:rt-text text-sm transition" @click="store.selectLaunch(null)">✕</span>
      </div>
      <div v-if="!launch" class="rt-text-tertiary text-sm rt-text-mono">// 未选中发射</div>
      <div v-else class="flex-1 overflow-y-auto">
        <div class="rt-card p-3 mb-4">
          <div class="rt-text text-sm rt-text-mono" style="font-weight: 500;">{{ launch.name }}</div>
          <div class="rt-text-secondary text-xs mt-1 rt-text-mono">{{ providerName(launch) }} · {{ formatTime(launch.net) }}</div>
          <div class="mt-3 inline-block px-2 py-1 rt-text-mono text-xs" :class="statusBorderClass(launch)"
               style="border: 1px solid; border-color: inherit;">
            <span :class="statusClass(launch)" style="font-weight: 500;">{{ statusText(launch) }}</span>
          </div>
        </div>

        <div class="rt-eyebrow mb-2">// PAD</div>
        <div class="rt-card p-3 text-xs mb-4 rt-text-mono">
          <div class="rt-text">{{ launch.pad ? launch.pad.name : '—' }}</div>
          <div class="rt-text-tertiary mt-0.5">{{ launch.pad ? launch.pad.location : '—' }}</div>
        </div>

        <div class="rt-eyebrow mb-2">// ROCKET SPEC</div>
        <div class="rt-card p-3 text-xs mb-1 rt-text-mono">
          <div v-if="spec">
            <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--rt-border);"><span class="rt-text-tertiary">型号</span><span class="rt-text">{{ spec.name }}</span></div>
            <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--rt-border);"><span class="rt-text-tertiary">级数</span><span class="rt-text">{{ spec.stages }}{{ spec.boosters ? ' + ' + spec.boosters + ' 助推' : '' }}</span></div>
            <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--rt-border);"><span class="rt-text-tertiary">高度</span><span class="rt-text">{{ spec.height_m }} m</span></div>
            <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--rt-border);"><span class="rt-text-tertiary">直径</span><span class="rt-text">{{ spec.diameter_m }} m</span></div>
            <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--rt-border);"><span class="rt-text-tertiary">起飞质量</span><span class="rt-text">{{ spec.liftoff_mass_t }} t</span></div>
            <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--rt-border);"><span class="rt-text-tertiary">LEO 运力</span><span class="rt-text" style="font-weight: 500;">{{ spec.leo_kg.toLocaleString() }} kg</span></div>
            <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--rt-border);"><span class="rt-text-tertiary">GTO 运力</span><span class="rt-text" style="font-weight: 500;">{{ spec.gto_kg ? spec.gto_kg.toLocaleString() + ' kg' : '—' }}</span></div>
            <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--rt-border);"><span class="rt-text-tertiary">起飞推力</span><span class="rt-text">{{ spec.thrust_kn.toLocaleString() }} kN</span></div>
            <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--rt-border);"><span class="rt-text-tertiary">发动机</span><span class="rt-text text-right" style="max-width: 60%;">{{ spec.engines }}</span></div>
            <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--rt-border);"><span class="rt-text-tertiary">首飞</span><span class="rt-text">{{ spec.first_flight }}</span></div>
            <div class="flex justify-between py-1" style="border-bottom: 1px solid var(--rt-border);"><span class="rt-text-tertiary">总发射</span><span class="rt-text">{{ spec.total_flights }} 次</span></div>
            <div class="flex justify-between py-1"><span class="rt-text-tertiary">成功率</span>
              <span class="rt-text" style="font-weight: 500;">{{ Math.round(spec.success_rate * 100) }}%</span>
            </div>
          </div>
          <div v-else class="rt-text-tertiary">// 规格数据待补充,欢迎补充到 <code style="color: var(--rt-text-secondary);">rocket-specs.js</code></div>
        </div>
        <div v-if="spec" class="text-[10px] rt-text-faint mb-4 rt-text-mono">// 数据更新于 {{ specsUpdated }}</div>

        <div class="rt-eyebrow mb-2">// PAYLOAD</div>
        <div class="rt-card p-3 text-xs mb-4 rt-text-mono">
          <div v-if="launch.mission">
            <div class="rt-text" style="font-weight: 500;">{{ launch.mission.name }}</div>
            <div class="rt-text-tertiary mt-1">类型: {{ launch.mission.type || '—' }}</div>
            <div class="rt-text-tertiary">轨道: {{ launch.mission.orbit || '—' }}</div>
            <div class="rt-text-tertiary">质量: {{ launch.mission.payload_mass_kg ? launch.mission.payload_mass_kg + ' kg' : '—' }}</div>
          </div>
          <div v-else class="rt-text-tertiary">—</div>
        </div>

        <div class="rt-eyebrow mb-2">// MODEL HISTORY</div>
        <div class="rt-card p-3 text-xs rt-text-mono">
          <div v-if="modelHistory.length === 0" class="rt-text-tertiary">// 缓存范围内共 0 次</div>
          <div v-else>
            <div v-for="h in modelHistory.slice(0, 5)" :key="h.id" class="flex justify-between py-1" style="border-bottom: 1px solid var(--rt-border);">
              <span class="truncate mr-2 rt-text-secondary">{{ h.name }}</span>
              <span :class="resultClass(h.status)">{{ resultText(h.status) }}</span>
            </div>
            <div class="mt-2 pt-1 rt-text-faint flex justify-between" style="border-top: 1px solid var(--rt-border);">
              <span>// 共 {{ modelHistory.length }} 次</span>
              <span>成功率 {{ modelSuccessRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      if (l.status === 'Success') return 'rt-text-secondary';
      if (l.status === 'Failure' || l.status === 'Partial Failure' || l.status === 'In Flight') return 'rt-text';
      if (l.status === 'Hold') return 'rt-text-tertiary';
      return 'rt-text';
    },
    statusClass(l) {
      if (l.status === 'In Flight') return 'rt-flight-pulse rt-text';
      return 'rt-text';
    },
    resultClass(s) {
      if (s === 'Success') return 'rt-text-secondary';
      if (s === 'Failure' || s === 'Partial Failure') return 'rt-text';
      return 'rt-text-tertiary';
    },
    resultText(s) {
      const map = { 'Success':'✓ OK','Failure':'✗ FAIL','Partial Failure':'▲ PART','In Flight':'◉ FLIGHT','Go':'▸ GO' };
      return map[s] || '— TBD';
    }
  }
};
