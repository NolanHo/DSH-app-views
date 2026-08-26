/**
 * Injected stylesheet for the app-view chrome. One <style> tag per
 * activation (guarded by a data attribute); class names are literal strings
 * shared with the components (no CSS-module machinery in the client
 * bundle). Colors ride the DSH theme's global custom properties only.
 * @module dsh-app-views/client/styles
 */

/** The shared class prefix (avoids collisions with host-page classes). */
export const PREFIX = 'dshav'

/** One stylesheet tag id (installed once per page, even across HMR). */
const STYLE_ID = 'dsh-app-views-styles'

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
`

/**
 * Install the stylesheet once per page.
 * @returns true when this call installed the tag.
 */
export function injectStyles(): boolean {
  if (document.getElementById(STYLE_ID) !== null) return false
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = RULES
  document.head.appendChild(style)
  return true
}
