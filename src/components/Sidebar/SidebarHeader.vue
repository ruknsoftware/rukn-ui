<template>
  <div
    class="flex items-center gap-2 rounded-lg py-2 transition-all duration-300 ease-in-out"
    :class="isCollapsed ? 'justify-center px-0' : 'px-2'"
  >
    <div class="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg">
      <slot name="logo">
        <img
          v-if="typeof logo === 'string'"
          :src="logo"
          class="h-full w-full object-cover"
          alt="Logo"
        />
        <div
          v-else-if="!logo"
          class="flex h-full w-full items-center justify-center bg-surface-container-high font-semibold text-on-surface-variant"
        >{{ title?.charAt(0).toUpperCase() }}</div>
        <component v-else :is="logo" class="h-full w-full" />
      </slot>
    </div>
    <div
      class="flex flex-1 flex-col truncate text-start transition-all duration-300 ease-in-out"
      :class="isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'"
    >
      <div class="truncate text-headline-md font-bold leading-none text-on-surface">{{ title }}</div>
      <div
        v-if="subtitle"
        class="mt-1 truncate text-label-md leading-none text-on-surface-variant opacity-70"
      >{{ subtitle }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: null },
  logo: { default: null },
  isCollapsed: { type: Boolean, default: false },
})
</script>
