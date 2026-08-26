/**
 * The app-view registry contract: descriptors contributed by view plugins
 * and the service face consumers switch views through. All collaboration
 * goes through the cordis `appViews` service — plugins never value-import
 * this package's client half.
 */
import type { ReactNode } from 'react';
/** Props a view component receives from the overlay layer. */
export interface AppViewRenderProps {
    /** Close the active view and return to the chat workspace. */
    close: () => void;
}
/** One registered full-page app view. */
export interface AppViewDescriptor {
    /** Stable view id; the open target and the sidebar entry identity. */
    id: string;
    /** Display title (a thunk so the copy follows the active locale). */
    title: () => string;
    /** Optional 16px-scale glyph for the sidebar entry and the layer header. */
    icon?: (size: number) => ReactNode;
    /** Sidebar entry order (ascending, default 0; offset above the built-ins). */
    order?: number;
    /** The full-page view body. */
    component: (props: AppViewRenderProps) => ReactNode;
}
/** The service snapshot (stable object, replaced on changes). */
export interface AppViewsSnapshot {
    /** Registered views in registration order. */
    readonly views: readonly AppViewDescriptor[];
    /** The active view id, or null while the chat workspace is active. */
    readonly activeId: string | null;
}
/**
 * The app-view registry: plugins register full-page views; the layer renders
 * the active one over the chat workspace (which stays mounted underneath).
 */
export interface AppViewsService {
    /**
     * Register one view and its sidebar footer entry.
     * @param descriptor - the view contribution.
     * @returns disposer removing the view, its entry, and the active state.
     */
    registerView(descriptor: AppViewDescriptor): () => void;
    /** Activate a registered view (unknown id is a no-op). */
    open(id: string): void;
    /** Return to the chat workspace. */
    close(): void;
    subscribe(listener: () => void): () => void;
    getSnapshot(): AppViewsSnapshot;
}
