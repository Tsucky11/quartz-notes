import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// Explorer からは見えないけど、ページ自体は公開されたまま
const publicOnlyFilter = (node: any) => {
  const name = node.displayName?.toLowerCase?.() ?? ""
  const slug = node.data?.slug ?? ""

  // サイトルートとトップページは残す
  if (slug === "" || slug === "index") return true
  // public フォルダ本体は残す
  if (name === "public" || slug === "public") return true
  // public 配下のファイルは残す
  if (slug.startsWith("public/")) return true
  // public 配下を子孫に持つフォルダだけ残す
  if (node.isFolder && hasPublicDescendant(node)) return true

  return false
}


// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      // GitHub: "https://github.com/jackyzha0/quartz",
      // "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      filterFn: publicOnlyFilter,
      useSavedState: false,
    })
  ],
  right: [
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    // Explorer からは見えないけど、ページ自体は公開されたまま
    Component.Explorer({
      filterFn: publicOnlyFilter,
      useSavedState: false,
    }),
  ],
  right: [],
}
