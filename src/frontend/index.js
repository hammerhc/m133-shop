function load() {
    loadProducts();
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
    <article class="product">
        <img class="productImage" src="${element.imagePath}" alt="${element.productName}" width="200" height="200">
        <p class="productTitle">${element.productName}</p>
        <p class="productPrice">${getPrice(element.normalPrice, true)}</p>
        <p class="productSpecialPrice">${getPrice(element.specialOffer, false)}</p>
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