/**
 * dsh-app-views browser half: publishes the `appViews` service and swaps
 * the CENTER display area — while a view is active, a priority shadow
 * occupies the `conversation` slot, so the left sidebar (session list +
 * view entries) and the frame chrome never move. Selecting a session in
 * the sidebar closes the active view and returns to the chat workspace.
 */
import type { Context } from 'cordis'
import { createAppViewsService } from './service.ts'
import { AppViewPanel } from './view-panel.tsx'
import { SidebarViewsNav } from './view-entry.tsx'
import { injectStyles } from './styles.ts'
import { attachLocale, en, LOCALE_NS, zh } from './i18n.ts'
import type { AppViewsService } from './types.ts'

export type { AppViewDescriptor, AppViewRenderProps, AppViewsService, AppViewsSnapshot } from './types.ts'

/** Services required before activation. */
export const inject = ['slots', 'locale', 'sessions', 'layout'] as const

/** Client plugin body (runs once the injected services are provided). */
export function apply(ctx: Context): void {
  injectStyles()
  attachLocale(ctx.locale)
  ctx.effect(() => {
    const offZh = ctx.locale.register(LOCALE_NS, { zh, en })
    return () => { offZh() }
  }, 'dsh-app-views: dictionaries')

  const service = createAppViewsService()
  ctx.provide('appViews', service)

  // One sidebar footer entry: a vertically stacked nav block rendering every
  // registered view (the shell's footer container is horizontal — a single
  // full-width child is what makes the rows stack).
  ctx.effect(
    () => ctx.slots.inject('sidebar.footer.action', () => {
      ctx.slots.register(
        { name: 'sidebar.footer.action', id: 'dsh-app-views:nav', order: 50 },
        (owner: unknown) => SidebarViewsNav({ service, owner }),
      )
    }),
    'dsh-app-views: sidebar nav registration',
  )

  // Center-display swap: while a view is active, a priority -10 shadow of
  // the `conversation` slot renders the panel; disposing it returns the
  // original conversation occupant. `slots.inject` waits for the slot's
  // declaration and re-runs the registration after a redeclaration, so the
  // shadow never registers into an undeclared slot. Opening a view closes
  // the details panel (desktop column / mobile sheet) for a clean swap.
  let disposeShadow: (() => void) | undefined
  const syncShadow = (): void => {
    const active = service.getSnapshot().activeId !== null
    if (active) {
      ctx.layout.closeDetails()
      if (disposeShadow === undefined) {
        ctx.slots.inject('conversation', () => {
          if (service.getSnapshot().activeId === null || disposeShadow !== undefined) return
          disposeShadow = ctx.slots.register(
            { name: 'conversation', priority: -10 },
            () => AppViewPanel({ service }),
          )
        })
      }
    } else if (disposeShadow !== undefined) {
      disposeShadow()
      disposeShadow = undefined
    }
  }
  const offViews = service.subscribe(syncShadow)
  syncShadow()

  // Selecting a session while a view is active means "back to the chat
  // workspace": close the view so the conversation returns with the picked
  // session. Only the CURRENT id matters — other list churn is ignored.
  let lastCurrent: unknown = ctx.sessions.list.getSnapshot().current
  const offSessions = ctx.sessions.list.subscribe(() => {
    const current = ctx.sessions.list.getSnapshot().current
    if (current === lastCurrent) return
    lastCurrent = current
    if (service.getSnapshot().activeId !== null) service.close()
  })

  ctx.effect(() => () => {
    offViews()
    offSessions()
    disposeShadow?.()
    disposeShadow = undefined
  }, 'dsh-app-views: shadow lifecycle')
}

declare module 'cordis' {
  interface Context {
    /** The app-view registry provided by this plugin (may be absent). */
    appViews?: AppViewsService
  }
}
