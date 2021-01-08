function load() {
    loadOverview();
}

async function  loadOverview() {
    const response = await fetch("/api/persons");
    const persons  = await response.json();
    
    const list = document.querySelector("ul");
    
    for (const person of persons) {
        list.innerHTML += `
            <li>
                <a href="./view/page2.html?personId=${person.id}">${person.firstName} ${person.lastName}</a>
            </li>
        `;
    }
}