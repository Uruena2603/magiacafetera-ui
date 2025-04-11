// Variables globales para almacenar selecciones del usuario
let destinosSeleccionados = [];
let datosViaje = {
    destinos: [],
    duracion: 1,
    tipoViajero: 'familiar',
    presupuesto: 'bajo',
    transporte: 'privado',
    hospedaje: 'no',
    alimentacion: 'tipico',
    guia: 'si',
    serviciosExtra: [],
    costoTotal: 0
};

// Eventos climáticos simulados para fechas
const climasSimulados = [
    "Soleado con altas de 28°C",
    "Parcialmente nublado con posibilidad de lluvias ligeras",
    "Despejado con bajas de 18°C",
    "Cielo cubierto con lluvias intermitentes",
    "Clima templado con máximas de 24°C",
    "Mañanas frescas y tardes soleadas, 22°C",
    "Nublado por la mañana, soleado por la tarde, 25°C",
    "Lluvias ocasionales con 21°C",
    "Cielo despejado con brisa suave, 26°C",
    "Caluroso con 30°C"
];

// Mensajes asociados al clima
const mensajesClima = [
    "¡Perfecto para actividades al aire libre!",
    "Lleva contigo un paraguas por si acaso.",
    "Ideal para disfrutar un buen café caliente.",
    "Recomendamos llevar ropa impermeable.",
    "Condiciones ideales para explorar los cafetales.",
    "No olvides protector solar y sombrero.",
    "Ideal para caminatas y fotografía.",
    "Recomendable llevar una chaqueta ligera.",
    "Excelente para visitar miradores panorámicos.",
    "Refresca con bebidas tradicionales de la región."
];

// Eventos especiales simulados
const eventosSimulados = [
    "Festival del Café en Montenegro",
    "Exposición artesanal en Salento",
    "Feria gastronómica en Armenia",
    "Festival de la cosecha en Calarcá",
    "Competencia de baristas en Pereira",
    "Noche de cuentos tradicionales en Quimbaya",
    "Mercado tradicional campesino en Circasia",
    "Torneo de Tejo en Filandia",
    "Exhibición cultural en Buenavista",
    "Fiesta tradicional cafetera en Córdoba"
];

// Definición de paquetes predefinidos
const paquetesPredefinidos = {
    'aventura': {
        nombre: 'Aventura Cafetera',
        destinos: ['parque-cafe', 'consota'],
        duracion: 2,
        tipoViajero: 'amigos',
        transporte: 'chiva',
        hospedaje: 'si',
        alimentacion: 'tipico',
        guia: 'si',
        serviciosExtra: ['Taller de barismo'],
        precio: 250000
    },
    'naturaleza': {
        nombre: 'Naturaleza y Tradición',
        destinos: ['ukumari', 'consota'],
        duracion: 2,
        tipoViajero: 'familiar',
        transporte: 'compartido',
        hospedaje: 'si',
        alimentacion: 'vegetariano',
        guia: 'si',
        serviciosExtra: [],
        precio: 280000
    },
    'completa': {
        nombre: 'Experiencia Completa',
        destinos: ['parque-cafe', 'panaca', 'ukumari', 'consota'],
        duracion: 3,
        tipoViajero: 'familiar',
        transporte: 'privado',
        hospedaje: 'si',
        alimentacion: 'gourmet',
        guia: 'si',
        serviciosExtra: ['Fotografía profesional', 'Experiencias exclusivas'],
        precio: 450000
    }
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Configurar los listeners para los checkboxes de destinos
    const checkboxesDestinos = document.querySelectorAll('.destinos-checkbox input[type="checkbox"]');
    checkboxesDestinos.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            actualizarDestinosSeleccionados();
        });
    });
    
    // Configurar listener para cambio en duración
    document.getElementById('duracion-viaje').addEventListener('change', function() {
        actualizarInfoClima();
    });
    
    // Inicializar información de clima
    actualizarInfoClima();
    
    // Configurar listeners para los selectores en el paso 2
    const selectoresPaso2 = document.querySelectorAll('#paso-2 select');
    selectoresPaso2.forEach(selector => {
        selector.addEventListener('change', calcularCostos);
    });
});

// Función para actualizar lista de destinos seleccionados
function actualizarDestinosSeleccionados() {
    destinosSeleccionados = [];
    const checkboxes = document.querySelectorAll('.destinos-checkbox input[type="checkbox"]:checked');
    
    checkboxes.forEach(checkbox => {
        destinosSeleccionados.push({
            nombre: checkbox.nextElementSibling.textContent,
            valor: checkbox.value,
            precioBase: parseInt(checkbox.dataset.precioBase)
        });
    });
    
    // Actualizar costo total
    calcularCostos();
}

// Función para actualizar información del clima y eventos según fecha
function actualizarInfoClima() {
    // Obtener duración seleccionada y fecha
    const duracion = parseInt(document.getElementById('duracion-viaje').value);
    const fechaEl = document.getElementById('fecha-viaje');
    
    // Obtener los destinos seleccionados para personalizar el clima
    let destinoActual = 'generico';
    if (destinosSeleccionados.length > 0) {
        destinoActual = destinosSeleccionados[0].valor;
    }
    
    // Determinar índice de clima y evento basado en fecha, duración y destino
    let indiceClima, indiceEvento, indiceMensaje;
    
    // Si hay una fecha seleccionada, usarla para determinar el clima
    if (fechaEl && fechaEl.value) {
        const fecha = new Date(fechaEl.value);
        const sumaDias = fecha.getDate() + fecha.getMonth();
        indiceClima = sumaDias % climasSimulados.length;
        indiceEvento = (sumaDias + duracion) % eventosSimulados.length;
        // Usar un índice de mensaje diferente para tener variedad
        indiceMensaje = (sumaDias * 2) % mensajesClima.length;
    } else {
        // Si no hay fecha, usar combinación de duración y destino
        const hashDestino = destinoActual.length;
        indiceClima = (duracion + hashDestino) % climasSimulados.length;
        indiceEvento = (duracion * 2 + hashDestino) % eventosSimulados.length;
        indiceMensaje = (duracion + 3) % mensajesClima.length;
    }
    
    // Asegurarse de que el índice del mensaje climático sea diferente del clima
    if (indiceMensaje === indiceClima) {
        indiceMensaje = (indiceMensaje + 1) % mensajesClima.length;
    }
    
    // Generar un mensaje asociado al clima
    const mensajeClima = mensajesClima[indiceMensaje];
    
    // Actualizar textos
    document.getElementById('info-clima-texto').textContent = `${climasSimulados[indiceClima]}. ${mensajeClima}`;
    document.getElementById('info-eventos-texto').textContent = eventosSimulados[indiceEvento];
}

// Función para navegar entre los pasos
function mostrarPaso(numeroPaso) {
    // Ocultar todos los pasos
    document.querySelectorAll('.paso').forEach(paso => {
        paso.style.display = 'none';
    });
    
    // Si pasamos del paso 1 al 2, guardamos la información
    if (numeroPaso === 2) {
        guardarInfoPaso1();
    }
    
    // Si pasamos al paso 3, generamos el resumen
    if (numeroPaso === 3) {
        // Si venimos de modificar un paquete, asegurarnos de guardar el plan
        guardarInfoPaso2();
        
        // Verificar que hay destinos seleccionados antes de continuar
        if (!datosViaje.destinos || datosViaje.destinos.length === 0) {
            alert('Por favor, selecciona al menos un destino para continuar');
            mostrarPaso(1);
            return;
        }
        
        // Actualizar la información del resumen e itinerario
        actualizarResumenViaje();
        generarItinerario();
    }
    
    // Mostrar el paso solicitado
    document.getElementById(`paso-${numeroPaso}`).style.display = 'block';
    
    // Si volvemos al paso 2 desde el paso 3, actualizar la interfaz
    if (numeroPaso === 2 && document.getElementById('paso-3').style.display === 'none') {
        // Asegurarse de que los selectores reflejen las opciones guardadas
        const transporteSelect = document.getElementById('transporte-plan');
        if (transporteSelect) transporteSelect.value = datosViaje.transporte;
        
        const hospedajeSelect = document.getElementById('hospedaje-plan');
        if (hospedajeSelect) hospedajeSelect.value = datosViaje.hospedaje;
        
        const alimentacionSelect = document.getElementById('alimentacion-plan');
        if (alimentacionSelect) alimentacionSelect.value = datosViaje.alimentacion;
        
        const guiaSelect = document.getElementById('guia-plan');
        if (guiaSelect) guiaSelect.value = datosViaje.guia;
        
        // Actualizar servicios extra
        const serviciosSelect = document.getElementById('servicios-extra');
        if (serviciosSelect && datosViaje.serviciosExtra) {
            // Limpiar selecciones actuales
            Array.from(serviciosSelect.options).forEach(option => {
                option.selected = false;
            });
            
            // Seleccionar servicios guardados
            datosViaje.serviciosExtra.forEach(servicio => {
                Array.from(serviciosSelect.options).forEach(option => {
                    if (option.textContent === servicio) {
                        option.selected = true;
                    }
                });
            });
        }
        
        // Actualizar costo
        calcularCostos();
    }
    
    // Scroll al inicio del paso
    window.scrollTo({
        top: document.getElementById(`paso-${numeroPaso}`).offsetTop - 100,
        behavior: 'smooth'
    });
}

