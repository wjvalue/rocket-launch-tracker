window.RT = window.RT || {};
RT.TopBar = {
  name: 'TopBar',
  props: ['store'],
  emits: ['refresh'],
  template: `
    <header class="rt-scanline bg-rt-panel border-b border-rt-border px-4 py-2.5 flex justify-between items-center text-sm relative">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="rt-pulse-dot rt-pulse-red"></span>
          <strong class="text-base tracking-wider" style="font-family: var(--rt-font-mono); color: var(--rt-text);">
            <span class="rt-text-accent">▲</span> LAUNCH&nbsp;TRACKER
          </strong>
          <span class="rt-eyebrow hidden md:inline">MISSION CONTROL</span>
        </div>
        <div class="flex gap-1 border border-rt-border-bright p-0.5">
          <button
            v-for="v in viewOptions"
            :key="v[0]"
            @click="store.setView(v[0])"
            :class="store.view === v[0] ? 'rt-btn-active' : 'bg-transparent text-rt-muted hover:text-rt-text'"
            class="px-3 py-1 text-xs transition font-mono">{{ v[1] }}</button>
        </div>
        <button
          v-if="store.ui.screenWidth < 1024"
          @click="store.ui.sidebarOpen = !store.ui.sidebarOpen"
          class="rt-btn text-xs">⚡ 筛选</button>
      </div>
      <div class="flex items-center gap-3 text-xs">
        <select
          :value="store.timezone"
          @change="store.setTimezone($event.target.value)"
          class="rt-input">
          <option v-for="tz in timezones" :key="tz.id" :value="tz.id" class="bg-rt-panel">{{ tz.label }}</option>
        </select>
        <span class="flex items-center gap-1.5 px-2 py-1 border border-rt-border-bright">
          <span :class="store.meta.online ? 'rt-pulse-dot rt-pulse-green' : 'rt-pulse-dot rt-pulse-red'"></span>
          <span class="rt-text-mono" :style="{ color: store.meta.online ? 'var(--rt-green)' : 'var(--rt-red)' }">
            {{ store.meta.online ? 'ONLINE' : 'OFFLINE' }}
          </span>
        </span>
        <button
          @click="$emit('refresh')"
          :disabled="isCooling"
          :class="isCooling ? 'opacity-40 cursor-not-allowed' : 'hover:border-rt-accent hover:text-rt-accent'"
          class="rt-btn"
          :title="'本小时剩余 ~' + store.meta.quotaRemaining + ' 次配额'">
          {{ isCooling ? '◐ COOL ' + cooldownText : '↻ SYNC' }}
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
      return `${m}m${s.toString().padStart(2,'0')}s`;
    }
  },
  mounted() { this.timer = setInterval(() => { this.nowMs = Date.now(); }, 1000); },
  unmounted() { if (this.timer) clearInterval(this.timer); }
};
