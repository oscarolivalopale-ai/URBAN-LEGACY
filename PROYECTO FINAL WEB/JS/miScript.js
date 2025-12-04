// ----------------------------------------------------------
// MANEJO DE CUENTAS (REGISTRO + LOGIN)
// ----------------------------------------------------------

document.addEventListener("DOMContentLoaded", inicio);

function inicio() {
    document.querySelector(".formulario").addEventListener("submit", iniciarSesion);

    // Mostrar catálogo público siempre
    mostrarCatalogoPublico();

    // Ocultar zona privada al inicio
    document.querySelector(".zona-usuario").style.display = "none";
}


function iniciarSesion(e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("contrasena").value;

    let cuentas = JSON.parse(localStorage.getItem("cuentas")) || [];

    // Buscar coincidencia
    let logueado = false;
    cuentas.forEach(c => {
        if (c.usuario === usuario && c.contrasena === contrasena) {
            logueado = true;
        }
    });

    if (logueado) {
        alert("Inicio de sesión correcto");
        mostrarZonaPrivada();
    } else {
        alert("Usuario no encontrado, registrando...");

        // Registrar cuenta nueva
        const cuenta = { usuario, contrasena };
        cuentas.push(cuenta);
        localStorage.setItem("cuentas", JSON.stringify(cuentas));

        alert("Ya puedes iniciar sesión");
    }
}


function mostrarZonaPrivada() {
    document.querySelector(".zona-usuario").style.display = "block";

    // Si el HTML incluye tabla admin, mostrarla
    if (document.getElementById("listaProductosAdm")) {
        mostrarCatalogoAdmin();
    }
}


// ----------------------------------------------------------
// CRUD DEL CATÁLOGO (MISMO ESTILO QUE TU CÓDIGO ORIGINAL)
// ----------------------------------------------------------

let productoEditado = null;

// GUARDAR PRODUCTO
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("btnGuardarProd")) {
        document.getElementById("btnGuardarProd").addEventListener("click", registrarProducto);
    }

    if (document.getElementById("btnActualizarProd")) {
        document.getElementById("btnActualizarProd").addEventListener("click", actualizarProducto);
    }
});


function registrarProducto() {
    const nombre = document.getElementById("prodNombre").value;
    const precio = document.getElementById("prodPrecio").value;

    const producto = { nombre, precio };

    let catalogo = JSON.parse(localStorage.getItem("catalogo")) || [];
    catalogo.push(producto);

    localStorage.setItem("catalogo", JSON.stringify(catalogo));

    mostrarCatalogoAdmin();
    mostrarCatalogoPublico();
}


// MOSTRAR CATALOGO PARA ADMIN
function mostrarCatalogoAdmin() {
    const lista = document.getElementById("listaProductosAdm");
    if (!lista) return;

    const catalogo = JSON.parse(localStorage.getItem("catalogo")) || [];

    let tabla = `
    <table border="1">
        <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th></th>
            <th></th>
        </tr>
    `;

    catalogo.forEach((p, index) => {
        tabla += `
        <tr>
            <td>${p.nombre}</td>
            <td>${p.precio}</td>
            <td><input type="button" value="Seleccionar" onclick="editarProducto(${index})"></td>
            <td><input type="button" value="Eliminar" onclick="borrarProducto(${index})"></td>
        </tr>`;
    });

    tabla += `</table>`;

    lista.innerHTML = tabla;
}


// EDITAR PRODUCTO
function editarProducto(index) {
    const catalogo = JSON.parse(localStorage.getItem("catalogo")) || [];
    const producto = catalogo[index];

    document.getElementById("prodNombre").value = producto.nombre;
    document.getElementById("prodPrecio").value = producto.precio;

    productoEditado = index;

    document.getElementById("btnGuardarProd").style.display = "none";
}


// ACTUALIZAR PRODUCTO
function actualizarProducto() {
    if (productoEditado === null) {
        alert("No hay producto seleccionado.");
        return;
    }

    const nombre = document.getElementById("prodNombre").value;
    const precio = document.getElementById("prodPrecio").value;

    let catalogo = JSON.parse(localStorage.getItem("catalogo")) || [];
    catalogo[productoEditado] = { nombre, precio };

    localStorage.setItem("catalogo", JSON.stringify(catalogo));

    productoEditado = null;

    document.getElementById("btnGuardarProd").style.display = "inline-block";

    mostrarCatalogoAdmin();
    mostrarCatalogoPublico();
}


// BORRAR PRODUCTO
function borrarProducto(index) {
    let catalogo = JSON.parse(localStorage.getItem("catalogo")) || [];

    catalogo.splice(index, 1);
    localStorage.setItem("catalogo", JSON.stringify(catalogo));

    mostrarCatalogoAdmin();
    mostrarCatalogoPublico();
}



// ----------------------------------------------------------
// CATALOGO PUBLICO
// ----------------------------------------------------------

function mostrarCatalogoPublico() {
    const lista = document.getElementById("listaProductosPublico");
    if (!lista) return;

    const catalogo = JSON.parse(localStorage.getItem("catalogo")) || [];

    let html = "<ul>";

    catalogo.forEach(p => {
        html += `<li>${p.nombre} - $${p.precio}</li>`;
    });

    html += "</ul>";

    lista.innerHTML = html;
}