// Guardar información del paso 1
function guardarInfoPaso1() {
    datosViaje.destinos = destinosSeleccionados;
    datosViaje.duracion = parseInt(document.getElementById('duracion-viaje').value);
    datosViaje.tipoViajero = document.getElementById('tipo-viajero').value;
    datosViaje.presupuesto = document.getElementById('presupuesto').value;
    
    // Guardar fecha si está seleccionada
    const fechaEl = document.getElementById('fecha-viaje');
    if (fechaEl && fechaEl.value) {
        datosViaje.fecha = fechaEl.value;
    }
    
    // También podemos guardar la información del clima y eventos
    datosViaje.climaEsperado = document.getElementById('info-clima-texto').textContent;
    datosViaje.eventosEspeciales = document.getElementById('info-eventos-texto').textContent;
}

// Guardar información del paso 2
function guardarInfoPaso2() {
    datosViaje.transporte = document.getElementById('transporte-plan').value;
    datosViaje.hospedaje = document.getElementById('hospedaje-plan').value;
    datosViaje.alimentacion = document.getElementById('alimentacion-plan').value;
    datosViaje.guia = document.getElementById('guia-plan').value;
    
    // Obtener servicios extra seleccionados
    datosViaje.serviciosExtra = [];
    const serviciosSelect = document.getElementById('servicios-extra');
    for (let i = 0; i < serviciosSelect.options.length; i++) {
        if (serviciosSelect.options[i].selected) {
            datosViaje.serviciosExtra.push(serviciosSelect.options[i].textContent);
        }
    }
    
    // Guardar costo total
    datosViaje.costoTotal = parseInt(document.getElementById('costo-total').textContent.replace(/\D/g, ''));
    
    // Detectar si venimos de un paquete modificado y actualizar comparador si es necesario
    const ultimoPaqueteModificado = sessionStorage.getItem('ultimoPaqueteModificado');
    if (ultimoPaqueteModificado) {
        actualizarComparadorPrecios(ultimoPaqueteModificado);
        // Limpiar el valor después de usarlo
        sessionStorage.removeItem('ultimoPaqueteModificado');
    }
}

// Función para calcular costos según selecciones del usuario
function calcularCostos() {
    let costoTotal = 0;
    
    // Agregar costo base por cada destino seleccionado
    destinosSeleccionados.forEach(destino => {
        costoTotal += destino.precioBase;
    });
    
    // Añadir costos según servicios seleccionados
    const factoresMultiplicadores = {
        'transporte': {
            'privado': 1.3,
            'compartido': 1.1,
            'chiva': 1.2,
            'ninguno': 0.9
        },
        'hospedaje': {
            'si': 1.5,
            'no': 1.0
        },
        'alimentacion': {
            'basico': 1.0,
            'tipico': 1.2,
            'vegetariano': 1.25,
            'gourmet': 1.4
        },
        'guia': {
            'si': 1.2,
            'no': 1.0
        }
    };
    
    // Obtener valores seleccionados
    const transporte = document.getElementById('transporte-plan').value;
    const hospedaje = document.getElementById('hospedaje-plan').value;
    const alimentacion = document.getElementById('alimentacion-plan').value;
    const guia = document.getElementById('guia-plan').value;
    
    // Aplicar factores
    costoTotal *= factoresMultiplicadores.transporte[transporte] || 1;
    costoTotal *= factoresMultiplicadores.hospedaje[hospedaje] || 1;
    costoTotal *= factoresMultiplicadores.alimentacion[alimentacion] || 1;
    costoTotal *= factoresMultiplicadores.guia[guia] || 1;
    
    // Calcular costo extra por servicios adicionales
    const serviciosSelect = document.getElementById('servicios-extra');
    let serviciosSeleccionados = [];
    
    for (let i = 0; i < serviciosSelect.options.length; i++) {
        if (serviciosSelect.options[i].selected) {
            serviciosSeleccionados.push(serviciosSelect.options[i].value);
        }
    }
    
    // Costo por cada servicio extra (simulado)
    const costosServicios = {
        'fotografo': 50000,
        'barismo': 40000,
        'souvenirs': 30000,
        'exclusivas': 80000,
        'wellness': 60000,
        'folklore': 45000
    };
    
    // Sumar costos de servicios seleccionados
    serviciosSeleccionados.forEach(servicio => {
        costoTotal += costosServicios[servicio] || 0;
    });
    
    // Redondear costo a miles
    costoTotal = Math.round(costoTotal / 1000) * 1000;
    
    // Actualizar en la interfaz
    document.getElementById('costo-total').textContent = costoTotal.toLocaleString();
    
    // Verificar si hay un paquete activo para actualizar el comparador
    const ultimoPaqueteModificado = sessionStorage.getItem('ultimoPaqueteModificado');
    if (ultimoPaqueteModificado) {
        actualizarComparadorPrecios(ultimoPaqueteModificado);
    }
}

// Función para actualizar el resumen de viaje
function actualizarResumenViaje() {
    // Verificar que todos los datos necesarios estén presentes
    if (!datosViaje.destinos || datosViaje.destinos.length === 0) {
        console.warn("No hay destinos seleccionados para mostrar en el resumen");
    }

    // Mostrar destinos seleccionados
    const destinos = datosViaje.destinos.map(d => d.nombre).join(', ');
    document.getElementById('resumen-destino').textContent = destinos || 'Ninguno seleccionado';
    
    // Actualizar fecha si existe
    if (datosViaje.fecha) {
        // Formatear la fecha para mostrarla en formato legible
        const fecha = new Date(datosViaje.fecha);
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
        
        // Si existe el elemento para mostrar la fecha, actualizarlo
        const resumenFechaEl = document.getElementById('resumen-fecha');
        if (resumenFechaEl) {
            resumenFechaEl.textContent = fechaFormateada;
        }
    }
    
    // Actualizar duración
    document.getElementById('resumen-duracion').textContent = `${datosViaje.duracion} día(s)`;
    
    // Actualizar tipo de viajero
    const tipoViajeroTexto = obtenerTextoPorValor('tipo-viajero', datosViaje.tipoViajero);
    document.getElementById('resumen-tipo-viajero').textContent = tipoViajeroTexto;
    
    // Actualizar transporte
    document.getElementById('resumen-transporte').textContent = obtenerTextoPorValor('transporte-plan', datosViaje.transporte);
    
    // Actualizar hospedaje
    document.getElementById('resumen-hospedaje').textContent = datosViaje.hospedaje === 'si' ? 'Incluido' : 'No incluido';
    
    // Actualizar alimentación
    document.getElementById('resumen-alimentacion').textContent = obtenerTextoPorValor('alimentacion-plan', datosViaje.alimentacion);
    
    // Actualizar guía
    document.getElementById('resumen-guia').textContent = datosViaje.guia === 'si' ? 'Incluido' : 'No incluido';
    
    // Actualizar servicios extra
    document.getElementById('resumen-servicios').textContent = datosViaje.serviciosExtra.length > 0 ? 
        datosViaje.serviciosExtra.join(', ') : 'Ninguno seleccionado';
    
    // Actualizar costo
    document.getElementById('resumen-costo').textContent = datosViaje.costoTotal.toLocaleString();
    
    // Añadir botón para modificar directamente desde el resumen
    const resumenContainer = document.querySelector('.resumen-viaje');
    if (resumenContainer) {
        // Verificar si ya existe el botón para no duplicarlo
        const botonExistente = resumenContainer.querySelector('.btn-modificar-desde-resumen');
        if (!botonExistente) {
            const botonModificar = document.createElement('button');
            botonModificar.className = 'btn btn-modificar-desde-resumen';
            botonModificar.innerHTML = '<i class="fas fa-edit"></i> Modificar plan';
            botonModificar.onclick = function() {
                mostrarPaso(2);
            };
            
            resumenContainer.appendChild(botonModificar);
        }
    }
}

