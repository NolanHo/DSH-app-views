/**
 * Copy for the app-view chrome. The module-level t() resolves the active
 * locale through the DSH locale service snapshot (attached on activation),
 * falling back to the browser language. Registered into the shared locale
 * registry as the `app-views` namespace (zh keys are the source of truth).
 * @module dsh-app-views/client/i18n
 */
/** The locale namespace this plugin registers. */
export declare const LOCALE_NS = "app-views";
/** Simplified Chinese dictionary (the key-set source of truth). */
export declare const zh: {
    back: string;
    viewFailed: string;
    views: string;
};
/** The copy key union. */
export type CopyKey = keyof typeof zh;
/** English dictionary, checked complete against the zh key set. */
export declare const en: {
    back: string;
    viewFailed: string;
    views: string;
};
/**
 * Attach the DSH locale service for language resolution.
 * @param service - the locale service face.
 */
export declare function attachLocale(service: {
    getSnapshot(): {
        active: string;
    };
} | undefined): void;
/**
 * Translate a copy key in the active locale.
 * @param key - the copy key.
 * @returns the translated string.
 */
export declare function t(key: CopyKey): string;
