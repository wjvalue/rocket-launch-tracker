window.RT = window.RT || {};
RT.TopBar = {
  name: 'TopBar',
  props: ['store'],
  emits: ['refresh'],
  template: `
    <header class="rt-topbar rt-corner-deco text-sm">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2.5">
          <span class="rt-dot rt-dot-pulse" style="background: var(--rt-text);"></span>
          <strong class="text-sm tracking-wider rt-text-mono" style="font-weight: 500;">
            LAUNCH<span class="rt-text-tertiary">·</span>TRACKER
          </strong>
          <span class="rt-eyebrow hidden md:inline">深空 · DEEP SPACE</span>
        </div>
        <div class="flex gap-px border" style="border-color: var(--rt-border-bright);">
          <button
            v-for="v in viewOptions"
            :key="v[0]"
            @click="store.setView(v[0])"
            :class="store.view === v[0] ? 'rt-btn-active' : ''"
            class="rt-btn border-0">{{ v[1] }}</button>
        </div>
        <button
          v-if="store.ui.screenWidth < 1024"
          @click="store.ui.sidebarOpen = !store.ui.sidebarOpen"
          class="rt-btn text-xs">FILTER</button>
      </div>
      <div class="flex items-center gap-3 text-xs">
        <select
          :value="store.timezone"
          @change="store.setTimezone($event.target.value)"
          class="rt-input">
          <option v-for="tz in timezones" :key="tz.id" :value="tz.id" class="bg-rt-bg">{{ tz.label }}</option>
        </select>
        <button
          @click="$emit('refresh')"
          :disabled="isCooling"
          :class="isCooling ? 'opacity-40 cursor-not-allowed' : ''"
          class="rt-btn"
          :title="'本小时剩余 ~' + store.meta.quotaRemaining + ' 次配额'">
          {{ isCooling ? 'COOL ' + cooldownText : 'SYNC' }}
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
        ? [['list','LIST'],['history','HISTORY']]
        : [['calendar','CALENDAR'],['list','LIST'],['history','HISTORY']];
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
