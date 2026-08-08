const MENU = [
  {
    id: "latte",
    name: "House Latte",
    description: "Espresso, steamed milk, light foam",
    category: "coffee",
    price: 4.5,
  },
  {
    id: "americano",
    name: "Americano",
    description: "Espresso stretched with hot water",
    category: "coffee",
    price: 3.25,
  },
  {
    id: "chai",
    name: "Spiced Chai",
    description: "Black tea, cinnamon, cardamom",
    category: "tea",
    price: 4.0,
  },
  {
    id: "matcha",
    name: "Matcha Latte",
    description: "Ceremonial grade, oat milk",
    category: "tea",
    price: 5.25,
  },
  {
    id: "pumpkin",
    name: "Pumpkin Cold Brew",
    description: "Seasonal spice, slow steeped",
    category: "seasonal",
    price: 5.75,
  },
];

const TAX_RATE = 0.08;

const menuList = document.getElementById("menu-list");
const cartList = document.getElementById("cart-list");
const cartEmpty = document.getElementById("cart-empty");
const categoryFilter = document.getElementById("category-filter");
const tipSelect = document.getElementById("tip-select");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const tipEl = document.getElementById("tip");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutMessage = document.getElementById("checkout-message");

/** @type {Array<{ id: string, name: string, price: number, qty: number }>} */
const cart = [];

function formatMoney(amount) {
  return `$${amount.toFixed(2)}`;
}

function getFilteredMenu(category) {
  if (category === "all") return MENU;
  return MENU.filter((item) => item.category === category);
}

function renderMenu() {
  const items = getFilteredMenu(categoryFilter.value);
  menuList.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.className = "menu-item";
    li.innerHTML = `
      <div class="item-copy">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
      <div>
        <div class="price">${formatMoney(item.price)}</div>
        <button type="button" class="add-btn" data-id="${item.id}">Add</button>
      </div>
    `;
    menuList.appendChild(li);
  });
}

function findCartItem(id) {
  return cart.find((item) => item.id === id);
}

function addToCart(id) {
  const menuItem = MENU.find((item) => item.id === id);
  if (!menuItem) return;

  const existing = findCartItem(id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      qty: 1,
    });
  }

  checkoutMessage.hidden = true;
  renderCart();
}

function removeFromCart(id) {
  const index = cart.findIndex((item) => item.id === id);
  if (index === -1) return;
  cart.splice(index, 1);
  renderCart();
}

function calculateSubtotal() {
  // Demo bug: String() turns addition into concatenation after the first item.
  // One drink often looks fine; two or more breaks the total.
  return cart.reduce((sum, item) => sum + String(item.price * item.qty), 0);
}

function renderCart() {
  cartList.innerHTML = "";
  cartEmpty.hidden = cart.length > 0;
  checkoutBtn.disabled = cart.length === 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div class="item-copy">
        <h3>${item.name}</h3>
        <p>Qty ${item.qty} · ${formatMoney(item.price)} each</p>
      </div>
      <button type="button" class="add-btn" data-remove="${item.id}">Remove</button>
    `;
    cartList.appendChild(li);
  });

  const subtotal = calculateSubtotal();
  const numericSubtotal = Number(subtotal);
  const tipRate = Number(tipSelect.value);

  if (Number.isNaN(numericSubtotal)) {
    subtotalEl.textContent = String(subtotal);
    taxEl.textContent = "—";
    tipEl.textContent = "—";
    totalEl.textContent = "—";
    return;
  }

  const tax = numericSubtotal * TAX_RATE;
  const tipAmount = numericSubtotal * tipRate;
  const total = numericSubtotal + tax + tipAmount;

  subtotalEl.textContent = formatMoney(numericSubtotal);
  taxEl.textContent = formatMoney(tax);
  tipEl.textContent = formatMoney(tipAmount);
  totalEl.textContent = formatMoney(total);
}

function checkout() {
  if (cart.length === 0) return;

  const subtotal = Number(calculateSubtotal());
  if (Number.isNaN(subtotal)) {
    checkoutMessage.hidden = false;
    checkoutMessage.textContent =
      "Checkout failed: cart total looks wrong. Try debugging calculateSubtotal().";
    return;
  }

  const tipRate = Number(tipSelect.value);
  const tipAmount = subtotal * tipRate;
  const total = subtotal + subtotal * TAX_RATE + tipAmount;

  checkoutMessage.hidden = false;
  checkoutMessage.textContent = `Order placed for ${formatMoney(
    total
  )}. See you soon!`;
  cart.length = 0;
  renderCart();
}

menuList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  addToCart(button.dataset.id);
});

cartList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-remove]");
  if (!button) return;
  removeFromCart(button.dataset.remove);
});

categoryFilter.addEventListener("change", renderMenu);
tipSelect.addEventListener("change", renderCart);
checkoutBtn.addEventListener("click", checkout);

renderMenu();
renderCart();
