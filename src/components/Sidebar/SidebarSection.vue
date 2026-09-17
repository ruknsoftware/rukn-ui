<template>
  <div class="mt-2 flex flex-col gap-0.5">
    <div
      v-if="label"
      class="relative flex items-center gap-1 px-2 py-1.5"
      :class="collapsible ? 'cursor-pointer select-none' : ''"
      @click="collapsible ? (isOpen = !isOpen) : null"
    >
      <span
        class="text-label-sm uppercase tracking-wider text-on-surface-variant transition-all duration-300 ease-in-out"
        :class="isSidebarCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'"
      >{{ label }}</span>
      <span
        v-if="collapsible && !isSidebarCollapsed"
        class="grid flex-shrink-0 place-items-center text-on-surface-variant transition-transform duration-300 ease-in-out"
        :class="{ 'rotate-90': isOpen }"
      >
        <span
          v-if="typeof chevronIcon === 'string'"
          class="material-symbols-outlined text-[16px] leading-none"
        >{{ chevronIcon }}</span>
        <component v-else :is="chevronIcon" class="size-4" />
      </span>
      <div
        v-if="isSidebarCollapsed"
        class="absolute inset-0 flex items-center justify-center"
      >
        <hr class="w-full border-t border-outline-variant" />
      </div>
    </div>
    <nav v-show="isOpen" class="flex flex-col gap-0.5">
      <template v-for="item in items" :key="item.label">
        <slot name="sidebar-item" :item="item" :isCollapsed="isSidebarCollapsed">
          <SidebarItem
            :label="item.label"
            :icon="item.icon"
            :suffix="item.suffix"
            :isActive="item.isActive"
            :disabled="item.disabled"
            :onClick="item.onClick"
            :accessKey="item.accessKey"
          />
        </slot>
      </template>
    </nav>
  </div>
</template>

<script setup>
import { inject, ref } from 'vue'
import SidebarItem from './SidebarItem.vue'

defineProps({
  label: { type: String, default: null },
  items: { type: Array, default: () => [] },
  collapsible: { type: Boolean, default: false },
  chevronIcon: { default: 'chevron_right' },
})

const isSidebarCollapsed = inject('isSidebarCollapsed', false)
const isOpen = ref(true)
</script>
