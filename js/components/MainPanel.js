window.RT = window.RT || {};
RT.MainPanel = {
  name: 'MainPanel',
  props: ['store'],
  template: `
    <main class="h-full overflow-hidden">
      <calendar-view v-if="store.view === 'calendar'" :store="store" />
      <list-view v-else-if="store.view === 'list'" :store="store" />
      <history-view v-else :store="store" />
    </main>
  `
};
