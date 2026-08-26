/**
 * Cordis context augmentation for the DSH services this plugin injects.
 * A third-party plugin resolves outside the DSH monorepo's single cordis
 * instance, so the upstream augmentations do not reach this Context — the
 * members below mirror the actual runtime shapes.
 */
import type { Context } from 'cordis'

/** One sidebar footer entry's owner share (declared by the sidebar shell). */
export interface FooterActionOwner {
  /** Whether the sidebar renders wide content (false = 56px rail). */
  wide: boolean
}

/** Registration options the slot core accepts (minimal external surface). */
export interface SlotRegisterOptions {
  name: string
  id?: string
  order?: number
  label?: string | (() => string)
  priority?: number
}

/** The slots service face this plugin uses. */
export interface SlotsService {
  register(options: SlotRegisterOptions, component: unknown): () => void
  inject(key: string, callback: () => void): void
}

/** The locale service face this plugin uses (snapshot holds the active id). */
export interface LocaleService {
  register(ns: string, dicts: Record<string, Record<string, string>>): () => void
  getSnapshot(): { active: string }
}

/** The client sessions list face this plugin uses (current-session change). */
export interface SessionsService {
  subscribe(listener: () => void): () => void
  getListSnapshot(): { current: unknown }
}

/** The layout service face (details panel control). */
export interface LayoutService {
  closeDetails(): void
}

declare module 'cordis' {
  interface Context {
    /** The DSH-vendored lifecycle helper (auto-disposes the returned disposer). */
    effect(execute: () => (() => void) | void, label?: string): void
    /** Scoped service injection (the vendored Context member). */
    inject(deps: string[], callback: (ctx: Context) => void): void
    /** Publish a service into the global store (the vendored Context member). */
    provide(name: string, value: unknown): unknown
    /** The UI slot registry (provided by the client runtime). */
    slots: SlotsService
    /** The client locale service (provided by the locale plugin). */
    locale: LocaleService
    /** The client sessions list service (provided by the client runtime). */
    sessions: SessionsService
    /** The layout service (provided by ui-layout). */
    layout: LayoutService
  }
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    effect(execute: () => (() => void) | void, label?: string): void
    inject(deps: string[], callback: (ctx: Context) => void): void
    provide(name: string, value: unknown): unknown
    slots: SlotsService
    locale: LocaleService
    sessions: SessionsService
    layout: LayoutService
  }
}
