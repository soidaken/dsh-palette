# dsh-palette

DSH Web GUI 主题调色盘与界面微调插件（客户端插件，无宿主逻辑）。右下角 🎨 悬浮面板，主题、字体、界面微调一站式。

## 功能

1. **思考过程滚动框**：聊天视图的 Think 展开内容与轨迹视图的思考引用都限制在固定最大高度内，超出部分滚动，不再无限拉长页面。
2. **输入框**：
   - 默认高度从 1 行提高到约 3 行（84px）；
   - 鼠标悬停输入框**最顶部区域**出现抓取条，**往上拖动 = 变高**（最高约 60% 视口高），高度记忆在 localStorage，重启自动恢复；
   - 卡片最大宽度从 780px 放宽到 880px；
   - 定义了 `--dsh-composer-text-max-height`，长草稿在输入框内滚动而不是无限增高。
3. **额外主题（右下角 🎨 悬浮选择器）**，选择保存在 localStorage：

   | id | 名称 | 模式 |
   | --- | --- | --- |
   | system / light / dark | 内置三种 | — |
   | `midnight` | 午夜蓝 Midnight | 深色 |
   | `paper` | 羊皮纸 Paper | 浅色 |
   | `terminal` | 终端绿 Terminal | 深色 |
   | `nord` | 北欧 Nord | 深色 |
   | `latte` | 拿铁 Latte | 浅色 |

   每个主题覆盖：背景色（应用/面板/侧栏/弹层）、文本色（主/次/弱）、边框、输入框背景、代码块背景与 banner、行内代码、滚动条、shiki 语法高亮色、品牌强调色。
4. **字体（🎨 面板内）**：英文与中文各一个下拉选择器：
   - **英文**：预制 20 个 Google Fonts 精选字体（无衬线 + 衬线两组，选项以该字体本身渲染预览），默认"跟随系统"；另有"自定义…"输入框与"灵感 → Google Fonts"链接；
   - **中文**：启动时用 `document.fonts.check` 检测本机实际安装的中文字体（60 个常见候选：Windows/macOS/Linux 自带、Office 华文系列、思源/霞鹜/更纱等开源、阿里巴巴普惠体/小米 MiSans/得意黑等国产、方正系列），把检测到的列进"系统字体"组（最多 50 个，组标题显示已安装数量）；检测失败时回退到按平台预置列表。另有通用开源组 + 两个联网字体选项（Noto Sans SC Google 分片加载、霞鹜文楷 jsdelivr 约 3MB，均标注需下载）；
   - 字体选择**自动生效**（无需点"应用"）：下拉选中立即应用；自定义输入框**敲回车才生效**（占位符提示"字体名或URL，回车生效"，输入过程不会反复触发）。本地字体同步生效；网络字体走 `font-display: swap`，下载完成后自动无缝切换（期间显示回退字体）。面板底部保留"重置字体"按钮一键回默认。
   - 应用后覆盖 `--dsw-font-family`，英文优先、中文自动回退，全界面正文生效（代码字体不动）。联网字体受网络/CORS 限制，加载失败自动回退默认字体。

## 原理

- 客户端通过 `package.json` 的 `dsh.client` 声明 + `exports["./client"]` 被 DSH Web 客户端模块系统自动发现（宿主半 `lib/index.js` 为 no-op Cordis 插件）。
- 主题通过官方 `ctx.theme` 服务（`ThemeRuntime.register`）注册，由 ui-layout 的呈现器应用到 `body` 内联变量与 `body[data-ds-dark-theme]`——与内置主题同一套机制。
- 第三方主题 id 是进程内扩展（不写入 settings.yaml），因此选择持久化在 localStorage，启动时恢复。

## 安装

从 GitHub 安装（推荐）：

```sh
dsh plugin --profile web add github:soidaken/dsh-palette
```

开发模式（本地改代码热迭代）：

```sh
dsh plugin --profile web add link:E:\dshplugin
```

装完重启 `dsh web` 后生效。卸载：

```sh
dsh plugin --profile web remove dsh-palette
```

## License

MIT © soidaken
