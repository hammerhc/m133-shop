import { send, Context } from "https://deno.land/x/oak/mod.ts";

export const fileserver = async (context: Context<Record<string, any>>) => {
    await send(
        context,
        context.request.url.pathname,
        { 
            root: `${Deno.cwd()}/src/frontend`,
            index: "view/page1.html"
    });
};