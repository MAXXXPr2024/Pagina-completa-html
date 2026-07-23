document.addEventListener('DOMContentLoaded', () => {
    const FORMSPREE_URL = "https://formspree.io/f/mzdnajpn"; 

    // 1. Pelotitas flotantes
    const contenedor = document.getElementById('particulas');
    if (contenedor) {
        for (let i = 0; i < 35; i++) { // Reducido a 35 para mejor rendimiento en celulares
            const pelotita = document.createElement('div');
            pelotita.classList.add('circle');
            pelotita.style.width = `${Math.random() * 6 + 3}px`;
            pelotita.style.height = pelotita.style.width;
            pelotita.style.left = `${Math.random() * 100}%`;
            pelotita.style.animationDuration = `${Math.random() * 11 + 7}s`;
            pelotita.style.animationDelay = `${Math.random() * 12}s`;
            contenedor.appendChild(pelotita);
        }
    }

    // Corregido: Fecha mínima basada en la zona horaria LOCAL del dispositivo
    const fechaInput = document.getElementById('fecha-cita');
    const ahora = new Date();
    const ano = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');
    const hoyLocal = `${ano}-${mes}-${dia}`;
    
    if (fechaInput) {
        fechaInput.value = hoyLocal;
        fechaInput.min = hoyLocal;
    }

    // Elementos
    const pantallaInicio = document.getElementById('pantalla-inicio');
    const imagenFondo = document.getElementById('imagen-fondo-pantalla');
    const musicaIntro = document.getElementById('musica-intro');
    const musicaClimax = document.getElementById('musica-climax');
    const secBienvenida = document.getElementById('sec-bienvenida');
    const secFinal = document.getElementById('sec-final');
    const btnComenzar = document.getElementById('btn-comenzar');
    const fotoCine = document.getElementById('foto-cine');
    
    const videoFestejo = document.getElementById('video-festejo');
    const videoLocal = document.getElementById('video-local');

    // PASO 1: Abrir invitación
    pantallaInicio.addEventListener('click', () => {
        // Pre-cargar/desbloquear videos en móviles durante el primer toque
        if (videoFestejo) videoFestejo.load();
        if (videoLocal) videoLocal.load();

        if (musicaIntro) {
            musicaIntro.play().catch(e => console.log("Audio intro bloqueado:", e));
        }
        pantallaInicio.style.opacity = '0';
        setTimeout(() => {
            pantallaInicio.style.visibility = 'hidden';
        }, 500);
        
        secBienvenida.classList.remove('oculto');
    });

    // PASO 2: Pregunta final
    btnComenzar.addEventListener('click', () => {
        if (musicaIntro) {
            musicaIntro.pause();
            musicaIntro.currentTime = 0;
        }
        if (musicaClimax) {
            musicaClimax.play().catch(e => console.log("Audio climax bloqueado:", e));
        }

        imagenFondo.classList.remove('oculto-fondo');
        secBienvenida.classList.add('oculto');
        secFinal.classList.remove('oculto');
    });

    // Lógica para botón SÍ
    document.getElementById('btn-si').addEventListener('click', () => {
        if (musicaClimax) {
            musicaClimax.pause();
            musicaClimax.currentTime = 0;
        }

        fotoCine.style.display = 'none';
        
        const contenedorVideoSi = document.getElementById('contenedor-video-si');
        contenedorVideoSi.classList.remove('oculto');
        
        if (videoFestejo) {
            videoFestejo.currentTime = 0;
            videoFestejo.play().catch(e => {
                console.log("El navegador bloqueó la reproducción con audio:", e);
                // Fallback si el celular frena el video con sonido: reproduce muteado
                videoFestejo.muted = true;
                videoFestejo.play();
            });
        }

        document.getElementById('texto-final').textContent = "me peino y me baño 🧐🎩";
        document.getElementById('bloque-botones').style.display = 'none';
        document.getElementById('contenedor-cita').classList.remove('oculto');

        lanzarConfeti();
    });

    // Toggle formulario
    document.getElementById('btn-horario').addEventListener('click', () => {
        document.getElementById('info-horario').classList.toggle('oculto');
    });

    // Confirmar Cita (SÍ)
    document.getElementById('btn-confirmar-cita').addEventListener('click', () => {
        const cine = document.getElementById('select-cine').value;
        const fechaVal = document.getElementById('fecha-cita').value;
        const hora = document.getElementById('select-hora').value;
        const mensaje = document.getElementById('mensaje-si').value;
        const pelicula = "Spider-Man: Brand New Day";

        if (!fechaVal) {
            alert("Por favor selecciona una fecha válida 📆");
            return;
        }

        const partesFecha = fechaVal.split('-');
        const fechaFormateada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

        fetch(FORMSPREE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                respuesta: "¡Dijo que SÍ! 🎉",
                invitado: "Ailu",
                pelicula: pelicula,
                cine: cine,
                fecha: fechaFormateada,
                hora: hora,
                mensaje_opcional: mensaje || "Sin mensaje"
            })
        }).catch(e => console.log("Error al enviar correo:", e));

        document.getElementById('info-horario').classList.add('oculto');
        document.getElementById('btn-horario').style.display = 'none';

        const resumen = document.getElementById('resumen-confirmado');
        document.getElementById('detalle-resumen').innerHTML = 
            `🎬 <strong>Película:</strong> ${pelicula}<br>` +
            `📍 <strong>Lugar:</strong> ${cine}<br>` +
            `📆 <strong>Día:</strong> ${fechaFormateada}<br>` +
            `⏰ <strong>Hora:</strong> ${hora}` +
            (mensaje ? `<br>💬 <strong>Nota:</strong> "${mensaje}"` : '');

        resumen.classList.remove('oculto');
        lanzarConfeti();
    });

    // Lógica para botón NO
    document.getElementById('btn-no').addEventListener('click', () => {
        if (musicaClimax) {
            musicaClimax.pause();
            musicaClimax.currentTime = 0;
        }

        fotoCine.style.display = 'none';
        document.getElementById('texto-final').textContent = "ta bien 😞";
        document.getElementById('bloque-botones').style.display = 'none';

        const contenedorVideo = document.getElementById('contenedor-video');
        contenedorVideo.classList.remove('oculto');

        if (videoLocal) {
            videoLocal.currentTime = 0;
            videoLocal.play().catch(e => console.log("Error video NO:", e));
        }

        fetch(FORMSPREE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
                respuesta: "Dijo que NO 😢",
                invitado: "Ailu"
            })
        }).catch(e => console.log(e));
    });

    // Mensaje opcional (NO)
    document.getElementById('btn-enviar-no').addEventListener('click', () => {
        const mensajeNo = document.getElementById('mensaje-no').value;

        if (mensajeNo.trim() !== "") {
            fetch(FORMSPREE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    respuesta: "Mensaje tras decir NO 💬",
                    invitado: "Ailu",
                    mensaje: mensajeNo
                })
            }).catch(e => console.log(e));
        }

        document.getElementById('bloque-mensaje-no').style.display = 'none';
        document.getElementById('confirmacion-mensaje-no').classList.remove('oculto');
    });

    function lanzarConfeti() {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
});