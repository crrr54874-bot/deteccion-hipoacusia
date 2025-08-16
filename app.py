from flask import Flask, render_template

app = Flask(__name__)

# Datos del protocolo
PROTOCOLO = {
    "ley": "Ley 1980 de 2019",
    "resolucion": "Resolución 207 de 2024",
    "principios": {
        "1": "Primer tamizaje antes de 1 mes",
        "3": "Diagnóstico antes de 3 meses",
        "6": "Intervención antes de 6 meses"
    },
    "contactos": [
        {"nombre": "INSOR", "telefono": "(601) 593 7676", "web": "www.insor.gov.co"},
        {"nombre": "FENASCOL", "telefono": "(601) 610 0087", "web": "www.fenascol.org.co"},
        {"nombre": "Ministerio de Salud", "telefono": "018000960020", "web": "www.minsalud.gov.co"}
    ],
    "recomendaciones": [
        "Guarde todos los resultados de exámenes",
        "Sea persistente con su EPS para agilizar citas",
        "Pregunte por la ruta de atención específica",
        "Documente todas las gestiones realizadas"
    ]
}

@app.route('/')
def index():
    return render_template('index.html', protocolo=PROTOCOLO)

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
