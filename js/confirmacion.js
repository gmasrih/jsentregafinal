// leer datos de localStorage
const shipAddress = JSON.parse(localStorage.getItem("shipAddress")) || {}
const pymntCardNum = parseInt(JSON.parse(localStorage.getItem("pymntCardNum")) || "")

// crear tarjeta y rellenar con los datos
const container = document.getElementById("confirmationContainer")
container.innerHTML = `
    <h5 class="card-title text-warning text-center">Información de pedido</h5>
    <p><strong>Dirección de envío:</strong></p>
    <ul class="list-unstyled mb-3">
      <li><strong>Calle:</strong> ${shipAddress.calle}</li>
      <li><strong>No. exterior:</strong> ${shipAddress.numExt}</li>
      <li><strong>No. interior:</strong> ${shipAddress.numInt}</li>
      <li><strong>Colonia:</strong> ${shipAddress.colonia}</li>
      <li><strong>CP:</strong> ${shipAddress.cp}</li>
      <li><strong>País:</strong> ${shipAddress.pais}</li>
    </ul>
    <p class="mb-3">
      <strong>Contacto:</strong>
      Teléfono: ${shipAddress.telefono} |
      Email: ${shipAddress.email}
    </p>
    <p><strong>Pago:</strong> **** **** **** ${pymntCardNum}</p>
`

// array de productos
let products = []
// array carrito
let cart = JSON.parse(localStorage.getItem("cart")) || []

fetch("../db/products.json")
.then(response => {
    if (!response.ok) throw new Error("No se pudo cargar products.json")
    return response.json()
})
.then(data => {
    products = data
    renderCart()
})
.catch(error => console.error("Error cargando productos:", error))

// renderizar carrito
function renderCart() {
    const cartData = JSON.parse(localStorage.getItem("cart")) || []
    const cartContainer = document.getElementById("orderSummaryContainer")
    cartContainer.innerHTML = `
            <h5 class="card-title text-warning text-center">Resumen de pedido</h5>`

    if (cartData.length === 0) {
      cartContainer.innerHTML = `<h5 class="mt-3 bg-light">Sin información de pedido</h5>`
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
        <td class="text-end">$ ${monto}</td>`
      tbody.appendChild(row)
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
}

const shoppBtn = document.getElementById("keepShopping")
shoppBtn.addEventListener("click", () => {
    localStorage.clear()
    window.location.href = "../index.html"
})