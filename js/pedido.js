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
    const cartContainer = document.getElementById("orderInfoContainer")
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

// obtiene la tarjeta valida desde el json
let validCard = {}

fetch("../db/card.json")
.then(response => {
    if (!response.ok) throw new Error("No se pudo cargar card.json")
    return response.json()
})
.then(data => {
    validCard = data
})
.catch(error => console.error("Error cargando tarjeta:", error))

document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault()

  // dirección de envío
  const shipAddress = {
    calle: document.getElementById("ship-calle").value.trim(),
    numExt: document.getElementById("ship-numext").value.trim(),
    numInt: document.getElementById("ship-numint").value.trim(),
    colonia: document.getElementById("ship-colonia").value.trim(),
    cp: document.getElementById("ship-cp").value.trim(),
    pais: document.getElementById("ship-pais").value,
    email: document.getElementById("ship-email").value.trim(),
    telefono: document.getElementById("ship-tel").value.trim()
  }

  // datos de tarjeta del pedido
  const orderCard = {
    name: document.getElementById("pay-nombre").value.trim(),
    cardNum: parseInt(document.getElementById("pay-numtarjeta").value.trim()),
    cp: parseInt(document.getElementById("pay-cp").value.trim()),
    cvv: parseInt(document.getElementById("pay-cvv").value.trim())
  }

  // alerta validando pago
  Swal.fire({
    didOpen: () => Swal.showLoading(),
    title: "Validando pago",
    showConfirmButton: false,
    timer: 1500,
    allowOutsideClick: false
    })

  //validación tajeta de crédito           
  .then(() => {
    try {
      if (validCard.cardNum === orderCard.cardNum && validCard.cp === orderCard.cp && validCard.cvv === orderCard.cvv) {
        Swal.fire({
          icon: "success",
          title: "¡Pago exitoso!",
          text: "Se ha completado tu pedido",
          showConfirmButton: false,
          timer: 1500,
          allowOutsideClick: false,
        })
        
        .then(() => {
        const pymntCardNum = orderCard.cardNum.toString().slice(-4)
        localStorage.setItem("shipAddress", JSON.stringify(shipAddress))
        localStorage.setItem("pymntCardNum", JSON.stringify(pymntCardNum))
        window.location.href = "confirmacion.html"
        })
      } else {
        throw new Error("Tarjeta inválida, intenta de nuevo")
        }
    } catch (err) {
        Swal.fire({
          icon: "error",
          titleText: err.message,
          confirmButtonText:"Regresar",
          confirmButtonColor: "#0D6EFD"
        })
      }
  })
})


