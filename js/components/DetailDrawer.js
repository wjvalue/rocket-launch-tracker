window.RT = window.RT || {};
RT.DetailDrawer = {
  name: 'DetailDrawer',
  props: { store: Object, fullscreen: { default: false } },
  template: `
    <aside
      v-if="store.ui.drawerOpen"
      :class="fullscreen ? 'w-full bg-amber-50' : 'bg-amber-50 border-l border-amber-400'"
      class="p-4 overflow-y-auto"
      :style="fullscreen ? {} : { width: '340px' }">
      <div class="flex justify-between items-center mb-3">
        <div class="text-[10px] text-amber-700 uppercase tracking-wide">发射详情</div>
        <span class="text-amber-700 cursor-pointer" @click="store.selectLaunch(null)">✕</span>
      </div>
      <div v-if="!launch" class="text-slate-400 text-sm">未选中发射</div>
      <div v-else>
        <div class="bg-white border border-amber-200 rounded p-3 mb-3">
          <div class="font-semibold text-sm">{{ launch.name }}</div>
          <div class="text-slate-500 text-xs mt-1">{{ providerName(launch) }} · {{ formatTime(launch.net) }}</div>
          <div class="bg-slate-100 px-2 py-1 rounded mt-2 text-xs">
            <strong :class="statusClass(launch)">{{ statusText(launch) }}</strong>
          </div>
        </div>
        <div class="text-[10px] text-amber-700 uppercase tracking-wide mb-1">发射场</div>
        <div class="bg-white border border-amber-200 rounded p-2 text-xs mb-3">
          <div>{{ launch.pad ? launch.pad.name : '—' }}</div>
          <div class="text-slate-500">{{ launch.pad ? launch.pad.location : '—' }}</div>
        </div>
        <div class="text-[10px] text-amber-700 uppercase tracking-wide mb-1">火箭规格</div>
        <div class="bg-white border border-amber-200 rounded p-2 text-xs mb-1">
          <div v-if="spec">
            <div class="flex justify-between py-0.5"><span class="text-slate-500">级数</span><span>{{ spec.stages }}{{ spec.boosters ? ' + ' + spec.boosters + ' 助推' : '' }}</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">高度</span><span>{{ spec.height_m }} m</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">直径</span><span>{{ spec.diameter_m }} m</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">起飞质量</span><span>{{ spec.liftoff_mass_t }} t</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">LEO 运力</span><span>{{ spec.leo_kg.toLocaleString() }} kg</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">GTO 运力</span><span>{{ spec.gto_kg ? spec.gto_kg.toLocaleString() + ' kg' : '—' }}</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">起飞推力</span><span>{{ spec.thrust_kn.toLocaleString() }} kN</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">发动机</span><span>{{ spec.engines }}</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">首飞</span><span>{{ spec.first_flight }}</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">总发射</span><span>{{ spec.total_flights }} 次</span></div>
            <div class="flex justify-between py-0.5"><span class="text-slate-500">成功率</span><span>{{ Math.round(spec.success_rate * 100) }}%</span></div>
          </div>
          <div v-else class="text-slate-400">规格数据待补充,欢迎补充到 <code>rocket-specs.js</code></div>
        </div>
        <div v-if="spec" class="text-[10px] text-slate-400 mb-3">规格数据更新于 {{ RT.ROCKET_SPECS_UPDATED.slice(0, 7) }}</div>
        <div class="text-[10px] text-amber-700 uppercase tracking-wide mb-1">载荷</div>
        <div class="bg-white border border-amber-200 rounded p-2 text-xs mb-3">
          <div v-if="launch.mission">
            <div class="font-semibold">{{ launch.mission.name }}</div>
            <div class="text-slate-500 mt-1">类型: {{ launch.mission.type || '—' }}</div>
            <div class="text-slate-500">轨道: {{ launch.mission.orbit || '—' }}</div>
            <div class="text-slate-500">质量: {{ launch.mission.payload_mass_kg ? launch.mission.payload_mass_kg + ' kg' : '—' }}</div>
          </div>
          <div v-else class="text-slate-400">—</div>
        </div>
        <div class="text-[10px] text-amber-700 uppercase tracking-wide mb-1">该型号历史</div>
        <div class="bg-white border border-amber-200 rounded p-2 text-xs">
          <div v-if="modelHistory.length === 0" class="text-slate-400">缓存范围内共 0 次</div>
          <div v-else>
            <div v-for="h in modelHistory.slice(0, 5)" :key="h.id" class="flex justify-between py-0.5">
              <span class="truncate mr-2">{{ h.name }}</span>
              <span :class="resultClass(h.status)">{{ resultText(h.status) }}</span>
            </div>
            <div class="mt-1 pt-1 border-t border-dashed border-amber-200 text-slate-500">
              缓存范围内共 {{ modelHistory.length }} 次 · 成功率 {{ modelSuccessRate }}%
            </div>
          </div>
        </div>
      </div>
    </aside>
  `,
  computed: {
    launch() { return this.store.selectedLaunch; },
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
      const p = RT.PRESET_MANUFACTURERS.find(m => m.name === l.provider.name);
      return p ? p.name_zh : l.provider.name;
    },
    statusText(l) {
      const net = new Date(l.net).getTime();
      const now = Date.now();
      if (l.status === 'In Flight') return '🔴 发射进行中';
      if (l.status === 'Success') return '✓ 发射成功';
      if (l.status === 'Failure') return '✗ 发射失败';
      if (l.status === 'Partial Failure') return '▲ 部分失败';
      if (l.status === 'Hold') return '⏸ 发射暂停';
      if (net > now) {
        const ws = l.window_start ? new Date(l.window_start).getTime() : null;
        return RT.time.formatCountdown(net, now, ws);
      }
      return '— 待确认';
    },
    statusClass(l) {
      if (l.status === 'Success') return 'text-emerald-600';
      if (l.status === 'Failure' || l.status === 'Partial Failure' || l.status === 'In Flight') return 'text-red-600';
      if (l.status === 'Hold') return 'text-amber-700';
      return 'text-amber-600';
    },
    resultClass(s) {
      if (s === 'Success') return 'text-emerald-600';
      if (s === 'Failure' || s === 'Partial Failure') return 'text-red-600';
      return 'text-slate-500';
    },
    resultText(s) {
      const map = { 'Success':'✓ 成功','Failure':'✗ 失败','Partial Failure':'▲ 部分失败','In Flight':'🔴 进行中','Go':'⏳ 待发射' };
      return map[s] || '—';
    }
  }
};