// Función para obtener texto descriptivo según valor seleccionado
function obtenerTextoPorValor(selectId, valor) {
    const select = document.getElementById(selectId);
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === valor) {
            return select.options[i].textContent;
        }
    }
    return valor;
}

// Función para generar el itinerario basado en los destinos seleccionados
function generarItinerario() {
    const itinerarioEl = document.getElementById('itinerario-generado');
    itinerarioEl.innerHTML = '';
    
    if (datosViaje.destinos.length === 0) {
        itinerarioEl.innerHTML = '<p>No has seleccionado ningún destino para tu viaje.</p>';
        return;
    }
    
    // Distribuir destinos por días según la duración seleccionada
    const destinosPorDia = distribuirDestinosPorDia(datosViaje.destinos, datosViaje.duracion);
    
    // Generar HTML del itinerario por día
    for (let dia = 1; dia <= datosViaje.duracion; dia++) {
        const destinosDelDia = destinosPorDia[dia - 1];
        
        // Crear contenedor del día
        const diaEl = document.createElement('div');
        diaEl.className = 'dia-itinerario';
        
        // Agregar título del día
        const tituloDia = document.createElement('h5');
        tituloDia.textContent = `Día ${dia}`;
        diaEl.appendChild(tituloDia);
        
        // Crear horarios para este día
        if (destinosDelDia && destinosDelDia.length > 0) {
            // Mañana
            const mananaEl = crearFranjaHoraria('Mañana (8:00 AM - 12:00 PM)', obtenerActividadesMañana(destinosDelDia[0]));
            diaEl.appendChild(mananaEl);
            
            // Tarde
            const tardeEl = crearFranjaHoraria('Tarde (2:00 PM - 6:00 PM)', 
                destinosDelDia.length > 1 ? obtenerActividadesTarde(destinosDelDia[1]) : obtenerActividadesTarde(destinosDelDia[0]));
            diaEl.appendChild(tardeEl);
            
            // Noche
            const nocheEl = crearFranjaHoraria('Noche (7:00 PM - 9:00 PM)', obtenerActividadesNoche(datosViaje.tipoViajero));
            diaEl.appendChild(nocheEl);
        } else {
            // Si no hay destinos asignados para este día
            const sinDestinos = document.createElement('p');
            sinDestinos.textContent = 'Día libre o de descanso';
            diaEl.appendChild(sinDestinos);
        }
        
        // Agregar notas si es el último día
        if (dia === datosViaje.duracion) {
            const notasEl = document.createElement('div');
            notasEl.className = 'notas-itinerario';
            notasEl.innerHTML = `
                <p><strong>Notas importantes:</strong></p>
                <ul>
                    <li>Clima esperado: ${datosViaje.climaEsperado}</li>
                    <li>Eventos especiales: ${datosViaje.eventosEspeciales}</li>
                    <li>Este itinerario es flexible y puede ajustarse según tus preferencias.</li>
                    <li>Recomendamos reservar con anticipación en temporada alta.</li>
                </ul>
            `;
            diaEl.appendChild(notasEl);
        }
        
        // Agregar día al itinerario
        itinerarioEl.appendChild(diaEl);
    }
    
    // Agregar botones de acción para el itinerario
    const accionesEl = document.createElement('div');
    accionesEl.className = 'acciones-itinerario';
    accionesEl.innerHTML = `
        <button onclick="descargarItinerario()" class="btn btn-descargar">
            <i class="fas fa-download"></i> Descargar Itinerario
        </button>
        <button onclick="compartirItinerario()" class="btn btn-secundario btn-compartir">
            <i class="fas fa-share-alt"></i> Compartir
        </button>
    `;
    itinerarioEl.appendChild(accionesEl);
}

// Función para distribuir destinos por día
function distribuirDestinosPorDia(destinos, dias) {
    const resultado = [];
    const destinosCopia = [...destinos];
    
    // Si hay menos destinos que días, añadir un destino por día
    if (destinosCopia.length <= dias) {
        for (let i = 0; i < dias; i++) {
            resultado.push(i < destinosCopia.length ? [destinosCopia[i]] : []);
        }
    } 
    // Si hay más destinos que días, distribuir equitativamente
    else {
        const destinosPorDia = Math.ceil(destinosCopia.length / dias);
        for (let i = 0; i < dias; i++) {
            resultado.push(destinosCopia.splice(0, destinosPorDia));
        }
    }
    
    return resultado;
}

// Función para crear elemento de franja horaria
function crearFranjaHoraria(titulo, actividades) {
    const franjaEl = document.createElement('div');
    franjaEl.className = 'franja-horaria';
    
    const tituloEl = document.createElement('h6');
    tituloEl.textContent = titulo;
    franjaEl.appendChild(tituloEl);
    
    const actividadesEl = document.createElement('ul');
    actividades.forEach(actividad => {
        const li = document.createElement('li');
        li.textContent = actividad;
        actividadesEl.appendChild(li);
    });
    
    franjaEl.appendChild(actividadesEl);
    return franjaEl;
}

// Funciones para obtener actividades según destino y hora del día
function obtenerActividadesMañana(destino) {
    const actividades = {
        'ukumari': [
            'Visita al bioparque Ukumarí',
            'Recorrido por el sendero de fauna silvestre',
            'Exhibición educativa sobre especies nativas'
        ],
        'consota': [
            'Exploración del Parque Arqueológico Consotá',
            'Visita a las réplicas de viviendas indígenas',
            'Recorrido por la hacienda tradicional'
        ],
        'panaca': [
            'Recorrido por las estaciones agropecuarias de PANACA',
            'Exhibición de ganadería y ordeño',
            'Show de actividades campestres'
        ],
        'parque-cafe': [
            'Recorrido por el sendero del café',
            'Visita al Museo del Café',
            'Show cultural sobre la historia cafetera'
        ]
    };
    
    return actividades[destino.valor] || [
        'Desayuno típico de la región',
        'Visita a atractivos locales',
        'Recorrido por centro histórico'
    ];
}

function obtenerActividadesTarde(destino) {
    const actividades = {
        'ukumari': [
            'Visita a la sección de fauna africana',
            'Alimentación de especies en exhibición',
            'Show de conservación ambiental'
        ],
        'consota': [
            'Actividades recreativas en el parque',
            'Paseo por senderos naturales',
            'Experiencia de arqueología participativa'
        ],
        'panaca': [
            'Espectáculo ecuestre',
            'Participación en actividades agrícolas',
            'Recorrido en carreta por la hacienda'
        ],
        'parque-cafe': [
            'Atracciones mecánicas del parque',
            'Show del café en el teatro',
            'Teleférico panorámico'
        ]
    };
    
    return actividades[destino.valor] || [
        'Almuerzo regional',
        'Visita a miradores panorámicos',
        'Tiempo libre para compras artesanales'
    ];
}

