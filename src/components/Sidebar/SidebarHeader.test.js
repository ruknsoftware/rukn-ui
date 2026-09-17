import { describe, expect, it, vi } from "vitest";
import { markRaw } from "vue";
import { mount } from "@vue/test-utils";
import SidebarHeader from "./SidebarHeader.vue";

describe("SidebarHeader", () => {
  it("renders the title and subtitle", () => {
    const wrapper = mount(SidebarHeader, {
      props: { title: "Rukn UI", subtitle: "Sidebar Demo" },
    });
    expect(wrapper.text()).toContain("Rukn UI");
    expect(wrapper.text()).toContain("Sidebar Demo");
  });

  it("falls back to the title's initial when no logo is given", () => {
    const wrapper = mount(SidebarHeader, { props: { title: "Rukn UI" } });
    expect(wrapper.text()).toContain("R");
    expect(wrapper.find("img").exists()).toBe(false);
  });

  it("renders an <img> when logo is a URL string", () => {
    const wrapper = mount(SidebarHeader, { props: { title: "Rukn UI", logo: "/logo.png" } });
    expect(wrapper.find("img").attributes("src")).toBe("/logo.png");
  });

  it("renders a logo component when logo is not a string", () => {
    const LogoStub = markRaw({ template: '<svg class="logo-stub" />' });
    const wrapper = mount(SidebarHeader, { props: { title: "Rukn UI", logo: LogoStub } });
    expect(wrapper.find(".logo-stub").exists()).toBe(true);
  });

  it("renders custom content passed to the #prefix slot instead of the default logo", () => {
    const wrapper = mount(SidebarHeader, {
      props: { title: "Rukn UI" },
      slots: { prefix: '<div class="custom-prefix" />' },
    });
    expect(wrapper.find(".custom-prefix").exists()).toBe(true);
    expect(wrapper.find(".bg-surface-container-high").exists()).toBe(false);
  });

  it("omits the logo box entirely when showLogo is false", () => {
    const wrapper = mount(SidebarHeader, { props: { title: "Rukn UI", showLogo: false } });
    expect(wrapper.find(".rounded-lg.overflow-hidden").exists()).toBe(false);
  });

  it("is a plain non-interactive div when no menuItems are given", () => {
    const wrapper = mount(SidebarHeader, { props: { title: "Rukn UI" } });
    expect(wrapper.find("button").exists()).toBe(false);
    expect(wrapper.text()).not.toContain("expand_more");
  });

  it("shows a chevron indicator only when menuItems are given", () => {
    const wrapper = mount(SidebarHeader, {
      props: { title: "Rukn UI", menuItems: [{ label: "Sign out" }] },
    });
    expect(wrapper.find(".material-symbols-outlined").text()).toBe("expand_more");
  });

  it("becomes a clickable trigger that opens a dropdown when menuItems are given", async () => {
    const onClick = vi.fn();
    const wrapper = mount(SidebarHeader, {
      props: { title: "Rukn UI", menuItems: [{ label: "Sign out", icon: "logout", onClick }] },
    });
    expect(wrapper.find("button").exists()).toBe(true);
    expect(wrapper.text()).not.toContain("Sign out");

    await wrapper.find("button").trigger("click");
    expect(wrapper.text()).toContain("Sign out");

    await wrapper.findAll("button").at(-1).trigger("click");
    expect(onClick).toHaveBeenCalledOnce();
    expect(wrapper.text()).not.toContain("Sign out");
  });

  it("opens the dropdown upward when menuPosition is top", async () => {
    const wrapper = mount(SidebarHeader, {
      props: { title: "Rukn UI", menuItems: [{ label: "Sign out" }], menuPosition: "top" },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.find(".bottom-full").exists()).toBe(true);
  });

  it("closes the dropdown when clicking outside, but not when clicking the trigger itself", async () => {
    const wrapper = mount(SidebarHeader, {
      attachTo: document.body,
      props: { title: "Rukn UI", menuItems: [{ label: "Sign out" }] },
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.text()).toContain("Sign out");

    document.body.click();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).not.toContain("Sign out");

    wrapper.unmount();
  });
});
