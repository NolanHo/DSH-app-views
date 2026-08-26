/**
 * dsh-app-views node half: a no-op host row. The view registry and the
 * overlay layer live entirely in the browser half; the host row exists so
 * the profile Loader resolves the entry and the client-bundle scan
 * (dsh.client) serves lib/client.js at /plugins/dsh-app-views/client.js.
 */
import type { Context } from 'cordis';
/** Plugin identity for cordis rows. */
export declare const name = "dsh-app-views";
/**
 * Host plugin body: nothing to mount on the node side.
 * @param ctx - the host cordis context (unused).
 */
export declare function apply(ctx: Context): void;
