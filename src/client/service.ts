/**
 * The appViews service implementation: the view ledger, the active-view
 * state, and the sidebar footer entries. One instance per plugin activation
 * (created in apply; never a module-level singleton), shared by the overlay
 * layer and every sidebar entry through the cordis service.
 * @module dsh-app-views/client/service
 */
import type { SlotsService } from '../shims.d.ts'
import type { AppViewDescriptor, AppViewsService, AppViewsSnapshot } from './types.ts'
import { SidebarViewEntry } from './view-entry.tsx'

/** The footer-order base; view entries sort above the built-in footer actions. */
const FOOTER_ORDER_BASE = 50

/** The empty snapshot identity (stable between changes). */
const EMPTY_SNAPSHOT: AppViewsSnapshot = { views: [], activeId: null }

/**
 * Create the appViews registry bound to the slots service.
 * @param slots - the client slot registry (the footer entries' home).
 * @returns the service face.
 */
export function createAppViewsService(slots: SlotsService): AppViewsService {
  const views = new Map<string, AppViewDescriptor>()
  let activeId: string | null = null
  let snapshot: AppViewsSnapshot = EMPTY_SNAPSHOT
  const listeners = new Set<() => void>()
  /** Per-view footer disposers, so unregistering a view removes its entry. */
  const footers = new Map<string, Set<() => void>>()

  const notify = (): void => {
    snapshot = { views: [...views.values()], activeId }
    for (const listener of [...listeners]) listener()
  }

  const service: AppViewsService = {
    registerView(descriptor) {
      if (views.has(descriptor.id)) {
        throw new Error(`appViews: view "${descriptor.id}" is already registered`)
      }
      views.set(descriptor.id, descriptor)
      const disposers = new Set<() => void>()
      footers.set(descriptor.id, disposers)
      // The footer slot is declared by the sidebar shell entry; inject waits
      // for the declaration and re-runs after redeclaration (HMR-safe). The
      // registration is captured so unregistering the view removes it.
      slots.inject('sidebar.footer.action', () => {
        disposers.add(slots.register({
          name: 'sidebar.footer.action',
          id: `dsh-app-views:${descriptor.id}`,
          order: FOOTER_ORDER_BASE + (descriptor.order ?? 0),
          label: () => descriptor.title(),
        }, (owner: unknown) => SidebarViewEntry({ descriptor, service, owner })))
      })
      notify()
      return () => {
        views.delete(descriptor.id)
        for (const dispose of [...disposers]) dispose()
        disposers.clear()
        footers.delete(descriptor.id)
        if (activeId === descriptor.id) activeId = null
        notify()
      }
    },
    open(id) {
      if (!views.has(id) || activeId === id) return
      activeId = id
      notify()
    },
    close() {
      if (activeId === null) return
      activeId = null
      notify()
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    getSnapshot: () => snapshot,
  }
  return service
}