function obtenerActividadesNoche(tipoViajero) {
    const actividades = {
        'familiar': [
            'Cena familiar con platos típicos',
            'Actividad recreativa en el hospedaje',
            'Descanso y tiempo libre'
        ],
        'pareja': [
            'Cena romántica en restaurante local',
            'Recorrido nocturno por la ciudad',
            'Tiempo de descanso'
        ],
        'escolar': [
            'Cena grupal en el hospedaje',
            'Actividades educativas y de integración',
            'Tiempo de descanso'
        ],
        'amigos': [
            'Cena en restaurante local',
            'Visita a sitios de entretenimiento nocturno',
            'Tiempo libre para disfrutar de la vida nocturna'
        ]
    };
    
    return actividades[tipoViajero] || [
        'Cena en restaurante local',
        'Descanso en el hospedaje',
        'Preparación para el día siguiente'
    ];
}

// Función para simular el proceso de pago
function simularPago() {
    // Crear modal de pago
    const modalPago = document.createElement('div');
    modalPago.className = 'modal-pago';
    modalPago.innerHTML = `
        <div class="modal-contenido">
            <h3>Pasarela de pagos</h3>
            <p>Monto a pagar: $<span>${datosViaje.costoTotal.toLocaleString('es-CO')}</span></p>
            
            <div class="opciones-pago">
                <button onclick="procesarPago('tarjeta')" class="btn-opcion-pago">
                    <i class="fas fa-credit-card"></i> Pagar con Tarjeta
                </button>
                <button onclick="procesarPago('transferencia')" class="btn-opcion-pago">
                    <i class="fas fa-university"></i> Transferencia Bancaria
                </button>
                <button onclick="procesarPago('pse')" class="btn-opcion-pago">
                    <i class="fas fa-money-check"></i> PSE
                </button>
            </div>
            
            <div class="resumen-pago">
                <p><strong>Resumen de tu compra:</strong></p>
                <p>Destinos: ${datosViaje.destinos.map(d => d.nombre).join(', ')}</p>
                <p>Duración: ${datosViaje.duracion} día(s)</p>
                <p>Servicios extra: ${datosViaje.serviciosExtra.length > 0 ? datosViaje.serviciosExtra.join(', ') : 'Ninguno'}</p>
            </div>
            
            <button class="btn-cerrar" onclick="cerrarModalPago()">Cancelar</button>
        </div>
    `;
    
    document.body.appendChild(modalPago);
    
    // Agregar estilos específicos para el modal
    const estiloModal = document.createElement('style');
    estiloModal.textContent = `
        .modal-pago {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        
        .modal-contenido {
            background-color: white;
            padding: 30px;
            border-radius: var(--radius);
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        
        .modal-contenido h3 {
            color: var(--color-primary);
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--color-accent);
        }
        
        .opciones-pago {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 25px 0;
            flex-wrap: nowrap; /* Asegura que los elementos estén en una línea */
        }
        
        .btn-opcion-pago {
            background-color: var(--color-primary);
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: var(--radius);
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            flex: 1;
            min-width: 0; /* Permite que los botones se ajusten en el contenedor */
        }
        
        .btn-opcion-pago i {
            font-size: 1.5rem;
        }
        
        .btn-opcion-pago:hover {
            background-color: var(--color-accent);
            transform: translateY(-3px);
        }
        
        .resumen-pago {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: var(--radius);
            margin: 20px 0;
            text-align: left;
            border-left: 3px solid var(--color-primary);
        }
        
        .resumen-pago p {
            margin: 5px 0;
        }
        
        .btn-cerrar {
            background-color: #f8f9fa;
            color: #333;
            border: 1px solid #ddd;
            padding: 10px 20px;
            border-radius: var(--radius);
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-cerrar:hover {
            background-color: #e2e6ea;
        }
        
        .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid var(--color-primary);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 2s linear infinite;
            margin: 20px auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 576px) {
            .opciones-pago {
                flex-direction: column;
            }
        }
    `;
    
    document.head.appendChild(estiloModal);
}

// Función para procesar el pago
function procesarPago(metodo) {
    const modalPago = document.querySelector('.modal-pago .modal-contenido');
    modalPago.innerHTML = `
        <h3>Procesando tu pago</h3>
        <div class="loader"></div>
        <p>Estamos procesando tu pago a través de ${obtenerTextoMetodoPago(metodo)}...</p>
    `;
    
    // Simular proceso de pago (3 segundos)
    setTimeout(function() {
        const codigoReserva = `MC-${Math.floor(Math.random() * 10000)}`;
        
        modalPago.innerHTML = `
            <h3>¡Pago Exitoso!</h3>
            <div class="confirmacion-pago">
                <i class="fas fa-check-circle"></i>
                <p>Tu reserva ha sido confirmada</p>
            </div>
            
            <div class="detalles-reserva">
                <p><strong>Destinos:</strong> ${datosViaje.destinos.map(d => d.nombre).join(', ')}</p>
                <p><strong>Duración:</strong> ${datosViaje.duracion} día(s)</p>
                <p><strong>Fecha:</strong> ${datosViaje.fecha || 'No especificada'}</p>
                <p><strong>Monto pagado:</strong> $${datosViaje.costoTotal.toLocaleString()} COP</p>
                <p><strong>Método de pago:</strong> ${obtenerTextoMetodoPago(metodo)}</p>
                <p><strong>Código de reserva:</strong> <span class="codigo-reserva">${codigoReserva}</span></p>
            </div>
            
            <p>Hemos enviado el itinerario a tu correo electrónico</p>
            
            <div class="acciones-confirmacion">
                <button class="btn-accion" onclick="descargarItinerario()">
                    <i class="fas fa-download"></i> Descargar Itinerario
                </button>
                <button class="btn-accion" onclick="compartirItinerario()">
                    <i class="fas fa-share-alt"></i> Compartir
                </button>
            </div>
            
            <button class="btn-cerrar" onclick="cerrarModalPago()">Cerrar</button>
        `;
        
        // Agregar estilos específicos para confirmación
        const estilosConfirmacion = document.createElement('style');
        estilosConfirmacion.textContent = `
            .confirmacion-pago {
                text-align: center;
                margin: 20px 0;
            }
            
            .confirmacion-pago i {
                font-size: 3rem;
                color: #28a745;
                margin-bottom: 15px;
            }
            
            .detalles-reserva {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: var(--radius);
                margin-bottom: 20px;
                text-align: left;
            }
            
            .detalles-reserva p {
                margin: 8px 0;
            }
            
            .codigo-reserva {
                font-weight: bold;
                color: var(--color-primary);
                letter-spacing: 1px;
            }
            
            .acciones-confirmacion {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin: 20px 0;
            }
            
            .btn-accion {
                background-color: var(--color-primary);
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: var(--radius);
                cursor: pointer;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .btn-accion:hover {
                background-color: var(--color-accent);
                transform: translateY(-2px);
            }
        `;
        
        document.head.appendChild(estilosConfirmacion);
        
        // Guardar el código de reserva en sessionStorage
        sessionStorage.setItem('codigoReserva', codigoReserva);
    }, 3000);
}

// Función para obtener el texto descriptivo del método de pago
function obtenerTextoMetodoPago(metodo) {
    switch(metodo) {
        case 'tarjeta':
            return 'Tarjeta de Crédito/Débito';
        case 'transferencia':
            return 'Transferencia Bancaria';
        case 'pse':
            return 'PSE (Pagos Seguros en Línea)';
        default:
            return metodo;
    }
}

// Función para cerrar el modal de pago
function cerrarModalPago() {
    const modalPago = document.querySelector('.modal-pago');
    if (modalPago) {
        modalPago.remove();
    }
}

