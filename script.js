document.addEventListener("DOMContentLoaded", function () {
    localStorage.removeItem("usuario"); // obliga a mostrar login siempre
});
function login() {
    const usernameInput = document.getElementById("usernameInput");
    if (!usernameInput) return;

    const username = usernameInput.value.trim();

    if (username === "") {
        alert("Por favor, ingresa un nombre de usuario");
        return;
    }

    localStorage.setItem("usuario", username);

    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("mainScreen").classList.remove("hidden");

    cargarCarpetas();
}

//CARPETAS//
	function crearCarpeta(){
	const input =
	document.getElementById("folderInput")
;
	const nombre =input.value.trim();
	if (nombre ===""){
	alert ("ESCRIBE UN NOMBRE PARA LA CARPETA");
	return;
}
	const carpetas =obtenerCarpetas();
	const nuevaCarpeta= {
	id: Date.now(),
	nombre:nombre,
	tema:"",
	contenido:""
};
	carpetas.push(nuevaCarpeta);
	localStorage.setItem("carpetas",JSON.stringify(carpetas));
	
	input.value="";
	mostrarCarpetas();
}
	function obtenerCarpetas(){
	return JSON.parse(localStorage.getItem("carpetas"))||[];
}
function mostrarCarpetas(){
    const lista = document.getElementById("folderList");
    lista.innerHTML = "";
    const carpetas = obtenerCarpetas();

    carpetas.forEach(carpeta => {
        const div = document.createElement("div");
        div.className = "card";

        const titulo = document.createElement("span");
        titulo.textContent = "📂 " + carpeta.nombre;
        titulo.style.cursor = "pointer";

        titulo.addEventListener("click", function() {
            abrirCarpeta(carpeta.id);
        });

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "BORRAR";

        btnEliminar.addEventListener("click", function() {
            eliminarCarpeta(carpeta.id);
        });

        div.appendChild(titulo);
        div.appendChild(btnEliminar);
        lista.appendChild(div);
    });
}

	function cargarCarpetas(){
	 mostrarCarpetas();
}
 function eliminarCarpeta(id){
	let carpetas= obtenerCarpetas();
	carpetas=carpetas.filter(c=> c.id !== id);
	localStorage.setItem("carpetas",JSON.stringify(carpetas));
	mostrarCarpetas();
}
function abrirCarpeta(id){
    id = Number(id); 

    const carpetas = obtenerCarpetas();
    const carpeta = carpetas.find(c => c.id === id);
    if (!carpeta) return;

    localStorage.setItem("carpetaActiva", id);

    document.getElementById("mainScreen").classList.add("hidden");
    document.getElementById("carpetaScreen").classList.remove("hidden");

    document.getElementById("tituloCarpeta").textContent = carpeta.nombre;
    document.getElementById("temaCarpeta").value = carpeta.tema || "";
    document.getElementById("infoCarpeta").value = carpeta.contenido || "";
}
 function correccion(){
	const inputs=
	document.querySelectorAll("#zonaEstudio input");
	if (inputs.length === 0) { alert("No hay preguntas para corregir"); return;
}
	let correctas =0;
	inputs.forEach(input => {
	const user=
	input.value.trim().toLowerCase();
	const correcta=
	input.dataset.correcta.toLowerCase();
	if (user === correcta) correctas++;
});
	const nota= Math.round((correctas/inputs.length)*10);
	alert(`SACASTE ${nota}/10!!!`);
	guardarProgreso(nota);
}
  function guardarProgreso(nota) {
	let historial=
	JSON.parse(localStorage.getItem("progreso")) || [];
	historial.push(nota);
	localStorage.setItem("progreso",JSON.stringify(historial));
}
function guardarInfo() {
    const id = Number(localStorage.getItem("carpetaActiva"));
    const tema = document.getElementById("temaCarpeta").value.trim();
    const texto = document.getElementById("infoCarpeta").value.trim();

    if (!tema || !texto) {
        alert("Completa tema e información");
        return;
    }

    let carpetas = obtenerCarpetas();
    const carpeta = carpetas.find(c => c.id === id);
    if (!carpeta) return;

    carpeta.tema = tema;
    carpeta.contenido = texto;

    localStorage.setItem("carpetas", JSON.stringify(carpetas));
    alert("Contenido guardado correctamente");
}
 function verProgreso() {
	let historial=
	JSON.parse(localStorage.getItem("progreso")) || [];
	if (historial.length === 0) return alert("Aun no hay notas");
	const promedio=(historial.reduce((a,b)=>a+b,0)/historial.length).toFixed(1);
	alert("TU PROMEDIO: "+ promedio);
}
 function nivelEstudiante() {
	const historial = 
	JSON.parse(localStorage.getItem("progreso")) || [];
	const puntos=historial.reduce((a,b)=>a+b,0);
	let nivel ="Novato"
	if (puntos > 50)nivel= "NADA MAL"
	if (puntos > 100)nivel= "MAESTRO PERFECTO"
	alert("Nivel actual:"+nivel);
}
function generarExamen() {
    const texto = document.getElementById("infoCarpeta").value.trim();
    if (texto === "") return alert("Primero guarda información para estudiar");

    const oraciones = texto.split(".").filter(o => o.trim().length > 20);

    if (oraciones.length < 2) {
        alert("Escribe más contenido para generar un buen examen");
        return;
    }

    let html = "<h3>📝 EXAMEN</h3>";

    oraciones.forEach((o, i) => {
        const palabras = o.trim().split(" ");
        if (palabras.length < 6) return;

const respuesta = palabras[Math.floor(palabras.length / 2)].replace(/[.,]/g,"");
        const pregunta = o.replace(respuesta, "_____");

        html += `
            <p><b>${i + 1}.</b> ${pregunta}</p>
            <input data-correcta="${respuesta}">
            <br><br>
        `;
    });

    html += `<button onclick="correccion()">Enviar respuestas</button>`;

    document.getElementById("zonaEstudio").innerHTML = html;
document.getElementById("carpetaScreen").classList.add("hidden");
document.getElementById("estudioScreen").classList.remove("hidden");
}
function generarFlashcards() {
    const texto = document.getElementById("infoCarpeta").value.trim();
    if (texto === "") return alert("Primero guarda información");

    const frases = texto.split(".").filter(f => f.trim().length > 20);

    let html = "<h3>FLASHCARDS</h3>";

    frases.slice(0, 8).forEach(frase => {
        const palabras = frase.trim().split(" ");
        const mitad = Math.floor(palabras.length / 2);

        const inicio = palabras.slice(0, mitad).join(" ");
        const final = palabras.slice(mitad).join(" ");

        html += `
            <div class="flashcard" onclick="this.classList.toggle('flip')">
                <div class="flashcard-inner">
                    <div class="flashcard-front">${inicio} ...</div>
                    <div class="flashcard-back">${final}</div>
                </div>
            </div>
        `;
    });

    document.getElementById("zonaEstudio").innerHTML = html;
document.getElementById("carpetaScreen").classList.add("hidden");
document.getElementById("estudioScreen").classList.remove("hidden");
}

function volver() {
    document.getElementById("carpetaScreen").classList.add("hidden");
    document.getElementById("mainScreen").classList.remove("hidden");
}
	
function volverACarpeta() {
    document.getElementById("estudioScreen").classList.add("hidden");
    document.getElementById("carpetaScreen").classList.remove("hidden");
    document.getElementById("zonaEstudio").innerHTML="";
}
window.crearCarpeta = crearCarpeta;
window.volver = volver;
window.volverACarpeta = volverACarpeta;
window.guardarInfo = guardarInfo;
window.generarExamen = generarExamen;
window.generarFlashcards = generarFlashcards;
window.login = login;
window.abrirCarpeta = abrirCarpeta;
window.eliminarCarpeta = eliminarCarpeta;
