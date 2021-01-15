function back() {
    window.location.href = `/views/cart.html`;
}

function validate() {
    var messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = "";

    var isValid = true;

    var firstName = document.forms["checkoutForm"]["firstName"];
    var lastName = document.forms["checkoutForm"]["lastName"];
    var email = document.forms["checkoutForm"]["email"];
    var button = document.getElementById("checkoutButton");

    button.disabled = true;

    var elements = [firstName, lastName, email]

    elements.forEach(element => {
        if (element.value === "") {
            createMessage(`Bitte ${element.placeholder} eingeben!`)
            isValid = false;
        } else if (element.validity.typeMismatch) {
            createMessage(`Bitte eine valide ${element.placeholder} eingeben!`)
            isValid = false;
        }
    })

    if (isValid) {
        button.disabled = false;
    }

    return isValid;
}

async function sendValues() {
    var firstName = document.forms["checkoutForm"]["firstName"];
    var lastName = document.forms["checkoutForm"]["lastName"];
    var email = document.forms["checkoutForm"]["email"];

    var isValid = validate();

    values = [
        {
            name: firstName.placeholder, value: firstName.value
        },
        {
            name: lastName.placeholder, value: lastName.value
        },
        {
            name: email.placeholder, value: email.value
        }
    ]

    if (isValid) {
        var data = await fetch("/api/checkout", {
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        })
            .then((response) => response.json())
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error(error);
            });

        if (data.length > 0) {
            data.forEach(element => {
                if (element.value === "") {
                    createMessage(`Bitte ${element.name} eingeben!`)
                    isValid = false;
                } else if (element.value !== "") {
                    createMessage(`Bitte eine valide ${element.name} eingeben!`)
                    isValid = false;
                }
            });
        } else {
            success();
        }
    }
}

function createMessage(message) {
    var messageContainer = document.getElementById("messageContainer");

    messageContainer.innerHTML += `<p class="message">${message}</p>`;
}

function success() {
    fetch("/api/clearCart", {
        method: "DELETE"
    });

    window.location.href = `/views/success.html`;
}