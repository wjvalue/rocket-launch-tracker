window.RT = window.RT || {};
RT.CalendarView = {
  name: 'CalendarView',
  props: ['store'],
  template: `
    <div class="p-4 bg-white h-full overflow-y-auto">
      <div class="flex justify-between items-center mb-3">
        <div class="font-semibold text-sm">{{ year }} 年 {{ month + 1 }} 月</div>
        <div class="text-xs flex gap-1">
          <button @click="prevMonth" class="bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">‹</button>
          <button @click="goToday" class="bg-slate-100 px-3 py-1 rounded hover:bg-slate-200">今日</button>
          <button @click="nextMonth" class="bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">›</button>
        </div>
      </div>
      <div class="grid grid-cols-7 gap-1 mb-1 text-xs text-slate-400 text-center">
        <div v-for="d in ['一','二','三','四','五','六','日']" :key="d">{{ d }}</div>
      </div>
      <div class="grid grid-cols-7 gap-1 text-xs">
        <div v-for="cell in calendarCells" :key="cell.key"
          @click="cell.inMonth && selectDay(cell.day)"
          :class="cellClass(cell)"
          class="aspect-square p-1 border cursor-pointer relative">
          <div :class="cell.inMonth ? '' : 'text-slate-300'">{{ cell.day }}</div>
          <div v-for="l in launchesOfDay(cell)" :key="l.id"
            @click.stop="store.selectLaunch(l.id)"
            :style="{ background: providerColor(l) }"
            class="text-white text-[8px] px-1 py-0.5 rounded mt-0.5 truncate">
            {{ shortName(l) }}
          </div>
          <div v-if="extraCount(cell) > 0" class="absolute bottom-0 right-0 text-[8px] text-slate-500">+{{ extraCount(cell) }}</div>
        </div>
      </div>
      <div class="flex gap-3 mt-4 text-[10px] text-slate-600 flex-wrap">
        <span v-for="l in legend" :key="l.name">
          <span :style="{ display: 'inline-block', width: '8px', height: '8px', background: l.color, borderRadius: '2px', marginRight: '4px' }"></span>{{ l.name }}
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
      if (!cell.inMonth) return 'bg-slate-50';
      const today = new Date();
      const isToday = cell.day === today.getDate() && this.month === today.getMonth() && this.year === today.getFullYear();
      const launches = this.launchesOfDay(cell);
      const isUpcoming72h = launches.some(l => RT.time.isWithin72h(new Date(l.net).getTime(), Date.now()));
      return [
        isToday ? 'bg-blue-100 border-blue-500 border-2 font-semibold' : 'bg-slate-50 border-slate-200',
        isUpcoming72h && !isToday ? 'bg-amber-50 border-amber-400 border-2' : ''
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
    selectDay(day) {
      const list = this.launchesOfDay({ day, inMonth: true });
      if (list.length > 0) this.store.selectLaunch(list[0].id);
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
