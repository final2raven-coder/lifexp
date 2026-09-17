# LifeXP — Mission System Contract M0

**Fase:** M0 — Contract and reconciliation  
**Estado:** contrato aprobado para implementación por fases  
**Alcance de este documento:** contrato de dominio y compatibilidad; no implementa código runtime  
**Idioma de este documento:** español interno; todo contenido visible del juego continúa en inglés

---

## 1. Propósito

Este contrato define la base técnica y de producto para convertir las misiones en el sistema narrativo central de LifeXP.

La unidad narrativa canónica será la **mission action**: una acción que el jugador puede iniciar, avanzar mediante eventos compatibles y completar para producir revelaciones, consecuencias, follow-ups u otras posibilidades.

El contrato evita ampliar indefinidamente el modelo actual con excepciones específicas para quests, objetos, tareas o IDs concretos.

La implementación se ejecutará en fases M1–M9. Este documento cierra únicamente M0.

---

## 2. Estado real de partida para la implementación

El repositorio actual contiene:

- un save canónico con `saveVersion: 4`;
- un modelo de quests separado con `questModelVersion: 2`;
- quests legacy basadas en `objectives`;
- quests DT-24 basadas en `stages` y objetivos persistentes;
- `completionId` para evitar progreso duplicado;
- `availableFollowUps` y `derivedTasks` como campos persistentes iniciales;
- recompensas con ledger, estados de recuperación y entrega idempotente;
- un flujo canónico de completado de tareas en `ui_tasks.js`;
- actualización de progreso de quests desde `quests.js`.

Estos elementos se conservan. El sistema de acciones se construirá como una evolución compatible, no como una sustitución destructiva.

---

## 3. Principios obligatorios

1. `gameState` es el único estado mutable del juego.
2. `gameState.quests` es el único contenedor persistente de estado de misiones, acciones, revelaciones y consecuencias.
3. El catálogo de contenido es estático y declarativo; el progreso del jugador es persistente y separado.
4. Las quests legacy y DT-24 continúan siendo legibles y recuperables.
5. Las nuevas misiones usarán actions como modelo canónico.
6. Las tareas normales y las tareas temporales usan el mismo flujo canónico de completado.
7. Una acción nunca completa una tarea directamente desde la pantalla de misión.
8. Los eventos se consumen mediante identificadores estables e idempotentes.
9. Las recompensas y consecuencias se aplican dentro de fronteras transaccionales existentes o equivalentes.
10. Las diferencias de comportamiento viven en datos declarativos, nunca en ramas por ID.
11. La interfaz solo muestra acciones, revelaciones, objetos, enemigos, lugares y recompensas descubiertos legítimamente.
12. El grafo futuro completo de una misión nunca se muestra por anticipado.
13. Todo texto visible del juego permanece en inglés.
14. La ausencia o interrupción del jugador no puede dejar una misión permanentemente bloqueada si existe una ruta de recuperación declarada.

---

## 4. Separación entre catálogo y save

### 4.1 Catálogo estático

El catálogo define qué puede existir en el juego. Vive en `quests.js` y en las expansiones de contenido.

Puede declarar:

- mission definitions;
- routes o chapters;
- actions;
- requisitos;
- criterios de eventos;
- derived-task templates;
- reveals;
- consequences;
- follow-ups;
- mission sources;
- recovery routes.

El catálogo no contiene el progreso del jugador.

### 4.2 Estado persistente

El save registra qué ha iniciado, completado, descubierto o reclamado el jugador.

El estado persistente debe conservar, como mínimo:

- instancias de misión;
- acción activa por instancia cuando exista;
- acciones iniciadas y completadas;
- eventos consumidos;
- tareas derivadas y su ciclo de vida;
- revelaciones descubiertas;
- consecuencias reclamadas, pendientes o rechazadas;
- follow-ups disponibles;
- estado de recuperación;
- estado de recompensas.

Los nombres exactos de las propiedades pueden ajustarse en M1 si se preserva este contrato semántico y la compatibilidad con el save actual.

---

## 5. Modelo de dominio

### 5.1 Mission definition

Entrada declarativa del catálogo.

Debe expresar:

