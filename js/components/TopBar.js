window.RT = window.RT || {};
RT.TopBar = {
  name: 'TopBar',
  props: ['store'],
  emits: ['refresh'],
  template: `
    <header class="bg-slate-800 text-white px-4 py-3 flex justify-between items-center text-sm">
      <div class="flex items-center gap-4">
        <strong class="text-base">🚀 火箭发射追踪</strong>
        <div class="bg-slate-700 rounded p-1 flex gap-1">
          <button
            v-for="v in viewOptions"
            :key="v[0]"
            @click="store.setView(v[0])"
            :class="store.view === v[0] ? 'bg-blue-500' : 'text-slate-300'"
            class="px-3 py-1 rounded transition">{{ v[1] }}</button>
        </div>
        <button
          v-if="store.ui.screenWidth < 1024"
          @click="store.ui.sidebarOpen = !store.ui.sidebarOpen"
          class="bg-slate-700 px-3 py-1 rounded text-xs">⚙ 筛选</button>
      </div>
      <div class="flex items-center gap-3 text-xs">
        <select
          :value="store.timezone"
          @change="store.setTimezone($event.target.value)"
          class="bg-slate-700 px-2 py-1 rounded">
          <option v-for="tz in timezones" :key="tz.id" :value="tz.id">{{ tz.label }}</option>
        </select>
        <span :class="store.meta.online ? 'bg-emerald-500' : 'bg-slate-600'" class="px-2 py-1 rounded">
          ● {{ store.meta.online ? '在线' : '离线' }}
        </span>
        <button
          @click="$emit('refresh')"
          :disabled="isCooling"
          :class="isCooling ? 'bg-slate-600 cursor-not-allowed' : 'bg-slate-700 hover:bg-slate-600'"
          class="px-3 py-1 rounded"
          :title="'本小时剩余 ~' + store.meta.quotaRemaining + ' 次配额'">
          {{ isCooling ? '↻ 冷却 ' + cooldownText : '↻ 刷新' }}
        </button>
      </div>
    </header>
  `,
  data() {
    return {
      timezones: [
        { id: 'UTC', label: 'UTC' },
        { id: 'Asia/Shanghai', label: '北京 UTC+8' },
        { id: 'America/New_York', label: '纽约 UTC-5' },
        { id: 'America/Cayenne', label: '库鲁 UTC-3' }
      ],
      nowMs: Date.now(),
      timer: null
    };
  },
  computed: {
    viewOptions() {
      return this.store.ui.screenWidth < 1024
        ? [['list','列表'],['history','历史']]
        : [['calendar','日历'],['list','列表'],['history','历史']];
    },
    isCooling() { return this.nowMs < this.store.meta.cooldownUntil; },
    cooldownText() {
      const sec = Math.ceil((this.store.meta.cooldownUntil - this.nowMs) / 1000);
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m}m ${s}s`;
    }
  },
  mounted() { this.timer = setInterval(() => { this.nowMs = Date.now(); }, 1000); },
  unmounted() { if (this.timer) clearInterval(this.timer); }
};
