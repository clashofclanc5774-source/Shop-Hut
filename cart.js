// --------------------------
// Load Cart From localStorage
// --------------------------

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Display Products Inside Cart
function loadCart() {
    const container = document.getElementById("cart-items");
    const totalPriceEl = document.getElementById("cart-total");

    container.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        totalPriceEl.textContent = "0";
        return;
    }

    cart.forEach((product, index) => {
        total += product.price;

        const item = document.createElement("div");
        item.classList.add("cart-item");

        item.innerHTML = `
            <img src="${product.image}" class="cart-img" />
            
            <div class="cart-info">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
            </div>

            <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
        `;

        container.appendChild(item);
    });

    totalPriceEl.textContent = total.toFixed(2);
}

// --------------------------
// Remove Item From Cart
// --------------------------
function removeItem(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// --------------------------
// Checkout Button
// --------------------------
document.getElementById("checkout-btn").addEventListener("click", () => {
    alert("Checkout completed! (You can replace this with Firebase orders)");
    cart = [];
    localStorage.removeItem("cart");
    loadCart();
});

// Load cart automatically when page opens
loadCart();