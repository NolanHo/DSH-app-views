/**
 * One sidebar footer entry: a compact icon button (rail) or icon+label row
 * (wide) that opens its view. Rendered by the sidebar shell with the
 * `sidebar.footer.action` owner share ({ wide }).
 */
import { createElement, type ReactNode } from 'react'
import type { AppViewDescriptor, AppViewsService } from './types.ts'
import { PREFIX } from './styles.ts'

/** The footer owner share's runtime shape (mirrored in shims). */
interface EntryOwner { wide: boolean }

/**
 * Create the footer entry element for one view.
 * @param descriptor - the view this entry opens.
 * @param service - the active-view state source.
 * @param owner - the sidebar footer owner share.
 * @returns the entry element.
 */
export function SidebarViewEntry({ descriptor, service, owner }: {
  descriptor: AppViewDescriptor
  service: AppViewsService
  owner: unknown
}): ReactNode {
  const { wide } = owner as EntryOwner
  const title = descriptor.title()
  const icon = descriptor.icon?.(16)
  return createElement('button', {
    type: 'button',
    className: wide ? `${PREFIX}-footerEntry` : `${PREFIX}-footerEntryRail`,
    'aria-label': title,
    title,
    onClick: () => { service.open(descriptor.id) },
  }, createElement('span', { className: `${PREFIX}-footerIcon`, 'aria-hidden': 'true' }, icon),
    wide ? createElement('span', null, title) : null)
}
