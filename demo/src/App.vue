<template>
  <div class="flex h-screen bg-surface-container-lowest">
    <Sidebar
      v-model:collapsed="collapsed"
      v-model:mobile-open="mobileOpen"
      :header="{ title: 'Rukn UI', subtitle: 'Sidebar Demo' }"
      :sections="sections"
    >
      <template #footer-items>
        <SidebarItem
          label="Sign Out"
          icon="logout"
          :onClick="() => alert('sign out clicked')"
        />
      </template>
    </Sidebar>

    <main class="flex-1 overflow-y-auto p-8">
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="mobileOpen = true"
          class="material-symbols-outlined rounded-lg p-2 text-on-surface hover:bg-surface-container-high md:hidden"
        >menu</button>
        <h1 class="text-headline-lg font-bold text-on-surface">Preview area</h1>
        <button
          type="button"
          @click="toggleDirection"
          class="rounded-lg bg-primary px-3 py-1.5 text-label-md text-on-primary transition-colors hover:opacity-90"
        >
          Switch to {{ isRtl ? "LTR" : "RTL" }}
        </button>
      </div>
      <p class="mt-2 max-w-prose text-body-md text-on-surface-variant">
        Stand-in for a real app's content area. Click the "Collapse" button at the
        bottom of the sidebar (visible at md+ widths), click nav items to see
        active-state highlighting, click the "Settings" section label to
        collapse/expand it, use the button above to flip the whole page to RTL, or
        shrink the window below 768px (md) and tap the ☰ button to see the mobile
        off-canvas drawer — tap the backdrop or a nav item to close it.
      </p>
      <p class="mt-4 text-body-md text-on-surface">
        Active item: <span class="font-semibold">{{ activeItem }}</span>
      </p>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { Sidebar, SidebarItem } from "../../src/index.js";

const collapsed = ref(false);
const mobileOpen = ref(false);
const activeItem = ref("dashboard");

const isRtl = ref(document.documentElement.dir === "rtl");
function toggleDirection() {
  isRtl.value = !isRtl.value;
  document.documentElement.dir = isRtl.value ? "rtl" : "ltr";
}

function select(item) {
  activeItem.value = item;
}

const sections = computed(() => [
  {
    label: "General",
    items: [
      {
        label: "Dashboard",
        icon: "dashboard",
        isActive: activeItem.value === "dashboard",
        onClick: () => select("dashboard"),
      },
      {
        label: "Projects",
        icon: "folder",
        suffix: "12",
        isActive: activeItem.value === "projects",
        onClick: () => select("projects"),
      },
      {
        label: "Tasks",
        icon: "checklist",
        isActive: activeItem.value === "tasks",
        onClick: () => select("tasks"),
      },
    ],
  },
  {
    label: "Settings",
    collapsible: true,
    items: [
      {
        label: "Profile",
        icon: "person",
        isActive: activeItem.value === "profile",
        onClick: () => select("profile"),
      },
      {
        label: "Preferences",
        icon: "tune",
        isActive: activeItem.value === "preferences",
        onClick: () => select("preferences"),
      },
    ],
  },
]);
</script>
