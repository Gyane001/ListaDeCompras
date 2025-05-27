// Seletores de elementos do DOM
const itemName = document.getElementById("item-name");
const itemQty = document.getElementById("item-qty");
const itemPrice = document.getElementById("item-price");
const itemList = document.getElementById("item-list");
const totalDisplay = document.getElementById("total");
const languageSelect = document.getElementById("language-select");

const translations = {
    pt: {
        title: "Lista de Compras",
        heading: "🛒 Lista de Compras 🛒",
        item: "Item",
        quantity: "Quantidade",
        price: "Preço (R$)",
        add: "Adicionar",
        totalLabel: "Total: R$"
    },
    en: {
        title: "Grocery List",
        heading: "🛒 Grocery List 🛒",
        item: "Item",
        quantity: "Quantity",
        price: "Price ($)",
        add: "Add",
        totalLabel: "Total: $"
    }
};

// Carrega itens salvos ao abrir a página
window.addEventListener("load", loadSavedItems);

function addItem() {
    const name = itemName.value.trim();
    const qty = parseInt(itemQty.value);
    const price = parseFloat(itemPrice.value);

    if (!name || isNaN(qty) || isNaN(price) || qty <= 0 || price < 0) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const totalItem = qty * price;

    const item = {
        name,
        qty,
        price,
        totalItem
    };

    appendItemToList(item);
    updateTotal(totalItem);
    saveItem(item);

    itemName.value = "";
    itemQty.value = "";
    itemPrice.value = "";
}

function appendItemToList(item) {
    const li = document.createElement("li");
    li.innerHTML = `
        ${item.name} - ${item.qty} x R$ ${item.price.toFixed(2)} = R$ ${item.totalItem.toFixed(2)}
        <span onclick="removeItem(this, ${item.totalItem}, '${item.name}')">×</span>
    `;
    itemList.appendChild(li);
}

function updateTotal(amount) {
    const currentTotal = parseFloat(totalDisplay.dataset.total || "0");
    const newTotal = currentTotal + amount;
    totalDisplay.dataset.total = newTotal;

    const currentLang = languageSelect.value;
    const totalText = translations[currentLang].totalLabel;
    totalDisplay.innerText = `${totalText} ${newTotal.toFixed(2).replace('.', ',')}`;

    localStorage.setItem("total", newTotal);
}

function removeItem(element, amount, itemNameToRemove) {
    element.parentElement.remove();
    updateTotal(-amount);
    removeItemFromStorage(itemNameToRemove);
}

function saveItem(item) {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    items.push(item);
    localStorage.setItem("items", JSON.stringify(items));
}

function removeItemFromStorage(name) {
    let items = JSON.parse(localStorage.getItem("items")) || [];
    items = items.filter(item => item.name !== name);
    localStorage.setItem("items", JSON.stringify(items));
}

function loadSavedItems() {
    const items = JSON.parse(localStorage.getItem("items")) || [];
    const total = parseFloat(localStorage.getItem("total") || "0");

    items.forEach(item => appendItemToList(item));
    totalDisplay.dataset.total = total;

    const currentLang = languageSelect.value;
    totalDisplay.innerText = `${translations[currentLang].totalLabel} ${total.toFixed(2).replace('.', ',')}`;
}

// Troca de idioma
languageSelect.addEventListener("change", () => {
    const lang = languageSelect.value;
    const dict = translations[lang];

    document.querySelector("title").innerText = dict.title;
    document.querySelector("[data-i18n='heading']").innerText = dict.heading;
    document.querySelector("[data-i18n='add']").innerText = dict.add;

    itemName.placeholder = dict.item;
    itemQty.placeholder = dict.quantity;
    itemPrice.placeholder = dict.price;

    const total = parseFloat(totalDisplay.dataset.total || "0");
    totalDisplay.innerText = `${dict.totalLabel} ${total.toFixed(2).replace('.', ',')}`;
});
