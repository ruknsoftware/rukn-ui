<template>
  <div
    v-if="mobileOpen"
    class="fixed inset-0 z-40 bg-black/40 md:hidden"
    @click="mobileOpen = false"
  />

  <div
    class="flex flex-shrink-0 flex-col self-stretch overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out max-md:fixed max-md:inset-y-0 max-md:start-0 max-md:z-50 max-md:h-auto max-md:w-sidebar-width max-md:duration-200"
    :class="[
      containerClass,
      shouldCollapse ? 'w-sidebar-collapsed-width' : 'w-sidebar-width',
      mobileOpen
        ? 'max-md:translate-x-0'
        : 'max-md:-translate-x-full max-md:rtl:translate-x-full',
    ]"
  >
    <slot name="header">
      <SidebarHeader
        v-if="header"
        :title="header.title"
        :subtitle="header.subtitle"
        :logo="header.logo"
        :isCollapsed="shouldCollapse"
      >
        <template #logo><slot name="header-logo" /></template>
      </SidebarHeader>
    </slot>

    <slot name="content">
      <div @click="closeOnItemClick">
        <SidebarSection
          v-for="section in sections"
          :key="section.label ?? section.items.map((item) => item.label).join('-')"
          :label="section.label"
          :items="section.items"
          :collapsible="section.collapsible"
          :chevron-icon="section.chevronIcon ?? chevronIcon"
        >
          <template #sidebar-item="{ item, isCollapsed }">
            <slot name="sidebar-item" :item="item" :isCollapsed="isCollapsed" />
          </template>
        </SidebarSection>
      </div>
    </slot>

    <div class="mt-auto flex flex-col gap-1" :class="{ 'pt-2': !disableCollapse }">
      <slot name="footer-items" :isCollapsed="shouldCollapse" />
      <button
        v-if="!disableCollapse"
        type="button"
        @click="collapsed = !collapsed"
        class="hidden w-full items-center gap-2 rounded-lg px-2 py-1.5 text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high md:flex"
      >
        <span
          class="grid flex-shrink-0 place-items-center transition-transform duration-300 ease-in-out rtl:-scale-x-100"
          :class="{ 'rotate-180': !shouldCollapse }"
        >
          <span
            v-if="typeof toggleIcon === 'string'"
            class="material-symbols-outlined text-[20px] leading-none"
          >{{ toggleIcon }}</span>
          <component v-else :is="toggleIcon" class="size-5" />
        </span>
        <span
          class="truncate transition-all duration-300 ease-in-out"
          :class="shouldCollapse ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'"
        >{{ shouldCollapse ? 'Expand' : 'Collapse' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, provide } from 'vue'
import SidebarHeader from './SidebarHeader.vue'
import SidebarSection from './SidebarSection.vue'

const props = defineProps({
  // { title, subtitle?, logo? } — logo is an image URL string or a component
  header: { type: Object, default: null },
  // [{ label, collapsible?, chevronIcon?, items: [{ label, icon?, suffix?, isActive?, onClick?, accessKey? }] }]
  sections: { type: Array, default: () => [] },
  disableCollapse: { type: Boolean, default: false },
  // Default chevron for collapsible sections; override per-section via section.chevronIcon
  chevronIcon: { default: 'chevron_right' },
  toggleIcon: { default: 'left_panel_open' },
  // Override the root panel's background/border/padding, e.g. to match an
  // app's existing design instead of the default MD3 tokens.
  containerClass: {
    type: [String, Array, Object],
    default: 'border-e border-outline-variant bg-surface-container-low p-2',
  },
})

// Desktop (md+): icon-only vs full-width. Consuming app owns persistence.
const collapsed = defineModel('collapsed', { type: Boolean, default: false })
// Below md: off-canvas drawer, hidden unless mobileOpen. Consuming app's own
// header/hamburger button toggles this — Sidebar only renders the drawer +
// backdrop, not the button that opens it.
const mobileOpen = defineModel('mobileOpen', { type: Boolean, default: false })

const shouldCollapse = computed(() => collapsed.value && !props.disableCollapse)
provide('isSidebarCollapsed', shouldCollapse)

// Mirrors docflow's AppShell: clicking any nav item (a <button> or a <a>/
// router-link rendered via the sidebar-item slot — unlike the section-label
// toggles, which are plain divs) closes the mobile drawer; collapsing/
// expanding a section keeps it open.
function closeOnItemClick(event) {
  if (event.target.closest('button, a')) {
    mobileOpen.value = false
  }
}
</script>
