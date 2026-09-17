import { describe, expect, it, vi } from "vitest";
import { markRaw } from "vue";
import { mount } from "@vue/test-utils";
import SidebarItem from "./SidebarItem.vue";

describe("SidebarItem", () => {
  it("renders the label", () => {
    const wrapper = mount(SidebarItem, { props: { label: "Dashboard" } });
    expect(wrapper.text()).toContain("Dashboard");
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    const wrapper = mount(SidebarItem, { props: { label: "Dashboard", onClick } });
    await wrapper.find("button").trigger("click");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("applies active styling when isActive is true", () => {
    const wrapper = mount(SidebarItem, { props: { label: "Dashboard", isActive: true } });
    expect(wrapper.find("button").classes()).toContain("bg-primary-container");
  });

  it("renders a material-symbols icon name as the icon span's text", () => {
    const wrapper = mount(SidebarItem, { props: { label: "Dashboard", icon: "dashboard" } });
    expect(wrapper.find(".material-symbols-outlined").text()).toBe("dashboard");
  });

  it("renders a component icon instead of text when icon is not a string", () => {
    const IconStub = markRaw({ template: '<svg class="icon-stub" />' });
    const wrapper = mount(SidebarItem, { props: { label: "Dashboard", icon: IconStub } });
    expect(wrapper.find(".icon-stub").exists()).toBe(true);
    expect(wrapper.find(".material-symbols-outlined").exists()).toBe(false);
  });

  it("shows a title tooltip only when the sidebar is collapsed", () => {
    const collapsed = mount(SidebarItem, {
      props: { label: "Dashboard" },
      global: { provide: { isSidebarCollapsed: true } },
    });
    expect(collapsed.find("button").attributes("title")).toBe("Dashboard");

    const expanded = mount(SidebarItem, {
      props: { label: "Dashboard" },
      global: { provide: { isSidebarCollapsed: false } },
    });
    expect(expanded.find("button").attributes("title")).toBeUndefined();
  });

  it("renders the suffix when provided", () => {
    const wrapper = mount(SidebarItem, { props: { label: "Projects", suffix: "12" } });
    expect(wrapper.text()).toContain("12");
  });

  it("disables the button and ignores clicks when disabled is true", async () => {
    const onClick = vi.fn();
    const wrapper = mount(SidebarItem, {
      props: { label: "Management", disabled: true, onClick },
    });
    expect(wrapper.find("button").attributes("disabled")).toBeDefined();
    expect(wrapper.find("button").classes()).toContain("opacity-50");
    await wrapper.find("button").trigger("click");
    expect(onClick).not.toHaveBeenCalled();
  });
});
