/**
 * Injected stylesheet for the app-view chrome. One <style> tag per
 * activation (guarded by a data attribute); class names are literal strings
 * shared with the components (no CSS-module machinery in the client
 * bundle). Colors ride the DSH theme's global custom properties only.
 * @module dsh-app-views/client/styles
 */

/** The shared class prefix (avoids collisions with host-page classes). */
export const PREFIX = 'dshav'

/** One stylesheet tag id. */
const STYLE_ID = 'dsh-app-views-styles'

/** The loader entry id (must equal the HMR style-cleanup attribute). */
const PLUGIN_ID = 'dsh-app-views'

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
`

/**
 * Install the stylesheet once per page.
 * @returns true when this call installed the tag.
 */
export function injectStyles(): boolean {
  // Self-healing: drop any previous tag with our id (including tags from
  // older bundles that predate the data-plugin attribute), then inject the
  // current rules. The HMR reload driver also removes owned tags by
  // data-plugin, so the stylesheet always matches the running bundle.
  document.getElementById(STYLE_ID)?.remove()
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.setAttribute('data-plugin', PLUGIN_ID)
  style.textContent = RULES
  document.head.appendChild(style)
  return true
}
