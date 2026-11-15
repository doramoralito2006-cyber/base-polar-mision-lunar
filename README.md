# Base Polar: Misión Lunar

Videojuego educativo de gestión lunar por turnos, desarrollado con HTML, CSS y JavaScript para ejecutarse en Visual Studio Code y en navegadores modernos.

## Ejecutar el juego

1. Descarga o clona este repositorio.
2. Abre la carpeta \`base-polar-mision-lunar\` en Visual Studio Code.
3. Abre \`index.html\` en el navegador. También puedes utilizar la extensión **Live Server** para recargar automáticamente los cambios.
4. Pulsa **Iniciar misión**.

No requiere Node.js, instalaciones adicionales ni conexión a un servidor. Las fuentes tipográficas externas son opcionales; el juego funciona con fuentes de respaldo si no hay conexión.

## Estructura

- \`index.html\`: pantallas, interfaz y estructura.
- \`styles.css\`: diseño visual adaptable a escritorio y móvil.
- \`game.js\`: recursos, acciones, eventos, turnos y condiciones de victoria/derrota.
- \`assets/\`: carpeta reservada para los gráficos PNG originales del proyecto.

## Reglas principales

- La misión dura 30 días, distribuidos en seis periodos de cinco días.
- Cada periodo comienza con 3 puntos de acción que no se acumulan.
- La meta científica es de 100 puntos.
- Oxígeno, agua o energía en cero provocan el fin de la misión.
- Los eventos de tormenta solar, noche lunar, micrometeorito y oscuridad prolongada requieren decisiones.
- La enciclopedia presenta información científica y no modifica el estado de la partida.

## Recursos gráficos

Los nombres previstos para los PNG están descritos en los requisitos del proyecto.


## Ilustraciones añadidas
Se incorporaron imágenes WebP en `assets/acciones/`, `assets/estructuras/` y `assets/ciencia/`. Los cambios visuales están en `index.html` y `styles.css`; la lógica de `game.js` se mantiene sin modificaciones.
