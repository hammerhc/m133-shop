import { Router } from "https://deno.land/x/oak/mod.ts";
import { Session } from "https://deno.land/x/session/mod.ts";
import { Product } from "../common/types.ts";

// Session konfigurieren und starten
const session = new Session({ framework: "oak" });
await session.init();
export const usableSession = session.use()(session);

const products: Product[] = JSON.parse(Deno.readTextFileSync("./src/common/products.json"));

const router = new Router();
router
    .get("/api/products", context => {
        context.response.body = products;
    })
    .get("/api/products/:id", async context => {
        context.response.body = products
            .find(p => p.id == context.params.id);
    });

export const api = router.routes();