import { Application, Router, send } from "https://deno.land/x/oak@v6.4.0/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";
import { Product, Cart } from "../common/types.ts";

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));

const products: Product[] = JSON.parse(Deno.readTextFileSync("./src/common/products.json"));

var cart: Cart = {
    products: [],
    totalPrice: 0,
    count: 0
}

const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const router = new Router();
router
    .get("/api/products", context => {
        context.response.status = 200;
        context.response.body = products;
    })
    .get("/api/product/:id", async context => {
        var id = context.params.id;
        var product = products.filter((product) => product.id == id);
        context.response.status = 200;
        context.response.body = product;
    })
    .get("/api/cart", async context => {
        context.response.status = 200;
        context.response.body = cart;
    })
    .post("/api/addItem", async context => {
        cart = await addItem(context);
        cart = calculateProducts();
        context.response.status = 200;
        context.response.body = cart;
    })
    .post("/api/checkout", async context => {
        var nonValidElements = validateInput(context);
        context.response.status = 200;
        context.response.body = nonValidElements;
    })
    .patch("/api/increase/:id", async context => {
        cart = await increase(context);
        cart = calculateProducts();
        context.response.status = 200;
        context.response.body = cart;
    })
    .patch("/api/decrease/:id", async context => {
        cart = await decrease(context);
        cart = calculateProducts();
        context.response.status = 200;
        context.response.body = cart;
    })
    .delete("/api/clearCart", async context => {
        cart = await clearCart(context);
        cart = calculateProducts();
        context.response.status = 200;
        context.response.body = cart;
    });

app.use(router.routes());

async function addItem(context: any) {
    var product = await context.request.body({ type: "json" }).value;

    if (await context.state.session.get("cart") == undefined) {
        await context.state.session.set("cart", cart);
    }

    cart = await context.state.session.get("cart");

    if (cart.products.find(element => element.id == product.id) == undefined) {
        cart.products.push(product);
    } else {
        var index = cart.products.findIndex((element) => element.id == product.id);
        cart.products[index].amount += 1;
    }

    await context.state.session.set("cart", cart);
    return cart;
}

async function increase(context: any) {
    var id = context.params.id;

    if (await context.state.session.get("cart") == undefined) {
        await context.state.session.set("cart", cart);
    }

    cart = await context.state.session.get("cart");

    var index = cart.products.findIndex((element) => element.id == id);
    if (index >= 0) {
        cart.products[index].amount += 1;
    }

    await context.state.session.set("cart", cart);
    return cart;
}

async function decrease(context: any) {
    var id = context.params.id;

    if (await context.state.session.get("cart") == undefined) {
        await context.state.session.set("cart", cart);
    }

    cart = await context.state.session.get("cart");

    var index = cart.products.findIndex((element) => element.id == id);
    if (index >= 0) {
        if (cart.products[index].amount > 1) {
            cart.products[index].amount -= 1;
        }
        else {
            cart.products.splice(index, 1);
        }
    }

    await context.state.session.set("cart", cart);
    return cart;
}

async function clearCart(context: any) {
    if (await context.state.session.get("cart") == undefined) {
        await context.state.session.set("cart", cart);
    }

    cart = await context.state.session.get("cart");

    cart.products = [];

    await context.state.session.set("cart", cart);
    return cart;
}

async function validateInput(context: any) {
    var values = await context.request.body({ type: "json" }).value;
    var nonValidElements: any = [];

    values.forEach((element: any) => {
        if (element.value === "") {
            nonValidElements = [...nonValidElements, element];
        }

        if (element.name == "email") {
            if (!re.test(String(element.value).toLowerCase())) {
                nonValidElements = [...nonValidElements, element];
            }
        }
    });

    return nonValidElements;
}

function calculateProducts() {
    cart.totalPrice = 0;
    cart.count = 0
    cart.products.forEach(element => {
        if (element.specialOffer != null) {
            cart.totalPrice += element.specialOffer * element.amount;
        } else {
            cart.totalPrice += element.normalPrice * element.amount;
        }
        cart.count += element.amount
    });
    return cart;
}

app.use(async (context) => {
    await send(context, context.request.url.pathname, {
        root: `${Deno.cwd()}/src/frontend`,
        index: "index.html",
    });
});

console.log("Server running on http://localhost:8000");
app.listen({ port: 8000 });

