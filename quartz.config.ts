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
    // ビルド時に無視するパターン。この文字列に一致するフォルダやファイルは、Quartz の処理対象から外れやすい。Assets と Static もこの global configuration の ignorePatterns を尊重する。
    // private → 非公開メモ用
    //templates → テンプレート置き場を公開しない
    //.obsidian → Obsidian 設定フォルダを公開しない
    ignorePatterns: ["Private", "templates", ".obsidian"],
    // ページおよびページリストに表示するデフォルトの日付として、作成日、変更日、または公開日を使用するかどうか。値「created, modified, published」
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      // Google CDNキャッシュを使ってフォントや関連リソースの配信効率を上げる方向の設定
      cdnCaching: true,
      // 使用するフォント。利用可能なフォント Googleフォント 
      typography: {
        header: "Schibsted Grotesk", // 見出し用フォント
        body: "Source Sans Pro", // 本文用フォント
        code: "IBM Plex Mono", // コードブロックやインラインコード用フォント
      },
      colors: { // ライトモード・ダークモードの配色設定
        lightMode: {
          light: "#faf8f8", // ページの背景色
          lightgray: "#e5e5e5", // 薄い境界線や補助色
          gray: "#b8b8b8", // グラフリンク、より重い境界線
          darkgray: "#4e4e4e", // 本文(濃い補助文字や線?)
          dark: "#2b2b2b", // ヘッダーテキストとアイコン(本文の主文字色?)
          secondary: "#284b63", // リンクの色、現在のグラフノード
          tertiary: "#84a59d", // ホバー状態と訪問済み グラフ ノード
          highlight: "rgba(143, 159, 169, 0.15)", // 内部リンクの背景、強調表示されたテキスト、 強調表示されたコード行
          textHighlight: "#fff23688", // テキスト選択やマーカー風強調
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
    transformers: [ // Markdownやメタ情報を読む・変換する段階。Quartz では transformer は各コンテンツに順番に適用され、順序依存のものもある
      // 各Markdownファイル先頭の frontmatter を解析する。
      // title description tags aliases draft enableToc created modified などを読む土台になる。
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        /** 作成日・更新日・公開日をどこから取るか決める。
        今の設定は
        frontmatter に日付が書いてあればそれを最優先
        なければ git の更新履歴
        さらに無ければファイルの時刻 **/
        priority: ["frontmatter", "git", "filesystem"],
      }),
      /** コードブロックのシンタックスハイライト設定。
      Quartz は Shikiji ベースのテーマ指定ができ、github-light / github-dark は公式の既定例でもある。keepBackground: false だと、コードブロック背景は Shikiji テーマ色ではなく Quartz 側の背景色を使う。
      **/
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light", // ライトテーマ時は GitHub Light
          dark: "github-dark", // ダークテーマ時は GitHub Dark
        },
        keepBackground: false, // でも背景色は Quartz 全体デザインに合わせる
      }),
      // Obsidian 独自寄りのMarkdown記法を扱いやすくするプラグイン
      // enableInHtmlEmbed: false は HTML 埋め込み内部でその機能を有効化しない設定。
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      /**
      GitHub Flavored Markdown を有効化。
      Quartz 公式は footnotes、strikethrough、tables、tasklists などをデフォルトでサポートすると説明している。
      使えるものの例
      表・打ち消し線・タスクリスト・脚注
      **/
      Plugin.GitHubFlavoredMarkdown(), 
      Plugin.TableOfContents(), // 見出しから目次を生成する。今はデフォルト設定の目次
      /** リンクを解決して、正しいページ先に向ける。
      Quartz 公式では、Markdownリンクの解決方式として "absolute" "relative" "shortest" を案内している。
      "shortest" :できるだけ短い名前でリンク解決する
      同名ファイルがあって曖昧ならフルパス寄りになる
      **/
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      // 各ページの説明文を生成・処理するプラグイン。description frontmatter や本文要約をもとに、ページ説明やプレビュー用テキストに使われる。
      Plugin.Description(),
      // 数式を描画。KaTeX か MathJax
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    // draft: true のノートなど、下書きを除外するフィルタ。
    // frontmatter に`draft: true`
    filters: [Plugin.RemoveDrafts()],
    // 最終的に何を出力するかを決める段階。Quartz では emitter がページやRSSや各種ファイルを生成する
    emitters: [ 
      Plugin.AliasRedirects(), // aliases からリダイレクトを作る。旧ノート名や別名でアクセスしても本ページに飛ばしやすくする用途。
      Plugin.ComponentResources(),　// Quartz の各コンポーネントが必要とするCSSやJSなどのリソースを出力
      Plugin.ContentPage(), // Markdownごとの通常ページを生成する、Quartz の中核プラグイン。これが無いと各ノートの本文ページ自体が出なくなる。
      Plugin.FolderPage(), // フォルダごとの一覧ページを作る。content/diary/ があれば、そのフォルダの索引ページを出す用途
      Plugin.TagPage(), // タグ一覧ページ・各タグページを作る。タグ運用を可視化したい時に重要。
      Plugin.ContentIndex({ // サイト全体のインデックスを作るプラグイン。ここで サイトマップ と RSS を有効化
        enableSiteMap: true, // sitemap.xml を出す
        enableRSS: true, // RSS フィードを出す
      }),
      Plugin.Assets(), // フォルダ内の 非Markdownファイル を出力。画像、動画、PDF、HTML などが対象
      /** quartz/static 内の静的ファイルを出力
      Assets との違い
      Assets() → content 配下の添付物
      Static() → quartz/static 配下のサイト用固定ファイル
      **/
      Plugin.Static(), 
      Plugin.Favicon(), // ファビコンを出力する。ブラウザタブの小さいアイコン関連。
      Plugin.NotFoundPage(), // 404ページを生成する
      // Comment out CustomOgImages to speed up build time（ビルド時間が伸びることがあるので、重ければ無効化候補。）
      Plugin.CustomOgImages(), // OGP画像を自動生成。SNS共有時のリンクカード画像向け。
    ],
  },
}

export default config