// Función para descargar itinerario (implementada)
function descargarItinerario() {
    // Verificar si hay destinos seleccionados
    if (!datosViaje.destinos || datosViaje.destinos.length === 0) {
        alert('No hay destinos seleccionados para generar un itinerario.');
        return;
    }
    
    // Crear contenido del itinerario
    let contenido = `
        ITINERARIO DE VIAJE - MAGIA CAFETERA
        =====================================
        
        DETALLES DEL VIAJE:
        -------------------
        Destinos: ${datosViaje.destinos.map(d => d.nombre).join(', ')}
        Duración: ${datosViaje.duracion} día(s)
        Fecha: ${datosViaje.fecha || 'No especificada'}
        Tipo de viajero: ${obtenerTextoPorValor('tipo-viajero', datosViaje.tipoViajero)}
        
        SERVICIOS INCLUIDOS:
        -------------------
        Transporte: ${obtenerTextoPorValor('transporte-plan', datosViaje.transporte)}
        Hospedaje: ${datosViaje.hospedaje === 'si' ? 'Incluido' : 'No incluido'}
        Alimentación: ${obtenerTextoPorValor('alimentacion-plan', datosViaje.alimentacion)}
        Guía: ${datosViaje.guia === 'si' ? 'Incluido' : 'No incluido'}
        Servicios extra: ${datosViaje.serviciosExtra.length > 0 ? datosViaje.serviciosExtra.join(', ') : 'Ninguno'}
        
        COSTO TOTAL: $${datosViaje.costoTotal.toLocaleString()} COP
        
        ITINERARIO DIARIO:
        -----------------
    `;
    
    // Obtener elementos del itinerario generado
    const diasItinerario = document.querySelectorAll('.dia-itinerario');
    
    diasItinerario.forEach((dia, index) => {
        // Obtener título del día
        const tituloDia = dia.querySelector('h5').textContent;
        contenido += `\n${tituloDia}:\n`;
        
        // Obtener franjas horarias
        const franjas = dia.querySelectorAll('.franja-horaria');
        
        franjas.forEach(franja => {
            const tituloFranja = franja.querySelector('h6').textContent;
            contenido += `  ${tituloFranja}\n`;
            
            // Obtener actividades
            const actividades = franja.querySelectorAll('li');
            actividades.forEach(actividad => {
                contenido += `    - ${actividad.textContent}\n`;
            });
        });
    });
    
    // Añadir notas
    const notas = document.querySelector('.notas-itinerario');
    if (notas) {
        contenido += '\nNOTAS IMPORTANTES:\n';
        const items = notas.querySelectorAll('li');
        items.forEach(item => {
            contenido += `  - ${item.textContent}\n`;
        });
    }
    
    contenido += `
        =====================================
        ¡Gracias por elegir Magia Cafetera!
        Contacto: info@magiacafetera.com
        Teléfono: +57 123 456 7890
    `;
    
    // Crear un elemento para descargar
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenido));
    element.setAttribute('download', 'Itinerario_Magia_Cafetera.txt');
    
    element.style.display = 'none';
    document.body.appendChild(element);
    
    element.click();
    
    document.body.removeChild(element);
}

// Función para compartir itinerario (actualizada)
function compartirItinerario() {
    // Simulación de funcionalidad de compartir
    // En una implementación real, esto podría conectarse a una API de compartir
    
    // Verificar si el navegador soporta Web Share API
    if (navigator.share) {
        navigator.share({
            title: 'Mi Itinerario - Magia Cafetera',
            text: `He planificado un viaje de ${datosViaje.duracion} días por ${datosViaje.destinos.map(d => d.nombre).join(', ')}`,
            url: window.location.href
        }).then(() => {
            console.log('Itinerario compartido con éxito');
        }).catch(error => {
            console.error('Error al compartir:', error);
            alert('Esta funcionalidad estará disponible próximamente. Por ahora, puedes descargar tu itinerario y compartirlo manualmente.');
        });
    } else {
        alert('Esta funcionalidad estará disponible próximamente. Por ahora, puedes descargar tu itinerario y compartirlo manualmente.');
    }
}

// Función para mostrar notificaciones temporales
function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento para notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${mensaje}</p>
        </div>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('estilos-notificacion')) {
        const estilos = document.createElement('style');
        estilos.id = 'estilos-notificacion';
        estilos.textContent = `
            .notificacion {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background-color: white;
                border-radius: var(--radius);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                animation: slideIn 0.5s ease, fadeOut 0.5s ease 3s forwards;
                max-width: 350px;
            }
            
            .notificacion-contenido {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notificacion i {
                font-size: 1.5rem;
            }
            
            .notificacion p {
                margin: 0;
                font-size: 1rem;
            }
            
            .notificacion-success i {
                color: #28a745;
            }
            
            .notificacion-warning i {
                color: #ffc107;
            }
            
            .notificacion-error i {
                color: #dc3545;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; visibility: hidden; }
            }
        `;
        document.head.appendChild(estilos);
    }
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Eliminar después de 3.5 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 3500);
}

// Actualizar la función seleccionarPaquete para mostrar notificación
function seleccionarPaquete(tipoPaquete) {
    const paquete = paquetesPredefinidos[tipoPaquete];
    if (!paquete) return;
    
    // Guardar el paquete seleccionado para referencia posterior
    sessionStorage.setItem('ultimoPaqueteModificado', tipoPaquete);
    
    // Ir a la sección de planificador
    window.location.href = '#planificador';
    
    // Marcar los destinos correspondientes
    document.querySelectorAll('.destinos-checkbox input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = paquete.destinos.includes(checkbox.value);
    });
    
    // Actualizar destinos seleccionados
    actualizarDestinosSeleccionados();
    
    // Establecer duración
    const duracionSelect = document.getElementById('duracion-viaje');
    duracionSelect.value = paquete.duracion;
    
    // Establecer tipo de viajero
    const tipoViajeroSelect = document.getElementById('tipo-viajero');
    tipoViajeroSelect.value = paquete.tipoViajero;
    
    // Actualizar clima
    actualizarInfoClima();
    
    // Configurar opciones del paso 2 si venimos del paso 3
    const paso2Config = {
        'transporte-plan': paquete.transporte,
        'hospedaje-plan': paquete.hospedaje,
        'alimentacion-plan': paquete.alimentacion,
        'guia-plan': paquete.guia
    };
    
    // Aplicar configuraciones
    for (const [id, valor] of Object.entries(paso2Config)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.value = valor;
        }
    }
    
    // Actualizar servicios extra si existen
    const serviciosExtra = document.getElementById('servicios-extra');
    if (serviciosExtra) {
        // Desmarcar todos primero
        Array.from(serviciosExtra.options).forEach(option => {
            option.selected = false;
        });
        
        // Marcar los del paquete
        paquete.serviciosExtra.forEach(servicio => {
            Array.from(serviciosExtra.options).forEach(option => {
                if (option.textContent === servicio) {
                    option.selected = true;
                }
            });
        });
    }
    
    // Calcular costos
    calcularCostos();
    
    // Actualizar comparador de precios
    actualizarComparadorPrecios(tipoPaquete);
    
    // Mostrar notificación
    mostrarNotificacion(`Paquete "${paquete.nombre}" cargado correctamente. Puedes modificarlo a tu gusto.`);
    
    // Ir al paso 1
    mostrarPaso(1);
}

// Nueva función para actualizar el comparador de precios en tiempo real
function actualizarComparadorPrecios(tipoPaqueteSeleccionado) {
    // Obtener la fila del comparador correspondiente al paquete
    const filas = document.querySelectorAll('.comparador-precios table tbody tr');
    const costoPersonalizado = datosViaje.costoTotal;
    
    filas.forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length >= 4) {
            const nombrePaquete = celdas[0].textContent.trim();
            
            // Verificar si esta fila corresponde al paquete seleccionado
            let correspondeAlSeleccionado = false;
            if (tipoPaqueteSeleccionado === 'aventura' && nombrePaquete === 'Aventura Cafetera') {
                correspondeAlSeleccionado = true;
            } else if (tipoPaqueteSeleccionado === 'naturaleza' && nombrePaquete === 'Naturaleza y Tradición') {
                correspondeAlSeleccionado = true;
            } else if (tipoPaqueteSeleccionado === 'completa' && nombrePaquete === 'Experiencia Completa') {
                correspondeAlSeleccionado = true;
            }
            
            // Actualizar celda de precio personalizado para el paquete seleccionado
            if (correspondeAlSeleccionado) {
                celdas[3].textContent = `$${costoPersonalizado.toLocaleString()}`;
                celdas[3].style.fontWeight = 'bold';
                celdas[3].style.color = 'var(--color-primary)';
            }
        }
    });
}

