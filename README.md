# dsh-app-views

DSH plugin: an **app-level view registry** — swaps the **center display area** of the web GUI between the chat workspace and registered views. The left sidebar (session list + view entries) and the frame chrome never move: click a view entry in the sidebar footer, the center column shows the view; click a session (or the view's `返回聊天` / `Back to chat` button, or `Escape`) and the center column returns to the chat workspace.

English primary; [中文说明](#中文说明) follows.

## How it works

- The browser half publishes the `appViews` cordis service. Each registered view also gets an entry at the sidebar footer (`sidebar.footer.action`): an icon button on the rail, icon + label when wide.
- While a view is active, the plugin registers a priority `-10` shadow of the `conversation` slot — the center column renders the view panel (header with back button + scrollable body). Disposing the shadow returns the original conversation occupant. The sidebar and frame stay mounted the whole time.
- Selecting a session in the sidebar while a view is active closes the view (back to the chat workspace with the picked session). Opening a view closes the details panel first.
- `Escape` closes the active view; a focus trap keeps `Tab` inside the panel; a view crash renders a dismissible error strip instead of a blank panel.

## Install (profile)

```jsonc
// ~/.dsh/profiles/<profile>/package.json
"dependencies": {
  "dsh-app-views": "github:NolanHo/DSH-app-views#v0.1.1"
},
"dsh": {
  "profile": {
    "bundles": ["…", "dsh-app-views", "…"] // the bundle list is explicit — add it
  }
}
```

Then `pnpm install` in the profile directory and restart `dsh web` (plugin-set changes take effect on restart), and hard-refresh the browser page.

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

- **The conversation column unmounts while a view is active** (the shadow replaces the occupant). Chat data is safe — it lives in the runtime object layer and the per-session chat store (scroll position, fold state, drafts), and streaming continues host-side — but the transcript DOM rebuilds on return.
- **Details panel**: closed automatically when a view opens; reopening it while the view is active shows it beside the panel (desktop) or as the mobile sheet.
- **Mobile drawer**: the frame-owned drawer still overlays the center panel (by design — the sidebar is the persistent navigation).
- **Command palette** (`z-100`) renders above the panel.

## 中文说明

DSH 插件：应用级视图注册表——只切换 web GUI 的**中间展示区**。左侧栏（会话列表 + 视图入口）与框架不动：点侧栏底部的视图入口，中间列切换为该视图；点会话（或视图头部 `返回聊天`、按 `Escape`）即切回聊天工作区。视图作者用 `ctx.get('appViews')` 拿服务后调用 `registerView({ id, title, icon, component })`。已知限制见上：视图激活期间对话列会卸载（状态存于 chat store，切回自动恢复）；手机上抽屉仍会盖在面板之上（侧栏是常驻导航）。

## Development

```sh
pnpm install
pnpm run test      # vitest service spec
pnpm run typecheck
pnpm run build     # tsc declarations + tsdown host/client bundles
```
