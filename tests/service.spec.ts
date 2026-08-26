/**
 * The appViews service core: ledger, active state, footer entry lifecycle.
 * The slots service is faked; components are not mounted (node env).
 */
import { describe, expect, it, vi } from 'vitest'
import { createAppViewsService } from '../src/client/service.ts'
import type { AppViewDescriptor, AppViewsService } from '../src/client/types.ts'
import type { SlotsService } from '../src/shims.d.ts'

/** A minimal fake slots service capturing registrations per key. */
function fakeSlots() {
  const registrations: { options: Record<string, unknown> }[] = []
  const register = vi.fn((options: Record<string, unknown>) => {
    registrations.push({ options })
    return () => {
      const index = registrations.findIndex(entry => entry.options === options)
      if (index >= 0) registrations.splice(index, 1)
    }
  })
  const inject = vi.fn((_key: string, callback: () => void) => { callback() })
  return { registrations, register, inject: inject as SlotsService['inject'] }
}

function view(id: string, overrides: Partial<AppViewDescriptor> = {}): AppViewDescriptor {
  return {
    id,
    title: () => id,
    component: () => null,
    ...overrides,
  }
}

function makeService(): { service: AppViewsService; slots: ReturnType<typeof fakeSlots> } {
  const slots = fakeSlots()
  const service = createAppViewsService(slots as unknown as SlotsService)
  return { service, slots }
}

describe('createAppViewsService', () => {
  it('starts with an empty ledger and no active view', () => {
    const { service } = makeService()
    expect(service.getSnapshot()).toEqual({ views: [], activeId: null })
  })

  it('registerView adds the view, notifies, and creates the sidebar footer entry', () => {
    const { service, slots } = makeService()
    const seen: number[] = []
    service.subscribe(() => { seen.push(1) })
    service.registerView(view('github'))
    expect(service.getSnapshot().views.map(v => v.id)).toEqual(['github'])
    expect(seen.length).toBe(1)
    const footers = slots.registrations.filter(entry => String((entry.options as { name?: unknown }).name) === 'sidebar.footer.action')
    expect(footers.length).toBe(1)
    expect((footers[0]?.options as { id?: string }).id).toBe('dsh-app-views:github')
  })

  it('rejects a duplicate view id and leaves the ledger unchanged', () => {
    const { service } = makeService()
    service.registerView(view('github'))
    expect(() => { service.registerView(view('github')) }).toThrow(/already registered/)
    expect(service.getSnapshot().views.length).toBe(1)
  })

  it('open activates a registered view and close returns to the workspace', () => {
    const { service } = makeService()
    service.registerView(view('github'))
    service.open('github')
    expect(service.getSnapshot().activeId).toBe('github')
    service.close()
    expect(service.getSnapshot().activeId).toBeNull()
  })

  it('open of an unknown id is a no-op', () => {
    const { service } = makeService()
    service.open('missing')
    expect(service.getSnapshot().activeId).toBeNull()
  })

  it('unregistering a view removes its footer entry and its active state', () => {
    const { service, slots } = makeService()
    const dispose = service.registerView(view('github'))
    service.open('github')
    dispose()
    expect(service.getSnapshot()).toEqual({ views: [], activeId: null })
    expect(slots.registrations.filter(entry => String((entry.options as { name?: unknown }).name) === 'sidebar.footer.action').length).toBe(0)
  })

  it('notifies subscribers on open and close', () => {
    const { service } = makeService()
    service.registerView(view('github'))
    const seen: string[] = []
    service.subscribe(() => { seen.push(service.getSnapshot().activeId ?? 'null') })
    service.open('github')
    service.close()
    expect(seen).toEqual(['github', 'null'])
  })

  it('re-activation after disposal re-registers the footer entry (HMR safety)', () => {
    const { service, slots } = makeService()
    const dispose = service.registerView(view('github'))
    dispose()
    service.registerView(view('github'))
    const footers = slots.registrations.filter(entry => String((entry.options as { name?: unknown }).name) === 'sidebar.footer.action')
    expect(footers.length).toBe(1)
  })
})
