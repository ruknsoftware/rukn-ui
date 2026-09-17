<template>
  <button
    type="button"
    :disabled="disabled"
    :accesskey="accessKey"
    :title="isCollapsed ? label : undefined"
    @click="!disabled && onClick && onClick()"
    class="flex w-full items-center rounded-lg px-3 py-2 text-label-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    :class="
      disabled
        ? 'cursor-not-allowed text-on-surface-variant opacity-50'
        : isActive
          ? 'bg-surface-container-low text-primary font-semibold'
          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
    "
  >
    <span class="flex flex-1 items-center gap-3 truncate">
      <span class="grid flex-shrink-0 place-items-center">
        <slot name="icon">
          <span
            v-if="icon && typeof icon === 'string'"
            class="material-symbols-outlined text-[20px] leading-none"
          >{{ icon }}</span>
          <component v-else-if="icon" :is="icon" class="size-5" />
        </slot>
      </span>
      <span
        class="flex-1 truncate text-start transition-all duration-300 ease-in-out"
        :class="isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'"
      >{{ label }}</span>
    </span>
    <span
      v-if="suffix || $slots.suffix"
      class="flex-shrink-0 text-label-sm text-on-surface-variant/70 transition-all duration-300 ease-in-out"
      :class="isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'"
    >
      <slot name="suffix">{{ suffix }}</slot>
    </span>
  </button>
</template>

<script setup>
import { inject } from 'vue'

defineProps({
  label: { type: String, required: true },
  icon: { default: null },
  suffix: { type: String, default: null },
  isActive: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  onClick: { type: Function, default: null },
  accessKey: { type: String, default: null },
})

const isCollapsed = inject('isSidebarCollapsed', false)
</script>
