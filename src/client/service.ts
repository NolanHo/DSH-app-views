/**
 * The appViews service implementation: the view ledger and the active-view
 * state. The sidebar nav block is ONE footer registration owned by the
 * plugin body (index.tsx); this service stays slot-free so the ledger is
 * testable without a slots service.
 * @module dsh-app-views/client/service
 */
import type { AppViewDescriptor, AppViewsService, AppViewsSnapshot } from './types.ts'

/** The empty snapshot identity (stable between changes). */
const EMPTY_SNAPSHOT: AppViewsSnapshot = { views: [], activeId: null }

/**
 * Create the appViews registry.
 * @returns the service face.
 */
export function createAppViewsService(): AppViewsService {
  const views = new Map<string, AppViewDescriptor>()
  let activeId: string | null = null
  let snapshot: AppViewsSnapshot = EMPTY_SNAPSHOT
  const listeners = new Set<() => void>()

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
      notify()
      return () => {
        views.delete(descriptor.id)
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
