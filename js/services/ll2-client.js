window.RT = window.RT || {};
RT.ll2Client = {
  BASE_URL: 'https://ll.thespacedevs.com/2.2.0/',
  MAX_RETRIES: 3,
  RETRY_DELAYS: [2000, 4000, 8000],

  buildUrl(endpoint, params) {
    const p = Object.assign({ limit: 100, mode: 'detailed', offset: 0 }, params || {});
    const query = Object.keys(p).map(k => `${k}=${p[k]}`).join('&');
    return `${this.BASE_URL}launch/${endpoint}/?${query}`;
  },

  normalizeLaunch(raw) {
    return {
      id: raw.id,
      name: raw.name,
      net: raw.net,
      window_start: raw.window_start,
      window_end: raw.window_end,
      status: raw.status ? raw.status.abbrev : null,
      status_abbrev: raw.status ? raw.status.name : null,
      provider: raw.launch_service_provider ? {
        id: (RT.MANUFACTURER_ALIASES && RT.MANUFACTURER_ALIASES[raw.launch_service_provider.id]) || raw.launch_service_provider.id,
        name: raw.launch_service_provider.name
      } : null,
      rocket_config: raw.rocket && raw.rocket.configuration ? {
        id: raw.rocket.configuration.id, name: raw.rocket.configuration.name
      } : null,
      pad: raw.pad ? { name: raw.pad.name, location: raw.pad.location ? raw.pad.location.name : null } : null,
      mission: raw.mission ? {
        name: raw.mission.name, type: raw.mission.type,
        orbit: raw.mission.orbit ? raw.mission.orbit.name : null,
        payload_mass_kg: raw.mission.payload_mass || raw.payload_mass || null
      } : null
    };
  },

  filterByDateRange(launches, nowMs, pastDays, futureDays) {
    const start = nowMs - pastDays * 24 * 60 * 60 * 1000;
    const end = nowMs + futureDays * 24 * 60 * 60 * 1000;
    return launches.filter(l => {
      const t = new Date(l.net).getTime();
      return t >= start && t <= end;
    });
  },

  async fetchUpcoming() { return this._fetchWithRetry(this.buildUrl('upcoming')); },
  async fetchPrevious() { return this._fetchWithRetry(this.buildUrl('previous')); },

  async _fetchWithRetry(url) {
    let lastError;
    for (let attempt = 0; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const resp = await fetch(url);
        if (resp.status === 429) {
          const err = new Error('Rate limited by LL2');
          err.name = 'RateLimitError'; err.status = 429;
          throw err;
        }
        if (!resp.ok) {
          const err = new Error(`LL2 returned ${resp.status}`);
          err.name = 'HttpError'; err.status = resp.status;
          throw err;
        }
        const data = await resp.json();
        return data.results.map(l => this.normalizeLaunch(l));
      } catch (e) {
        lastError = e;
        if (e.name === 'RateLimitError') throw e;
        if (attempt < this.MAX_RETRIES) {
          await new Promise(r => setTimeout(r, this.RETRY_DELAYS[attempt]));
          continue;
        }
        // 重试耗尽:所有非限速错误统一转为 FetchError
        const err = new Error(e.message);
        err.name = 'FetchError';
        err.original = e;
        throw err;
      }
    }
    throw lastError;
  }
};
