window.__ModuleLoader__.load({
	id: "dsh-app-views",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region src/client/service.ts
		/** The empty snapshot identity (stable between changes). */
		const EMPTY_SNAPSHOT = {
			views: [],
			activeId: null
		};
		/**
		* Create the appViews registry.
		* @returns the service face.
		*/
		function createAppViewsService() {
			const views = /* @__PURE__ */ new Map();
			let activeId = null;
			let snapshot = EMPTY_SNAPSHOT;
			const listeners = /* @__PURE__ */ new Set();
			const notify = () => {
				snapshot = {
					views: [...views.values()],
					activeId
				};
				for (const listener of [...listeners]) listener();
			};
			return {
				registerView(descriptor) {
					if (views.has(descriptor.id)) throw new Error(`appViews: view "${descriptor.id}" is already registered`);
					views.set(descriptor.id, descriptor);
					notify();
					return () => {
						views.delete(descriptor.id);
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
		}
		//#endregion
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
		/** One stylesheet tag id. */
		const STYLE_ID = "dsh-app-views-styles";
		/** The loader entry id (must equal the HMR style-cleanup attribute). */
		const PLUGIN_ID = "dsh-app-views";
		const RULES = `
.${PREFIX}-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: var(--dsw-alias-bg-base);
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
.${PREFIX}-nav,
.${PREFIX}-navRail {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.${PREFIX}-nav {
  gap: 2px;
  padding: 4px 0;
}
.${PREFIX}-navRail {
  gap: 4px;
  align-items: center;
}
.${PREFIX}-navTitle {
  font-size: 12px;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary);
  padding: 0 8px 2px;
}
.${PREFIX}-navItem,
.${PREFIX}-navItemRail {
  display: flex;
  align-items: center;
  border: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  cursor: pointer;
}
.${PREFIX}-navItem {
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  border-radius: 6px;
  text-align: left;
}
.${PREFIX}-navItem:hover {
  background: var(--dsw-alias-bg-l2);
}
.${PREFIX}-navItemRail {
  justify-content: center;
  padding: 6px;
  border-radius: 6px;
}
.${PREFIX}-navItemRail:hover {
  background: var(--dsw-alias-bg-l2);
}
.${PREFIX}-navIcon {
  display: inline-flex;
  align-items: center;
}
`;
		/**
		* Install the stylesheet once per page.
		* @returns true when this call installed the tag.
		*/
		function injectStyles() {
			document.getElementById(STYLE_ID)?.remove();
			const style = document.createElement("style");
			style.id = STYLE_ID;
			style.setAttribute("data-plugin", PLUGIN_ID);
			style.textContent = RULES;
			document.head.appendChild(style);
			return true;
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
			viewFailed: "该视图渲染失败",
			views: "应用"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			back: "Back to chat",
			viewFailed: "This view failed to render",
			views: "Apps"
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
		//#region src/client/view-panel.tsx
		/**
		* The center display panel: fills the conversation column while an app view
		* is active (the plugin shadows the `conversation` slot, so the sidebar and
		* the rest of the frame never move). Carries the back-to-chat header, an
		* Escape shortcut, a focus trap, and an error boundary so a view crash
		* shows a strip instead of a blank panel.
		*/
		/** A view crash keeps the chrome alive: a dismissible strip + back. */
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
		* The center display panel (registered as the `conversation` slot's
		* shadow occupant). Renders nothing while no view is active.
		* @param service - the appViews registry.
		* @returns the panel element, or null.
		*/
		function AppViewPanel({ service }) {
			const snapshot = (0, react.useSyncExternalStore)(service.subscribe, service.getSnapshot);
			const panelRef = (0, react.useRef)(null);
			const active = snapshot.views.find((view) => view.id === snapshot.activeId);
			const activeId = active?.id;
			(0, react.useEffect)(() => {
				if (activeId === void 0) return;
				panelRef.current?.focus();
				const onKeyDown = (event) => {
					if (event.key === "Escape") {
						event.preventDefault();
						service.close();
						return;
					}
					if (event.key !== "Tab") return;
					const panel = panelRef.current;
					if (panel === null) return;
					const focusables = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);
					if (focusables.length === 0) return;
					const first = focusables[0];
					const last = focusables[focusables.length - 1];
					const current = document.activeElement;
					if (event.shiftKey && (current === first || current === panel)) {
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
				ref: panelRef,
				className: `${PREFIX}-panel`,
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
		//#region src/client/view-entry.tsx
		/**
		* The sidebar "apps" nav block: ONE footer entry rendering every registered
		* view as a vertically stacked row (icon + label when wide, centered icons
		* on the rail). A single entry keeps the layout owned by this plugin — the
		* shell's horizontal footer container renders exactly one full-width child.
		*/
		/** One nav row (wide) or icon cell (rail). */
		function NavButton({ descriptor, service, wide }) {
			const title = descriptor.title();
			const icon = descriptor.icon?.(16);
			return (0, react.createElement)("button", {
				type: "button",
				className: wide ? `${PREFIX}-navItem` : `${PREFIX}-navItemRail`,
				"aria-label": title,
				title,
				onClick: () => {
					service.open(descriptor.id);
				}
			}, (0, react.createElement)("span", {
				className: `${PREFIX}-navIcon`,
				"aria-hidden": "true"
			}, icon), wide ? (0, react.createElement)("span", { className: `${PREFIX}-navLabel` }, title) : null);
		}
		/**
		* The footer nav block for all registered views (sorted by order).
		* @param service - the appViews registry.
		* @param owner - the sidebar footer owner share.
		* @returns the nav block, or null while no view is registered.
		*/
		function SidebarViewsNav({ service, owner }) {
			const { wide } = owner;
			const snapshot = (0, react.useSyncExternalStore)(service.subscribe, service.getSnapshot);
			if (snapshot.views.length === 0) return null;
			const sorted = [...snapshot.views].sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
			return (0, react.createElement)("div", { className: wide ? `${PREFIX}-nav` : `${PREFIX}-navRail` }, wide ? (0, react.createElement)("div", { className: `${PREFIX}-navTitle` }, t("views")) : null, ...sorted.map((descriptor) => (0, react.createElement)(NavButton, {
				key: descriptor.id,
				descriptor,
				service,
				wide
			})));
		}
		//#endregion
		//#region src/client/index.tsx
		/** Services required before activation. */
		const inject = [
			"slots",
			"locale",
			"sessions",
			"layout"
		];
		/** Client plugin body (runs once the injected services are provided). */
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
			const service = createAppViewsService();
			ctx.provide("appViews", service);
			ctx.effect(() => ctx.slots.inject("sidebar.footer.action", () => {
				ctx.slots.register({
					name: "sidebar.footer.action",
					id: "dsh-app-views:nav",
					order: 50
				}, (owner) => SidebarViewsNav({
					service,
					owner
				}));
			}), "dsh-app-views: sidebar nav registration");
			let disposeShadow;
			const syncShadow = () => {
				if (service.getSnapshot().activeId !== null) {
					ctx.layout.closeDetails();
					ctx.layout.closeDrawer?.();
					if (disposeShadow === void 0) ctx.slots.inject("conversation", () => {
						if (service.getSnapshot().activeId === null || disposeShadow !== void 0) return;
						disposeShadow = ctx.slots.register({
							name: "conversation",
							priority: -10
						}, () => AppViewPanel({ service }));
					});
				} else if (disposeShadow !== void 0) {
					disposeShadow();
					disposeShadow = void 0;
				}
			};
			const offViews = service.subscribe(syncShadow);
			syncShadow();
			let lastCurrent = ctx.sessions.list.getSnapshot().current;
			const offSessions = ctx.sessions.list.subscribe(() => {
				const current = ctx.sessions.list.getSnapshot().current;
				if (current === lastCurrent) return;
				lastCurrent = current;
				if (service.getSnapshot().activeId !== null) service.close();
			});
			ctx.effect(() => () => {
				offViews();
				offSessions();
				disposeShadow?.();
				disposeShadow = void 0;
			}, "dsh-app-views: shadow lifecycle");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map