- `id` estable;
- tipo y origen;
- grupo de cupo;
- requisitos;
- rutas o nodos;
- acciones disponibles según el estado descubierto;
- recompensas y consecuencias declarativas;
- política de expiración cuando aplique.

No contiene progreso.

### 5.2 Mission instance

Estado persistente de una misión aceptada o descubierta.

Debe expresar:

- `missionId` o referencia equivalente;
- `instanceId` estable;
- estado de la misión;
- fecha de inicio;
- origen;
- ruta o nodo actual;
- acción activa;
- acciones completadas;
- eventos consumidos;
- IDs de tareas derivadas;
- IDs de revelaciones aplicadas;
- claims de consecuencias;
- estado de recuperación;
- estado de recompensas.

Los índices existentes `active`, `completed` y `failed` se mantienen como índices compatibles. No se crean índices paralelos que puedan divergir.

### 5.3 Route node

Agrupación narrativa que organiza acciones.

Estados admitidos:

- `locked`;
- `available`;
- `active`;
- `completed`;
- `blocked`;
- `needs_recovery`.

La interfaz solo muestra nodos que hayan sido descubiertos o que el contrato permita presentar como siguiente paso legítimo.

### 5.4 Mission action

Unidad narrativa que el jugador puede iniciar.

Una definición de acción debe declarar:

- `id` estable dentro de su misión;
- nodo o ruta de pertenencia;
- texto visible en inglés;
- requisitos declarativos;
- criterios de eventos compatibles;
- objetivo y política de progreso;
- revelaciones;
- consecuencias;
- follow-ups;
- tareas derivadas opcionales.

El estado de una acción usa estos valores:

- `available` — puede iniciarse;
- `in_progress` — el jugador la ha iniciado;
- `awaiting_task` — tiene una tarea compatible pendiente;
- `completed` — su resultado ya fue aplicado;
- `blocked` — tiene un requisito conocido no satisfecho;
- `needs_recovery` — necesita una ruta de investigación o apoyo.

Una acción completada no vuelve a aplicar progreso, revelaciones ni consecuencias salvo que el contenido declare una nueva instancia válida.

### 5.5 Action requirement

Condición declarativa para mostrar o iniciar una acción.

Puede referirse a:

- estado de la misión;
- acción o nodo descubierto;
- objeto legítimamente descubierto;
- uso de objeto desbloqueado;
- categoría o estado del mundo;
- nivel, clase u otro requisito ya soportado;
- una consecuencia previamente reclamada;
- una fuente pasiva o de gremio satisfecha.

No puede depender de una rama específica para un ID concreto en el motor.

---

## 6. Evento canónico y progreso

### 6.1 Evento de tarea

El flujo canónico de completado debe producir un evento normalizado equivalente a:

```js
{
  type: 'task_completed',
  completionId: 'stable-completion-id',
  taskId: 'task-id',
  category: 'category-id',
  date: 'YYYY-MM-DD',
  source: 'standard_task',
  derivedTaskId: null,
  themes: []
}
```

`themes` solo se incluye cuando forma parte del contrato de datos disponible. El evento no inventa temas.

Durante la transición puede aceptarse el nombre legacy `task_complete` en la frontera de entrada, pero el resolver interno trabaja con un único tipo normalizado.

### 6.2 Otros eventos

El mismo resolver debe poder recibir eventos normalizados de:

- enemigo derrotado;
- jefe derrotado;
- subida de nivel;
- objeto equipado;
- uso de objeto descubierto;
- descubrimiento de lugar o referencia;
- evento pasivo satisfecho;
- aceptación o finalización de una misión cuando el contenido lo declare.

Cada evento debe incluir un identificador estable cuando pueda producir progreso o consecuencias.

### 6.3 Regla de consumo

Una combinación de evento y acción no puede producir progreso dos veces.

El estado persistente debe conservar los identificadores consumidos o una estructura equivalente que permita comprobarlo después de recargar.

Un evento recibido cuando una misión o acción no está activa no crea progreso retroactivo salvo que el criterio declarativo lo permita explícitamente.

### 6.4 Criterios de tarea

Un action task criterion puede declarar:

- `eventType`;
- `category`;
- `taskId`;
- `theme`;
- `derivedTaskId`;
- `count` o umbral;
- orden obligatorio o libre;
- política de consumo de eventos.

