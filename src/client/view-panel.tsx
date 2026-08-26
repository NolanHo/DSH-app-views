/**
 * The center display panel: fills the conversation column while an app view
 * is active (the plugin shadows the `conversation` slot, so the sidebar and
 * the rest of the frame never move). Carries the back-to-chat header, an
 * Escape shortcut, a focus trap, and an error boundary so a view crash
 * shows a strip instead of a blank panel.
 */
import { Component, createElement, useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { IconChevronLeftOutline14 } from '@deepseek-ai/dsh-client-ui-primitives'
import type { AppViewsService } from './types.ts'
import { PREFIX } from './styles.ts'
import { t } from './i18n.ts'

/** A view crash keeps the chrome alive: a dismissible strip + back. */
class ViewBoundary extends Component<{ onClose: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true }
  }
  render(): ReactNode {
    if (this.state.failed) {
      return createElement('div', { className: `${PREFIX}-boundary` },
        createElement('p', null, t('viewFailed')),
        createElement('button', { type: 'button', className: `${PREFIX}-back`, onClick: () => { this.props.onClose() } }, t('back')))
    }
    return this.props.children
  }
}

/** Focusable selectors for the Tab trap (buttons/links/form controls only). */
const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * The center display panel (registered as the `conversation` slot's
 * shadow occupant). Renders nothing while no view is active.
 * @param service - the appViews registry.
 * @returns the panel element, or null.
 */
export function AppViewPanel({ service }: { service: AppViewsService }): ReactNode {
  const snapshot = useSyncExternalStore(service.subscribe, service.getSnapshot)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const active = snapshot.views.find(view => view.id === snapshot.activeId)
  const activeId = active?.id

  // Escape closes; Tab cycles inside the panel while a view is open.
  useEffect(() => {
    if (activeId === undefined) return
    panelRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        service.close()
        return
      }
      if (event.key !== 'Tab') return
      const panel = panelRef.current
      if (panel === null) return
      const focusables = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)]
        .filter(el => el.offsetParent !== null || el === document.activeElement)
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const current = document.activeElement
      if (event.shiftKey && (current === first || current === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => { window.removeEventListener('keydown', onKeyDown, true) }
  }, [activeId, service])

  if (active === undefined) return null
  return createElement('div', {
    ref: panelRef,
    className: `${PREFIX}-panel`,
    tabIndex: -1,
    'aria-label': active.title(),
  },
  createElement('header', { className: `${PREFIX}-header` },
    createElement('button', { type: 'button', className: `${PREFIX}-back`, onClick: () => { service.close() } },
      createElement(IconChevronLeftOutline14), t('back')),
    createElement('span', { className: `${PREFIX}-title` },
      active.icon?.(16), active.title())),
  createElement('div', { className: `${PREFIX}-body` },
    createElement(ViewBoundary, { onClose: () => { service.close() }, children: active.component({ close: () => { service.close() } }) })))
}