// Función para reservar directamente un paquete (ir al paso 3 con datos preestablecidos)
function reservarPaquete(tipoPaquete) {
    const paquete = paquetesPredefinidos[tipoPaquete];
    if (!paquete) return;
    
    // Guardar el paquete seleccionado para referencia posterior
    sessionStorage.setItem('ultimoPaqueteModificado', tipoPaquete);
    
    // Ir a la sección de planificador
    window.location.href = '#planificador';
    
    // Establecer destinos
    destinosSeleccionados = [];
    paquete.destinos.forEach(destinoId => {
        const checkbox = document.querySelector(`.destinos-checkbox input[value="${destinoId}"]`);
        if (checkbox) {
            destinosSeleccionados.push({
                nombre: checkbox.nextElementSibling.textContent,
                valor: destinoId,
                precioBase: parseInt(checkbox.dataset.precioBase)
            });
        }
    });
    
    // Rellenar datos del viaje
    datosViaje = {
        destinos: destinosSeleccionados,
        duracion: paquete.duracion,
        tipoViajero: paquete.tipoViajero,
        presupuesto: 'medio', // Valor predeterminado
        transporte: paquete.transporte,
        hospedaje: paquete.hospedaje,
        alimentacion: paquete.alimentacion,
        guia: paquete.guia,
        serviciosExtra: paquete.serviciosExtra,
        costoTotal: paquete.precio,
        climaEsperado: document.getElementById('info-clima-texto').textContent,
        eventosEspeciales: document.getElementById('info-eventos-texto').textContent,
        paqueteSeleccionado: tipoPaquete // Guardar referencia al paquete seleccionado
    };
    
    // Actualizar la vista del paso 3
    actualizarResumenViaje();
    generarItinerario();
    
    // Actualizar comparador de precios
    actualizarComparadorPrecios(tipoPaquete);
    
    // Ir al paso 3 directamente
    mostrarPaso(3);
}

// Función para inicializar la página con todos los eventos y configuraciones
function inicializar() {
    // Vincular eventos para el planificador
    const transporteSelect = document.getElementById('transporte-plan');
    const alimentacionSelect = document.getElementById('alimentacion-plan');
    const guiaSelect = document.getElementById('guia-plan');
    const hospedajeSelect = document.getElementById('hospedaje-plan');
    const serviciosExtraSelect = document.getElementById('servicios-extra');

    if (transporteSelect) transporteSelect.addEventListener('change', calcularCostos);
    if (alimentacionSelect) alimentacionSelect.addEventListener('change', calcularCostos);
    if (guiaSelect) guiaSelect.addEventListener('change', calcularCostos);
    if (hospedajeSelect) hospedajeSelect.addEventListener('change', calcularCostos);
    if (serviciosExtraSelect) serviciosExtraSelect.addEventListener('change', calcularCostos);
    
    // Inicializar valores del planificador
    calcularCostos();
    
    // Para el paso de confirmación
    const botonConfirmacion = document.querySelector('#paso-2 button[onclick*="mostrarPaso(3)"]');
    if (botonConfirmacion) {
        botonConfirmacion.addEventListener('click', actualizarResumen);
    }
    
    // Agregar evento a todos los controles de filtro
    // Select elements
    const selectFilters = document.querySelectorAll('#filter-type, #filter-location, #filter-price, #filter-duration');
    selectFilters.forEach(filter => {
        if (filter) filter.addEventListener('change', aplicarFiltros);
    });
    
    // Checkbox elements
    const checkboxFilters = document.querySelectorAll('#filter-accessibility, #filter-activity-senderismo, #filter-activity-montanas, #filter-activity-cultural, #filter-activity-acuatico, #filter-activity-gastronomia');
    checkboxFilters.forEach(filter => {
        if (filter) filter.addEventListener('change', aplicarFiltros);
    });
    
    // Vincular eventos para los botones de filtro
    const botonResetFiltros = document.getElementById('reset-filtros');
    if (botonResetFiltros) {
        botonResetFiltros.addEventListener('click', reiniciarFiltros);
    }
    
    // Inicializar sidebar responsive
    inicializarSidebarResponsive();

    // Verificar si hay destinos al cargar la página
    if (document.querySelector('.destino')) {
        aplicarFiltros();
    }

    // Inicializar información de clima
    actualizarInfoClima();
}

// Función para manejar el sidebar responsive
function inicializarSidebarResponsive() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Función para reiniciar los filtros
function reiniciarFiltros() {
    // Resetear selects
    const selectsToReset = ['filter-type', 'filter-location', 'filter-price', 'filter-duration'];
    selectsToReset.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.value = '';
    });
    
    // Resetear checkboxes
    const checkboxesToReset = [
        'filter-accessibility', 
        'filter-activity-senderismo', 
        'filter-activity-montanas', 
        'filter-activity-cultural', 
        'filter-activity-acuatico', 
        'filter-activity-gastronomia'
    ];
    
    checkboxesToReset.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.checked = false;
    });
    
    // Mostrar todos los destinos
    document.querySelectorAll('.destino').forEach(destino => {
        destino.style.display = 'block';
    });
    
    // Ocultar mensaje de no resultados
    const mensajeNoResultados = document.getElementById('mensaje-no-resultados');
    if (mensajeNoResultados) {
        mensajeNoResultados.style.display = 'none';
    }
}

// Función para aplicar filtros a los destinos
function aplicarFiltros() {
    // Obtener valores de los filtros
    const tipoFiltro = document.getElementById('filter-type')?.value || '';
    const ubicacionFiltro = document.getElementById('filter-location')?.value || '';
    const precioFiltro = document.getElementById('filter-price')?.value || '';
    const duracionFiltro = document.getElementById('filter-duration')?.value || '';
    
    // Obtener valores de los checkboxes
    const accesibilidadFiltro = document.getElementById('filter-accessibility')?.checked || false;
    const senderismoFiltro = document.getElementById('filter-activity-senderismo')?.checked || false;
    const montanasFiltro = document.getElementById('filter-activity-montanas')?.checked || false;
    const culturalFiltro = document.getElementById('filter-activity-cultural')?.checked || false;
    const acuaticoFiltro = document.getElementById('filter-activity-acuatico')?.checked || false;
    const gastronomiaFiltro = document.getElementById('filter-activity-gastronomia')?.checked || false;
    
    // Filtrar los destinos
    const destinos = document.querySelectorAll('.destino');
    let destinosVisibles = 0;
    
    destinos.forEach(destino => {
        // Obtener atributos de datos del destino
        const tipo = destino.getAttribute('data-type') || '';
        const ubicacion = destino.getAttribute('data-location') || '';
        const precio = destino.getAttribute('data-price') || '';
        const duracion = destino.getAttribute('data-duration') || '';
        const actividades = destino.getAttribute('data-activities') || '';
        const esAccesible = destino.getAttribute('data-accessible') === 'true';
        
        // Realizar filtrado
        let mostrar = true;
        
        if (tipoFiltro && tipo !== tipoFiltro) mostrar = false;
        if (ubicacionFiltro && ubicacion !== ubicacionFiltro) mostrar = false;
        if (precioFiltro && precio !== precioFiltro) mostrar = false;
        if (duracionFiltro && duracion !== duracionFiltro) mostrar = false;
        
        // Filtros de checkbox
        if (accesibilidadFiltro && !esAccesible) mostrar = false;
        if (senderismoFiltro && !actividades.includes('senderismo')) mostrar = false;
        if (montanasFiltro && !actividades.includes('montanas')) mostrar = false;
        if (culturalFiltro && !actividades.includes('cultural')) mostrar = false;
        if (acuaticoFiltro && !actividades.includes('acuatico')) mostrar = false;
        if (gastronomiaFiltro && !actividades.includes('gastronomia')) mostrar = false;
        
        // Mostrar u ocultar según resultados
        destino.style.display = mostrar ? 'block' : 'none';
        
        // Contar destinos visibles
        if (mostrar) destinosVisibles++;
    });
    
    // Mostrar mensaje si no hay resultados
    const mensajeNoResultados = document.getElementById('mensaje-no-resultados');
    if (mensajeNoResultados) {
        mensajeNoResultados.style.display = destinosVisibles === 0 ? 'block' : 'none';
    }
}

