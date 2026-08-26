/**
 * The appViews service implementation: the view ledger and the active-view
 * state. The sidebar nav block is ONE footer registration owned by the
 * plugin body (index.tsx); this service stays slot-free so the ledger is
 * testable without a slots service.
 * @module dsh-app-views/client/service
 */
import type { AppViewsService } from './types.ts';
/**
 * Create the appViews registry.
 * @returns the service face.
 */
export declare function createAppViewsService(): AppViewsService;
