import { Router } from "https://deno.land/x/oak@v6.4.0/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";
import { Person } from "../common/types.ts";

// Session konfigurieren und starten
const session = new Session({ framework: "oak" });
await session.init();
export const usableSession = session.use()(session);

const persons: Person[] = [
    { id: "p01", firstName: "Hans", lastName: "Maulwurf" }
];

const router = new Router();
router
    .get("/api/persons", cxt => {
        cxt.response.body = persons;
    })
    .get("/api/persons/:id", async ctx => {
        ctx.response.body = persons
            .find(p => p.id == ctx.params.id);
    });

export const api = router.routes();