// array de productos
let products = []
// array carrito
let cart = JSON.parse(localStorage.getItem("cart")) || []

fetch("db/products.json")
.then(response => {
    if (!response.ok) throw new Error("No se pudo cargar products.json")
    return response.json()
})
.then(data => {
    products = data
    renderProducts()
    renderCart()
})
.catch(error => console.error("Error cargando productos:", error))


// renderizar productos
const productContainer = document.getElementById("productsContainer")
function renderProducts() {
    productContainer.innerHTML = ""
    products.forEach(product => {
        const card = document.createElement("div")
        card.className = "card mb-2"
        card.innerHTML = `<div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text">Precio: <strong>$ ${product.price} USD</strong></p>
                            <div class="mb-2">
                                <label for="qty-${product.productId}" class="form-label me-2 mb-0">Cantidad:</label>
                                <input type="number" id="qty-${product.productId}" class="form-control form-control-sm d-inline-block w-25" value="1" min="1" required>
                                <button type="button" class="btn btn-warning btn-sm text-white  addToCartBtn">Agregar</button>
                            </div>
                        </div>`
        productContainer.appendChild(card)

        const btn = card.querySelector(".addToCartBtn")
        btn.addEventListener("click", () => {
            const qtyInput = card.querySelector(`#qty-${product.productId}`)
            const productQty = parseInt(qtyInput.value)
            if (isNaN(productQty) || productQty < 1){
                Swal.fire({
                icon: "warning",
                iconColor: "#FFC107",
                titleText: "Error",
                text: "La cantidad debe de ser mayor a 0",
                confirmButtonColor: "#BB2D3B"
                });
            } else {
            addToCart(product.productId, productQty)
            qtyInput.value = 1
            }
        })
    })
}

function removeFromCart(productId){
    const delProdId = Number(productId)
    cart = cart.filter(product => product.productId !== delProdId)
    localStorage.setItem("cart",JSON.stringify(cart))
    renderCart()
}

// renderizar carrito
function renderCart() {
    const cartData = JSON.parse(localStorage.getItem("cart")) || []
    const cartContainer = document.getElementById("cartItemsContainer")
    cartContainer.innerHTML = ""
  
    if (cartData.length === 0) {
      cartContainer.innerHTML = `<h5 class="mt-3 bg-light">El carrito está vacío.</h5>`
      return
    }
  
    const table = document.createElement("table")
    table.className = "table table-sm table-striped"
    let subTotal = 0
  
    table.innerHTML = `
      <thead>
        <tr>
          <th>Producto</th>
          <th class="text-center">Cantidad</th>
          <th class="text-end">Precio U.</th>
          <th class="text-end">Monto</th>
          <th class="text-center"></th>
        </tr>
      </thead>
      <tbody id="cartTableBody"></tbody>
    `
  
    const tbody = table.querySelector("#cartTableBody")
  
    cartData.forEach(product => {
      const prod = products.find(p => p.productId === product.productId)
      const monto = prod.price * product.qty
      subTotal += monto
  
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${prod.name}</td>
        <td class="text-center">${product.qty}</td>
        <td class="text-end">$ ${prod.price}</td>
        <td class="text-end">$ ${monto}</td>
        <td class="text-center text-danger"><i class="bi bi-trash delProdBtn" data-product-id="${prod.productId}"></i></td>
      `
      tbody.appendChild(row)

      const delBtn = row.querySelector(".delProdBtn")
        delBtn.addEventListener("click", () => {
        removeFromCart(delBtn.dataset.productId)
        })
    })
  
    cartContainer.appendChild(table)
  
    const subTotalDiv = document.createElement("div")
    subTotalDiv.className = "mt-2 text-end"
    const subTotalTag = document.createElement("span")
    subTotalTag.className = "fw-bold mb-0"
    subTotalTag.textContent = `Subtotal: $ ${subTotal.toFixed(2)} USD`
    subTotalDiv.appendChild(subTotalTag)
    cartContainer.appendChild(subTotalDiv)

    let impuestos = subTotal * .21
    const impuestosDiv = document.createElement("div")
    impuestosDiv.className = "mt-0 text-end"
    const impuestosTag = document.createElement("span")
    impuestosTag.className = "mb-0"
    impuestosTag.textContent = `Impuestos: $ ${impuestos.toFixed(2)} USD`
    impuestosDiv.appendChild(impuestosTag)
    cartContainer.appendChild(impuestosDiv)
    
    let total = subTotal + impuestos
    const totalDiv = document.createElement("div")
    totalDiv.className = "mt-0 text-end"
    const totalTag = document.createElement("span")
    totalTag.className = "fw-bold mb-0"
    totalTag.textContent = `Total: $ ${total.toFixed(2)} USD`
    totalDiv.appendChild(totalTag)
    cartContainer.appendChild(totalDiv)

    // Botón Comprar
    const buyLink = document.createElement("a")
    buyLink.href = "pages/pedido.html"
    const buyBtn = document.createElement("button")
    buyBtn.id = "buyBtn"
    buyBtn.className = "btn btn-warning w-100 mt-3"
    buyBtn.textContent = "Comprar"
    buyLink.appendChild(buyBtn)
    cartContainer.appendChild(buyLink)
}
  
// agregar al carrito
function addToCart(productId,qty) {
    const existingProduct = cart.find(product => product.productId === productId)

    if(existingProduct) {
        existingProduct.qty += qty
    } else {
        const newCartAdd = {productId,qty}
        cart.push(newCartAdd)
        }
    localStorage.setItem("cart",JSON.stringify(cart))
    renderCart()
}

//vaciar carrito
const emptyCartBtn = document.getElementById("emptyCartBtn")
emptyCartBtn.addEventListener("click",emptyCart)

function emptyCart() {
    localStorage.removeItem("cart")
    cart.length = 0
    localStorage.setItem("cart",JSON.stringify(cart))
    renderCart()
}

buyBtn.addEventListener("click",{

})