window.RT = window.RT || {};
RT.time = {
  formatCountdown(netMs, nowMs, windowStartMs) {
    const diff = netMs - nowMs;
    if (diff <= 0) return '已完成';
    if (windowStartMs && nowMs >= windowStartMs) return '发射窗口已开启';
    if (diff < 60 * 60 * 1000) {
      const totalSec = Math.floor(diff / 1000);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      return `T-${m}m ${s}s`;
    }
    const totalMin = Math.floor(diff / 60000);
    const d = Math.floor(totalMin / (60 * 24));
    const h = Math.floor((totalMin % (60 * 24)) / 60);
    const m = totalMin % 60;
    return `T-${d}d ${h}h ${m}m`;
  },

  formatLocal(ms, timezone) {
    try {
      const d = new Date(ms);
      const fmt = new Intl.DateTimeFormat('zh-CN', {
        timeZone: timezone,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: false
      });
      return fmt.format(d).replace(/\//g, '-');
    } catch (e) {
      return new Date(ms).toISOString().slice(0, 16).replace('T', ' ');
    }
  },

  getUpcomingStatus(netMs, nowMs, windowStartMs) {
    if (netMs <= nowMs) return 'done';
    if (windowStartMs && nowMs >= windowStartMs) return 'window_open';
    return 'go';
  },

  isWithin72h(netMs, nowMs) {
    const diff = netMs - nowMs;
    return diff > 0 && diff < 72 * 60 * 60 * 1000;
  }
};
