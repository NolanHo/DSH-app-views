/**
 * dsh-app-views browser half: publishes the `appViews` service, registers
 * the full-page overlay layer into the shell's `shell.overlay` slot, and
 * attaches the plugin's locale namespace. The chat workspace stays mounted
 * underneath the layer — switching views never unmounts it.
 */
import type { Context } from 'cordis';
import type { AppViewsService } from './types.ts';
export type { AppViewDescriptor, AppViewRenderProps, AppViewsService, AppViewsSnapshot } from './types.ts';
/** Services required before activation. */
export declare const inject: readonly ["slots", "locale"];
/** Client plugin body (runs once slots and locale are provided). */
export declare function apply(ctx: Context): void;
declare module 'cordis' {
    interface Context {
        /** The app-view registry provided by this plugin (may be absent). */
        appViews?: AppViewsService;
    }
}
