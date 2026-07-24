window.RT_TESTS = {
  results: [],
  register(name, fn) { this.results.push({ name, fn, status: 'pending' }); },
  async run() {
    const output = document.getElementById('test-output');
    let pass = 0, fail = 0;
    for (const t of this.results) {
      try {
        await t.fn();
        t.status = 'pass'; pass++;
        output.innerHTML += `<div class="pass">✓ ${t.name}</div>`;
      } catch (e) {
        t.status = 'fail'; fail++;
        output.innerHTML += `<div class="fail">✗ ${t.name}<pre>${e.stack || e.message}</pre></div>`;
      }
    }
    output.innerHTML += `<div class="summary">总计: ${this.results.length} · 通过: ${pass} · 失败: ${fail}</div>`;
  }
};
window.assert = {
  equal(actual, expected, msg) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`${msg || ''}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`);
    }
  },
  truthy(value, msg) { if (!value) throw new Error(msg || `expected truthy, got ${value}`); },
  falsy(value, msg) { if (value) throw new Error(msg || `expected falsy, got ${value}`); },
  throws(fn, msg) {
    let threw = false;
    try { fn(); } catch (e) { threw = true; }
    if (!threw) throw new Error(msg || 'expected function to throw');
  }
};
