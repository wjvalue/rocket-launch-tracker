window.RT = window.RT || {};
RT.ListView = {
  name: 'ListView',
  props: ['store'],
  template: `
    <div class="p-4 bg-white h-full overflow-y-auto">
      <div class="text-xs text-slate-500 mb-3">
        共 {{ filtered.length }} 条发射 · 数据覆盖至 {{ coverageDate }}
      </div>
      <table class="w-full text-xs">
        <thead class="sticky top-0 bg-white">
          <tr class="border-b border-slate-200 text-slate-600">
            <th class="text-left py-2 cursor-pointer" @click="sortBy('net')">日期</th>
            <th class="text-left py-2">倒计时/结果</th>
            <th class="text-left py-2 cursor-pointer" @click="sortBy('rocket')">火箭</th>
            <th class="text-left py-2">厂商</th>
            <th class="text-left py-2">发射场</th>
            <th class="text-left py-2">载荷</th>
            <th class="text-left py-2">状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in sorted" :key="l.id"
            @click="store.selectLaunch(l.id)"
            :class="store.selectedLaunchId === l.id ? 'bg-blue-50' : 'hover:bg-slate-50'"
            class="cursor-pointer border-b border-slate-100">
            <td class="py-2">{{ formatTime(l.net) }}</td>
            <td class="py-2">{{ countdownOrResult(l) }}</td>
            <td class="py-2">{{ l.rocket_config ? l.rocket_config.name : '—' }}</td>
            <td class="py-2"><span :style="{ color: providerColor(l) }">●</span> {{ providerName(l) }}</td>
            <td class="py-2">{{ l.pad ? l.pad.name : '—' }}</td>
            <td class="py-2">{{ l.mission ? l.mission.name : '—' }}</td>
            <td class="py-2">{{ statusBadge(l.status) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  data() { return { sortKey: 'net', sortAsc: true }; },
  computed: {
    filtered() { return this.store.filteredLaunches; },
    sorted() {
      const list = this.filtered.slice();
      const key = this.sortKey;
      const dir = this.sortAsc ? 1 : -1;
      list.sort((a, b) => {
        let va, vb;
        if (key === 'net') { va = new Date(a.net).getTime(); vb = new Date(b.net).getTime(); }
        else { va = a.rocket_config ? a.rocket_config.name : ''; vb = b.rocket_config ? b.rocket_config.name : ''; }
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });
      return list;
    },
    coverageDate() {
      if (this.filtered.length === 0) return '—';
      const last = this.filtered[this.filtered.length - 1];
      return RT.time.formatLocal(new Date(last.net).getTime(), this.store.timezone);
    }
  },
  methods: {
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else { this.sortKey = key; this.sortAsc = true; }
    },
    formatTime(iso) { return RT.time.formatLocal(new Date(iso).getTime(), this.store.timezone); },
    countdownOrResult(l) {
      const net = new Date(l.net).getTime();
      const now = Date.now();
      if (l.status === 'Success') return '✓ 成功';
      if (l.status === 'Failure') return '✗ 失败';
      if (l.status === 'Partial Failure') return '▲ 部分失败';
      if (l.status === 'In Flight') return '🔴 发射中';
      if (l.status === 'Hold') return '⏸ 暂停';
      if (net > now) {
        const ws = l.window_start ? new Date(l.window_start).getTime() : null;
        return RT.time.formatCountdown(net, now, ws);
      }
      return '— 待确认';
    },
    providerColor(l) {
      const p = l.provider ? RT.PRESET_MANUFACTURERS.find(m => m.id === l.provider.id) : null;
      return p ? p.color : '#94a3b8';
    },
    providerName(l) {
      if (!l.provider) return '—';
      const p = RT.PRESET_MANUFACTURERS.find(m => m.id === l.provider.id);
      return p ? p.name_zh : l.provider.name;
    },
    statusBadge(s) {
      const map = { 'Go':'🟢 Go','TBD':'🟡 TBD','Hold':'⏸ Hold','In Flight':'🔴 In Flight','Success':'✓ Success','Failure':'✗ Failure','Partial Failure':'▲ Partial' };
      return map[s] || s;
    }
  }
};
