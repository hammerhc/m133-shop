async function load() {
    await loadTable();
}

async function loadTable() {
    var productTable = document.getElementById("productTable");

    var data = await fetch("/api/cart")
        .then((response) => response.json())
        .then(data => {
            return data;
        })
        .catch(error => {
            console.error(error);
        });

    data.products.forEach(element => {
        productTable.innerHTML += createProductRow(element);
    });

    productTable.innerHTML += createTotalRow(data);
}

function createProductRow(element) {
    return `
    <tr class="tableRow">
        <td class="columnProduct">${element.productName}</td>
        <td class="columnPrice">        
            <span class="productPrice">${getPrice(element.normalPrice, true)}</span>
            <span class="productSpecialPrice">${getPrice(element.specialOffer, false)}</span>
        </td>
        <td class="columnAmount">
            <button onclick="removeItem()">-</button>
            ${element.amount}
            <button onclick="addItem()">+</button>
        </td>
        <td class="columnTotal">${getPrice(element.specialOffer * element.amount, false)}</td>
    </tr>
    `
}

function createTotalRow(element) {
    return `
    <tr class="tableRowTotal">
        <td colspan="4">${getPrice(element.totalPrice, true)}</td>
    </tr>
    <tr class="tableRowTotal">
        <td colspan="4">${getPrice(element.totalSpecialPrice, false)}</td>
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

function addItem() {

}

function removeItem() {

}
