<template>
  <div class="space-y-1">
    <FieldLabel v-if="!hideLabel" :field="field" :required="required" />
    <div v-if="cameraOption" class="relative">
      <button
        type="button"
        :disabled="disabled || uploading"
        :class="[
          'relative flex w-full items-center ps-4 pe-11 py-3 rounded-lg border transition-all text-start',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          error ? 'border-error' : 'border-outline-variant hover:border-primary-container',
        ]"
        @click="menuOpen = !menuOpen"
        @blur="emit('blur')"
      >
        <span class="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2">
          <span class="material-symbols-outlined text-secondary" style="font-size:20px">attach_file</span>
        </span>
        <span class="text-body-md text-secondary">
          {{ uploading ? uploadingText : localValue ? changeFileText : chooseFileText }}
        </span>
      </button>
      <div
        v-if="menuOpen"
        class="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-outline-variant bg-white shadow-lg"
      >
        <button
          type="button"
          class="flex w-full items-center gap-3 px-4 py-3 text-start text-body-md hover:bg-surface-container"
          @click="pick(fileInput)"
        >
          <span class="material-symbols-outlined text-secondary" style="font-size:20px">folder_open</span>
          {{ chooseFromDeviceText }}
        </button>
        <button
          type="button"
          class="flex w-full items-center gap-3 border-t border-outline-variant px-4 py-3 text-start text-body-md hover:bg-surface-container"
          @click="openCamera"
        >
          <span class="material-symbols-outlined text-secondary" style="font-size:20px">photo_camera</span>
          {{ takePhotoText }}
        </button>
        <p v-if="cameraFailed" class="border-t border-outline-variant px-4 py-2 text-label-sm text-error">
          {{ cameraUnavailableText }}
        </p>
      </div>
      <div
        v-if="cameraOpen"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-black/90 p-4"
      >
        <video ref="videoEl" autoplay playsinline muted class="max-h-[70vh] w-full max-w-lg rounded-lg bg-black"></video>
        <div class="flex gap-3">
          <button
            type="button"
            class="rounded-lg bg-white px-6 py-3 text-body-md text-black"
            @click="closeCamera"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-body-md text-white"
            @click="capturePhoto"
          >
            <span class="material-symbols-outlined" style="font-size:20px">photo_camera</span>
            {{ captureText }}
          </button>
        </div>
      </div>
      <input ref="fileInput" type="file" class="sr-only" tabindex="-1" @change="onFileChange" />
      <input
        ref="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        class="sr-only"
        tabindex="-1"
        @change="onFileChange"
      />
    </div>
    <label
      v-else
      :class="[
        'relative flex items-center ps-4 pe-11 py-3 rounded-lg border transition-all cursor-pointer',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        error ? 'border-error' : 'border-outline-variant hover:border-primary-container',
      ]"
    >
      <span class="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2">
        <span class="material-symbols-outlined text-secondary" style="font-size:20px">attach_file</span>
      </span>
      <span class="text-body-md text-secondary">
        {{ uploading ? uploadingText : localValue ? changeFileText : chooseFileText }}
      </span>
      <input
        type="file"
        class="sr-only"
        :disabled="disabled || uploading"
        @change="onFileChange"
        @blur="emit('blur')"
      />
    </label>
    <a v-if="localValue" :href="localValue" target="_blank" class="block text-label-sm text-primary underline truncate">
      {{ localValue.split('/').pop() }}
    </a>
    <p v-if="error" class="text-label-sm text-error">{{ error }}</p>
    <p v-else-if="field.description && !localValue" class="text-label-sm text-secondary">{{ field.description }}</p>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import FieldLabel from './FieldLabel.vue'
import { uploadAttachment } from './attachUploader'

const props = defineProps({
  field: { type: Object, required: true },
  modelValue: { default: null },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  error: { type: String, default: null },
  required: { type: Boolean, default: false },
  hideLabel: { type: Boolean, default: false },
  generatedDoctype: { type: String, default: '' },
  tempName: { type: String, default: '' },
  chooseFileText: { type: String, default: 'Choose file' },
  changeFileText: { type: String, default: 'Change file' },
  uploadingText: { type: String, default: 'Uploading…' },
  // Opt-in: clicking opens a two-option menu (device file / camera photo)
  // instead of going straight to the OS file picker.
  cameraOption: { type: Boolean, default: false },
  chooseFromDeviceText: { type: String, default: 'Choose file' },
  takePhotoText: { type: String, default: 'Take photo' },
  captureText: { type: String, default: 'Capture' },
  cancelText: { type: String, default: 'Cancel' },
  cameraUnavailableText: { type: String, default: 'Camera unavailable — tap again to use the device camera' },
})
// `uploading` lets a parent form hold its submit until the file URL has been emitted.
const emit = defineEmits(['update:modelValue', 'blur', 'uploading'])
const uploading = ref(false)
watch(uploading, (v) => emit('uploading', v))
const menuOpen = ref(false)
const fileInput = ref(null)
const cameraInput = ref(null)
const videoEl = ref(null)
const cameraOpen = ref(false)
const cameraFailed = ref(false)
let stream = null

// Live camera preview via getUserMedia — needs HTTPS (or localhost) and
// triggers the browser's camera permission prompt. If it's unavailable or
// denied, the OS camera/file picker (capture attr) is the fallback. That
// `.click()` only works inside a user-gesture turn, so it can't run after the
// awaited getUserMedia: on failure we reopen the menu and the *next* tap
// opens the picker synchronously.
async function openCamera() {
  menuOpen.value = false
  if (cameraFailed.value || !navigator.mediaDevices?.getUserMedia) {
    return cameraInput.value?.click()
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  } catch {
    cameraFailed.value = true
    menuOpen.value = true
    return
  }
  cameraOpen.value = true
  await nextTick()
  videoEl.value.srcObject = stream
}

function closeCamera() {
  stream?.getTracks().forEach((t) => t.stop())
  stream = null
  cameraOpen.value = false
}

function capturePhoto() {
  const video = videoEl.value
  // No frame decoded yet (videoWidth is 0) — ignore the tap, keep the sheet open.
  if (!video?.videoWidth) return
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d').drawImage(video, 0, 0)
  canvas.toBlob(
    (blob) => {
      if (!blob) return
      closeCamera()
      uploadFile(new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' }))
    },
    'image/jpeg',
    0.9,
  )
}

onBeforeUnmount(closeCamera)

function pick(input) {
  menuOpen.value = false
  input?.click()
}
const localValue = computed(() => props.modelValue)

async function onFileChange(event) {
  const file = event.target?.files?.[0]
  if (!file) return emit('update:modelValue', null)
  await uploadFile(file)
}

async function uploadFile(file) {
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
