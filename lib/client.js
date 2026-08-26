window.__ModuleLoader__.load({
	id: "dsh-app-views",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region src/client/styles.ts
		/**
		* Injected stylesheet for the app-view chrome. One <style> tag per
		* activation (guarded by a data attribute); class names are literal strings
		* shared with the components (no CSS-module machinery in the client
		* bundle). Colors ride the DSH theme's global custom properties only.
		* @module dsh-app-views/client/styles
		*/
		/** The shared class prefix (avoids collisions with host-page classes). */
		const PREFIX = "dshav";
		/** One stylesheet tag id (installed once per page, even across HMR). */
		const STYLE_ID = "dsh-app-views-styles";
		const RULES = `
.${PREFIX}-layer {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  flex-direction: column;
  background: var(--dsw-alias-bg-base);
  pointer-events: auto;
}
.${PREFIX}-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  padding-top: max(8px, env(safe-area-inset-top));
  border-bottom: 1px solid var(--dsw-alias-border-l1);
  background: var(--dsw-alias-bg-base);
}
.${PREFIX}-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--dsw-alias-border-l1);
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  cursor: pointer;
}
.${PREFIX}-back:hover {
  background: var(--dsw-alias-bg-l2);
}
.${PREFIX}-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
}
.${PREFIX}-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}
.${PREFIX}-boundary {
  padding: 16px;
  color: var(--dsw-alias-label-secondary);
}
.${PREFIX}-footerEntry,
.${PREFIX}-footerEntryRail {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  cursor: pointer;
}
.${PREFIX}-footerEntry {
  width: 100%;
  padding: 6px 8px;
  border-radius: 6px;
  text-align: left;
}
.${PREFIX}-footerEntry:hover {
  background: var(--dsw-alias-bg-l2);
}
.${PREFIX}-footerEntryRail {
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
}
.${PREFIX}-footerEntryRail:hover {
  background: var(--dsw-alias-bg-l2);
}
.${PREFIX}-footerIcon {
  display: inline-flex;
  align-items: center;
}
`;
		/**
		* Install the stylesheet once per page.
		* @returns true when this call installed the tag.
		*/
		function injectStyles() {
			if (document.getElementById(STYLE_ID) !== null) return false;
			const style = document.createElement("style");
			style.id = STYLE_ID;
			style.textContent = RULES;
			document.head.appendChild(style);
			return true;
		}
		//#endregion
		//#region src/client/view-entry.tsx
		/**
		* One sidebar footer entry: a compact icon button (rail) or icon+label row
		* (wide) that opens its view. Rendered by the sidebar shell with the
		* `sidebar.footer.action` owner share ({ wide }).
		*/
		/**
		* Create the footer entry element for one view.
		* @param descriptor - the view this entry opens.
		* @param service - the active-view state source.
		* @param owner - the sidebar footer owner share.
		* @returns the entry element.
		*/
		function SidebarViewEntry({ descriptor, service, owner }) {
			const { wide } = owner;
			const title = descriptor.title();
			const icon = descriptor.icon?.(16);
			return (0, react.createElement)("button", {
				type: "button",
				className: wide ? `${PREFIX}-footerEntry` : `${PREFIX}-footerEntryRail`,
				"aria-label": title,
				title,
				onClick: () => {
					service.open(descriptor.id);
				}
			}, (0, react.createElement)("span", {
				className: `${PREFIX}-footerIcon`,
				"aria-hidden": "true"
			}, icon), wide ? (0, react.createElement)("span", null, title) : null);
		}
		//#endregion
		//#region src/client/service.ts
		/** The footer-order base; view entries sort above the built-in footer actions. */
		const FOOTER_ORDER_BASE = 50;
		/** The empty snapshot identity (stable between changes). */
		const EMPTY_SNAPSHOT = {
			views: [],
			activeId: null
		};
		/**
		* Create the appViews registry bound to the slots service.
		* @param slots - the client slot registry (the footer entries' home).
		* @returns the service face.
		*/
		function createAppViewsService(slots) {
			const views = /* @__PURE__ */ new Map();
			let activeId = null;
			let snapshot = EMPTY_SNAPSHOT;
			const listeners = /* @__PURE__ */ new Set();
			/** Per-view footer disposers, so unregistering a view removes its entry. */
			const footers = /* @__PURE__ */ new Map();
			const notify = () => {
				snapshot = {
					views: [...views.values()],
					activeId
				};
				for (const listener of [...listeners]) listener();
			};
			const service = {
				registerView(descriptor) {
					if (views.has(descriptor.id)) throw new Error(`appViews: view "${descriptor.id}" is already registered`);
					views.set(descriptor.id, descriptor);
					const disposers = /* @__PURE__ */ new Set();
					footers.set(descriptor.id, disposers);
					slots.inject("sidebar.footer.action", () => {
						disposers.add(slots.register({
							name: "sidebar.footer.action",
							id: `dsh-app-views:${descriptor.id}`,
							order: FOOTER_ORDER_BASE + (descriptor.order ?? 0),
							label: () => descriptor.title()
						}, (owner) => SidebarViewEntry({
							descriptor,
							service,
							owner
						})));
					});
					notify();
					return () => {
						views.delete(descriptor.id);
						for (const dispose of [...disposers]) dispose();
						disposers.clear();
						footers.delete(descriptor.id);
						if (activeId === descriptor.id) activeId = null;
						notify();
					};
				},
				open(id) {
					if (!views.has(id) || activeId === id) return;
					activeId = id;
					notify();
				},
				close() {
					if (activeId === null) return;
					activeId = null;
					notify();
				},
				subscribe(listener) {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				},
				getSnapshot: () => snapshot
			};
			return service;
		}
		//#endregion
		//#region src/client/i18n.ts
		/**
		* Copy for the app-view chrome. The module-level t() resolves the active
		* locale through the DSH locale service snapshot (attached on activation),
		* falling back to the browser language. Registered into the shared locale
		* registry as the `app-views` namespace (zh keys are the source of truth).
		* @module dsh-app-views/client/i18n
		*/
		/** The locale namespace this plugin registers. */
		const LOCALE_NS = "app-views";
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			back: "返回聊天",
			viewFailed: "该视图渲染失败"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			back: "Back to chat",
			viewFailed: "This view failed to render"
		};
		/** The attached locale service (module-level: copy only, no component state). */
		let localeService;
		/**
		* Attach the DSH locale service for language resolution.
		* @param service - the locale service face.
		*/
		function attachLocale(service) {
			localeService = service;
		}
		/** The active locale id ('zh' | 'en' | browser fallback). */
		function activeLocale() {
			return localeService?.getSnapshot().active ?? (typeof navigator !== "undefined" ? navigator.language : "") ?? "en";
		}
		/**
		* Translate a copy key in the active locale.
		* @param key - the copy key.
		* @returns the translated string.
		*/
		function t(key) {
			return activeLocale().toLowerCase().startsWith("zh") ? zh[key] : en[key];
		}
		//#endregion
		//#region src/client/view-layer.tsx
		/**
		* The full-page overlay layer: renders the active app view over the chat
		* workspace (which stays mounted underneath — no unmount, no state loss),
		* with a back-to-chat header, an Escape shortcut, a focus trap, and an
		* error boundary so a view crash shows a strip instead of a blank page.
		*/
		/** A view crash keeps the chrome alive: a dismissible strip + close. */
		var ViewBoundary = class extends react.Component {
			state = { failed: false };
			static getDerivedStateFromError() {
				return { failed: true };
			}
			render() {
				if (this.state.failed) return (0, react.createElement)("div", { className: `${PREFIX}-boundary` }, (0, react.createElement)("p", null, t("viewFailed")), (0, react.createElement)("button", {
					type: "button",
					className: `${PREFIX}-back`,
					onClick: () => {
						this.props.onClose();
					}
				}, t("back")));
				return this.props.children;
			}
		};
		/** Focusable selectors for the Tab trap (buttons/links/form controls only). */
		const FOCUSABLE = "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex=\"-1\"])";
		/**
		* The overlay layer entry (registered into the shell's `shell.overlay`
		* list slot). Renders nothing while the chat workspace is active.
		* @param service - the appViews registry.
		* @returns the layer element, or null.
		*/
		function AppViewLayer({ service }) {
			const snapshot = (0, react.useSyncExternalStore)(service.subscribe, service.getSnapshot);
			const layerRef = (0, react.useRef)(null);
			const active = snapshot.views.find((view) => view.id === snapshot.activeId);
			const activeId = active?.id;
			(0, react.useEffect)(() => {
				if (activeId === void 0) return;
				layerRef.current?.focus();
				const onKeyDown = (event) => {
					if (event.key === "Escape") {
						event.preventDefault();
						service.close();
						return;
					}
					if (event.key !== "Tab") return;
					const layer = layerRef.current;
					if (layer === null) return;
					const focusables = [...layer.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
					if (focusables.length === 0) return;
					const first = focusables[0];
					const last = focusables[focusables.length - 1];
					const current = document.activeElement;
					if (event.shiftKey && (current === first || current === layer)) {
						event.preventDefault();
						last.focus();
					} else if (!event.shiftKey && current === last) {
						event.preventDefault();
						first.focus();
					}
				};
				window.addEventListener("keydown", onKeyDown, true);
				return () => {
					window.removeEventListener("keydown", onKeyDown, true);
				};
			}, [activeId, service]);
			if (active === void 0) return null;
			return (0, react.createElement)("div", {
				ref: layerRef,
				className: `${PREFIX}-layer`,
				tabIndex: -1,
				"aria-label": active.title()
			}, (0, react.createElement)("header", { className: `${PREFIX}-header` }, (0, react.createElement)("button", {
				type: "button",
				className: `${PREFIX}-back`,
				onClick: () => {
					service.close();
				}
			}, (0, react.createElement)(_deepseek_ai_dsh_client_ui_primitives.IconChevronLeftOutline14), t("back")), (0, react.createElement)("span", { className: `${PREFIX}-title` }, active.icon?.(16), active.title())), (0, react.createElement)("div", { className: `${PREFIX}-body` }, (0, react.createElement)(ViewBoundary, {
				onClose: () => {
					service.close();
				},
				children: active.component({ close: () => {
					service.close();
				} })
			})));
		}
		//#endregion
		//#region src/client/index.tsx
		/** Services required before activation. */
		const inject = ["slots", "locale"];
		/** Client plugin body (runs once slots and locale are provided). */
		function apply(ctx) {
			injectStyles();
			attachLocale(ctx.locale);
			ctx.effect(() => {
				const offZh = ctx.locale.register(LOCALE_NS, {
					zh,
					en
				});
				return () => {
					offZh();
				};
			}, "dsh-app-views: dictionaries");
			const service = createAppViewsService(ctx.slots);
			ctx.provide("appViews", service);
			ctx.effect(() => ctx.slots.register({
				name: "shell.overlay",
				id: "dsh-app-views",
				order: 50
			}, () => AppViewLayer({ service })), "dsh-app-views: overlay layer registration");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map