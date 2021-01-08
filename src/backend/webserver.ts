import { Application } from "https://deno.land/x/oak/mod.ts";
import { api, usableSession } from "./api.ts";
import { fileserver } from "./fileserver.ts";

const app = new Application();

app.use(usableSession);
app.use(api);
app.use(fileserver);

console.log("Server running on http://localhost:8000");
app.listen({ port: 8000 });

