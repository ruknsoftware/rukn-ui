import { describe, expect, it } from "vitest";
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
});
