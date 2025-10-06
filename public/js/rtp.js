const socket = io();
const form = document.getElementById("productForm");
const list = document.getElementById("productList");
const errorBox = document.getElementById("error");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  errorBox.textContent = "";

  const thumbs = document.getElementById("thumbnails").value.trim();
  const data = {
    title: document.getElementById("title").value.trim(),
    description: document.getElementById("description").value.trim(),
    code: document.getElementById("code").value.trim(),
    price: Number(document.getElementById("price").value),
    status: document.getElementById("status").checked,
    stock: Number(document.getElementById("stock").value),
    category: document.getElementById("category").value.trim(),
    thumbnails: thumbs ? thumbs.split(",").map(s => s.trim()) : []
  };

  socket.emit("newProduct", data);
  form.reset();
  document.getElementById("status").checked = true;
});

socket.on("formError", (msg) => {
  errorBox.textContent = msg;
});

socket.on("updateProducts", (products) => {
  list.innerHTML = "";
  products.forEach(p => {
    const li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `
      <h3>${p.title} — $${p.price}</h3>
      <p><b>Código:</b> ${p.code} | <b>Stock:</b> ${p.stock} | <b>Estado:</b> ${p.status ? "Activo" : "Inactivo"}</p>
      <p><b>Categoría:</b> ${p.category}</p>
      <p>${p.description}</p>
      <div>${(p.thumbnails||[]).map(u=>`<img class="thumb" src="${u}" alt="thumb">`).join("")}</div>
      <small>ID: ${p.id}</small><br>
      <button data-id="${p.id}">Eliminar</button>
    `;
    list.appendChild(li);
  });
});

list.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = e.target.getAttribute("data-id");
    socket.emit("deleteProduct", id);
  }
});