// Función para actualizar costos base según el destino
function actualizarCostosBase() {
    const destinoSelect = document.getElementById('destino-planificador');
    if (!destinoSelect) return; // Evitar error si el elemento no existe
    
    // Verificar si tiene opciones antes de acceder a selectedIndex
    if (destinoSelect.options && destinoSelect.options.length > 0) {
        const precioBase = destinoSelect.options[destinoSelect.selectedIndex].getAttribute('data-precio-base');
        calcularCostos();
    }
}

// Función auxiliar para distribuir los destinos entre los días disponibles
function distribuirDestinos(destinos, diaActual, duracionTotal) {
    // Si hay pocos destinos para los días disponibles, distribuir equitativamente
    if (destinos.length <= duracionTotal) {
        return (diaActual <= destinos.length) ? [destinos[diaActual - 1]] : [];
    }
    
    // Si hay más destinos que días, agrupar de forma óptima (máximo 2 por día)
    const destinosPorDia = Math.ceil(destinos.length / duracionTotal);
    const inicio = (diaActual - 1) * destinosPorDia;
    const fin = Math.min(inicio + destinosPorDia, destinos.length);
    
    return destinos.slice(inicio, fin);
}

// Función auxiliar para obtener el nombre legible de un destino
function obtenerNombreDestino(codigoDestino) {
    const nombres = {
        'parque-cafe': 'Parque del Café',
        'panaca': 'PANACA',
        'consota': 'Parque Consotá',
        'ukumari': 'Bioparque Ukumarí'
    };
    
    return nombres[codigoDestino] || codigoDestino;
}

// Función para confirmar reserva (simplificada)
function confirmarReserva() {
    alert('¡Tu reserva ha sido confirmada! Te hemos enviado el itinerario a tu correo y WhatsApp.');
}

// Función para actualizar el resumen de viaje
function actualizarResumen() {
    // Verificar si ya existe la función en el script
    if (typeof window.actualizarResumenViaje === 'function') {
        // Guardar datos para asegurar que el resumen tenga toda la información
        guardarInfoPaso1();
        guardarInfoPaso2();
        
        // Llamar a la función existente
        actualizarResumenViaje();
        generarItinerario();
        return;
    }

    // Obtener valores seleccionados para los destinos
    const destinosSeleccionados = [];
    const destinosTexto = [];
    document.querySelectorAll('input[name="destinos[]"]:checked').forEach(checkbox => {
        destinosSeleccionados.push(checkbox.value);
        destinosTexto.push(checkbox.nextElementSibling.textContent.trim());
    });
    const resumenDestinoEl = document.getElementById('resumen-destino');
    if (resumenDestinoEl) {
        resumenDestinoEl.textContent = destinosTexto.length > 0 ? destinosTexto.join(', ') : 'Ninguno seleccionado';
    }
    
    // Duración
    const duracionSelect = document.getElementById('duracion-viaje');
    const resumenDuracionEl = document.getElementById('resumen-duracion');
    if (duracionSelect && resumenDuracionEl) {
        resumenDuracionEl.textContent = duracionSelect.options[duracionSelect.selectedIndex].text;
    }
    
    // Tipo de viajero
    const tipoViajeroSelect = document.getElementById('tipo-viajero');
    const resumenTipoViajeroEl = document.getElementById('resumen-tipo-viajero');
    if (tipoViajeroSelect && resumenTipoViajeroEl) {
        resumenTipoViajeroEl.textContent = tipoViajeroSelect.options[tipoViajeroSelect.selectedIndex].text;
    }
    
    // Transporte
    const transporteSelect = document.getElementById('transporte-plan');
    const resumenTransporteEl = document.getElementById('resumen-transporte');
    if (transporteSelect && resumenTransporteEl) {
        resumenTransporteEl.textContent = transporteSelect.options[transporteSelect.selectedIndex].text;
    }
    
    // Hospedaje
    const hospedajeSelect = document.getElementById('hospedaje-plan');
    const resumenHospedajeEl = document.getElementById('resumen-hospedaje');
    if (hospedajeSelect && resumenHospedajeEl) {
        resumenHospedajeEl.textContent = hospedajeSelect.options[hospedajeSelect.selectedIndex].text;
    }
    
    // Alimentación
    const alimentacionSelect = document.getElementById('alimentacion-plan');
    const resumenAlimentacionEl = document.getElementById('resumen-alimentacion');
    if (alimentacionSelect && resumenAlimentacionEl) {
        resumenAlimentacionEl.textContent = alimentacionSelect.options[alimentacionSelect.selectedIndex].text;
    }
    
    // Guía
    const guiaSelect = document.getElementById('guia-plan');
    const resumenGuiaEl = document.getElementById('resumen-guia');
    if (guiaSelect && resumenGuiaEl) {
        resumenGuiaEl.textContent = guiaSelect.options[guiaSelect.selectedIndex].text;
    }
    
    // Obtener los servicios extra seleccionados y unir sus textos
    const serviciosSelect = document.getElementById('servicios-extra');
    const resumenServiciosEl = document.getElementById('resumen-servicios');
    if (serviciosSelect && resumenServiciosEl) {
        const serviciosSeleccionados = Array.from(serviciosSelect.selectedOptions)
            .map(option => option.textContent.trim())
            .join(', ');
        resumenServiciosEl.textContent = serviciosSeleccionados || 'Ninguno';
    }
    
    // Costo
    const costoTotalEl = document.getElementById('costo-total'); 
    const resumenCostoEl = document.getElementById('resumen-costo');
    if (costoTotalEl && resumenCostoEl) {
        resumenCostoEl.textContent = costoTotalEl.textContent;
    }
    
    // Generar itinerario basado en los datos seleccionados
    generarItinerarioPersonalizado(destinosSeleccionados, parseInt(duracionSelect?.value || 1));
}

