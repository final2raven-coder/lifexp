LifeXP - Update 1 + quest modal fix

Archivos oficiales actualizados para GitHub.

Cambios principales:
- Se anade openModal(), que faltaba y rompia el boton de quests disponibles.
- Se conserva el inicio con 0 quests activas.
- Las quests disponibles se pueden abrir y aceptar manualmente.
- El listado reconoce requisitos minLevel y levelReq.
- El render de quests muestra progreso basico tambien para quests antiguas.
- Se conservan las tareas personalizadas existentes al cargar una partida.
- Se evita anadir dos veces contenido oficial.
- El service worker usa cache v7.

Sustituye estos archivos en el repositorio:
index.html
game.js
items.js
enemies.js
combat.js
quests.js
classes.js
manifest.json
sw.js

No hace falta anadir ningun script nuevo ni ejecutar comandos desde la app.
