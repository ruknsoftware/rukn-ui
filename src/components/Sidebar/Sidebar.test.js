import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import Sidebar from "./Sidebar.vue";

const sections = [
  {
    label: "General",
    items: [{ label: "Dashboard", icon: "dashboard", isActive: true }],
  },
];

describe("Sidebar", () => {
  it("renders the header and sections", () => {
    const wrapper = mount(Sidebar, {
      props: { header: { title: "Rukn UI", subtitle: "Sidebar Demo" }, sections },
    });
    expect(wrapper.text()).toContain("Rukn UI");
    expect(wrapper.text()).toContain("General");
    expect(wrapper.text()).toContain("Dashboard");
  });

  it("toggles collapsed state when the collapse button is clicked", async () => {
    const wrapper = mount(Sidebar, { props: { sections } });
    expect(wrapper.text()).toContain("Collapse");
    await wrapper.findAll("button").at(-1).trigger("click");
    expect(wrapper.text()).toContain("Expand");
    expect(wrapper.find(".w-sidebar-collapsed-width").exists()).toBe(true);
  });

  it("hides the collapse toggle when disableCollapse is set", () => {
    const wrapper = mount(Sidebar, { props: { sections, disableCollapse: true } });
    expect(wrapper.text()).not.toContain("Collapse");
  });

  it("keeps the mobile drawer off-canvas and hides the backdrop by default", () => {
    const wrapper = mount(Sidebar, { props: { sections } });
    expect(wrapper.find(".bg-black\\/40").exists()).toBe(false);
    expect(wrapper.find(".max-md\\:-translate-x-full").exists()).toBe(true);
  });

  it("shows a backdrop and slides the drawer in when mobileOpen is true", () => {
    const wrapper = mount(Sidebar, { props: { sections, mobileOpen: true } });
    expect(wrapper.find(".bg-black\\/40").exists()).toBe(true);
    expect(wrapper.find(".max-md\\:translate-x-0").exists()).toBe(true);
  });

  it("closes the mobile drawer when the backdrop is clicked", async () => {
    const wrapper = mount(Sidebar, { props: { sections, mobileOpen: true } });
    await wrapper.find(".bg-black\\/40").trigger("click");
    expect(wrapper.find(".bg-black\\/40").exists()).toBe(false);
  });

  it("closes the mobile drawer when a nav item is clicked", async () => {
    const wrapper = mount(Sidebar, { props: { sections, mobileOpen: true } });
    await wrapper.find("button").trigger("click");
    expect(wrapper.find(".bg-black\\/40").exists()).toBe(false);
  });

  it("does not close the mobile drawer when a collapsible section label is toggled", async () => {
    const collapsibleSections = [{ ...sections[0], collapsible: true }];
    const wrapper = mount(Sidebar, {
      props: { sections: collapsibleSections, mobileOpen: true },
    });
    await wrapper.find(".relative").trigger("click");
    expect(wrapper.find(".bg-black\\/40").exists()).toBe(true);
  });

  it("lets toggleIcon override the collapse-toggle glyph", () => {
    const wrapper = mount(Sidebar, { props: { sections, toggleIcon: "menu" } });
    const toggleButton = wrapper.findAll("button").at(-1);
    expect(toggleButton.find(".material-symbols-outlined").text()).toBe("menu");
  });

  it("passes chevronIcon down to sections, overridable per-section", () => {
    const collapsibleSections = [
      { ...sections[0], collapsible: true },
      { label: "Settings", collapsible: true, chevronIcon: "expand_more", items: [] },
    ];
    const wrapper = mount(Sidebar, {
      props: { sections: collapsibleSections, chevronIcon: "arrow_right" },
    });
    const chevrons = wrapper.findAll(".material-symbols-outlined");
    const chevronTexts = chevrons.map((c) => c.text());
    expect(chevronTexts).toContain("arrow_right");
    expect(chevronTexts).toContain("expand_more");
  });

  it("lets a content slot fully replace the sections-driven middle area", () => {
    const wrapper = mount(Sidebar, {
      props: { sections },
      slots: { content: '<div class="custom-content">custom nav</div>' },
    });
    expect(wrapper.find(".custom-content").exists()).toBe(true);
    expect(wrapper.text()).not.toContain("Dashboard");
  });

  it("renders footer-items slot content", () => {
    const wrapper = mount(Sidebar, {
      props: { sections },
      slots: { "footer-items": '<div class="custom-footer">Sign Out</div>' },
    });
    expect(wrapper.find(".custom-footer").exists()).toBe(true);
  });

  it("omits the footer wrapper's top padding when disableCollapse hides the toggle button", () => {
    const wrapper = mount(Sidebar, {
      props: { sections, disableCollapse: true },
      slots: { "footer-items": '<div class="custom-footer">Sign Out</div>' },
    });
    expect(wrapper.find(".custom-footer").element.parentElement.className).not.toContain("pt-2");
  });

  it("defaults containerClass to the MD3 tokens", () => {
    const wrapper = mount(Sidebar, { props: { sections } });
    // .overflow-y-auto is unique to the root panel, unlike bg-surface-container-low
    // which an active SidebarItem also carries.
    expect(wrapper.find(".overflow-y-auto").classes()).toContain("bg-surface-container-low");
  });

  it("lets containerClass override the panel's background/border", () => {
    const wrapper = mount(Sidebar, {
      props: { sections, containerClass: "bg-white border-e border-[#c7c4d8]" },
    });
    const panel = wrapper.find(".overflow-y-auto");
    expect(panel.classes()).not.toContain("bg-surface-container-low");
    expect(panel.classes()).toContain("bg-white");
  });

  it("closes the mobile drawer when a slotted <a> nav item is clicked", async () => {
    const wrapper = mount(Sidebar, {
      props: { sections, mobileOpen: true },
      slots: { "sidebar-item": '<a href="/documents" @click.prevent>Documents</a>' },
    });
    await wrapper.find("a").trigger("click");
    expect(wrapper.find(".bg-black\\/40").exists()).toBe(false);
  });
});
