let saldo = 1000;

// Actualiza saldo en pantalla
function actualizarSaldo() {
  document.getElementById("saldo").textContent = saldo.toFixed(2);
}
actualizarSaldo();

// Obtiene la cantidad apostada
function obtenerCantidad() {
  const cantidad = Number(document.getElementById("cantidad").value);
  if (cantidad <= 0 || cantidad > saldo) {
    alert("Cantidad no válida");
    return null;
  }
  return cantidad;
}

// Estadísticas de equipos
const equipoA = { golesMedia: 1.8, amarillasMedia: 2.5, rojasMedia: 0.2, faltasMedia: 12, tirosPuertaMedia: 5 };
const equipoB = { golesMedia: 1.3, amarillasMedia: 3, rojasMedia: 0.3, faltasMedia: 14, tirosPuertaMedia: 4 };

// Genera resultado aleatorio realista
function generarResultado(media) {
  return Math.max(0, Math.round(media + (Math.random() * 2 - 1)));
}

// Resultado 1X2
function resultadoPartido(golesA, golesB) {
  if (golesA > golesB) return "A";
  if (golesA < golesB) return "B";
  return "Empate";
}

// Probabilidades para cuotas
function calcularProbabilidades(equipoA, equipoB) {
  const fuerzaA = equipoA.golesMedia + equipoA.tirosPuertaMedia * 0.3;
  const fuerzaB = equipoB.golesMedia + equipoB.tirosPuertaMedia * 0.3;
  const total = fuerzaA + fuerzaB;
  let probA = fuerzaA / total;
  let probB = fuerzaB / total;
  let probEmpate = 0.25;
  const ajuste = probA + probB + probEmpate;
  probA /= ajuste; probB /= ajuste; probEmpate /= ajuste;
  return { probA, probEmpate, probB };
}

// Convierte probabilidad a cuota
function probabilidadACuota(probabilidad) {
  const margen = 0.07;
  return Number(1 / (probabilidad * (1 - margen))).toFixed(2);
}

// Cuotas 1X2
function generarCuotas1X2(equipoA, equipoB) {
  const { probA, probEmpate, probB } = calcularProbabilidades(equipoA, equipoB);
  return { A: probabilidadACuota(probA), Empate: probabilidadACuota(probEmpate), B: probabilidadACuota(probB) };
}

// Cuotas para números (goles, tarjetas, faltas, tiros)
function cuotaNumero(media, elegido) {
  const diferencia = Math.abs(media - elegido);
  const prob = Math.max(0.1, 1 - diferencia * 0.25);
  return probabilidadACuota(prob);
}

// Función que confirma todas las apuestas
function confirmarApuesta() {
  const cantidad = obtenerCantidad();
  if (!cantidad) return;

  // Tomar elecciones del usuario
  const resultadoElegido = document.getElementById("resultadoElegido").value;
  const golesElegidos = Number(document.getElementById("golesElegidos").value);
  const amarillasElegidas = Number(document.getElementById("amarillasElegidas").value);
  const rojasElegidas = Number(document.getElementById("rojasElegidas").value);
  const faltasElegidas = Number(document.getElementById("faltasElegidas").value);
  const tirosElegidos = Number(document.getElementById("tirosElegidos").value);

  // Generar resultados reales
  const golesA = generarResultado(equipoA.golesMedia);
  const golesB = generarResultado(equipoB.golesMedia);
  const resultadoReal = resultadoPartido(golesA, golesB);

  const golesTotales = golesA + golesB;
  const amarillasTotales = generarResultado(equipoA.amarillasMedia) + generarResultado(equipoB.amarillasMedia);
  const rojasTotales = generarResultado(equipoA.rojasMedia) + generarResultado(equipoB.rojasMedia);
  const faltasTotales = generarResultado(equipoA.faltasMedia) + generarResultado(equipoB.faltasMedia);
  const tirosTotales = generarResultado(equipoA.tirosPuertaMedia) + generarResultado(equipoB.tirosPuertaMedia);

  // Calcular ganancias/pérdidas
  let mensaje = "";
  let totalGanado = 0;

  const cuotas1X2 = generarCuotas1X2(equipoA, equipoB);
  if (resultadoElegido === resultadoReal) {
    const ganancia = cantidad * cuotas1X2[resultadoElegido];
    totalGanado += ganancia;
    mensaje += `✅ Resultado 1X2 correcto! Ganaste ${ganancia.toFixed(2)}€\n`;
  } else mensaje += `❌ Resultado 1X2 incorrecto. Real: ${resultadoReal}\n`;

  // Goles
  const cuotaG = cuotaNumero(equipoA.golesMedia + equipoB.golesMedia, golesElegidos);
  if (golesElegidos === golesTotales) {
    const ganancia = cantidad * cuotaG;
    totalGanado += ganancia;
    mensaje += `✅ Goles correctos! Ganaste ${ganancia.toFixed(2)}€\n`;
  } else mensaje += `❌ Goles incorrectos. Real: ${golesTotales}\n`;

  // Amarillas
  const cuotaA = cuotaNumero(equipoA.amarillasMedia + equipoB.amarillasMedia, amarillasElegidas);
  if (amarillasElegidas === amarillasTotales) {
    const ganancia = cantidad * cuotaA;
    totalGanado += ganancia;
    mensaje += `✅ Amarillas correctas! Ganaste ${ganancia.toFixed(2)}€\n`;
  } else mensaje += `❌ Amarillas incorrectas. Real: ${amarillasTotales}\n`;

  // Rojas
  const cuotaR = cuotaNumero(equipoA.rojasMedia + equipoB.rojasMedia, rojasElegidas);
  if (rojasElegidas === rojasTotales) {
    const ganancia = cantidad * cuotaR;
    totalGanado += ganancia;
    mensaje += `✅ Rojas correctas! Ganaste ${ganancia.toFixed(2)}€\n`;
  } else mensaje += `❌ Rojas incorrectas. Real: ${rojasTotales}\n`;

  // Faltas
  const cuotaF = cuotaNumero(equipoA.faltasMedia + equipoB.faltasMedia, faltasElegidas);
  if (faltasElegidas === faltasTotales) {
    const ganancia = cantidad * cuotaF;
    totalGanado += ganancia;
    mensaje += `✅ Faltas correctas! Ganaste ${ganancia.toFixed(2)}€\n`;
  } else mensaje += `❌ Faltas incorrectas. Real: ${faltasTotales}\n`;

  // Tiros
  const cuotaT = cuotaNumero(equipoA.tirosPuertaMedia + equipoB.tirosPuertaMedia, tirosElegidos);
  if (tirosElegidos === tirosTotales) {
    const ganancia = cantidad * cuotaT;
    totalGanado += ganancia;
    mensaje += `✅ Tiros correctos! Ganaste ${ganancia.toFixed(2)}€\n`;
  } else mensaje += `❌ Tiros incorrectos. Real: ${tirosTotales}\n`;

  // Actualizar saldo
  saldo -= cantidad; // quitar cantidad apostada inicial
  saldo += totalGanado; // sumar ganancias
  actualizarSaldo();

  alert(mensaje + `\nSaldo final: ${saldo.toFixed(2)}€`);
}
