var product = [];

async function load() {
    await loadProduct();
    getCart();
}

async function loadProduct() {
    var productContainer = document.getElementById("productContainer");

    var productId = new URLSearchParams(window.location.search).get("id");

    var productData = await fetch("/api/product/" + productId)
        .then((response) => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
        });

    productData.forEach(element => {
        product = element;
        productContainer.innerHTML += createProduct(element);
    });
}

function createProduct(element) {
    return `
    <article class="product">
        <img class="productImage" id="product-${element.id}" src="${element.imagePath}" alt="${element.productName}">
        <span class="productTitle">${element.productName}</span>
        <span class="productDescription">${element.description}</span>
        <span class="productPrice">${getPrice(element.normalPrice, true)}</span>
        <span class="productSpecialPrice">${getPrice(element.specialOffer, false)}</span>
        <button class="addButton" onclick="addToCart()">Zum Warenkorb hinzufügen</button>
    </article>
    `
}

function getPrice(price, isStriked) {
    var float = parseFloat(price).toFixed(2);
    var convertedPrice = "CHF " + float;
    if (isStriked) {
        return convertedPrice.strike();
    }
    return convertedPrice;
}

async function addToCart() {
    await fetch("/api/addItem", {
        body: JSON.stringify(product),
        headers: {
            "Content-Type": "application/json",
        },
        method: "POST",
    })

    getCart();
}

async function getCart() {
    var cartAmount = document.getElementById("cartAmount");

    var data = await fetch("/api/cart")
        .then((response) => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
        });

    cartAmount.innerHTML = data.count;
}

function showCart() {
    window.location.href = `/views/cart.html`;
}

function back() {
    window.location.href = `/index.html`;
}
