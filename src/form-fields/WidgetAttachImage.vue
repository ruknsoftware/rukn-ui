<template>
  <div class="space-y-1">
    <FieldLabel :field="field" :required="required" />
    <label
      :class="[
        'relative flex items-center ps-4 pe-11 py-3 rounded-lg border transition-all cursor-pointer',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        error ? 'border-error' : 'border-outline-variant hover:border-primary-container',
      ]"
    >
      <span class="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2">
        <span class="material-symbols-outlined text-secondary" style="font-size:20px">image</span>
      </span>
      <span class="text-body-md text-secondary">
        {{ uploading ? 'Uploading…' : localValue ? 'Change image' : 'Choose image' }}
      </span>
      <input
        type="file"
        accept="image/*"
        class="sr-only"
        :disabled="disabled || uploading"
        @change="onFileChange"
        @blur="emit('blur')"
      />
    </label>
    <div v-if="localValue" class="mt-2">
      <img :src="localValue" alt="preview" class="h-24 rounded-lg border border-outline-variant object-cover" />
    </div>
    <p v-if="error" class="text-label-sm text-error">{{ error }}</p>
    <p v-else-if="field.description && !localValue" class="text-label-sm text-secondary">{{ field.description }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import FieldLabel from './FieldLabel.vue'
import { uploadAttachment } from './attachUploader'

const props = defineProps({
  field: { type: Object, required: true },
  modelValue: { default: null },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: null },
  required: { type: Boolean, default: false },
  generatedDoctype: { type: String, default: '' },
  tempName: { type: String, default: '' },
})
const emit = defineEmits(['update:modelValue', 'blur'])
const uploading = ref(false)
const localValue = computed(() => props.modelValue)

async function onFileChange(event) {
  const file = event.target?.files?.[0]
  if (!file) return emit('update:modelValue', null)
  uploading.value = true
  try {
    const uploaded = await uploadAttachment(file, {
      doctype: props.generatedDoctype,
      docname: props.tempName,
      fieldname: props.field.fieldname,
    })
    emit('update:modelValue', uploaded?.file_url ?? null)
  } finally {
    uploading.value = false
  }
}
</script>