LifeXP - Inventory and Stash Update v9

Cambios:
- Los objetos del inventario se muestran aunque exista una entrada antigua no reconocida.
- Los objetos reconocidos se pueden abrir para consultar descripcion, stats, rareza y valor.
- Los drops se normalizan mediante IDs validos.
- Se anade el baul de la base con 30 espacios iniciales.
- Se puede mover contenido entre inventario y baul.
- Los objetos apilables ocupan un solo espacio por tipo.
- La capacidad del inventario admite mejoras futuras.
- La capacidad del baul admite mejoras futuras.
- Si inventario y baul estan llenos, el loot queda pendiente en vez de perderse silenciosamente.
- Se anade migracion defensiva para partidas existentes.
- El service worker usa cache v9.

Archivos a sustituir en GitHub:
index.html
game.js
items.js
enemies.js
combat.js
quests.js
classes.js
manifest.json
sw.js

El progreso se mantiene en localStorage del mismo dominio. Publicar una actualizacion no lo borra normalmente. Exporta un save desde Ajustes antes de sustituir archivos importantes.
