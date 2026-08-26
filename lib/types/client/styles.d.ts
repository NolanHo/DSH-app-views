/**
 * Injected stylesheet for the app-view chrome. One <style> tag per
 * activation (guarded by a data attribute); class names are literal strings
 * shared with the components (no CSS-module machinery in the client
 * bundle). Colors ride the DSH theme's global custom properties only.
 * @module dsh-app-views/client/styles
 */
/** The shared class prefix (avoids collisions with host-page classes). */
export declare const PREFIX = "dshav";
/**
 * Install the stylesheet once per page.
 * @returns true when this call installed the tag.
 */
export declare function injectStyles(): boolean;
