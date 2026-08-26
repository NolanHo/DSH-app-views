/**
 * dsh-app-views browser half: publishes the `appViews` service and swaps
 * the CENTER display area — while a view is active, a priority shadow
 * occupies the `conversation` slot, so the left sidebar (session list +
 * view entries) and the frame chrome never move. Selecting a session in
 * the sidebar closes the active view and returns to the chat workspace.
 */
import type { Context } from 'cordis';
import type { AppViewsService } from './types.ts';
export type { AppViewDescriptor, AppViewRenderProps, AppViewsService, AppViewsSnapshot } from './types.ts';
/** Services required before activation. */
export declare const inject: readonly ["slots", "locale", "sessions", "layout"];
/** Client plugin body (runs once the injected services are provided). */
export declare function apply(ctx: Context): void;
declare module 'cordis' {
    interface Context {
        /** The app-view registry provided by this plugin (may be absent). */
        appViews?: AppViewsService;
    }
}
