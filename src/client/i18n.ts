/**
 * Copy for the app-view chrome. The module-level t() resolves the active
 * locale through the DSH locale service snapshot (attached on activation),
 * falling back to the browser language. Registered into the shared locale
 * registry as the `app-views` namespace (zh keys are the source of truth).
 * @module dsh-app-views/client/i18n
 */

/** The locale namespace this plugin registers. */
export const LOCALE_NS = 'app-views'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  back: '返回聊天',
  viewFailed: '该视图渲染失败',
} satisfies Record<string, string>

/** The copy key union. */
export type CopyKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  back: 'Back to chat',
  viewFailed: 'This view failed to render',
} satisfies Record<CopyKey, string>

/** The attached locale service (module-level: copy only, no component state). */
let localeService: { getSnapshot(): { active: string } } | undefined

/**
 * Attach the DSH locale service for language resolution.
 * @param service - the locale service face.
 */
export function attachLocale(service: { getSnapshot(): { active: string } } | undefined): void {
  localeService = service
}

/** The active locale id ('zh' | 'en' | browser fallback). */
function activeLocale(): string {
  return localeService?.getSnapshot().active
    ?? (typeof navigator !== 'undefined' ? navigator.language : '')
    ?? 'en'
}

/**
 * Translate a copy key in the active locale.
 * @param key - the copy key.
 * @returns the translated string.
 */
export function t(key: CopyKey): string {
  return activeLocale().toLowerCase().startsWith('zh') ? zh[key] : en[key]
}