// Función para generar itinerario optimizado con elementos personalizados
function generarItinerarioPersonalizado(destinos, duracion) {
    // Contenedor donde se mostrará el itinerario
    const itinerarioContainer = document.getElementById('itinerario-generado');
    if (!itinerarioContainer) return;
    
    itinerarioContainer.innerHTML = '';
    
    if (!destinos || destinos.length === 0) {
        itinerarioContainer.innerHTML = '<p>Por favor, selecciona al menos un destino para generar un itinerario.</p>';
        return;
    }
    
    // Opciones seleccionadas
    const transporteEl = document.getElementById('transporte-plan');
    const hospedajeEl = document.getElementById('hospedaje-plan');
    const alimentacionEl = document.getElementById('alimentacion-plan');
    
    const transporte = transporteEl?.value || 'privado';
    const hospedaje = hospedajeEl?.value || 'no';
    const alimentacion = alimentacionEl?.value || 'tipico';
    
    // Crear el contenido del itinerario
    let itinerarioHTML = '';
    
    // Estructura para cada día según la duración seleccionada
    for (let dia = 1; dia <= duracion; dia++) {
        itinerarioHTML += `<div class="dia-itinerario">
            <h5>Día ${dia}</h5>`;
        
        // Seleccionar destinos para este día (distribuir destinos entre los días disponibles)
        const destinosDelDia = distribuirDestinos(destinos, dia, duracion);
        
        // Mañana
        itinerarioHTML += `<div class="franja-horaria">
            <h6>Mañana (8:00 AM - 12:00 PM)</h6>
            <ul>`;
            
        if (destinosDelDia.length > 0) {
            itinerarioHTML += `<li>Visita a ${obtenerNombreDestino(destinosDelDia[0])}</li>`;
            
            // Añadir actividades específicas según el destino
            if (destinosDelDia[0] === 'parque-cafe') {
                itinerarioHTML += `<li>Recorrido en Jeep Willys (30 min)</li>
                <li>Show del Café (40 min)</li>`;
            } else if (destinosDelDia[0] === 'panaca') {
                itinerarioHTML += `<li>Exhibición de animales (1 hora)</li>
                <li>Show de aves (30 min)</li>`;
            } else if (destinosDelDia[0] === 'ukumari') {
                itinerarioHTML += `<li>Visita al ecosistema africano (45 min)</li>
                <li>Recorrido por el aviario (30 min)</li>`;
            } else if (destinosDelDia[0] === 'consota') {
                itinerarioHTML += `<li>Piscinas y atracciones acuáticas (1 hora)</li>
                <li>Recorrido guiado por la granja (30 min)</li>`;
            }
        } else {
            itinerarioHTML += `<li>Desayuno en el hotel</li>
            <li>Tiempo libre para recorrer puntos de interés cercanos</li>`;
        }
        
        // Añadir traslado si corresponde
        if (dia === 1) {
            itinerarioHTML += `<li>Traslado desde el punto de encuentro (Tiempo estimado: 30 min)</li>`;
        }
        
        itinerarioHTML += `</ul>
        </div>`;
        
        // Almuerzo
        itinerarioHTML += `<div class="franja-horaria">
            <h6>Almuerzo (12:00 PM - 2:00 PM)</h6>
            <ul>`;
            
        if (alimentacion === 'tipico') {
            itinerarioHTML += `<li>Almuerzo típico en restaurante local (incluido)</li>`;
        } else if (alimentacion === 'vegetariano') {
            itinerarioHTML += `<li>Menú vegetariano en restaurante especializado (incluido)</li>`;
        } else if (alimentacion === 'gourmet') {
            itinerarioHTML += `<li>Experiencia gastronómica gourmet (incluido)</li>`;
        } else {
            itinerarioHTML += `<li>Almuerzo básico (incluido)</li>`;
        }
        
        itinerarioHTML += `</ul>
        </div>`;
        
        // Tarde
        itinerarioHTML += `<div class="franja-horaria">
            <h6>Tarde (2:00 PM - 6:00 PM)</h6>
            <ul>`;
            
        if (destinosDelDia.length > 1) {
            itinerarioHTML += `<li>Visita a ${obtenerNombreDestino(destinosDelDia[1])}</li>`;
            
            // Añadir actividades específicas según el destino
            if (destinosDelDia[1] === 'parque-cafe') {
                itinerarioHTML += `<li>Atracciones mecánicas (2 horas)</li>
                <li>Teleférico y mirador (30 min)</li>`;
            } else if (destinosDelDia[1] === 'panaca') {
                itinerarioHTML += `<li>Espectáculo ecuestre (45 min)</li>
                <li>Interacción con animales de granja (1 hora)</li>`;
            } else if (destinosDelDia[1] === 'ukumari') {
                itinerarioHTML += `<li>Tour por reptiles y anfibios (1 hora)</li>
                <li>Visita al área de mamíferos (45 min)</li>`;
            } else if (destinosDelDia[1] === 'consota') {
                itinerarioHTML += `<li>Sendero de la memoria indígena (45 min)</li>
                <li>Lagos de pesca (1 hora)</li>`;
            }
        } else if (destinosDelDia.length > 0) {
            // Continuamos en el mismo destino de la mañana
            itinerarioHTML += `<li>Continuación de actividades en ${obtenerNombreDestino(destinosDelDia[0])}</li>`;
            
            if (destinosDelDia[0] === 'parque-cafe') {
                itinerarioHTML += `<li>Atracciones mecánicas (2 horas)</li>
                <li>Museo del Café (40 min)</li>`;
            } else if (destinosDelDia[0] === 'panaca') {
                itinerarioHTML += `<li>Espectáculo ecuestre (45 min)</li>
                <li>Demostración de ordeño (30 min)</li>`;
            } else if (destinosDelDia[0] === 'ukumari') {
                itinerarioHTML += `<li>Visita a los ecosistemas americanos (1 hora)</li>
                <li>Observación de fauna nocturna (45 min)</li>`;
            } else if (destinosDelDia[0] === 'consota') {
                itinerarioHTML += `<li>Réplica de Pereira Antigua (45 min)</li>
                <li>Actividades deportivas (1 hora)</li>`;
            }
        } else {
            itinerarioHTML += `<li>Tiempo libre para actividades opcionales</li>
            <li>Tour por la ciudad (2 horas)</li>`;
        }
        
        itinerarioHTML += `</ul>
        </div>`;
        
        // Noche
        itinerarioHTML += `<div class="franja-horaria">
            <h6>Noche (6:00 PM - 10:00 PM)</h6>
            <ul>`;
            
        // Si hay hospedaje o es el último día
        if (hospedaje === 'si' && dia < duracion) {
            itinerarioHTML += `<li>Cena en el hotel o restaurante recomendado</li>
            <li>Alojamiento en hotel categoría turista</li>`;
            
            // Sugerencias de hospedaje según la zona
            itinerarioHTML += `<li>Sugerencias de hospedaje:`;
            if (destinosDelDia.includes('parque-cafe') || destinosDelDia.includes('panaca')) {
                itinerarioHTML += `
                <ul>
                    <li>Hotel Mocawa Resort (Montenegro)</li>
                    <li>Decameron Panaca (Quimbaya)</li>
                    <li>Hostería Los Naranjales (Montenegro)</li>
                </ul>`;
            } else if (destinosDelDia.includes('ukumari') || destinosDelDia.includes('consota')) {
                itinerarioHTML += `
                <ul>
                    <li>Hotel Movich (Pereira Centro)</li>
                    <li>Sonesta Hotel Pereira</li>
                    <li>Hotel Don Alfonso (Pereira)</li>
                </ul>`;
            } else {
                itinerarioHTML += `
                <ul>
                    <li>Hotel Soratama (Pereira Centro)</li>
                    <li>Kolibrí Hostel (Pereira)</li>
                    <li>Hotel Boutique Sazagua (Pereira)</li>
                </ul>`;
            }
            itinerarioHTML += `</li>`;
        } else if (dia === duracion) {
            // Último día
            itinerarioHTML += `<li>Cena de despedida (opcional)</li>
            <li>Traslado al punto de regreso (Tiempo estimado: 30 min)</li>`;
        } else {
            itinerarioHTML += `<li>Tiempo libre para actividades nocturnas</li>
            <li>Regreso al punto de encuentro</li>`;
        }
        
        itinerarioHTML += `</ul>
        </div>
        </div>`;
    }
    
    // Añadir notas adicionales
    itinerarioHTML += `
    <div class="notas-itinerario">
        <h5>Notas importantes:</h5>
        <ul>
            <li>Se recomienda llevar protector solar, repelente de insectos y ropa cómoda.</li>
            <li>Los horarios pueden ajustarse según condiciones climáticas.</li>
            <li>El transporte entre destinos está incluido con el tipo de transporte seleccionado.</li>
            ${hospedaje === 'si' ? '<li>El hospedaje incluye desayuno continental.</li>' : ''}
            ${alimentacion !== 'tipico' ? '<li>Las opciones de alimentación especial deben confirmarse con 24 horas de anticipación.</li>' : ''}
        </ul>
    </div>
    
    <div class="acciones-itinerario">
        <button onclick="descargarItinerario()" class="btn btn-descargar">
            <i class="fas fa-download"></i> Descargar Itinerario
        </button>
        <button onclick="compartirItinerario()" class="btn btn-secundario btn-compartir">
            <i class="fas fa-share-alt"></i> Compartir
        </button>
    </div>`;
    
    // Insertar el itinerario en el contenedor
    itinerarioContainer.innerHTML = itinerarioHTML;
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar los listeners para los checkboxes de destinos
    const checkboxesDestinos = document.querySelectorAll('.destinos-checkbox input[type="checkbox"]');
    checkboxesDestinos.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            actualizarDestinosSeleccionados();
        });
    });
    
    // Configurar listener para cambio en duración
    const duracionViaje = document.getElementById('duracion-viaje');
    if (duracionViaje) {
        duracionViaje.addEventListener('change', actualizarInfoClima);
    }
    
    // Inicializar información de clima
    actualizarInfoClima();
    
    // Configurar listeners para los selectores en el paso 2
    const selectoresPaso2 = document.querySelectorAll('#paso-2 select');
    selectoresPaso2.forEach(selector => {
        selector.addEventListener('change', calcularCostos);
    });
    
    // Inicializar la página
    inicializar();
}); 