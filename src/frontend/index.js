async function load() {
    await loadProducts();
}

async function loadProducts() {
    var productsContainer = document.getElementById("productsContainer");

    var data = await fetch("/api/products")
        .then((response) => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
        });

    data.forEach(element => {
        productsContainer.innerHTML += createProduct(element);
    });
}

function createProduct(element) {
    return `
    <article class="product" onclick="productClick(event)">
        <img class="productImage" id="product-${element.id}" src="${element.imagePath}" alt="${element.productName}">
        <span class="productTitle">${element.productName}</span>
        <span class="productPrice">${getPrice(element.normalPrice, true)}</span>
        <span class="productSpecialPrice">${getPrice(element.specialOffer, false)}</span>
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

function productClick(event) {
    var id = event.target.id.replace("product-", "");
    window.location.href = `./views/product.html?productId=${id}`;
}