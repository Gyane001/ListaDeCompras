// Seletores de elementos do DOM
const itemName = document.getElementById("item-name");
const itemQty = document.getElementById("item-qty");
const itemPrice = document.getElementById("item-price");
const itemList = document.getElementById("item-list");
const totalDisplay = document.getElementById("total");
const languageSelect = document.getElementById("language-select");

// Traduções
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

// Adiciona item à lista
function addItem() {
    const name = itemName.value.trim();
    const qty = parseInt(itemQty.value);
    const price = parseFloat(itemPrice.value);

    if (!name || isNaN(qty) || isNaN(price) || qty <= 0 || price < 0) {
        alert("Preencha todos os campos corretamente.");
        return;
    }

    const totalItem = qty * price;
    const li = document.createElement("li");
    li.innerHTML = `
        ${name} - ${qty} x R$ ${price.toFixed(2)} = R$ ${totalItem.toFixed(2)}
        <span onclick="removeItem(this, ${totalItem})">×</span>
    `;
    itemList.appendChild(li);

    updateTotal(totalItem);

    itemName.value = "";
    itemQty.value = "";
    itemPrice.value = "";
}

// Atualiza o total exibido
function updateTotal(amount) {
    const currentTotal = parseFloat(totalDisplay.dataset.total || "0");
    const newTotal = currentTotal + amount;
    totalDisplay.dataset.total = newTotal;

    const currentLang = languageSelect.value;
    const totalText = translations[currentLang].totalLabel;
    totalDisplay.innerText = `${totalText} ${newTotal.toFixed(2).replace('.', ',')}`;
}

// Remove item da lista e subtrai do total
function removeItem(element, amount) {
    element.parentElement.remove();
    updateTotal(-amount);
}

// Troca de idioma
languageSelect.addEventListener("change", () => {
    const lang = languageSelect.value;
    const dict = translations[lang];

    // Título da aba
    document.querySelector("title").innerText = dict.title;

    // Cabeçalho
    document.querySelector("[data-i18n='heading']").innerText = dict.heading;

    // Botão
    document.querySelector("[data-i18n='add']").innerText = dict.add;

    // Placeholder dos inputs
    itemName.placeholder = dict.item;
    itemQty.placeholder = dict.quantity;
    itemPrice.placeholder = dict.price;

    // Atualiza o rótulo do total
    const total = parseFloat(totalDisplay.dataset.total || "0");
    totalDisplay.innerText = `${dict.totalLabel} ${total.toFixed(2).replace('.', ',')}`;
});