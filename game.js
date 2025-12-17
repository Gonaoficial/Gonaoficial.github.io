// 💰 SALDO Y UTILIDADES
let saldo = 1000;

function actualizarSaldo() {
  document.getElementById("saldo").textContent = saldo.toFixed(2);
}

actualizarSaldo();

function obtenerCantidad() {
  const cantidad = Number(document.getElementById("cantidad").value);
  if (cantidad <= 0 || cantidad > saldo) {
    alert("Cantidad no válida");
    return null;
  }
  return cantidad;
}

// 📊 ESTADÍSTICAS DE EQUIPOS
const equipoA = {
  nombre: "Equipo A",
  golesMedia: 1.8,
  amarillasMedia: 2.5,
  rojasMedia: 0.2,
  faltasMedia: 12,
  tirosPuertaMedia: 5
};

const equipoB = {
  nombre: "Equipo B",
  golesMedia: 1.3,
  amarillasMedia: 3,
  rojasMedia: 0.3,
  faltasMedia: 14,
  tirosPuertaMedia: 4
};

// 🎲 GENERADOR DE RESULTADOS REALISTAS
function generarResultado(media) {
  return Math.max(0, Math.round(media + (Math.random() * 2 - 1)));
}

// 🏁 RESULTADO DEL PARTIDO
function resultadoPartido(golesA, golesB) {
  if (golesA > golesB) return "A";
  if (golesA < golesB) return "B";
  return "Empate";
}

// 🧠 PROBABILIDADES (BASE CASAS DE APUESTAS)
function calcularProbabilidades(equipoA, equipoB) {
  const fuerzaA = equipoA.golesMedia + equipoA.tirosPuertaMedia * 0.3;
  const fuerzaB = equipoB.golesMedia + equipoB.tirosPuertaMedia * 0.3;

  const total = fuerzaA + fuerzaB;

  let probA = fuerzaA / total;
  let probB = fuerzaB / total;
  let probEmpate = 0.25;

  const ajuste = probA + probB + probEmpate;
  probA /= ajuste;
  probB /= ajuste;
  probEmpate /= ajuste;

  return { probA, probEmpate, probB };
}

// 💸 CONVERSIÓN PROBABILIDAD → CUOTA (CON MARGEN)
function probabilidadACuota(probabilidad) {
  const margen = 0.07;
  return Number(1 / (probabilidad * (1 - margen))).toFixed(2);
}

// 📈 CUOTAS 1X2
function generarCuotas1X2(equipoA, equipoB) {
  const { probA, probEmpate, probB } =
    calcularProbabilidades(equipoA, equipoB);

  return {
    A: probabilidadACuota(probA),
    Empate: probabilidadACuota(probEmpate),
    B: probabilidadACuota(probB)
  };
}

// 🧮 RESOLVER APUESTA
function resolverApuesta(eleccion, cuota, resultado, cantidad) {
  if (eleccion === resultado) {
    saldo += cantidad * cuota;
    alert("¡Has ganado!");
  } else {
    saldo -= cantidad;
    alert("Has perdido");
  }
  actualizarSaldo();
}

// 🏆 APOSTA 1X2
function apostar1X2(eleccion) {
  const cantidad = obtenerCantidad();
  if (!cantidad) return;

  const cuotas = generarCuotas1X2(equipoA, equipoB);

  const golesA = generarResultado(equipoA.golesMedia);
  const golesB = generarResultado(equipoB.golesMedia);

  const resultado = resultadoPartido(golesA, golesB);

  resolverApuesta(eleccion, cuotas[eleccion], resultado, cantidad);
}

// ⚽ GOLES TOTALES
function cuotaGoles(golesEsperados, golesElegidos) {
  const diferencia = Math.abs(golesEsperados - golesElegidos);
  const prob = Math.max(0.1, 1 - diferencia * 0.25);
  return probabilidadACuota(prob);
}

function apostarGoles() {
  const cantidad = obtenerCantidad();
  if (!cantidad) return;

  const golesElegidos =
    Number(document.getElementById("golesElegidos").value);

  const golesTotales =
    generarResultado(equipoA.golesMedia) +
    generarResultado(equipoB.golesMedia);

  const golesEsperados =
    equipoA.golesMedia + equipoB.golesMedia;

  const cuota = cuotaGoles(golesEsperados, golesElegidos);

  if (golesTotales === golesElegidos) {
    saldo += cantidad * cuota;
    alert("¡Has acertado los goles!");
  } else {
    saldo -= cantidad;
    alert("Fallaste los goles");
  }

  actualizarSaldo();
}
