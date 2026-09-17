import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import SidebarSection from "./SidebarSection.vue";

const items = [
  { label: "Profile", icon: "person" },
  { label: "Preferences", icon: "tune" },
];

describe("SidebarSection", () => {
  it("renders the section label and all items", () => {
    const wrapper = mount(SidebarSection, { props: { label: "Settings", items } });
    expect(wrapper.text()).toContain("Settings");
    expect(wrapper.text()).toContain("Profile");
    expect(wrapper.text()).toContain("Preferences");
  });

  it("toggles item visibility when collapsible and the label is clicked", async () => {
    const wrapper = mount(SidebarSection, {
      props: { label: "Settings", items, collapsible: true },
    });
    expect(wrapper.find("nav").element.style.display).not.toBe("none");
    await wrapper.find(".relative").trigger("click");
    expect(wrapper.find("nav").element.style.display).toBe("none");
  });

  it("does not toggle when the section is not collapsible", async () => {
    const wrapper = mount(SidebarSection, { props: { label: "Settings", items } });
    await wrapper.find(".relative").trigger("click");
    expect(wrapper.find("nav").element.style.display).not.toBe("none");
  });

  it("lets a sidebar-item slot override the default item rendering", () => {
    const wrapper = mount(SidebarSection, {
      props: { label: "Settings", items },
      slots: { "sidebar-item": '<div class="custom-item">custom</div>' },
    });
    expect(wrapper.findAll(".custom-item")).toHaveLength(items.length);
  });

  it("defaults the collapsible chevron to chevron_right", () => {
    const wrapper = mount(SidebarSection, {
      props: { label: "Settings", items, collapsible: true },
    });
    expect(wrapper.find(".material-symbols-outlined").text()).toBe("chevron_right");
  });

  it("lets chevronIcon override the collapsible chevron glyph", () => {
    const wrapper = mount(SidebarSection, {
      props: { label: "Settings", items, collapsible: true, chevronIcon: "expand_more" },
    });
    expect(wrapper.find(".material-symbols-outlined").text()).toBe("expand_more");
  });
});
