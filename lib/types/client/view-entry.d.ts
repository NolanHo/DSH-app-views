/**
 * One sidebar footer entry: a compact icon button (rail) or icon+label row
 * (wide) that opens its view. Rendered by the sidebar shell with the
 * `sidebar.footer.action` owner share ({ wide }).
 */
import { type ReactNode } from 'react';
import type { AppViewDescriptor, AppViewsService } from './types.ts';
/**
 * Create the footer entry element for one view.
 * @param descriptor - the view this entry opens.
 * @param service - the active-view state source.
 * @param owner - the sidebar footer owner share.
 * @returns the entry element.
 */
export declare function SidebarViewEntry({ descriptor, service, owner }: {
    descriptor: AppViewDescriptor;
    service: AppViewsService;
    owner: unknown;
}): ReactNode;
