async function load() {
    await loadTable();
}

async function loadTable() {
    var productTable = document.getElementById("tableBody");
    var cartAmount = document.getElementById("cartAmount");

    productTable.innerHTML = "";

    var data = await fetch("/api/cart")
        .then((response) => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
        });

    cartAmount.innerHTML = data.count;

    data.products.forEach(element => {
        productTable.innerHTML += createProductRow(element);
    });

    productTable.innerHTML += createTotalRow(data);
}

function createProductRow(element) {
    if (element.specialOffer != null) {
        return `
        <tr class="tableRow">
            <td class="columnProduct">${element.productName}</td>
            <td class="columnPrice">        
                <span class="productPrice">${getPrice(element.normalPrice, true)}</span>
                <span class="productSpecialPrice">${getPrice(element.specialOffer, false)}</span>
            </td>
            <td class="columnAmount">
                <button id="decrease${element.id}" onclick="decrease(event)">-</button>
                <span id="productAmount${element.id}">${element.amount}</span>
                <button id="increase${element.id}" onclick="increase(event)">+</button>
            </td>
            <td class="columnTotal">${getPrice(element.specialOffer * element.amount, false)}</td>
        </tr>
        `
    } else {
        return `
        <tr class="tableRow">
            <td class="columnProduct">${element.productName}</td>
            <td class="columnPrice">        
                <span class="productPrice">${getPrice(element.normalPrice, false)}</span>
            </td>
            <td class="columnAmount">
                <button id="decrease${element.id}" onclick="decrease(event)">-</button>
                <span id="productAmount${element.id}">${element.amount}</span>
                <button id="increase${element.id}" onclick="increase(event)">+</button>
            </td>
            <td class="columnTotal">${getPrice(element.normalPrice * element.amount, false)}</td>
        </tr>
        `
    }
}

function createTotalRow(element) {
    return `
    <tr class="tableRowTotal">
        <td colspan="4">${getPrice(element.totalPrice, false)}</td>
    </tr>
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

async function increase(event) {
    var productId = event.target.id.replace("increase", "");

    await fetch("/api/increase/" + productId, {
        method: "PATCH",
    })
        .then((response) => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
        });

    loadTable();
}

async function decrease(event) {
    var productId = event.target.id.replace("decrease", "");

    await fetch("/api/decrease/" + productId, {
        method: "PATCH",
    })
        .then((response) => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
        });

    loadTable();
}

function checkOut() {
    window.location.href = `/views/checkout.html`;
}

function back() {
    window.location.href = `/index.html`;
}
