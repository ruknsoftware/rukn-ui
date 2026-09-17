<template>
  <div ref="root" class="relative">
    <component
      :is="hasMenu ? 'button' : 'div'"
      :type="hasMenu ? 'button' : undefined"
      class="flex w-full items-center gap-2 rounded-lg py-2 transition-all duration-300 ease-in-out"
      :class="[
        isCollapsed ? 'justify-center px-0' : 'px-2',
        hasMenu ? 'hover:bg-surface-container-high focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40' : '',
      ]"
      @click="hasMenu ? (open = !open) : null"
    >
      <div v-if="showLogo" class="h-8 w-8 flex-shrink-0 overflow-hidden rounded-lg">
        <slot name="prefix">
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
      <span
        v-if="hasMenu"
        class="material-symbols-outlined flex-shrink-0 text-[20px] leading-none text-on-surface-variant transition-all duration-300 ease-in-out"
        :class="isCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'"
      >expand_more</span>
    </component>

    <div
      v-if="open && hasMenu"
      class="absolute z-10 w-48 rounded-lg border border-outline-variant bg-surface-container-lowest p-1 shadow-lg"
      :class="menuPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'"
    >
      <button
        v-for="item in menuItems"
        :key="item.label"
        type="button"
        class="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
        @click="handleMenuClick(item)"
      >
        <span
          v-if="item.icon && typeof item.icon === 'string'"
          class="material-symbols-outlined text-[20px] leading-none"
        >{{ item.icon }}</span>
        <component v-else-if="item.icon" :is="item.icon" class="size-5" />
        <span class="flex-1 truncate">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  // Workspace or app title.
  title: { type: String, required: true },
  // Secondary line under the title, e.g. a domain or workspace slug.
  subtitle: { type: String, default: null },
  // Leading logo: an image URL, or a component. Overridden by the #prefix slot.
  logo: { default: null },
  // Whether to render the leading logo/avatar box. Set to false when
  // workspace identity is already shown elsewhere, to avoid a duplicate
  // avatar; the title then sits flush-start. Best paired with a
  // non-collapsing sidebar, since a collapsed header with no logo has
  // nothing to show.
  showLogo: { type: Boolean, default: true },
  isCollapsed: { type: Boolean, default: false },
  // [{ label, icon?, onClick? }] — rendered in the trigger's dropdown.
  // Presence of items (not just the prop) makes the header itself
  // clickable; omit/empty means a plain, non-interactive header.
  menuItems: { type: Array, default: null },
  // Which side of the trigger the dropdown opens toward — 'bottom' (default)
  // for a header at the top of the sidebar, 'top' for one pinned at the
  // bottom (e.g. a footer account switcher).
  menuPosition: { type: String, default: 'bottom' },
})

const hasMenu = computed(() => !!props.menuItems?.length)
const open = ref(false)
const root = ref(null)

function handleMenuClick(item) {
  open.value = false
  item.onClick && item.onClick()
}

function closeOnOutsideClick(event) {
  if (open.value && !root.value?.contains(event.target)) {
    open.value = false
  }
}
onMounted(() => document.addEventListener('click', closeOnOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', closeOnOutsideClick))
</script>
