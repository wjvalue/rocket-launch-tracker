window.RT = window.RT || {};
RT.CalendarView = {
  name: 'CalendarView',
  props: ['store'],
  data() { return { expandedDay: null }; },
  template: `
    <div class="p-4 bg-rt-bg h-full overflow-y-auto">
      <div class="flex justify-between items-center mb-3">
        <div class="rt-text-mono text-sm tracking-wider">
          <span class="rt-text-accent">▸</span>
          <span class="rt-text">{{ year }}</span>
          <span class="rt-text-dim">.</span>
          <span class="rt-text">{{ String(month + 1).padStart(2, '0') }}</span>
          <span class="rt-eyebrow ml-2">MONTH</span>
        </div>
        <div class="flex gap-1">
          <button @click="prevMonth" class="rt-btn">‹</button>
          <button @click="goToday" class="rt-btn">TODAY</button>
          <button @click="nextMonth" class="rt-btn">›</button>
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1 mb-1 text-xs text-center rt-eyebrow">
        <div v-for="d in ['一','二','三','四','五','六','日']" :key="d">{{ d }}</div>
      </div>
      <div class="grid grid-cols-7 gap-1 text-xs">
        <div v-for="cell in calendarCells" :key="cell.key"
          @click="cell.inMonth && toggleDay(cell.day)"
          :class="[cellClass(cell), expandedDay === cell.day && cell.inMonth ? 'row-span-2 z-10' : '']"
          class="rt-cal-cell p-1 border cursor-pointer relative"
          :style="expandedDay === cell.day && cell.inMonth ? 'min-height: 200px;' : 'min-height: 56px;'">
          <div :class="cell.inMonth ? 'rt-text' : 'rt-text-dim'" class="rt-text-mono text-[10px]">{{ cell.day }}</div>
          <div v-for="l in (expandedDay === cell.day && cell.inMonth ? launchesOfDay(cell) : launchesOfDay(cell).slice(0, 2))" :key="l.id"
            @click.stop="store.selectLaunch(l.id)"
            :style="{ borderLeft: '2px solid ' + providerColor(l), background: 'rgba(' + hexToRgb(providerColor(l)) + ', 0.12)', color: providerColor(l) }"
            class="text-[8px] px-1 py-0.5 mt-0.5 truncate rt-text-mono">
            {{ shortName(l) }}
          </div>
          <div v-if="extraCount(cell) > 0 && expandedDay !== cell.day"
            class="absolute bottom-0 right-0 text-[8px] rt-text-accent px-1"
            style="background: rgba(255, 107, 53, 0.1); border-top: 1px solid var(--rt-border-bright); border-left: 1px solid var(--rt-border-bright);">
            +{{ extraCount(cell) }} ▾
          </div>
          <div v-if="expandedDay === cell.day && cell.inMonth"
            class="absolute top-0 right-0 text-[10px] rt-text-dim px-1 cursor-pointer"
            style="background: var(--rt-bg-panel);">✕</div>
        </div>
      </div>
      <div class="flex gap-3 mt-4 text-[10px] rt-text-muted flex-wrap rt-text-mono">
        <span v-for="l in legend" :key="l.name" class="flex items-center gap-1">
          <span :style="{ display: 'inline-block', width: '6px', height: '6px', background: l.color, boxShadow: '0 0 4px ' + l.color }"></span>
          <span>{{ l.name }}</span>
        </span>
      </div>
    </div>
  `,
  computed: {
    year() { return this.store.ui.calendarYear; },
    month() { return this.store.ui.calendarMonth; },
    calendarCells() {
      const y = this.year, m = this.month;
      const firstDay = new Date(y, m, 1);
      const offset = (firstDay.getDay() + 6) % 7;
      const daysInMonth = new Date(y, m + 1, 0).getDate();
      const prevMonthDays = new Date(y, m, 0).getDate();
      const cells = [];
      for (let i = offset - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, inMonth: false, key: 'prev-' + i });
      for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, inMonth: true, key: 'cur-' + d });
      let nextDay = 1;
      while (cells.length < 42) cells.push({ day: nextDay++, inMonth: false, key: 'next-' + nextDay });
      return cells;
    },
    legend() {
      const used = new Set();
      const list = [];
      this.store.filteredLaunches.forEach(l => {
        const preset = this.findPreset(l);
        if (preset && !used.has(preset.name)) {
          used.add(preset.name);
          list.push({ name: preset.name_zh, color: preset.color });
        }
      });
      return list;
    }
  },
  methods: {
    cellClass(cell) {
      if (!cell.inMonth) return 'bg-rt-bg border-rt-border';
      const today = new Date();
      const isToday = cell.day === today.getDate() && this.month === today.getMonth() && this.year === today.getFullYear();
      const launches = this.launchesOfDay(cell);
      const isUpcoming72h = launches.some(l => RT.time.isWithin72h(new Date(l.net).getTime(), Date.now()));
      return [
        isToday ? 'border-rt-accent border-2' : 'border-rt-border',
        isUpcoming72h && !isToday ? 'border-rt-yellow' : ''
      ].join(' ');
    },
    launchesOfDay(cell) {
      if (!cell.inMonth) return [];
      const y = this.year, m = this.month, d = cell.day;
      return this.store.filteredLaunches.filter(l => {
        const dt = new Date(l.net);
        const local = RT.time.formatLocal(dt.getTime(), this.store.timezone);
        const [datePart] = local.split(' ');
        const [yy, mm, dd] = datePart.split('-').map(Number);
        return yy === y && mm === m + 1 && dd === d;
      });
    },
    extraCount(cell) { return Math.max(0, this.launchesOfDay(cell).length - 2); },
    shortName(l) {
      const parts = l.name.split(' · ');
      return parts.length > 1 ? parts[0] + ' · ' + parts[1] : l.name;
    },
    providerColor(l) { const p = this.findPreset(l); return p ? p.color : '#94a3b8'; },
    findPreset(l) {
      if (!l.provider) return null;
      return RT.PRESET_MANUFACTURERS.find(m => m.id === l.provider.id);
    },
    hexToRgb(hex) {
      const h = hex.replace('#', '');
      const r = parseInt(h.substr(0, 2), 16);
      const g = parseInt(h.substr(2, 2), 16);
      const b = parseInt(h.substr(4, 2), 16);
      return `${r}, ${g}, ${b}`;
    },
    selectDay(day) {
      const list = this.launchesOfDay({ day, inMonth: true });
      if (list.length > 0) this.store.selectLaunch(list[0].id);
    },
    toggleDay(day) {
      this.expandedDay = (this.expandedDay === day) ? null : day;
    },
    prevMonth() {
      let m = this.month - 1, y = this.year;
      if (m < 0) { m = 11; y--; }
      this.store.ui.calendarMonth = m; this.store.ui.calendarYear = y;
    },
    nextMonth() {
      let m = this.month + 1, y = this.year;
      if (m > 11) { m = 0; y++; }
      this.store.ui.calendarMonth = m; this.store.ui.calendarYear = y;
    },
    goToday() {
      const d = new Date();
      this.store.ui.calendarYear = d.getFullYear();
      this.store.ui.calendarMonth = d.getMonth();
    }
  }
};
