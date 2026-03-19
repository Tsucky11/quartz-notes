import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Tsucky notes",
    pageTitleSuffix: "",
    enableSPA: true,
    // リンクにカーソルが合わせられた場合、ページのプレビューのポップアップを表示するか
    enablePopovers: true, 
    analytics: {
      provider: "plausible",
    },
    // デフォ言語、翻訳の際に参照される
    locale: "ja-JP",
    // サイトの標準 ‘ホーム’ がどこにあるかを知るための絶対 URL を必要とするサイトマップや RSS フィードに使用されます。
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    // ページおよびページリストに表示するデフォルトの日付として、作成日、変更日、または公開日を使用するかどうか。値「created, modified, published」
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      // Google CDN を使用してフォントをキャッシュ
      cdnCaching: true,
      // 使用するフォント。利用可能なフォント Googleフォント 
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono", // インライン引用符とブロック引用符のフォント
      },
      colors: { // 外観の色の設定
        lightMode: {
          light: "#faf8f8", // ページの背景色
          lightgray: "#e5e5e5", // border（境界線？）の色
          gray: "#b8b8b8", // グラフリンク、より重い境界線
          darkgray: "#4e4e4e", // 本文
          dark: "#2b2b2b", // ヘッダーテキストとアイコン
          secondary: "#284b63", // リンクの色、現在のグラフノード
          tertiary: "#84a59d", // ホバー状態と訪問済み グラフ ノード
          highlight: "rgba(143, 159, 169, 0.15)", // 内部リンクの背景、強調表示されたテキスト、 強調表示されたコード行
          textHighlight: "#fff23688",
        }, // マークダウンで強調表示されたテキストの背景
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