La selección de una tarea compatible es una decisión de datos y resolución genérica, no una condición especial por misión.

---

## 7. Tareas derivadas

Una tarea derivada es una tarea creada por una acción para que el jugador la realice mediante el flujo normal.

Debe conservar:

- ID estable;
- misión y acción de origen;
- template de origen;
- nombre y descripción práctica en inglés;
- categoría;
- disponibilidad;
- estado de ciclo de vida;
- fecha de creación;
- expiración si aplica;
- política de archivo;
- historial y completionId normal del sistema de tareas.

Estados mínimos:

- `pending` — definida pero todavía no aceptada o presentada;
- `accepted` — disponible para el jugador;
- `completed` — completada por el flujo canónico;
- `expired` — ya no disponible, pero conservada;
- `needs_review` — referencia o definición no resoluble.

Flujo obligatorio:

```text
acción de misión
    ↓
abre una tarea compatible
    ↓
flujo canónico de tarea
    ↓
recompensa e historial normales
    ↓
evento task_completed
    ↓
progreso de la acción
```

La pantalla de misión no tendrá un botón alternativo que marque la tarea como completada ni que entregue su recompensa.

Si una definición de misión desaparece temporalmente, una tarea derivada persistida no se elimina en silencio: queda visible y recuperable o se marca `needs_review`.

---

## 8. Revelaciones y diario

Una reveal es información que se hace visible cuando se cumple una condición legítima.

Debe declarar:

- ID estable;
- acción o consecuencia de origen;
- título y cuerpo visibles en inglés;
- requisito de descubrimiento;
- referencia opcional a una entidad del mundo;
- estado de descubrimiento.

Aplicación obligatoria:

- se registra desde la lógica de dominio;
- se aplica como máximo una vez por claim;
- queda persistida tras recargar;
- no aparece antes de su requisito;
- no expone IDs técnicos;
- no muestra futuras revelaciones en forma de lista vacía o previsualización.

El diario solo muestra registros ya descubiertos.

---

## 9. Consecuencias y claims

Una consequence es un cambio declarativo producido por una acción, una revelación o un nodo completado.

Tipos iniciales soportados por el contrato:

- recompensa de XP u oro mediante las fronteras existentes;
- entrega de objeto mediante la entrega canónica;
- desbloqueo de un uso de objeto descubierto;
- revelación de una acción, lugar o referencia;
- disponibilidad de un follow-up;
- creación de una tarea derivada;
- cambio de estado de misión o acción;
- registro de un estado del mundo.

Cada consecuencia debe tener:

- `claimId` estable;
- referencia de origen;
- estado `granted`, `pending` o `rejected`;
- motivo recuperable cuando no se pueda aplicar;
- datos suficientes para reintentar sin reroll.

Una consecuencia inválida se rechaza antes de guardar. No se crea un objeto ficticio ni se sustituye una referencia por otra aleatoria.

La aplicación de consecuencias debe ser transaccional: si falla una parte que obligue a abortar la operación, se restaura la memoria y los bytes anteriores del save.

---

## 10. Follow-ups

Un follow-up es una definición de misión que pasa a estar disponible como consecuencia de una acción o estado descubierto.

Reglas:

- se registra en `gameState.quests.availableFollowUps` o estructura canónica equivalente;
- aparece solo después de cumplir el requisito;
- no se acepta automáticamente salvo que la definición declare una entrega pasiva;
- respeta los cupos declarativos existentes;
- utiliza la aceptación canónica de quests;
- es idempotente;
- permanece recuperable si la presentación o el guardado falla;
- no revela el contenido completo del follow-up antes de descubrirlo.

No se crea una segunda lista de misiones fuera de `gameState.quests`.

---

## 11. Fuentes de misión

El contrato reconoce tres orígenes:

1. **Personal discovery:** acción iniciada por una pista, objeto, lugar o decisión ya descubierta.
2. **Passive world event:** misión o acción disponible tras una condición del mundo o del tiempo.
3. **Guild source:** misión presentada por una actividad de gremio, con requisito, coste, slot y recompensa declarativos.

Una fuente debe declarar:

- condición de activación;
- misión o acción que hace disponible;
- presentación automática o manual;
- política de expiración y retorno;
- requisitos de descubrimiento;
- coste y recompensas cuando aplique;
- consecuencias.

