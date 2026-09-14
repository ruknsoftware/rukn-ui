<template>
  <div class="relative space-y-1">
    <FieldLabel v-if="!hideLabel" :field="field" :required="required" />
    <div ref="inputWrapperRef" class="relative">
      <input
        v-model="query"
        type="text"
        :placeholder="field.placeholder ?? ''"
        :readonly="readonly"
        :disabled="disabled"
        autocomplete="off"
        :class="[
          'w-full py-3 ps-4 pe-10 rounded-lg border transition-all outline-none text-body-md bg-white placeholder:text-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed read-only:bg-surface-container-low',
          error ? 'border-error' : 'border-outline-variant focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container',
          field.bold ? 'font-bold' : '',
        ]"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <button
        v-if="modelValue && !disabled && !readonly"
        type="button"
        class="absolute end-3 top-1/2 -translate-y-1/2"
        @mousedown.prevent="clear"
      >
        <span class="material-symbols-outlined text-secondary" style="font-size: 18px">close</span>
      </button>
      <span v-else class="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2">
        <span class="material-symbols-outlined text-secondary" style="font-size: 18px">search</span>
      </span>
    </div>
    <p v-if="error" class="text-label-sm text-error">{{ error }}</p>
    <p v-else-if="field.description" class="text-label-sm text-secondary">{{ field.description }}</p>

    <!-- Teleported to <body> and positioned with fixed coordinates, not a
    plain absolutely-positioned child of the input wrapper — this widget
    is meant to be usable inside tables/modals/anything with overflow-
    hidden or overflow-auto ancestors (e.g. docflow's EntryLineEditor.vue
    line-items table), which would otherwise clip a same-DOM-subtree
    dropdown instead of letting it float above the page. -->
    <Teleport to="body">
      <ul
        v-if="open && (loading || results.length)"
        :style="dropdownStyle"
        class="z-[70] max-h-64 overflow-auto rounded-lg border border-outline-variant bg-white py-1 shadow-lg"
      >
        <li v-if="loading" class="px-4 py-2 text-body-md text-secondary">...</li>
        <li
          v-for="opt in results"
          :key="opt.value"
          class="cursor-pointer px-4 py-2 text-body-md hover:bg-primary-container/10"
          @mousedown.prevent="select(opt)"
        >
          {{ opt.label || opt.value }}
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import FieldLabel from './FieldLabel.vue'
import { searchLink } from './linkSearch'

const props = defineProps({
  field: { type: Object, required: true }, // field.options = target doctype, field.filters = optional Frappe filter dict/list
  modelValue: { default: null },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: null },
  required: { type: Boolean, default: false },
  hideLabel: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'blur'])

const query = ref('')
const open = ref(false)
const loading = ref(false)
const results = ref([])
const inputWrapperRef = ref(null)
const dropdownStyle = ref({})
let debounceTimer = null
let currentLabel = '' // resolved label for the current modelValue, so blur doesn't wipe a valid selection

function updatePosition() {
  const rect = inputWrapperRef.value?.getBoundingClientRect()
  if (!rect) return
  dropdownStyle.value = {
    position: 'fixed',
    top: `${rect.bottom + 4}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
  }
}

// Reposition on scroll of ANY ancestor (capture: true — a scroll event
// only bubbles from the element that scrolled, never up through parents,
// so a plain non-capturing listener on window would miss e.g. the
// line-items table scrolling under a fixed dropdown) and on resize, for
// as long as the dropdown is open.
function onWindowScrollOrResize() {
  if (open.value) updatePosition()
}

function openDropdown() {
  open.value = true
  updatePosition()
  window.addEventListener('scroll', onWindowScrollOrResize, true)
  window.addEventListener('resize', onWindowScrollOrResize)
}

function closeDropdown() {
  open.value = false
  window.removeEventListener('scroll', onWindowScrollOrResize, true)
  window.removeEventListener('resize', onWindowScrollOrResize)
}

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowScrollOrResize, true)
  window.removeEventListener('resize', onWindowScrollOrResize)
})

async function runSearch(txt) {
  loading.value = true
  try {
    results.value = await searchLink(props.field.options, txt, props.field.filters)
  } finally {
    loading.value = false
  }
}

function onInput() {
  openDropdown()
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => runSearch(query.value), 300)
}

function onFocus() {
  openDropdown()
  if (!results.value.length) runSearch(query.value)
}

function select(opt) {
  currentLabel = opt.label || opt.value
  query.value = currentLabel
  closeDropdown()
  emit('update:modelValue', opt.value)
}

function clear() {
  currentLabel = ''
  query.value = ''
  results.value = []
  emit('update:modelValue', null)
}

function onBlur() {
  // Revert to the last known-good label rather than leaving free-typed
  // text that was never actually selected from the dropdown — this
  // widget only ever sets modelValue via select(), so an unselected query
  // string doesn't correspond to a real value.
  closeDropdown()
  query.value = currentLabel
  emit('blur')
}

// Resolve modelValue -> display label on mount/external change (e.g. an
// existing record being edited) via one exact-match search_link call,
// same server-side title_field resolution real Frappe Link fields use —
// no client-side doctype-meta lookup needed.
watch(
  () => props.modelValue,
  async (value) => {
    if (!value) {
      currentLabel = ''
      query.value = ''
      return
    }
    if (value === (results.value.find((r) => r.value === value)?.value)) return
    const matches = await searchLink(props.field.options, '', { name: value })
    const match = matches.find((m) => m.value === value)
    currentLabel = match?.label || value
    query.value = currentLabel
  },
  { immediate: true }
)
</script>
