/**
 * The full-page overlay layer: renders the active app view over the chat
 * workspace (which stays mounted underneath — no unmount, no state loss),
 * with a back-to-chat header, an Escape shortcut, a focus trap, and an
 * error boundary so a view crash shows a strip instead of a blank page.
 */
import { type ReactNode } from 'react';
import type { AppViewsService } from './types.ts';
/**
 * The overlay layer entry (registered into the shell's `shell.overlay`
 * list slot). Renders nothing while the chat workspace is active.
 * @param service - the appViews registry.
 * @returns the layer element, or null.
 */
export declare function AppViewLayer({ service }: {
    service: AppViewsService;
}): ReactNode;
