# dsh-app-views

DSH plugin: an **app-level view registry** — full-page overlay views over the chat workspace, with sidebar footer entries. The chat workspace (session list + conversation) stays mounted underneath; switching views never unmounts it, so streaming, scroll positions, and fold state survive untouched.

English primary; [中文说明](#中文说明) follows.

## How it works

- The browser half publishes the `appViews` cordis service and registers a full-screen layer into the shell's `shell.overlay` slot. While no view is active the layer renders nothing — the default workspace is pixel-identical.
- Each registered view also gets an entry at the sidebar footer (`sidebar.footer.action`): an icon button on the rail, icon + label when wide. Clicking opens the view; the layer's header has a `返回聊天` / `Back to chat` button, `Escape` closes, and a focus trap keeps `Tab` inside the layer.
- A view crash renders a dismissible error strip instead of a blank page.

## Install (profile)

```jsonc
// ~/.dsh/profiles/<profile>/package.json
"dependencies": {
  "dsh-app-views": "github:NolanHo/DSH-app-views#v0.1.0"
}
```

Then `pnpm install` in the profile directory and restart `dsh web` (plugin-set changes take effect on restart).

## Registering a view (view plugin authors)

Collaborate through the service only — never value-import this package's client half:

```tsx
// In your plugin's browser half:
import type { Context } from 'cordis'

interface AppViewsService {
  registerView(descriptor: {
    id: string
    title: () => string
    icon?: (size: number) => ReactNode
    order?: number
    component: (props: { close: () => void }) => ReactNode
  }): () => void
}

export function apply(ctx: Context): void {
  const appViews = ctx.get('appViews') as AppViewsService | undefined
  if (appViews === undefined) return // view capability absent — stay inert
  ctx.effect(() => appViews.registerView({
    id: 'schedule',
    title: () => '调度',
    component: ({ close }) => <ScheduleView onBack={close} />,
  }))
}
```

View components receive `{ close }`; business data comes from your plugin's own services/inject closures.

## Known limitations

- **Mobile layering**: the layer sits inside the shell's overlay stacking context (z-20), below the mobile drawer (z-32) — opening the drawer on a phone draws over the active view; the floating `Open sidebar` button stays reachable. `Escape` may close both the drawer and the view in one press.
- **Command palette**: the palette popup (z-100) renders above the view layer.
- **Sidebar footer entries** only render while the original sidebar shell is mounted (the chat workspace).

## 中文说明

DSH 插件：应用级视图注册表——覆盖在聊天工作区之上的全页视图，带侧栏底部入口。聊天工作区（会话列表 + 对话区）保持挂载、切换视图不卸载，流式输出、滚动位置、折叠状态均不受影响。注册视图用 `ctx.get('appViews')` 拿服务后调用 `registerView({ id, title, icon, component })`；打开后按 `Escape` 或头部 `返回聊天` 关闭。已知限制见上：手机上抽屉会盖在视图层上方。

## Development

```sh
pnpm install
pnpm run test      # vitest service spec
pnpm run typecheck
pnpm run build     # tsc declarations + tsdown host/client bundles
```
