/**
 * The appViews service implementation: the view ledger, the active-view
 * state, and the sidebar footer entries. One instance per plugin activation
 * (created in apply; never a module-level singleton), shared by the overlay
 * layer and every sidebar entry through the cordis service.
 * @module dsh-app-views/client/service
 */
import type { SlotsService } from '../shims.d.ts';
import type { AppViewsService } from './types.ts';
/**
 * Create the appViews registry bound to the slots service.
 * @param slots - the client slot registry (the footer entries' home).
 * @returns the service face.
 */
export declare function createAppViewsService(slots: SlotsService): AppViewsService;
