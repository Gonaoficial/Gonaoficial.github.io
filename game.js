let dinero = 1000;

function apostar() {
  const cantidad = Number(document.getElementById("cantidad").value);
  const resultadoTexto = document.getElementById("resultado");

  if (cantidad <= 0 || isNaN(cantidad)) {
    resultadoTexto.textContent = "Introduce una cantidad válida";
    return;
  }

  if (cantidad > dinero) {
    resultadoTexto.textContent = "No tienes suficiente dinero";
    return;
  }

  const gana = Math.random() < 0.5;

  if (gana) {
    dinero += cantidad;
    resultadoTexto.textContent = "Has ganado";
  } else {
    dinero -= cantidad;
    resultadoTexto.textContent = "Has perdido";
  }

  document.getElementById("dinero").textContent = dinero;
}
