/**
 * The sidebar "apps" nav block: ONE footer entry rendering every registered
 * view as a vertically stacked row (icon + label when wide, centered icons
 * on the rail). A single entry keeps the layout owned by this plugin — the
 * shell's horizontal footer container renders exactly one full-width child.
 */
import { type ReactNode } from 'react';
import type { AppViewsService } from './types.ts';
/**
 * The footer nav block for all registered views (sorted by order).
 * @param service - the appViews registry.
 * @param owner - the sidebar footer owner share.
 * @returns the nav block, or null while no view is registered.
 */
export declare function SidebarViewsNav({ service, owner }: {
    service: AppViewsService;
    owner: unknown;
}): ReactNode;
