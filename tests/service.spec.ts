/**
 * The appViews service core: ledger, active state, footer entry lifecycle.
 * The slots service is faked; components are not mounted (node env).
 */
import { describe, expect, it } from 'vitest'
import { createAppViewsService } from '../src/client/service.ts'
import type { AppViewDescriptor, AppViewsService } from '../src/client/types.ts'

function view(id: string, overrides: Partial<AppViewDescriptor> = {}): AppViewDescriptor {
  return {
    id,
    title: () => id,
    component: () => null,
    ...overrides,
  }
}

function makeService(): { service: AppViewsService } {
  return { service: createAppViewsService() }
}

describe('createAppViewsService', () => {
  it('starts with an empty ledger and no active view', () => {
    const { service } = makeService()
    expect(service.getSnapshot()).toEqual({ views: [], activeId: null })
  })

  it('registerView adds the view and notifies subscribers', () => {
    const { service } = makeService()
    const seen: number[] = []
    service.subscribe(() => { seen.push(1) })
    service.registerView(view('github'))
    expect(service.getSnapshot().views.map(v => v.id)).toEqual(['github'])
    expect(seen.length).toBe(1)
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

  it('unregistering a view removes it and its active state', () => {
    const { service } = makeService()
    const dispose = service.registerView(view('github'))
    service.open('github')
    dispose()
    expect(service.getSnapshot()).toEqual({ views: [], activeId: null })
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

  it('re-registering after disposal works (HMR safety)', () => {
    const { service } = makeService()
    const dispose = service.registerView(view('github'))
    dispose()
    service.registerView(view('github'))
    expect(service.getSnapshot().views.map(v => v.id)).toEqual(['github'])
  })
})