Ninguna fuente crea un almacén alternativo. La misión resultante utiliza la instancia y persistencia canónicas.

---

## 12. Recuperación

La recuperación es una ruta de apoyo, no un atajo para inventar progreso.

Debe:

- aparecer únicamente cuando no exista un siguiente paso claro o cuando el contenido lo declare;
- ofrecer al menos una dirección investigable y legítima;
- conservar el estado tras recargar;
- no revelar el grafo completo;
- no generar recompensas nuevas;
- no repetir revelaciones;
- no modificar aleatoriamente el contenido de una misión;
- poder cerrarse o retomarse sin perder el progreso existente.

La primera abstracción del motor será genérica. Su presentación fantástica concreta pertenece al catálogo de contenido posterior.

---

## 13. Compatibilidad con quests existentes

### Legacy objectives

Las quests basadas en `objectives` siguen siendo cargables y progresables durante la transición.

Un adaptador podrá traducir un evento canónico a progreso legacy mientras la quest no haya sido convertida al modelo de acciones.

No se eliminan objetivos antiguos ni se reinicia su progreso.

### DT-24 stages

Las quests basadas en `stages` siguen siendo cargables y progresables con su modelo actual mientras no se conviertan.

Sus `completionIds`, estados terminales, recompensas y cupos siguen siendo válidos.

### Nuevas quests

El contenido nuevo que requiera narrativa, acciones, revelaciones o consecuencias debe usar el modelo de actions, no ampliar indefinidamente los objetivos legacy.

La conversión de catálogo existente queda para M8 y no forma parte de M0 ni M1.

---

## 14. Migración y transacciones

M0 no cambia `saveVersion` ni escribe una migración runtime.

M1 deberá:

- introducir la versión específica del modelo de acciones de forma secuencial;
- preservar `saveVersion: 4` salvo necesidad técnica demostrada;
- conservar campos desconocidos;
- normalizar arrays, estados e IDs;
- mantener objetivos legacy, stages, recompensas y tareas derivadas;
- ser determinista, idempotente y no destructiva;
- crear snapshot previo antes de persistir una migración;
- restaurar bytes y memoria ante cualquier fallo.

La carga de un save con datos parciales no debe convertir incertidumbre en progreso inventado. Lo no resoluble se conserva visible como `needs_review` o mediante el mecanismo recuperable equivalente.

---

## 15. Contrato de UI y anti-spoiler

La pantalla de misión debe presentar, progresivamente:

- situación actual descubierta;
- información ya registrada;
- acción disponible o en curso;
- tareas compatibles;
- progreso actual;
- cambios ya aplicados;
- recuperación cuando proceda.

No debe mostrar:

- el grafo completo de acciones futuras;
- recompensas no descubiertas;
- usos de objetos todavía bloqueados;
- nombres de entidades no descubiertas;
- IDs técnicos;
- controles que completen tareas fuera del flujo canónico.

Los estados sin acción disponible deben distinguir entre:

- esperando una tarea disponible;
- requisito conocido no cumplido;
- contenido todavía no descubierto;
- necesidad de recuperación;
- error recuperable.

---

## 16. Límites de M0

M0 no incluye:

- cambios en `engine.js`, `quests.js`, `ui_tasks.js` o `ui_quests.js`;
- nuevas migraciones de save;
- nuevas quests o nombres narrativos;
- creación de tareas temporales runtime;
- diario visible;
- fuentes pasivas o de gremio ejecutables;
- cambios de balance;
- rediseño visual global;
- conversión del catálogo existente.

Esas tareas pertenecen a M1–M9 y deben ejecutarse en sesiones y ramas separadas.

---

## 17. Criterio de cierre de M0

M0 se considera cerrado cuando:

- existe una definición única de mission action;
- está separada la definición estática del estado persistente;
- se documenta la compatibilidad con objectives y stages;
- se define cómo los eventos llegan a las acciones;
- se define cómo se aplican revelaciones, consecuencias y follow-ups;
- se define el ciclo de vida de tareas derivadas;
- se define recuperación sin spoilers;
- se actualiza `PROJECT_MAP.md`;
- no se ha cambiado código runtime.

**Siguiente fase:** M1 — Persistent action foundation.
