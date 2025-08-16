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

        // Función principal para evaluar el riesgo con porcentajes
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

            // Calcular riesgo como porcentaje
            let puntuacion = 0;
            let factoresRiesgo = [];

            // Evaluación según examen
            if (tipoExamen === 'oae') {
                if (oae === 'no_pasa') {
                    puntuacion += 40;
                    factoresRiesgo.push('<span class="badge bg-danger factor-badge">OAE no pasa (+40)</span>');
                } else if (oae === 'parcial') {
                    puntuacion += 20;
                    factoresRiesgo.push('<span class="badge bg-warning factor-badge">OAE parcial (+20)</span>');
                } else {
                    factoresRiesgo.push('<span class="badge bg-success factor-badge">OAE pasa</span>');
                }
            } else {
                if (aabr === 'anormal') {
                    puntuacion += 40;
                    factoresRiesgo.push('<span class="badge bg-danger factor-badge">AABR anormal (+40)</span>');
                } else if (aabr === 'inconcluso') {
                    puntuacion += 20;
                    factoresRiesgo.push('<span class="badge bg-warning factor-badge">AABR inconcluso (+20)</span>');
                } else {
                    factoresRiesgo.push('<span class="badge bg-success factor-badge">AABR normal</span>');
                }
            }

            // Prematuridad
            if (prematuridad === 'extremo') {
                puntuacion += 25;
                factoresRiesgo.push('<span class="badge bg-danger factor-badge">Prem. extrema (+25)</span>');
            } else if (prematuridad === 'moderado') {
                puntuacion += 12;
                factoresRiesgo.push('<span class="badge bg-warning factor-badge">Prem. moderada (+12)</span>');
            } else {
                factoresRiesgo.push('<span class="badge bg-success factor-badge">Término completo</span>');
            }

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

            // Convertir puntuación a porcentaje (máximo posible: 40+25+10+12+12+8 = 107)
            const porcentajeRiesgo = Math.min(100, Math.round((puntuacion / 107) * 100));

            // Determinar nivel de riesgo basado en porcentaje
            let nivelRiesgo, claseCSS, recomendacion;
            if (porcentajeRiesgo <= 15) {
                nivelRiesgo = 'BAJO';
                claseCSS = 'border-success';
                recomendacion = 'Riesgo bajo: El neonato presenta buen pronóstico auditivo. Programar seguimiento de rutina a los 6 meses.';
            } else if (porcentajeRiesgo <= 45) {
                nivelRiesgo = 'MEDIO';
                claseCSS = 'border-warning';
                recomendacion = 'Riesgo medio: Se requiere seguimiento estrecho. Realizar nueva evaluación auditiva en 2-4 semanas.';
            } else {
                nivelRiesgo = 'ALTO';
                claseCSS = 'border-danger';
                recomendacion = 'Riesgo alto: Probable hipoacusia. Realizar evaluación audiológica completa en las próximas 48-72 horas.';
            }

            // Protocolo 1-3-6 según edad
            let accionesProtocolo = '<div class="card action-card mb-4"><div class="card-body"><h4 class="card-title"><i class="fas fa-tasks me-2"></i>📋 Acciones Requeridas por Protocolo 1-3-6</h4>';
            
            if (edadBebe < 1) {
                if (!tipoExamen) {
                    accionesProtocolo += `
                        <div class="alert alert-danger">
                            <h5><i class="fas fa-exclamation-circle me-2"></i>🚨 PRIORIDAD MÁXIMA</h5>
                            <p>Debe realizarse primer tamizaje auditivo antes de cumplir 1 mes según la Ley 1980 de 2019.</p>
                            <ul>
                                <li><i class="fas fa-calendar-plus me-2"></i>Solicite cita inmediata con su EPS</li>
                                <li><i class="fas fa-hospital me-2"></i>Prefiera realizarlo antes del alta hospitalaria</li>
                                <li><i class="fas fa-bed me-2"></i>Prepare al bebé para el examen durante el sueño</li>
                            </ul>
                        </div>`;
                } else if (oae === 'no_pasa' || aabr === 'anormal') {
                    accionesProtocolo += `
                        <div class="alert alert-warning">
                            <h5><i class="fas fa-exclamation-triangle me-2"></i>⚠️ RESULTADO ANORMAL</h5>
                            <p>Requiere segunda prueba antes de los 3 meses según Resolución 207 de 2024.</p>
                            <ul>
                                <li><i class="fas fa-calendar-check me-2"></i>Gestionar cita para segundo tamizaje</li>
                                <li><i class="fas fa-clock me-2"></i>No espere a que el bebé cumpla 3 meses</li>
                                <li><i class="fas fa-file-alt me-2"></i>Documente todas las gestiones realizadas</li>
                            </ul>
                        </div>`;
                } else {
                    accionesProtocolo += `<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i>✅ Primer tamizaje realizado con resultado normal. Continúe con controles pediátricos regulares.</div>`;
                }
            } else if (edadBebe <= 3) {
                if (oae === 'no_pasa' || aabr === 'anormal') {
                    accionesProtocolo += `
                        <div class="alert alert-danger">
                            <h5><i class="fas fa-bell me-2"></i>🚨 URGENTE: Confirmar diagnóstico antes de los 3 meses</h5>
                            <p>Según Resolución 207 de 2024, se debe realizar evaluación diagnóstica completa.</p>
                            <ul>
                                <li><i class="fas fa-phone-alt me-2"></i>Exija a la EPS cita inmediata</li>
                                <li><i class="fas fa-file-signature me-2"></i>Si no obtiene respuesta en 48h, presente derecho de petición</li>
                                <li><i class="fas fa-headset me-2"></i>Contacte a INSOR: (601) 593 7676</li>
                            </ul>
                        </div>`;
                } else {
                    accionesProtocolo += `<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i>✅ El bebé está dentro del protocolo adecuado. Continúe con seguimiento rutinario.</div>`;
                }
            } else if (edadBebe <= 6) {
                if (oae === 'no_pasa' || aabr === 'anormal') {
                    accionesProtocolo += `
                        <div class="alert alert-danger">
                            <h5><i class="fas fa-skull-crossbones me-2"></i>🚨 EMERGENCIA: Iniciar intervención antes de los 6 meses</h5>
                            <p>Si se confirma pérdida auditiva, debe iniciarse intervención inmediata.</p>
                            <ul>
                                <li><i class="fas fa-stopwatch me-2"></i>Solicite evaluación diagnóstica en 72 horas</li>
                                <li><i class="fas fa-play-circle me-2"></i>Inicie intervención inmediata tras confirmación</li>
                                <li><i class="fas fa-hands-helping me-2"></i>Contacte a INSOR para orientación</li>
                                <li><i class="fas fa-balance-scale me-2"></i>Presente tutela si la EPS no garantiza atención</li>
                            </ul>
                        </div>`;
                } else {
                    accionesProtocolo += `<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i>✅ El bebé está dentro del protocolo adecuado.</div>`;
                }
            } else {
                if (oae === 'no_pasa' || aabr === 'anormal') {
                    accionesProtocolo += `
                        <div class="alert alert-danger">
                            <h5><i class="fas fa-fire me-2"></i>🚨 ATENCIÓN INMEDIATA REQUERIDA</h5>
                            <p>Aunque se han superado los plazos óptimos, es crucial actuar inmediatamente.</p>
                            <ul>
                                <li><i class="fas fa-stopwatch-20 me-2"></i>Solicite evaluación audiológica en 24-48 horas</li>
                                <li><i class="fas fa-running me-2"></i>Inicie intervención inmediatamente</li>
                                <li><i class="fas fa-hands-helping me-2"></i>Solicite apoyo de INSOR para programa urgente</li>
                                <li><i class="fas fa-gavel me-2"></i>Presente acción de tutela</li>
                            </ul>
                        </div>`;
                } else {
                    accionesProtocolo += `<div class="alert alert-success"><i class="fas fa-check-circle me-2"></i>✅ El bebé ha completado el protocolo adecuadamente.</div>`;
                }
            }
            
            accionesProtocolo += `<p class="text-muted mt-3"><small><i class="fas fa-book me-2"></i>Ley 1980 de 2019 - Resolución 207 de 2024 - Ministerio de Salud y Protección Social</small></p></div></div>`;
            
            // Mostrar resultados con porcentaje
            document.getElementById('valorRiesgo').textContent = `${porcentajeRiesgo}% - RIESGO ${nivelRiesgo}`;
            document.getElementById('recomendacion').textContent = recomendacion;
            document.getElementById('factores').innerHTML = factoresRiesgo.join('');
            document.getElementById('accionesProtocolo').innerHTML = accionesProtocolo;

            const resultadoDiv = document.getElementById('resultado');
            resultadoDiv.className = `card shadow-lg ${claseCSS} fade-in`;
            resultadoDiv.style.display = 'block';

            // Posicionar indicador de riesgo según porcentaje
            const riskIndicator = document.getElementById('riskIndicator');
            riskIndicator.style.left = `${porcentajeRiesgo}%`;

            // Scroll a resultados
            resultadoDiv.scrollIntoView({ behavior: 'smooth' });
        }

        // Mensaje de inicio
        console.log('Sistema de evaluación auditiva cargado correctamente');