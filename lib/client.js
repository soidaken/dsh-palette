/* dsh-palette client half.
 *
 * Loaded by the DSH web client module system (package.json dsh.client +
 * exports["./client"]). It:
 *   1. injects CSS overrides for the Think (reasoning) disclosure and the
 *      composer (input) card — stable selectors only, no hashed class names;
 *   2. registers extra themes through the official ctx.theme service
 *      (ThemeRuntime.register) so the theme presenter applies them like any
 *      built-in palette;
 *   3. mounts a small floating theme picker and persists the choice in
 *      localStorage (third-party theme ids are in-process extensions, so the
 *      official settings schema cannot hold them).
 */
window.__ModuleLoader__.load({
	id: "dsh-palette",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		// ------------------------------------------------------------------
		// CSS overrides
		// ------------------------------------------------------------------
		const CSS = `
/* ---- 1. Thinking / reasoning box: fixed max height + scroll ---- */
/* Chat view: the expanded Think body (class suffix is build-stable). */
[data-variant="think"] [class$="_thinkBody"] {
  max-height: 360px;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 8px;
}
/* Trajectory view: the expanded thinking quote. */
[class$="_thinkingQuote"] {
  max-height: 420px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* ---- 2. Composer: taller default, adjustable height, a bit wider ---- */
[data-composer-card] {
  --dsh-composer-text-max-height: min(45vh, 400px);
  max-width: min(880px, calc(100vw - 40px));
}
[data-composer-card] [data-input-mirror] {
  min-height: 84px;
}
[data-composer-card] [data-input-scroll] {
  min-height: 84px;
  overflow-y: auto;
}

/* ---- 3. Floating theme picker ---- */
.dshut-fab {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 10000;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--dsw-alias-border-l2);
  background: var(--dsw-specific-input-major);
  color: var(--dsw-alias-label-primary);
  box-shadow: var(--dsw-shadow-lv2);
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 17px;
  line-height: 1;
}
.dshut-fab:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dshut-menu {
  position: fixed;
  right: 16px;
  bottom: 62px;
  z-index: 10000;
  min-width: 240px;
  max-height: min(70vh, 560px);
  overflow-y: auto;
  background: var(--dsw-specific-menu);
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 12px;
  padding: 8px;
  box-shadow: var(--dsw-shadow-lv2);
}
.dshut-title {
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 20px;
  padding: 2px 10px 6px;
}
.dshut-opt {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 7px 10px;
  border: none;
  background: none;
  color: var(--dsw-alias-label-primary);
  cursor: pointer;
  border-radius: 8px;
  font-size: 13px;
  line-height: 20px;
  text-align: left;
}
.dshut-opt:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}
.dshut-opt[data-selected="true"] {
  color: var(--dsw-alias-state-business-primary);
  font-weight: 600;
}
.dshut-swatch {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 1px solid var(--dsw-alias-border-l2);
  flex: none;
}
.dshut-sep {
  height: 1px;
  background: var(--dsw-alias-border-l2);
  margin: 6px 4px;
}

/* ---- 4. Composer top-edge drag handle ---- */
.dshut-handle {
  position: fixed;
  z-index: 10001;
  height: 12px;
  cursor: ns-resize;
  display: none;
  align-items: center;
  justify-content: center;
  touch-action: none;
}
.dshut-handle[data-active="true"] {
  display: flex;
}
.dshut-handle::before {
  content: "";
  width: 44px;
  height: 5px;
  border-radius: 3px;
  background: var(--dsw-alias-state-business-primary);
  opacity: 0.8;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}
.dshut-handle[data-dragging="true"]::before {
  height: 7px;
  opacity: 1;
}

/* ---- 5. Font rows in the picker ---- */
.dshut-fontrow {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
}
.dshut-fontlabel {
  color: var(--dsw-alias-label-secondary);
  font-size: 12px;
  line-height: 20px;
  flex: none;
  width: 28px;
}
.dshut-fontinput {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  height: 28px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
  padding: 0 8px;
  outline: none;
}
.dshut-fontinput:focus {
  border-color: var(--dsw-alias-state-business-primary);
}
.dshut-fontselect {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  height: 28px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
  font-size: 12px;
  line-height: 18px;
  padding: 0 4px;
  outline: none;
}
.dshut-fontselect:focus {
  border-color: var(--dsw-alias-state-business-primary);
}
.dshut-fontlink {
  margin-left: auto;
  color: var(--dsw-alias-state-business-primary);
  font-size: 12px;
  line-height: 20px;
  text-decoration: none;
}
.dshut-fontlink:hover {
  text-decoration: underline;
}
.dshut-fontbtn {
  height: 26px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: none;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
  font-size: 12px;
  line-height: 18px;
  padding: 0 12px;
}
.dshut-fontbtn:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}
`;

		function injectCss() {
			if (typeof document === "undefined") return;
			const tagId = "dsh-palette/overrides";
			if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") !== null) return;
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-palette";
			tag.dataset.pluginCss = tagId;
			tag.textContent = CSS;
			document.head.appendChild(tag);
		}

		// ------------------------------------------------------------------
		// Extra themes
		// ------------------------------------------------------------------
		const THEMES = [
			{
				id: "midnight",
				colorScheme: "dark",
				label: "午夜蓝 Midnight",
				swatch: { bg: "#0b1020", fg: "#e8ecf9" },
				tokens: {
					"--dsw-alias-bg-base": "#0b1020",
					"--dsw-alias-bg-layer-1": "#101731",
					"--dsw-alias-bg-layer-2": "#141c3b",
					"--dsw-alias-bg-layer-3": "#192245",
					"--dsw-alias-bg-overlay": "#1b2549",
					"--dsw-alias-bg-module-platform": "#141c3b",
					"--dsw-alias-border-l1": "rgba(146, 164, 222, 0.14)",
					"--dsw-alias-border-l2": "rgba(146, 164, 222, 0.22)",
					"--dsw-alias-border-l3": "rgba(146, 164, 222, 0.3)",
					"--dsw-alias-label-primary": "#e8ecf9",
					"--dsw-alias-label-secondary": "#aab4d2",
					"--dsw-alias-label-tertiary": "#7e89ab",
					"--dsw-alias-label-caption": "#626d8f",
					"--dsw-alias-label-dimmed": "#4a557a",
					"--dsw-alias-state-business-primary": "#5b8cff",
					"--dsw-alias-button-info-fill": "#5b8cff",
					"--dsw-alias-button-info-hover": "#7ba4ff",
					"--dsw-alias-interactive-bg-hover": "rgba(91, 140, 255, 0.12)",
					"--dsw-alias-markdown-code-block": "#0d1430",
					"--dsw-alias-markdown-code-block-banner": "#111a3c",
					"--dsw-alias-markdown-inline-code": "#18224a",
					"--dsw-alias-markdown-code-segment-selected": "#1c2752",
					"--dsw-alias-markdown-code-segment-unselected": "#141d42",
					"--dsw-specific-input-major": "#111833",
					"--dsw-specific-sidebar-fill": "#0d1329",
					"--dsw-specific-menu": "#141c3b",
					"--dsw-specific-tip": "#131a36",
					"--dsw-specific-selector": "#18203f",
					"--dsw-alias-scrollbar-bg-l2": "rgba(146, 164, 222, 0.28)",
					"--dsw-alias-scrollbar-hover-l2": "rgba(146, 164, 222, 0.45)",
					"--shiki-foreground": "#dbe2f5",
					"--shiki-background": "#0d1430",
					"--shiki-token-constant": "#ff9e64",
					"--shiki-token-string": "#9ece6a",
					"--shiki-token-comment": "#5b6787",
					"--shiki-token-keyword": "#7aa2ff",
					"--shiki-token-parameter": "#e0af68",
					"--shiki-token-function": "#bb9af7",
					"--shiki-token-string-expression": "#73daca",
					"--shiki-token-punctuation": "#b7c1e0",
					"--shiki-token-link": "#7dcfff"
				}
			},
			{
				id: "paper",
				colorScheme: "light",
				label: "羊皮纸 Paper",
				swatch: { bg: "#f3ead6", fg: "#403820" },
				tokens: {
					"--dsw-alias-bg-base": "#f3ead6",
					"--dsw-alias-bg-layer-1": "#f8f1e0",
					"--dsw-alias-bg-layer-2": "#f5ecd8",
					"--dsw-alias-bg-layer-3": "#efe4c8",
					"--dsw-alias-bg-overlay": "#faf3e4",
					"--dsw-alias-bg-module-platform": "#f0e6cd",
					"--dsw-alias-border-l1": "rgba(122, 94, 40, 0.12)",
					"--dsw-alias-border-l2": "rgba(122, 94, 40, 0.2)",
					"--dsw-alias-border-l3": "rgba(122, 94, 40, 0.28)",
					"--dsw-alias-label-primary": "#403820",
					"--dsw-alias-label-secondary": "#6b5f3e",
					"--dsw-alias-label-tertiary": "#8d8059",
					"--dsw-alias-label-caption": "#a3946a",
					"--dsw-alias-label-dimmed": "#b3a57c",
					"--dsw-alias-state-business-primary": "#a16207",
					"--dsw-alias-button-info-fill": "#a16207",
					"--dsw-alias-button-info-hover": "#b97a1c",
					"--dsw-alias-interactive-bg-hover": "rgba(161, 98, 7, 0.08)",
					"--dsw-alias-markdown-code-block": "#efe3c4",
					"--dsw-alias-markdown-code-block-banner": "#e8d9b2",
					"--dsw-alias-markdown-inline-code": "#e9dcb8",
					"--dsw-alias-markdown-code-segment-selected": "#f0e5c6",
					"--dsw-alias-markdown-code-segment-unselected": "#e8dab6",
					"--dsw-specific-input-major": "#f8f1e0",
					"--dsw-specific-sidebar-fill": "#f0e7d0",
					"--dsw-specific-menu": "#f6eeda",
					"--dsw-specific-tip": "#f2e9d2",
					"--dsw-specific-selector": "#ece1c6",
					"--dsw-alias-scrollbar-bg-l2": "rgba(122, 94, 40, 0.25)",
					"--dsw-alias-scrollbar-hover-l2": "rgba(122, 94, 40, 0.4)",
					"--shiki-foreground": "#4a4230",
					"--shiki-background": "#efe3c4",
					"--shiki-token-constant": "#9c6b1f",
					"--shiki-token-string": "#6b7f2e",
					"--shiki-token-comment": "#97896a",
					"--shiki-token-keyword": "#a03d5c",
					"--shiki-token-parameter": "#c05f14",
					"--shiki-token-function": "#6f4f9e",
					"--shiki-token-string-expression": "#5d8a3a",
					"--shiki-token-punctuation": "#5d5543",
					"--shiki-token-link": "#3d6b9e"
				}
			},
			{
				id: "terminal",
				colorScheme: "dark",
				label: "终端绿 Terminal",
				swatch: { bg: "#0b120b", fg: "#c9f2c9" },
				tokens: {
					"--dsw-alias-bg-base": "#0b120b",
					"--dsw-alias-bg-layer-1": "#0f1a0f",
					"--dsw-alias-bg-layer-2": "#132113",
					"--dsw-alias-bg-layer-3": "#172917",
					"--dsw-alias-bg-overlay": "#142414",
					"--dsw-alias-bg-module-platform": "#132113",
					"--dsw-alias-border-l1": "rgba(120, 200, 120, 0.13)",
					"--dsw-alias-border-l2": "rgba(120, 200, 120, 0.2)",
					"--dsw-alias-border-l3": "rgba(120, 200, 120, 0.28)",
					"--dsw-alias-label-primary": "#c9f2c9",
					"--dsw-alias-label-secondary": "#94c894",
					"--dsw-alias-label-tertiary": "#63a063",
					"--dsw-alias-label-caption": "#4d824d",
					"--dsw-alias-label-dimmed": "#3d6b3d",
					"--dsw-alias-state-business-primary": "#35c735",
					"--dsw-alias-button-info-fill": "#2fbf2f",
					"--dsw-alias-button-info-hover": "#4fdc4f",
					"--dsw-alias-interactive-bg-hover": "rgba(63, 223, 63, 0.1)",
					"--dsw-alias-markdown-code-block": "#0a110a",
					"--dsw-alias-markdown-code-block-banner": "#0d170d",
					"--dsw-alias-markdown-inline-code": "#122112",
					"--dsw-alias-markdown-code-segment-selected": "#142614",
					"--dsw-alias-markdown-code-segment-unselected": "#0f1c0f",
					"--dsw-specific-input-major": "#0f1a0f",
					"--dsw-specific-sidebar-fill": "#0c140c",
					"--dsw-specific-menu": "#132113",
					"--dsw-specific-tip": "#101c10",
					"--dsw-specific-selector": "#152415",
					"--dsw-alias-scrollbar-bg-l2": "rgba(120, 200, 120, 0.25)",
					"--dsw-alias-scrollbar-hover-l2": "rgba(120, 200, 120, 0.4)",
					"--shiki-foreground": "#b8e6b8",
					"--shiki-background": "#0a110a",
					"--shiki-token-constant": "#8be08b",
					"--shiki-token-string": "#a9e6a9",
					"--shiki-token-comment": "#4f7a4f",
					"--shiki-token-keyword": "#6fe06f",
					"--shiki-token-parameter": "#9be09b",
					"--shiki-token-function": "#7ddb7d",
					"--shiki-token-string-expression": "#b8f0b8",
					"--shiki-token-punctuation": "#66a366",
					"--shiki-token-link": "#6fc3a8"
				}
			},
			{
				id: "nord",
				colorScheme: "dark",
				label: "北欧 Nord",
				swatch: { bg: "#2e3440", fg: "#eceff4" },
				tokens: {
					"--dsw-alias-bg-base": "#2e3440",
					"--dsw-alias-bg-layer-1": "#333a47",
					"--dsw-alias-bg-layer-2": "#3b4252",
					"--dsw-alias-bg-layer-3": "#434c5e",
					"--dsw-alias-bg-overlay": "#3b4252",
					"--dsw-alias-bg-module-platform": "#3b4252",
					"--dsw-alias-border-l1": "rgba(216, 222, 233, 0.1)",
					"--dsw-alias-border-l2": "rgba(216, 222, 233, 0.18)",
					"--dsw-alias-border-l3": "rgba(216, 222, 233, 0.26)",
					"--dsw-alias-label-primary": "#eceff4",
					"--dsw-alias-label-secondary": "#d8dee9",
					"--dsw-alias-label-tertiary": "#aeb8c9",
					"--dsw-alias-label-caption": "#8b96a8",
					"--dsw-alias-label-dimmed": "#6c7688",
					"--dsw-alias-state-business-primary": "#88c0d0",
					"--dsw-alias-button-info-fill": "#88c0d0",
					"--dsw-alias-button-info-hover": "#9fd3e0",
					"--dsw-alias-interactive-bg-hover": "rgba(136, 192, 208, 0.12)",
					"--dsw-alias-markdown-code-block": "#2e3440",
					"--dsw-alias-markdown-code-block-banner": "#363e4e",
					"--dsw-alias-markdown-inline-code": "#3b4252",
					"--dsw-alias-markdown-code-segment-selected": "#434c5e",
					"--dsw-alias-markdown-code-segment-unselected": "#373f4f",
					"--dsw-specific-input-major": "#333a47",
					"--dsw-specific-sidebar-fill": "#2b313c",
					"--dsw-specific-menu": "#3b4252",
					"--dsw-specific-tip": "#333b49",
					"--dsw-specific-selector": "#3d4656",
					"--dsw-alias-scrollbar-bg-l2": "rgba(216, 222, 233, 0.2)",
					"--dsw-alias-scrollbar-hover-l2": "rgba(216, 222, 233, 0.35)",
					"--shiki-foreground": "#d8dee9",
					"--shiki-background": "#2e3440",
					"--shiki-token-constant": "#b48ead",
					"--shiki-token-string": "#a3be8c",
					"--shiki-token-comment": "#616e88",
					"--shiki-token-keyword": "#81a1c1",
					"--shiki-token-parameter": "#d08770",
					"--shiki-token-function": "#88c0d0",
					"--shiki-token-string-expression": "#8fbcbb",
					"--shiki-token-punctuation": "#d8dee9",
					"--shiki-token-link": "#8fbcbb"
				}
			},
			{
				id: "latte",
				colorScheme: "light",
				label: "拿铁 Latte",
				swatch: { bg: "#eff1f5", fg: "#4c4f69" },
				tokens: {
					"--dsw-alias-bg-base": "#eff1f5",
					"--dsw-alias-bg-layer-1": "#e6e9ef",
					"--dsw-alias-bg-layer-2": "#dce0e8",
					"--dsw-alias-bg-layer-3": "#ccd0da",
					"--dsw-alias-bg-overlay": "#e6e9ef",
					"--dsw-alias-bg-module-platform": "#dce0e8",
					"--dsw-alias-border-l1": "rgba(76, 79, 105, 0.1)",
					"--dsw-alias-border-l2": "rgba(76, 79, 105, 0.16)",
					"--dsw-alias-border-l3": "rgba(76, 79, 105, 0.24)",
					"--dsw-alias-label-primary": "#4c4f69",
					"--dsw-alias-label-secondary": "#5c5f77",
					"--dsw-alias-label-tertiary": "#6c6f85",
					"--dsw-alias-label-caption": "#8c8fa1",
					"--dsw-alias-label-dimmed": "#acb0be",
					"--dsw-alias-state-business-primary": "#1e66f5",
					"--dsw-alias-button-info-fill": "#1e66f5",
					"--dsw-alias-button-info-hover": "#4287f7",
					"--dsw-alias-interactive-bg-hover": "rgba(30, 102, 245, 0.08)",
					"--dsw-alias-markdown-code-block": "#e6e9ef",
					"--dsw-alias-markdown-code-block-banner": "#dce0e8",
					"--dsw-alias-markdown-inline-code": "#e6e9ef",
					"--dsw-alias-markdown-code-segment-selected": "#dce0e8",
					"--dsw-alias-markdown-code-segment-unselected": "#d5d9e2",
					"--dsw-specific-input-major": "#e6e9ef",
					"--dsw-specific-sidebar-fill": "#e6e9ef",
					"--dsw-specific-menu": "#e6e9ef",
					"--dsw-specific-tip": "#e2e5ec",
					"--dsw-specific-selector": "#dce0e8",
					"--dsw-alias-scrollbar-bg-l2": "rgba(76, 79, 105, 0.18)",
					"--dsw-alias-scrollbar-hover-l2": "rgba(76, 79, 105, 0.3)",
					"--shiki-foreground": "#4c4f69",
					"--shiki-background": "#e6e9ef",
					"--shiki-token-constant": "#fe640b",
					"--shiki-token-string": "#40a02b",
					"--shiki-token-comment": "#9ca0b0",
					"--shiki-token-keyword": "#8839ef",
					"--shiki-token-parameter": "#e64553",
					"--shiki-token-function": "#1e66f5",
					"--shiki-token-string-expression": "#179299",
					"--shiki-token-punctuation": "#4c4f69",
					"--shiki-token-link": "#179299"
				}
			}
		];

		const STORAGE_KEY = "dsh-ui-tweaks:theme";

		// ------------------------------------------------------------------
		// Floating picker
		// ------------------------------------------------------------------
		const BUILTIN_OPTIONS = [
			{ id: "system", label: "跟随系统 System", swatch: { bg: "linear-gradient(135deg, #ffffff 50%, #1a1a1a 50%)", fg: "#888" } },
			{ id: "light", label: "浅色 Light", swatch: { bg: "#f9fafb", fg: "#0f1115" } },
			{ id: "dark", label: "深色 Dark", swatch: { bg: "#151517", fg: "#e8e8ea" } }
		];

		function el(tag, className, text) {
			const node = document.createElement(tag);
			if (className) node.className = className;
			if (text !== void 0) node.textContent = text;
			return node;
		}

		function swatch(option) {
			const box = el("span", "dshut-swatch");
			box.style.background = option.swatch.bg;
			return box;
		}

		function mountPicker(ctx, options) {
			if (typeof document === "undefined" || document.body === null) return;
			const fab = el("button", "dshut-fab", "🎨");
			fab.type = "button";
			fab.setAttribute("aria-label", "界面主题");
			fab.title = "界面主题";
			const menu = el("div", "dshut-menu");
			menu.hidden = true;
			menu.setAttribute("role", "menu");

			const build = () => {
				menu.textContent = "";
				menu.append(el("div", "dshut-title", "界面主题"));
				for (const option of [...BUILTIN_OPTIONS, ...options]) {
					const row = el("button", "dshut-opt", option.label);
					row.type = "button";
					row.prepend(swatch(option));
					row.setAttribute("role", "menuitemradio");
					row.dataset.themeId = option.id;
					row.addEventListener("click", () => {
						try {
							ctx.theme.setTheme(option.id);
						} catch (error) {
							// unknown id: ignore
						}
						try {
							localStorage.setItem(STORAGE_KEY, option.id);
						} catch (error) {
							// storage unavailable: keep in-process only
						}
						menu.hidden = true;
					});
					menu.append(row);
				}
				// Font settings (rebuildable after the async font probe)
				const fontSection = el("div", "dshut-fontsection");
				const buildFontSection = () => {
					fontSection.textContent = "";
					const fonts = loadFontSettings();
					fontSection.append(el("div", "dshut-sep"));
					fontSection.append(el("div", "dshut-title", "字体（下拉即生效，自定义输入后回车）"));
					const titleRow = el("div", "dshut-fontrow");
					titleRow.append(el("span", "dshut-fontlabel", "字体"));
					const fontLink = document.createElement("a");
					fontLink.className = "dshut-fontlink";
					fontLink.href = "https://fonts.google.com";
					fontLink.target = "_blank";
					fontLink.rel = "noreferrer";
					fontLink.textContent = "灵感 → Google Fonts";
					titleRow.append(fontLink);
					fontSection.append(titleRow);

					const enPicker = buildFontPicker(fontSection, "en", "英文", enFontGroups());
					const zhPicker = buildFontPicker(fontSection, "zh", "中文", zhFontGroups());
					enPicker.setValue(fonts.en);
					zhPicker.setValue(fonts.zh);

					const commitFonts = () => {
						saveFontSettings(enPicker.readValue(), zhPicker.readValue());
						applyFonts();
					};
					enPicker.setOnCommit(commitFonts);
					zhPicker.setOnCommit(commitFonts);

					const resetRow = el("div", "dshut-fontrow");
					const resetBtn = el("button", "dshut-fontbtn", "重置字体");
					resetBtn.type = "button";
					resetBtn.style.marginLeft = "auto";
					resetBtn.addEventListener("click", () => {
						saveFontSettings(null, null);
						enPicker.setValue(null);
						zhPicker.setValue(null);
						applyFonts();
					});
					resetRow.append(resetBtn);
					fontSection.append(resetRow);
				};
				buildFontSection();
				menu.append(fontSection);
				// Probe the machine for installed Chinese fonts, then rebuild the
				// font section so the system group lists what is actually present.
				detectInstalledFonts(ZH_FONT_CANDIDATES).then((installed) => {
					if (installed.length === 0) return;
					zhInstalled = installed;
					buildFontSection();
				});
			};
			build();

			const sync = (snapshot) => {
				const preference = snapshot.preference;
				for (const row of menu.querySelectorAll(".dshut-opt")) {
					row.dataset.selected = String(row.dataset.themeId === preference);
				}
			};
			ctx.on("theme/change", sync);
			sync(ctx.theme.getTheme());

			fab.addEventListener("click", () => {
				menu.hidden = !menu.hidden;
			});
			document.addEventListener("click", (event) => {
				if (menu.hidden) return;
				if (event.target !== fab && !menu.contains(event.target)) menu.hidden = true;
			});
			document.addEventListener("keydown", (event) => {
				if (event.key === "Escape" && !menu.hidden) menu.hidden = true;
			});

			document.body.append(fab, menu);
		}

		// ------------------------------------------------------------------
		// Composer top-edge drag handle
		// ------------------------------------------------------------------
		const HANDLE_BAND = 10;
		const HANDLE_MIN = 60;
		const HANDLE_MAX_FRACTION = 0.6;
		const COMPOSER_HEIGHT_KEY = "dsh-ui-tweaks:composer-height";

		function initComposerHandle() {
			if (typeof document === "undefined" || document.body === null) return;
			const handle = el("div", "dshut-handle");
			handle.dataset.active = "false";
			document.body.append(handle);

			const drag = { active: false, startY: 0, startH: 0, card: null, scroll: null };

			const maxHeight = () => Math.round(Math.min(600, window.innerHeight * HANDLE_MAX_FRACTION));

			function findBand(x, y) {
				const cards = document.querySelectorAll("[data-composer-card]");
				for (const card of cards) {
					const r = card.getBoundingClientRect();
					if (x >= r.left - 4 && x <= r.right + 4 && y >= r.top - 6 && y <= r.top + HANDLE_BAND) {
						return { card, top: r.top, left: r.left, width: r.width };
					}
				}
				return null;
			}

			function place(band) {
				handle.style.left = band.left + "px";
				handle.style.width = band.width + "px";
				handle.style.top = band.top - 6 + "px";
			}

			function show(band) {
				handle.dataset.active = "true";
				place(band);
			}

			function hide() {
				if (!drag.active) handle.dataset.active = "false";
			}

			document.addEventListener("pointermove", (event) => {
				if (drag.active) {
					const next = drag.startH + (drag.startY - event.clientY);
					const h = Math.min(maxHeight(), Math.max(HANDLE_MIN, next));
					drag.scroll.style.height = h + "px";
					drag.scroll.style.maxHeight = maxHeight() + "px";
					const r = drag.card.getBoundingClientRect();
					handle.style.top = r.top - 6 + "px";
					return;
				}
				const band = findBand(event.clientX, event.clientY);
				if (band === null) {
					hide();
					return;
				}
				show(band);
			}, { passive: true });

			handle.addEventListener("pointerdown", (event) => {
				const band = findBand(event.clientX, event.clientY);
				if (band === null) return;
				event.preventDefault();
				const scroll = band.card.querySelector("[data-input-scroll]");
				if (scroll === null) return;
				drag.active = true;
				drag.startY = event.clientY;
				drag.startH = scroll.getBoundingClientRect().height;
				drag.card = band.card;
				drag.scroll = scroll;
				handle.dataset.dragging = "true";
				document.body.style.cursor = "ns-resize";
				try {
					handle.setPointerCapture(event.pointerId);
				} catch (error) {
					// capture unsupported: move listeners are global anyway
				}
			});

			const endDrag = () => {
				if (!drag.active) return;
				drag.active = false;
				handle.dataset.dragging = "false";
				document.body.style.cursor = "";
				if (drag.scroll !== null) {
					try {
						localStorage.setItem(COMPOSER_HEIGHT_KEY, String(Math.round(drag.scroll.getBoundingClientRect().height)));
					} catch (error) {
						// storage unavailable: keep this session's height only
					}
				}
			};
			handle.addEventListener("pointerup", endDrag);
			handle.addEventListener("pointercancel", endDrag);

			// Restore a saved drag height on any composer scroll that appears
			// without one (React rebuilds wipe inline styles).
			let savedHeight = null;
			try {
				savedHeight = Number(localStorage.getItem(COMPOSER_HEIGHT_KEY)) || null;
			} catch (error) {
				savedHeight = null;
			}
			if (savedHeight !== null) {
				const applyTo = (scroll) => {
					if (scroll.style.height === "") {
						scroll.style.height = savedHeight + "px";
						scroll.style.maxHeight = maxHeight() + "px";
					}
				};
				const observer = new MutationObserver((mutations) => {
					for (const mutation of mutations) {
						for (const node of mutation.addedNodes) {
							if (!(node instanceof Element)) continue;
							if (node.matches("[data-composer-card] [data-input-scroll]")) applyTo(node);
							if (node.querySelectorAll !== void 0) {
								for (const scroll of node.querySelectorAll("[data-composer-card] [data-input-scroll]")) applyTo(scroll);
							}
						}
					}
				});
				observer.observe(document.body, { childList: true, subtree: true });
			}
		}

		// ------------------------------------------------------------------
		// Custom fonts: system names, remote font files, or web-font presets
		// ------------------------------------------------------------------
		const FONT_STORAGE_KEY = "dsh-ui-tweaks:fonts";
		const DEFAULT_FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif";
		const REMOTE_FONT_NAMES = { en: "dshut-remote-en", zh: "dshut-remote-zh" };

		/** Google Fonts presets for the EN dropdown. */
		const EN_PRESETS_SANS = [
			"Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins",
			"Nunito", "Manrope", "Space Grotesk", "DM Sans", "Raleway", "Oswald",
			"Barlow", "Source Sans 3", "Ubuntu", "Noto Sans"
		];
		const EN_PRESETS_SERIF = [
			"Merriweather", "Playfair Display", "Lora", "PT Serif"
		];

		const LXGW_WENKAI_CSS = "https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont/style.css";
		const NOTO_SANS_SC_CSS = "https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap";

		function googleFontsUrl(name) {
			return "https://fonts.googleapis.com/css2?family=" + name.replace(/ /g, "+") + "&display=swap";
		}

		/** EN dropdown groups: { label, options: [{ name, text?, css? }] }. */
		function enFontGroups() {
			return [
				{
					label: "Google Fonts · 无衬线",
					options: EN_PRESETS_SANS.map((name) => ({ name, css: googleFontsUrl(name) }))
				},
				{
					label: "Google Fonts · 衬线",
					options: EN_PRESETS_SERIF.map((name) => ({ name, css: googleFontsUrl(name) }))
				}
			];
		}

		/** ZH dropdown groups, filtered by the current OS (system fonts are zero-download). */
		let zhInstalled = null; // list of detected installed Chinese font names

		/** Candidate Chinese font names to probe on the current machine. */
		const ZH_FONT_CANDIDATES = [
			// Windows 自带
			"Microsoft YaHei", "Microsoft YaHei UI", "SimSun", "NSimSun", "SimHei", "KaiTi", "FangSong", "DengXian", "Microsoft JhengHei", "MingLiU", "PMingLiU", "SimSun-ExtB",
			// Office 附带的华文系列（装了 Office 才有）
			"STZhongsong", "STXihei", "STKaiti", "STFangsong", "STSong", "STHupo", "STLiti", "STXinwei", "STXingkai", "STCaiyun", "STXinhei",
			// macOS 自带
			"PingFang SC", "Songti SC", "Kaiti SC", "STHeiti", "Hiragino Sans GB", "Baoli SC", "Weibei SC", "Yuanti SC", "Xingkai SC", "Libian SC", "Hannotate SC",
			// 跨平台开源（用户自装）
			"Source Han Sans SC", "Source Han Serif SC", "Noto Sans CJK SC", "Noto Serif CJK SC", "Noto Sans SC", "Noto Serif SC",
			"LXGW WenKai", "LXGW WenKai Lite", "Sarasa Gothic SC", "Sarasa UI SC", "Sarasa Mono SC",
			// 国产/商业（用户自装）
			"Smiley Sans", "Alibaba PuHuiTi", "Alibaba PuHuiTi 3", "HarmonyOS Sans SC", "MiSans", "OPPO Sans",
			"ZCOOL KuHei", "ZCOOL KuaiLe", "ZCOOL XiaoWei", "ZCOOL QingKe HuangYou", "Ma Shan Zheng",
			// Linux 常见
			"WenQuanYi Micro Hei", "WenQuanYi Zen Hei", "Droid Sans Fallback", "AR PL UMing CN", "AR PL UKai CN",
			// 方正系列（装了方正字库才有）
			"FZShuSong-Z01S", "FZHei-B01S", "FZKai-Z03S", "FZFangSong-Z02S", "FZXiaoBiaoSong-B05S", "FZLanTingHeiS-R-GB"
		];

		/**
		* Probe which of the candidate fonts are installed locally.
		* `document.fonts.check` answers availability for system fonts synchronously;
		* a `load` attempt covers cold caches, and a timeout keeps the whole probe bounded.
		* @returns {Promise<string[]>} installed names in candidate order.
		*/
		async function detectInstalledFonts(names) {
			if (typeof document === "undefined" || typeof document.fonts === "undefined") return [];
			const probe = async (name) => {
				const spec = '16px "' + name + '"';
				try {
					if (document.fonts.check(spec, "中文字体检测")) return name;
					await document.fonts.load(spec);
					return document.fonts.check(spec, "中文字体检测") ? name : null;
				} catch (error) {
					return null;
				}
			};
			const withTimeout = (promise, ms) => Promise.race([
				promise,
				new Promise((resolve) => setTimeout(() => resolve(null), ms))
			]);
			const results = await Promise.all(names.map((name) => withTimeout(probe(name), 800)));
			return results.filter((name) => name !== null);
		}

		function zhFontGroups() {
			const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
			const system = [];
			if (zhInstalled !== null && zhInstalled.length > 0) {
				for (const name of zhInstalled.slice(0, 50)) system.push({ name, text: name });
			} else if (/Windows/.test(ua)) {
				system.push(
					{ name: "Microsoft YaHei", text: "微软雅黑" },
					{ name: "DengXian", text: "等线" },
					{ name: "SimSun", text: "宋体" },
					{ name: "SimHei", text: "黑体" },
					{ name: "KaiTi", text: "楷体" },
					{ name: "FangSong", text: "仿宋" }
				);
			} else if (/Macintosh/.test(ua)) {
				system.push(
					{ name: "PingFang SC", text: "苹方" },
					{ name: "Songti SC", text: "宋体-简" },
					{ name: "Kaiti SC", text: "楷体-简" },
					{ name: "STHeiti", text: "华文黑体" },
					{ name: "Hiragino Sans GB", text: "冬青黑体" }
				);
			} else {
				system.push(
					{ name: "Noto Sans CJK SC", text: "Noto Sans CJK SC" },
					{ name: "WenQuanYi Micro Hei", text: "文泉驿微米黑" }
				);
			}
			return [
				{
					label: zhInstalled !== null ? "系统字体（本机已安装 " + system.length + " 个）" : "系统字体（本机自带，零下载）",
					options: system
				},
				{
					label: "通用开源（需自行安装）",
					options: [
						{ name: "Source Han Sans SC", text: "思源黑体 Source Han Sans SC" },
						{ name: "Source Han Serif SC", text: "思源宋体 Source Han Serif SC" },
						{ name: "LXGW WenKai", text: "霞鹜文楷 LXGW WenKai" }
					]
				},
				{
					label: "联网字体（需下载，首次较慢）",
					options: [
						{ name: "Noto Sans SC", text: "Noto Sans SC（Google 分片加载）", css: NOTO_SANS_SC_CSS },
						{ name: "LXGW WenKai", text: "霞鹜文楷（jsdelivr，约 3MB）", css: LXGW_WENKAI_CSS }
					]
				}
			];
		}

		/** Normalize a stored font setting (string = legacy format). */
		function normalizeFontSetting(value) {
			if (value === null || value === undefined) return null;
			if (typeof value === "string") {
				return value === "" ? null : isUrl(value) ? { type: "url", url: value } : { type: "name", name: value };
			}
			if (typeof value !== "object") return null;
			if (value.type === "preset" && typeof value.name === "string") {
				return { type: "preset", name: value.name, css: typeof value.css === "string" ? value.css : "" };
			}
			if (value.type === "name" && typeof value.name === "string") return { type: "name", name: value.name };
			if (value.type === "url" && typeof value.url === "string") return { type: "url", url: value.url };
			return null;
		}

		function loadFontSettings() {
			try {
				const raw = JSON.parse(localStorage.getItem(FONT_STORAGE_KEY) || "{}");
				return {
					en: normalizeFontSetting(raw.en),
					zh: normalizeFontSetting(raw.zh)
				};
			} catch (error) {
				return { en: null, zh: null };
			}
		}

		function saveFontSettings(en, zh) {
			try {
				localStorage.setItem(FONT_STORAGE_KEY, JSON.stringify({ en, zh }));
			} catch (error) {
				// storage unavailable: keep in-process only
			}
		}

		function isUrl(value) {
			return /^https?:\/\//i.test(value.trim());
		}

		function fontFormat(url) {
			const match = /\.(woff2|woff|ttf|otf)(\?|#|$)/i.exec(url);
			if (match === null) return "";
			switch (match[1].toLowerCase()) {
				case "woff2": return " format('woff2')";
				case "woff": return " format('woff')";
				case "ttf": return " format('truetype')";
				case "otf": return " format('opentype')";
				default: return "";
			}
		}

		function ensureRemoteFont(kind, value) {
			const tagId = "dsh-palette/font-" + kind;
			let tag = document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]");
			if (!isUrl(value)) {
				if (tag !== null) tag.remove();
				return;
			}
			const url = value.trim();
			if (tag === null) {
				tag = document.createElement("style");
				tag.dataset.plugin = "dsh-palette";
				tag.dataset.pluginCss = tagId;
				document.head.appendChild(tag);
			}
			tag.textContent = "@font-face{font-family:'" + REMOTE_FONT_NAMES[kind] + "';src:url(\"" + url + "\")" + fontFormat(url) + ";font-display:swap}";
		}

		/** Load (or drop) one stylesheet that declares a preset web font. */
		function ensureCssFont(kind, url) {
			const tagId = "dsh-palette/font-css-" + kind;
			let link = document.querySelector("link[data-plugin-css=" + JSON.stringify(tagId) + "]");
			if (url === null || url === "") {
				if (link !== null) link.remove();
				return;
			}
			if (link === null) {
				link = document.createElement("link");
				link.rel = "stylesheet";
				link.dataset.plugin = "dsh-palette";
				link.dataset.pluginCss = tagId;
				document.head.appendChild(link);
			}
			link.href = url;
		}

		function quoteFontName(name) {
			const trimmed = name.trim();
			if (trimmed === "") return "";
			if (/^['"]/.test(trimmed)) return trimmed;
			return '"' + trimmed + '"';
		}

		/** Resolve one font setting into the stack entry and load its assets. */
		function resolveFont(kind, setting) {
			if (setting === null) {
				ensureCssFont(kind, null);
				ensureRemoteFont(kind, "");
				return "";
			}
			if (setting.type === "preset") {
				let css = setting.css || "";
				if (css === "" && kind === "en") css = googleFontsUrl(setting.name);
				ensureCssFont(kind, css || null);
				ensureRemoteFont(kind, "");
				return quoteFontName(setting.name);
			}
			if (setting.type === "name") {
				ensureCssFont(kind, null);
				ensureRemoteFont(kind, "");
				return quoteFontName(setting.name);
			}
			// type === "url"
			ensureCssFont(kind, null);
			ensureRemoteFont(kind, setting.url);
			return quoteFontName(REMOTE_FONT_NAMES[kind]);
		}

		function applyFonts() {
			if (typeof document === "undefined" || document.body === null) return;
			const { en, zh } = loadFontSettings();
			const parts = [resolveFont("en", en), resolveFont("zh", zh), DEFAULT_FONT_STACK];
			document.body.style.setProperty("--dsw-font-family", parts.filter((part) => part !== "").join(", "));
		}

		/**
		* Build one font picker row (select + hidden custom input) into the menu.
		* @returns { setValue, readValue } bound to the built DOM.
		*/
		function buildFontPicker(menu, kind, label, groups) {
			const row = el("div", "dshut-fontrow");
			row.append(el("span", "dshut-fontlabel", label));
			const select = document.createElement("select");
			select.className = "dshut-fontselect";
			select.setAttribute("aria-label", label + " font");
			const defOpt = document.createElement("option");
			defOpt.value = "";
			defOpt.textContent = "默认（跟随系统）";
			select.append(defOpt);
			const entries = new Map();
			for (const group of groups) {
				const og = document.createElement("optgroup");
				og.label = group.label;
				for (const opt of group.options) {
					const key = "preset:" + entries.size;
					const o = document.createElement("option");
					o.value = key;
					o.textContent = opt.text || opt.name;
					o.style.fontFamily = "'" + opt.name + "', sans-serif";
					og.append(o);
					entries.set(key, opt);
				}
				select.append(og);
			}
			const customOpt = document.createElement("option");
			customOpt.value = "custom";
			customOpt.textContent = "自定义…";
			select.append(customOpt);
			row.append(select);
			menu.append(row);

			const customRow = el("div", "dshut-fontrow");
			customRow.hidden = true;
			const customInput = document.createElement("input");
			customInput.className = "dshut-fontinput";
			customInput.type = "text";
			customInput.placeholder = "字体名或URL，回车生效";
			customInput.dataset.fontCustom = kind;
			// Custom input commits only on Enter — typing never re-applies fonts.
			let onCommit = null;
			const commit = () => {
				if (onCommit !== null) onCommit();
			};
			customInput.addEventListener("keydown", (event) => {
				if (event.key === "Enter") commit();
			});
			customRow.append(customInput);
			menu.append(customRow);

			const setValue = (setting) => {
				if (setting === null) {
					select.value = "";
					customRow.hidden = true;
					return;
				}
				if (setting.type === "preset") {
					let targetKey = null;
					for (const [key, meta] of entries) {
						if (meta.name !== setting.name) continue;
						if (setting.css !== "" && meta.css !== setting.css) continue;
						targetKey = key;
						break;
					}
					if (targetKey === null) {
						for (const [key, meta] of entries) {
							if (meta.name === setting.name) {
								targetKey = key;
								break;
							}
						}
					}
					if (targetKey !== null) {
						select.value = targetKey;
						customRow.hidden = true;
						return;
					}
					// stored preset no longer in the list — show it as custom
					select.value = "custom";
					customRow.hidden = false;
					customInput.value = setting.name;
					return;
				}
				select.value = "custom";
				customRow.hidden = false;
				customInput.value = setting.type === "url" ? setting.url : setting.name;
			};

			const readValue = () => {
				if (select.value === "custom") {
					const value = customInput.value.trim();
					if (value === "") return null;
					return isUrl(value) ? { type: "url", url: value } : { type: "name", name: value };
				}
				if (select.value.startsWith("preset:")) {
					const meta = entries.get(select.value);
					if (meta === void 0) return null;
					return { type: "preset", name: meta.name, css: meta.css || "" };
				}
				return null;
			};

			select.addEventListener("change", () => {
				if (select.value === "custom") {
					customRow.hidden = false;
					customInput.focus();
				} else {
					customRow.hidden = true;
					commit();
				}
			});

			return {
				setValue,
				readValue,
				select,
				customInput,
				customRow,
				setOnCommit(fn) {
					onCommit = fn;
				}
			};
		}

		// ------------------------------------------------------------------
		// Plugin body
		// ------------------------------------------------------------------
		/** Required services: theme (ThemeRuntime provided by ui-theme). */
		const inject = ["theme"];

		function apply(ctx) {
			injectCss();
			for (const def of THEMES) {
				try {
					ctx.theme.register({
						id: def.id,
						colorScheme: def.colorScheme,
						tokens: def.tokens
					});
				} catch (error) {
					// already registered (hot reload) — keep the existing one
				}
			}
			let saved = null;
			try {
				saved = localStorage.getItem(STORAGE_KEY);
			} catch (error) {
				saved = null;
			}
			if (saved !== null) {
				try {
					ctx.theme.setTheme(saved);
				} catch (error) {
					// saved id no longer registered: fall back to the default
				}
			}
			// Host settings sync (service restart / reconnect) resets the
			// in-process preference to the durable built-in value; third-party
			// theme ids never reach settings.yaml, so restore our localStorage
			// choice whenever the preference drifts back to a built-in one.
			// Manual switches to built-in themes update localStorage too, so
			// they are never overridden here.
			const BUILTIN_PREFS = ["light", "dark", "system"];
			ctx.on("theme/change", (snapshot) => {
				const preference = snapshot.preference;
				if (!BUILTIN_PREFS.includes(preference)) return;
				let stored = null;
				try {
					stored = localStorage.getItem(STORAGE_KEY);
				} catch (error) {
					stored = null;
				}
				if (stored === null || BUILTIN_PREFS.includes(stored) || stored === preference) return;
				try {
					ctx.theme.setTheme(stored);
				} catch (error) {
					// stored id no longer registered: leave the built-in theme
				}
			});
			const mount = () => {
				mountPicker(ctx, THEMES);
				initComposerHandle();
				applyFonts();
			};
			if (document.body !== null) {
				mount();
			} else {
				document.addEventListener("DOMContentLoaded", mount, { once: true });
			}
		}

		exports.apply = apply;
		exports.inject = inject;
		exports.name = "dsh-palette";
		return module.exports;
	}
});
