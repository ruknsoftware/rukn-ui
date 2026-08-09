<template>
  <component :is="tag" :class="[wrapperClass, field.bold ? 'font-bold' : '']">
    {{ field.label }}<span v-if="required" class="text-error ml-1">*</span>
  </component>
</template>

<script setup>
defineProps({
  field: { type: Object, required: true },
  required: { type: Boolean, default: false },
  tag: { type: String, default: 'label' },
  wrapperClass: { type: [String, Array], default: 'block text-label-md text-on-surface' },
})
</script>
