window.RT = window.RT || {};
RT.ListView = {
  name: 'ListView',
  props: ['store'],
  template: `
    <div class="p-4 h-full overflow-y-auto">
      <div class="text-xs rt-text-tertiary mb-3 rt-text-mono flex items-center gap-2">
        <span class="rt-text-tertiary">▸</span>
        <span>{{ filtered.length }} launches</span>
        <span class="rt-text-faint">·</span>
        <span class="rt-text-faint">coverage {{ coverageDate }}</span>
      </div>
      <table class="w-full text-xs rt-text-mono">
        <thead class="sticky top-0 z-10" style="background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(8px);">
          <tr class="rt-eyebrow" style="border-bottom: 1px solid var(--rt-border-bright);">
            <th class="text-left py-2 cursor-pointer rt-row" @click="sortBy('net')">▸ DATE</th>
            <th class="text-left py-2">COUNTDOWN</th>
            <th class="text-left py-2 cursor-pointer rt-row" @click="sortBy('rocket')">ROCKET</th>
            <th class="text-left py-2">PROVIDER</th>
            <th class="text-left py-2">PAD</th>
            <th class="text-left py-2">PAYLOAD</th>
            <th class="text-left py-2">STATUS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in sorted" :key="l.id"
            @click="store.selectLaunch(l.id)"
            :class="store.selectedLaunchId === l.id ? 'rt-selected' : 'rt-row'"
            class="cursor-pointer" style="border-bottom: 1px solid var(--rt-border);">
            <td class="py-2 rt-text-secondary">{{ formatTime(l.net) }}</td>
            <td class="py-2" :class="countdownClass(l)">{{ countdownOrResult(l) }}</td>
            <td class="py-2 rt-text">{{ l.rocket_config ? l.rocket_config.name : '—' }}</td>
            <td class="py-2"><span :style="{ color: providerColor(l), opacity: 0.8 }">●</span> <span class="rt-text-secondary">{{ providerName(l) }}</span></td>
            <td class="py-2 rt-text-tertiary">{{ l.pad ? l.pad.name : '—' }}</td>
            <td class="py-2 rt-text-tertiary truncate" style="max-width: 120px;">{{ l.mission ? l.mission.name : '—' }}</td>
            <td class="py-2" :class="statusClass(l)" style="font-weight: 500;">{{ statusBadge(l.status) }}</td>
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
      if (l.status === 'Success') return '✓ OK';
      if (l.status === 'Failure') return '✗ FAIL';
      if (l.status === 'Partial Failure') return '▲ PART';
      if (l.status === 'In Flight') return '◉ FLIGHT';
      if (l.status === 'Hold') return '⏸ HOLD';
      if (net > now) {
        const ws = l.window_start ? new Date(l.window_start).getTime() : null;
        return RT.time.formatCountdown(net, now, ws);
      }
      return '— TBD';
    },
    countdownClass(l) {
      if (l.status === 'Success') return 'rt-text-secondary';
      if (l.status === 'Failure' || l.status === 'Partial Failure') return 'rt-text';
      if (l.status === 'In Flight') return 'rt-flight-pulse rt-text';
      if (l.status === 'Hold') return 'rt-text-tertiary';
      return 'rt-text';
    },
    providerColor(l) {
      const p = l.provider ? RT.PRESET_MANUFACTURERS.find(m => m.id === l.provider.id) : null;
      return p ? p.color : 'rgba(15, 23, 42, 0.4)';
    },
    providerName(l) {
      if (!l.provider) return '—';
      const p = RT.PRESET_MANUFACTURERS.find(m => m.id === l.provider.id);
      return p ? p.name_zh : l.provider.name;
    },
    statusBadge(s) {
      const map = { 'Go':'GO','TBD':'TBD','Hold':'HOLD','In Flight':'FLIGHT','Success':'OK','Failure':'FAIL','Partial Failure':'PART' };
      return map[s] || s;
    },
    statusClass(s) {
      if (s === 'Success') return 'rt-text-secondary';
      if (s === 'Failure' || s === 'Partial Failure') return 'rt-text';
      if (s === 'In Flight') return 'rt-flight-pulse rt-text';
      if (s === 'Hold') return 'rt-text-tertiary';
      if (s === 'Go') return 'rt-text';
      return 'rt-text-tertiary';
    }
  }
};
