/**
 * dsh-app-views browser half: publishes the `appViews` service, registers
 * the full-page overlay layer into the shell's `shell.overlay` slot, and
 * attaches the plugin's locale namespace. The chat workspace stays mounted
 * underneath the layer — switching views never unmounts it.
 */
import type { Context } from 'cordis'
import { createAppViewsService } from './service.ts'
import { AppViewLayer } from './view-layer.tsx'
import { injectStyles } from './styles.ts'
import { attachLocale, en, LOCALE_NS, zh } from './i18n.ts'
import type { AppViewsService } from './types.ts'

export type { AppViewDescriptor, AppViewRenderProps, AppViewsService, AppViewsSnapshot } from './types.ts'

/** Services required before activation. */
export const inject = ['slots', 'locale'] as const

/** Client plugin body (runs once slots and locale are provided). */
export function apply(ctx: Context): void {
  injectStyles()
  attachLocale(ctx.locale)
  ctx.effect(() => {
    const offZh = ctx.locale.register(LOCALE_NS, { zh, en })
    return () => { offZh() }
  }, 'dsh-app-views: dictionaries')

  const service = createAppViewsService(ctx.slots)
  ctx.provide('appViews', service)

  // The overlay layer occupies the shell's overlay list slot (above the
  // frame, below the command palette's z-100 popup). It renders nothing
  // while no view is active, so the default workspace is pixel-identical.
  ctx.effect(
    () => ctx.slots.register({ name: 'shell.overlay', id: 'dsh-app-views', order: 50 }, () => AppViewLayer({ service })),
    'dsh-app-views: overlay layer registration',
  )
}

declare module 'cordis' {
  interface Context {
    /** The app-view registry provided by this plugin (may be absent). */
    appViews?: AppViewsService
  }
}
