/**
 * The center display panel: fills the conversation column while an app view
 * is active (the plugin shadows the `conversation` slot, so the sidebar and
 * the rest of the frame never move). Carries the back-to-chat header, an
 * Escape shortcut, a focus trap, and an error boundary so a view crash
 * shows a strip instead of a blank panel.
 */
import { type ReactNode } from 'react';
import type { AppViewsService } from './types.ts';
/**
 * The center display panel (registered as the `conversation` slot's
 * shadow occupant). Renders nothing while no view is active.
 * @param service - the appViews registry.
 * @returns the panel element, or null.
 */
export declare function AppViewPanel({ service }: {
    service: AppViewsService;
}): ReactNode;
