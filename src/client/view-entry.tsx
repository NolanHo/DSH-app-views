/**
 * The sidebar "apps" nav block: ONE footer entry rendering every registered
 * view as a vertically stacked row (icon + label when wide, centered icons
 * on the rail). A single entry keeps the layout owned by this plugin — the
 * shell's horizontal footer container renders exactly one full-width child.
 */
import { createElement, useSyncExternalStore, type ReactNode } from 'react'
import type { AppViewDescriptor, AppViewsService } from './types.ts'
import { PREFIX } from './styles.ts'
import { t } from './i18n.ts'

/** The footer owner share's runtime shape (mirrored in shims). */
interface EntryOwner { wide: boolean }

/** One nav row (wide) or icon cell (rail). */
function NavButton({ descriptor, service, wide }: {
  descriptor: AppViewDescriptor
  service: AppViewsService
  wide: boolean
}): ReactNode {
  const title = descriptor.title()
  const icon = descriptor.icon?.(16)
  return createElement('button', {
    type: 'button',
    className: wide ? `${PREFIX}-navItem` : `${PREFIX}-navItemRail`,
    'aria-label': title,
    title,
    onClick: () => { service.open(descriptor.id) },
  }, createElement('span', { className: `${PREFIX}-navIcon`, 'aria-hidden': 'true' }, icon),
    wide ? createElement('span', { className: `${PREFIX}-navLabel` }, title) : null)
}

/**
 * The footer nav block for all registered views (sorted by order).
 * @param service - the appViews registry.
 * @param owner - the sidebar footer owner share.
 * @returns the nav block, or null while no view is registered.
 */
export function SidebarViewsNav({ service, owner }: {
  service: AppViewsService
  owner: unknown
}): ReactNode {
  const { wide } = owner as EntryOwner
  const snapshot = useSyncExternalStore(service.subscribe, service.getSnapshot)
  if (snapshot.views.length === 0) return null
  const sorted = [...snapshot.views].sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
  return createElement('div', { className: wide ? `${PREFIX}-nav` : `${PREFIX}-navRail` },
    wide ? createElement('div', { className: `${PREFIX}-navTitle` }, t('views')) : null,
    ...sorted.map(descriptor => createElement(NavButton, { key: descriptor.id, descriptor, service, wide })))
}
