Aquí documento mi flujo de trabajo utilizando las herramientas de IA integradas en Cursor, como el chat contextual, el autocompletado y la generación de código en línea, aplicadas al proyecto TaskFlow.


Función refactorizada
const btn = document.getElementById('theme-toggle');
const html = document.documentElement;
if (btn) {
    btn.addEventListener('click', () => {
        const isDark = html.classList.toggle('dark');
        btn.innerText = isDark ? 'Modo Claro' : 'Modo Oscuro';
    });
}

Por qué este cambio es mejor
Menos código, misma lógica: antes hacía el toggle y luego otra vez classList.contains('dark'); ahora reutilizo el valor que devuelve toggle (true si activa, false si desactiva).
Más legible: el operador ternario deja muy claro el contrato estado oscuro → "Modo Claro" / estado claro → "Modo Oscuro" en una sola línea.

Función refactorizada

 <script>
        const btn = document.getElementById('theme-toggle');
        const html = document.documentElement;

        if (btn) {
            const setThemeLabel = (isDark) => {
                btn.innerHTML = isDark ? '☀️ claro' : '🌙 oscuro';
            };

            // Estado inicial del botón según el tema actual
            setThemeLabel(html.classList.contains('dark'));

            btn.addEventListener('click', () => {
                const isDark = html.classList.toggle('dark');
                setThemeLabel(isDark);
            });
        }
    </script>

    Ahora tanto la función claro como oscuro tienen un icono que cambia en función de
    el fondo que el usuario prefiera.

    Cursor está siendo especialmente util en la función que cambia el fondo entre claro y oscuro,
    pero también ha sido de mucha ayuda guardando las preferencias del usuario en LocalStorage, porque ha abreviado y optimizado el código, que era bastant más denso antes.