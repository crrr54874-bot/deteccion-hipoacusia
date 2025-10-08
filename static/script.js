// Función para mostrar el campo de resultado según el examen seleccionado
function mostrarResultadoExamen() {
    const tipoExamen = document.getElementById('tipoExamen').value;
    const resultadoOAE = document.getElementById('resultadoOAE');
    const resultadoPEAA = document.getElementById('resultadoPEAA');

    resultadoOAE.style.display = 'none';
    resultadoPEAA.style.display = 'none';

    document.getElementById('oae').value = '';
    document.getElementById('peaa').value = '';

    if (tipoExamen === 'oae') {
        resultadoOAE.style.display = 'block';
    } else if (tipoExamen === 'peaa') {
        resultadoPEAA.style.display = 'block';
    }
}

// Función principal para evaluar el riesgo
function evaluarRiesgo() {
    const edadBebe = parseInt(document.getElementById('edadBebe').value) || 0;
    const tipoExamen = document.getElementById('tipoExamen').value;
    const oae = document.getElementById('oae').value;
    const peaa = document.getElementById('peaa').value;
    const prematuridad = document.getElementById('prematuridad').value;
    const antecedentes = document.getElementById('antecedentes').value;
    const infecciones = document.getElementById('infecciones').value;
    const ototoxicos = document.getElementById('ototoxicos').value;
    const ucin = document.getElementById('ucin').value;

    // Validación de edad (máximo 6 meses)
    if (edadBebe < 0 || edadBebe > 6) {
        alert('La edad del bebé debe estar entre 0 y 6 meses.');
        return;
    }

    // Validación de campos generales
    if (!tipoExamen || !prematuridad || !antecedentes || !infecciones || !ototoxicos || !ucin) {
        alert('Por favor, complete todos los campos antes de evaluar el riesgo.');
        return;
    }

    // Validación específica según examen seleccionado
    if (tipoExamen === 'oae') {
        if (!oae) {
            alert('Por favor, seleccione el resultado del examen OAE.');
            return;
        }
    } else if (tipoExamen === 'peaa') {
        if (!peaa) {
            alert('Por favor, seleccione el resultado del examen PEAA.');
            return;
        }
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
        if (peaa === 'anormal') { puntuacion += 40; factoresRiesgo.push('<span class="badge bg-danger factor-badge">PEAA anormal (+40)</span>'); }
        else if (peaa === 'inconcluso') { puntuacion += 20; factoresRiesgo.push('<span class="badge bg-warning factor-badge">PEAA inconcluso (+20)</span>'); }
        else { factoresRiesgo.push('<span class="badge bg-success factor-badge">PEAA normal</span>'); }
    }

    // Prematuridad
    if (prematuridad === 'extremo') { puntuacion += 25; factoresRiesgo.push('<span class="badge bg-danger factor-badge">Prem. extrema (+25)</span>'); }
    else if (prematuridad === 'moderado') { puntuacion += 12; factoresRiesgo.push('<span class="badge bg-warning factor-badge">Prem. moderada (+12)</span>'); }
    else { factoresRiesgo.push('<span class="badge bg-success factor-badge">Término completo</span>'); }

    // Factores adicionales
    const factoresAdicionales = [
        {id: 'antecedentes', valor: 'si', puntos: 10, texto: 'Antecedentes familiares'},
        {id: 'infecciones', valor: 'si', puntos: 12, texto: 'Infecciones prenatales y perinatales'},
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

    // --- Protocolo 1-3-6 OMS con recomendaciones integradas ---
    let accionesProtocolo = '<div class="card action-card mb-4"><div class="card-body">';
    accionesProtocolo += `<h4 class="card-title"><i class="fas fa-tasks me-2"></i>📋 Acciones Requeridas por Protocolo 1-3-6 OMS</h4>`;

    // 🔴 Revisión de riesgo primero
    if (porcentajeRiesgo > 45) {
        accionesProtocolo += `<div class="alert alert-danger">🚨 ALTO RIESGO: Requiere evaluación audiológica inmediata sin importar edad ni resultado del examen.</div>`;
    } else if (porcentajeRiesgo >= 16) {
        accionesProtocolo += `<div class="alert alert-warning">⚠️ Riesgo medio: debe repetirse evaluación y mantener seguimiento estrecho.</div>`;
    } else {
        // 🟢 Bajo riesgo: reglas por edad (solo hasta 6 meses)
        if (edadBebe < 1) {
            accionesProtocolo += `<div class="alert alert-success">✅ Primer tamizaje cumplido con resultado normal.</div>`;
        } else if (edadBebe <= 3) {
            accionesProtocolo += `<div class="alert alert-success">✅ Dentro del protocolo adecuado. Seguimiento rutinario.</div>`;
        } else {
            accionesProtocolo += `<div class="alert alert-success">✅ Protocolo cumplido, continuar seguimiento.</div>`;
        }

        // --- Reglas específicas para el rango de 0-6 meses ---
        if (edadBebe === 1 && (
            (tipoExamen === 'oae' && oae === 'pasa') ||
            (tipoExamen === 'peaa' && peaa === 'normal')
        )) {
            accionesProtocolo += `<div class="alert alert-info">📅 Tiene 1 mes y pasó el examen (${tipoExamen.toUpperCase()}). Recomendación: continuar seguimiento según protocolo.</div>`;
        }

        if (edadBebe === 3 && (
            (tipoExamen === 'oae' && oae === 'pasa') ||
            (tipoExamen === 'peaa' && peaa === 'normal')
        )) {
            accionesProtocolo += `<div class="alert alert-info">📅 Tiene 3 meses y pasó el examen (${tipoExamen.toUpperCase()}). Hito importante del protocolo cumplido.</div>`;
        }

        if (edadBebe === 3 && (
            (tipoExamen === 'oae' && oae === 'no_pasa') ||
            (tipoExamen === 'peaa' && peaa === 'anormal')
        )) {
            accionesProtocolo += `<div class="alert alert-warning">⚠️ Tiene 3 meses y no pasó el examen (${tipoExamen.toUpperCase()}). Recomendación: realizar evaluación complementaria inmediatamente.</div>`;
        }

        if (edadBebe >= 4 && edadBebe <= 6 && tipoExamen === 'peaa' && peaa === 'anormal') {
            accionesProtocolo += `<div class="alert alert-danger">🚨 Tiene entre 4 y 6 meses y no pasó el PEAA. Requiere intervención temprana inmediata.</div>`;
        }
    }

    // 🔹 Recomendaciones adicionales integradas aquí mismo
    if (((tipoExamen === 'oae' && oae === 'pasa') || (tipoExamen === 'peaa' && peaa === 'normal')) &&
        (antecedentes === 'si' || infecciones === 'si' || ototoxicos === 'si' || ucin === 'si')) {
        accionesProtocolo += `<div class="alert alert-info">ℹ️ Aunque pasó el examen, existen factores de riesgo. Recomendación: seguimiento auditivo cada 3 meses hasta completar el primer año.</div>`;
    }

    if ((tipoExamen === 'oae' && oae === 'parcial') || (tipoExamen === 'peaa' && peaa === 'inconcluso')) {
        accionesProtocolo += `<div class="alert alert-warning">⚠️ Resultado parcial/inconcluso. Recomendación: repetir examen en 2–4 semanas para confirmar diagnóstico.</div>`;
    }

    accionesProtocolo += `<div class="alert alert-secondary">👶 Signos de alarma en primeros 6 meses: No responde a sonidos fuertes (1-3 meses), no balbucea (4-6 meses), no gira la cabeza hacia sonidos (3-6 meses).</div>`;

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
