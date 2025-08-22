// Función para mostrar el campo de resultado según el examen seleccionado
function mostrarResultadoExamen() {
    const tipoExamen = document.getElementById('tipoExamen').value;
    const resultadoOAE = document.getElementById('resultadoOAE');
    const resultadoAABR = document.getElementById('resultadoAABR');

    resultadoOAE.style.display = 'none';
    resultadoAABR.style.display = 'none';

    document.getElementById('oae').value = '';
    document.getElementById('aabr').value = '';

    if (tipoExamen === 'oae') {
        resultadoOAE.style.display = 'block';
    } else if (tipoExamen === 'aabr') {
        resultadoAABR.style.display = 'block';
    }
}

// Función principal para evaluar el riesgo
function evaluarRiesgo() {
    const edadBebe = parseInt(document.getElementById('edadBebe').value) || 0;
    const tipoExamen = document.getElementById('tipoExamen').value;
    const oae = document.getElementById('oae').value;
    const aabr = document.getElementById('aabr').value;
    const prematuridad = document.getElementById('prematuridad').value;
    const antecedentes = document.getElementById('antecedentes').value;
    const infecciones = document.getElementById('infecciones').value;
    const ototoxicos = document.getElementById('ototoxicos').value;
    const ucin = document.getElementById('ucin').value;

    // Validación de campos
    if (!tipoExamen || !prematuridad || !antecedentes || !infecciones || !ototoxicos || !ucin) {
        alert('Por favor, complete todos los campos antes de evaluar el riesgo.');
        return;
    }

    if ((tipoExamen === 'oae' && !oae) || (tipoExamen === 'aabr' && !aabr)) {
        alert('Por favor, seleccione el resultado del examen.');
        return;
    }

    // --- Cálculo de riesgo ---
    let puntuacion = 0;
    let factoresRiesgo = [];

    // Evaluación según examen
    if (tipoExamen === 'oae') {
        if (oae === 'no_pasa') { puntuacion += 40; factoresRiesgo.push('<span class="badge bg-danger factor-badge">OAE no pasa (+40)</span>'); }
        else if (oae === 'parcial') { puntuacion += 20; factoresRiesgo.push('<span class="badge bg-warning factor-badge">OAE parcial (+20)</span>'); }
        else { factoresRiesgo.push('<span class="badge bg-success factor-badge">OAE pasa</span>'); }
    } else {
        if (aabr === 'anormal') { puntuacion += 40; factoresRiesgo.push('<span class="badge bg-danger factor-badge">AABR anormal (+40)</span>'); }
        else if (aabr === 'inconcluso') { puntuacion += 20; factoresRiesgo.push('<span class="badge bg-warning factor-badge">AABR inconcluso (+20)</span>'); }
        else { factoresRiesgo.push('<span class="badge bg-success factor-badge">AABR normal</span>'); }
    }

    // Prematuridad
    if (prematuridad === 'extremo') { puntuacion += 25; factoresRiesgo.push('<span class="badge bg-danger factor-badge">Prem. extrema (+25)</span>'); }
    else if (prematuridad === 'moderado') { puntuacion += 12; factoresRiesgo.push('<span class="badge bg-warning factor-badge">Prem. moderada (+12)</span>'); }
    else { factoresRiesgo.push('<span class="badge bg-success factor-badge">Término completo</span>'); }

    // Factores adicionales
    const factoresAdicionales = [
        {id: 'antecedentes', valor: 'si', puntos: 10, texto: 'Antecedentes familiares'},
        {id: 'infecciones', valor: 'si', puntos: 12, texto: 'Infecciones prenatales'},
        {id: 'ototoxicos', valor: 'si', puntos: 12, texto: 'Medicamentos ototóxicos'},
        {id: 'ucin', valor: 'si', puntos: 8, texto: 'Ingreso en UCIN'}
    ];
    factoresAdicionales.forEach(factor => {
        if (document.getElementById(factor.id).value === factor.valor) {
            puntuacion += factor.puntos;
            factoresRiesgo.push(`<span class="badge bg-secondary factor-badge">${factor.texto} (+${factor.puntos})</span>`);
        }
    });

    // Porcentaje de riesgo
    const porcentajeRiesgo = Math.min(100, Math.round((puntuacion / 107) * 100));

    // Clasificación
    let nivelRiesgo, claseCSS, recomendacion;
    if (porcentajeRiesgo <= 15) {
        nivelRiesgo = 'BAJO';
        claseCSS = 'border-success';
        recomendacion = 'Riesgo bajo: seguimiento rutinario.';
    } else if (porcentajeRiesgo <= 45) {
        nivelRiesgo = 'MEDIO';
        claseCSS = 'border-warning';
        recomendacion = 'Riesgo medio: seguimiento estrecho y nueva evaluación.';
    } else {
        nivelRiesgo = 'ALTO';
        claseCSS = 'border-danger';
        recomendacion = 'Riesgo alto: acción inmediata requerida.';
    }

    // --- Protocolo 1-3-6 ---
    let accionesProtocolo = '<div class="card action-card mb-4"><div class="card-body"><h4 class="card-title"><i class="fas fa-tasks me-2"></i>📋 Acciones Requeridas por Protocolo 1-3-6</h4>';

    if (edadBebe < 1) {
        if ((tipoExamen === 'oae' && oae === '') || (tipoExamen === 'aabr' && aabr === '')) {
            accionesProtocolo += `<div class="alert alert-danger">🚨 PRIORIDAD MÁXIMA: Realizar primer tamizaje auditivo antes de 1 mes de vida.</div>`;
        } else if (oae === 'no_pasa' || aabr === 'anormal') {
            accionesProtocolo += `<div class="alert alert-warning">⚠️ Resultado anormal: debe repetirse antes de los 3 meses.</div>`;
        } else {
            accionesProtocolo += `<div class="alert alert-success">✅ Primer tamizaje cumplido con resultado normal.</div>`;
        }
    } else if (edadBebe <= 3) {
        if (oae === 'no_pasa' || aabr === 'anormal') {
            accionesProtocolo += `<div class="alert alert-danger">🚨 Confirmar diagnóstico completo antes de los 3 meses.</div>`;
        } else {
            accionesProtocolo += `<div class="alert alert-success">✅ Seguimiento rutinario, dentro del protocolo.</div>`;
        }
    } else if (edadBebe <= 6) {
        if (oae === 'no_pasa' || aabr === 'anormal') {
            accionesProtocolo += `<div class="alert alert-danger">🚨 Iniciar intervención inmediata antes de los 6 meses.</div>`;
        } else {
            accionesProtocolo += `<div class="alert alert-success">✅ Protocolo cumplido, seguimiento regular.</div>`;
        }
    } else {
        if (oae === 'no_pasa' || aabr === 'anormal') {
            accionesProtocolo += `<div class="alert alert-danger">🚨 Fuera de protocolo: atención inmediata requerida.</div>`;
        } else {
            accionesProtocolo += `<div class="alert alert-success">✅ Protocolo completado satisfactoriamente.</div>`;
        }
    }

    accionesProtocolo += `</div></div>`;

    // Mostrar resultados
    document.getElementById('valorRiesgo').textContent = `${porcentajeRiesgo}% - RIESGO ${nivelRiesgo}`;
    document.getElementById('recomendacion').textContent = recomendacion;
    document.getElementById('factores').innerHTML = factoresRiesgo.join('');
    document.getElementById('accionesProtocolo').innerHTML = accionesProtocolo;

    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.className = `card shadow-lg ${claseCSS} fade-in`;
    resultadoDiv.style.display = 'block';

    // Posicionar indicador de riesgo
    const riskIndicator = document.getElementById('riskIndicator');
    riskIndicator.style.left = `${porcentajeRiesgo}%`;

    resultadoDiv.scrollIntoView({ behavior: 'smooth' });
}

console.log('Sistema de evaluación auditiva cargado correctamente');
