LifeXP - Quest discovery fix v8

Este parche corrige el boton de quests disponibles y fuerza la renovacion de la cache PWA.

Cambios:
- Botones de quests con listeners JavaScript explicitos.
- openModal() muestra el modal y tiene fallback inline de display.
- Validacion defensiva del estado de quests.
- Cache del service worker actualizada a v8.

Sube/sustituye todos los archivos del paquete en GitHub:
index.html
game.js
items.js
enemies.js
combat.js
quests.js
classes.js
manifest.json
sw.js

Despues de publicar, cierra completamente la app y vuelve a abrirla. Si el movil conserva la PWA antigua, desinstala la PWA y anade de nuevo la app desde la URL publicada.
