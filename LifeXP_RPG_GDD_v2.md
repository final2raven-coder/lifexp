# LifeXP RPG — Game Design Document v2.0

> Documento de diseño actualizado para revisión de Àngel Verdaguer.
>
> **Estado:** borrador de revisión. Las decisiones marcadas como `[REVISAR]` deben confirmarse antes de integrar la primera gran actualización de contenido.

---

## 1. Visión general

### 1.1 Concepto

LifeXP es un RPG de fantasía en el que el jugador progresa realizando tareas reales que él mismo ha elegido añadir al juego.

La app tiene dos capas inseparables:

- **Objetivo funcional invisible:** ayudar a Àngel a hacer con frecuencia las tareas que quiere hacer y que el TDAH puede dificultar por falta de motivación, activación o claridad.
- **Experiencia visible:** un juego de fantasía real, inmersivo y atractivo, con personaje, mundo, historia, preparación, exploración, enemigos, objetos, clases y decisiones.

La productividad es el motor interno. La fantasía es la experiencia que ve y siente el jugador.

### 1.2 Principio rector

> **LifeXP debe conseguir que Àngel haga sus tareas reales porque quiere volver a jugar, no porque la interfaz le recuerde constantemente que está usando una app de productividad.**

### 1.3 Fantasía del jugador

Àngel y su personaje son prácticamente la misma persona dentro de dos marcos distintos. El personaje representa una versión aventurera de Àngel: alguien que se prepara, aprende, ayuda a otros, investiga problemas y se convierte progresivamente en el héroe que siempre ha querido ser.

El jugador no interpreta a un avatar completamente separado ni una vida ficticia sin relación con la suya. Sus acciones reales son la forma principal de actuar en el mundo del juego.

### 1.4 Experiencia deseada

Al abrir la app, el jugador debe sentir que:

- vuelve a un mundo que continúa existiendo;
- tiene una situación, pista, misión o posibilidad que explorar;
- existe un siguiente paso claro;
- sus acciones tienen consecuencias fantásticas;
- puede preparar su personaje para retos mayores;
- siempre hay algo interesante que descubrir sin sentirse castigado si ha estado ausente.

---

## 2. Realidad y ficción

### 2.1 Regla de separación

La única parte de la experiencia que debe hablar directamente de la vida real es la descripción práctica de la tarea.

La descripción debe permitir entender exactamente qué hay que hacer:

> "Sesión de fuerza de 30 minutos: sentadillas, flexiones, planchas y otros ejercicios que puedas realizar con seguridad."

El resto debe pertenecer al mundo fantástico:

- nombre de la misión;
- contexto;
- diálogos;
- objetivos presentados al jugador;
- lugares;
- enemigos;
- facciones;
- recompensas;
- eventos;
- consecuencias;
- nombres y presentación de sistemas.

### 2.2 Ejemplo de presentación

**Presentación visible:**

> **El Juramento de la Torre Inclinada**
>
> Los cimientos de la torre han comenzado a ceder. Antes de entrar, debes recuperar tu fuerza y preparar el cuerpo para el ascenso.
>
> **Prueba disponible:** prepara tu cuerpo para la expedición.
>
> **Tarea:** descripción práctica real de la tarea que Àngel ha creado.

El motor puede saber que la tarea pertenece a `cuerpo` y que cumple un objetivo de misión, pero esos detalles no tienen que aparecer en la presentación narrativa.

### 2.3 No traducir siempre de forma literal

Una misma tarea real puede aparecer en distintos contextos fantásticos:

- limpiar puede purificar un santuario, reparar un refugio o despejar una ruta;
- estudiar puede descifrar un mapa, aprender un ritual o investigar una amenaza;
- llamar a alguien puede pedir ayuda a una facción o reforzar una alianza;
- ordenar documentos puede preparar permisos, mapas y contratos para una expedición.

La tarea real permanece estable. El contexto fantástico puede cambiar.

### 2.4 Canon del jugador

Las tareas que Àngel ha subido son el canon de su vida dentro del sistema.

El juego debe:

- utilizar esas tareas como base de interacción;
- priorizarlas, sugerirlas y tematizarlas;
- revisarlas periódicamente;
- permitir añadir, quitar, editar y ajustar frecuencias;
- evitar inventar obligaciones importantes que Àngel no haya elegido;
- adaptar el contenido fantástico a las tareas disponibles.

El contenido fantástico no debe forzar a Àngel a mantener una vida ficticia que no corresponde con sus necesidades reales.

---

## 3. Objetivo funcional y TDAH

### 3.1 Objetivo real

El objetivo real no es completar una campaña ni maximizar una puntuación. Es ayudar a Àngel a realizar con frecuencia las tareas que quiere hacer.

La métrica principal de éxito es la repetición sostenible de tareas relevantes, no la cantidad de sistemas desbloqueados.

### 3.2 Fricciones que debe reducir

LifeXP debe ayudar especialmente con:

- dificultad para empezar;
- tareas demasiado ambiguas o grandes;
- falta de motivación inmediata;
- olvido de tareas periódicas;
- dificultad para elegir qué hacer;
- pérdida de continuidad después de una interrupción;
- sensación de que una tarea no tiene recompensa visible.

### 3.3 Reglas de motivación

El sistema debe:

- mostrar un siguiente paso claro;
- permitir una versión mínima razonable cuando sea posible;
- premiar empezar y completar, no solo hacer una ejecución perfecta;
- reconocer volver después de una pausa;
- ofrecer variedad sin obligar a navegar por demasiadas opciones;
- evitar mensajes culpabilizadores;
- evitar castigos severos por romper rachas;
- permitir que una mala semana ralentice el progreso sin destruirlo;
- convertir la planificación y preparación en acciones con valor propio.

### 3.4 Recompensas

La motivación debe proceder principalmente de:

- descubrimiento;
- progresión del personaje;
- identidad y elección de build;
- decisiones;
- colección;
- historia;
- preparación para retos;
- sensación de capacidad.

El juego no debe depender de culpa, alarmas constantes, pérdida excesiva o presión artificial.

---

## 4. Pilares de diseño

### Pilar 1 — Fantasía primero

Cada elemento nuevo debe parecer pertenecer primero a un RPG de fantasía.

### Pilar 2 — Tareas reales como canon

El juego utiliza las tareas que Àngel ha elegido. No sustituye sus prioridades por una lista genérica de productividad.

### Pilar 3 — Preparación con significado

Cuidar el entorno, aprender, organizarse, descansar, ejercitarse y relacionarse son formas de preparar al héroe para afrontar problemas mayores.

### Pilar 4 — Progreso persistente y amable

La ausencia no debe destruir la partida. El mundo puede avanzar, pero siempre debe existir una forma clara de regresar.

### Pilar 5 — Acción inmediata

La app debe reducir la distancia entre abrirla y empezar una tarea. El jugador debe poder actuar sin atravesar una interfaz burocrática.

### Pilar 6 — Profundidad gradual

El mundo puede ser profundo, pero los primeros pasos deben ser claros. Los sistemas avanzados se desbloquean cuando aportan significado.

---

## 5. Inspiraciones de diseño

Estas referencias son fuentes de principios, no plantillas para copiar.

| Referencia | Principios aprovechables | Límites o precauciones |
|---|---|---|
| *Dungeon Meshi* | Preparación, recursos, comida, vida cotidiana con valor aventurero | No convertir todas las tareas en recolección literal |
| *The Witcher* | Investigación, contratos, preparación específica, problemas con contexto | Evitar cinismo constante y ambigüedad agotadora |
| *Monster Hunter* | Prepararse, conseguir materiales, fabricar mejoras, afrontar retos mayores | Evitar grindeo obligatorio |
| Saga *Souls* | Misterio, atmósfera, símbolos, lugares con historia | No usar castigo extremo ni pérdida frustrante |
| *Witch Hat Atelier* | Aprendizaje, creatividad, herramientas y belleza del proceso | Mantener reglas comprensibles |
| *Devil May Cry* | Estilo, iniciativa, dominio y expresión personal | No exigir perfección para progresar |
| *DOOM* | Claridad, acción inmediata y sensación de impacto | No saturar con intensidad constante |
| *Anima: Beyond Fantasy* | Identidad profunda, evolución y caminos poco convencionales | Evitar complejidad ilegible al principio |
| *Break!!* | Aventura accesible, vínculos y mundo acogedor | Mantener personalidad propia |
| *Slay the Spire* / *The Spire* | Decisiones, sinergias, rutas y recompensas con trade-offs | No convertir la vida en una optimización constante |
| *The Binding of Isaac* | Variedad, combinaciones, descubrimiento y humor extraño | No perder coherencia tonal |
| *Dungeons & Dragons* | Facciones, NPCs, rumores, campañas, objetos con historia | No exigir interpretación de personaje separada |
| *Black Desert Online* | Actividades múltiples, progresión persistente y especialización | Evitar grindeo, economía excesiva y retención artificial |

### Mezcla de identidad propuesta

- **Estructura:** *Monster Hunter* + D&D + *Slay the Spire*.
- **Mundo:** *The Witcher* + *Souls* + *Anima*.
- **Sensibilidad:** *Dungeon Meshi* + *Witch Hat Atelier* + *Break!!*.
- **Energía:** *Devil May Cry* + *DOOM*.
- **Variedad:** *Isaac* + *Black Desert Online*.

---

## 6. Mundo y narrativa

### 6.1 Fantasía flexible

El mundo combina fantasía medieval, misterio, magia, exploración y momentos coloridos de aventura. Puede contener humor, ternura, tensión y oscuridad, pero todo debe seguir sintiéndose parte de una misma realidad fantástica.

### 6.2 El mundo responde a la preparación

Las acciones reales del jugador no son tareas administrativas para una entidad externa. Son la preparación, entrenamiento, investigación y cuidado que permiten al personaje actuar.

```text
Problema en el mundo
    ↓
Preparación mediante una tarea real
    ↓
Recurso, conocimiento o capacidad
    ↓
Expedición, decisión o encuentro
    ↓
Nueva posibilidad
```

### 6.3 Tipos de contenido narrativo

- escenas breves;
- rumores;
- contratos;
- expediciones;
- investigaciones;
- preparación de equipo;
- conflictos con facciones;
- encuentros aleatorios;
- decisiones con consecuencias suaves;
- bosses y hitos;
- eventos temporales;
- arcos de temporada.

### 6.4 La historia no debe ser una lista de tareas

El motor puede usar condiciones como completar tareas de una categoría, pero la presentación debe describir una situación del mundo.

**Interno:**

```js
{ type: 'complete_tasks', category: 'casa', count: 3 }
```

**Visible:**

> “Refuerza los sellos del refugio antes de que la niebla alcance las murallas.”

---

## 7. Sistema de tareas

### 7.1 Categorías base

| Categoría | Uso funcional | Traducciones fantásticas posibles |
|---|---|---|
| Casa | Mantener el entorno y la base | refugio, campamento, santuario, taller |
| Cuerpo | Cuidar y preparar el cuerpo | entrenamiento, resistencia, viaje, combate |
| Gestiones | Resolver asuntos y reducir carga administrativa | permisos, mapas, contratos, suministros |
| Social | Mantener vínculos y pedir/ofrecer apoyo | alianzas, rumores, gremios, rescates |
| Personal | Aprender, crear, descansar y avanzar proyectos | estudio, magia, investigación, arte, visiones |

### 7.2 Frecuencias

Se conservan las frecuencias actuales:

- diaria;
- semanal;
- quincenal;
- mensual;
- trimestral;
- semestral;
- anual.

Las frecuencias deben revisarse periódicamente según la vida real de Àngel. No son una prueba de disciplina ni deben generar culpa automática.

### 7.3 Descripción práctica

Toda tarea debe tener una descripción concreta, breve y accionable. Debe evitar lenguaje fantástico cuando la claridad práctica pueda verse afectada.

### 7.4 Presentación temática

El nombre y el contexto de la tarea pueden ser fantásticos cuando se muestra dentro de una misión, pero el jugador siempre debe poder identificar claramente qué acción real tiene que realizar.

### 7.5 Extra Mile

Extra Mile representa una ejecución especialmente completa o una ampliación voluntaria de la tarea.

Debe ser opcional. Nunca debe convertir una tarea normal en un fracaso.

---

## 8. Progresión

### 8.1 Etapas de experiencia

| Etapa | Nivel orientativo | Sensación |
|---|---:|---|
| Despertar | 1–3 | Puedo empezar y el mundo responde |
| Preparación | 4–6 | Estoy construyendo una base |
| Primeras expediciones | 7–9 | Mis acciones abren posibilidades |
| Elección | 10+ | Estoy definiendo qué aventurero soy |
| Consolidación | 11–15 | Mi estilo empieza a tener identidad |
| Primer gran arco | 16–20 | Puedo afrontar un reto mayor |

Los niveles son una estructura de diseño, no una obligación de velocidad.

### 8.2 Clases

Las clases expresan estilos de afrontar problemas, no solo roles de combate:

- Guerrero: actuar aunque la tarea pese.
- Arquero: observar, planificar y actuar con precisión.
- Mago: comprender, investigar y construir sistemas.
- Clérigo: cuidar, sostener y ayudar.
- Pícaro: encontrar rutas eficientes y aprovechar oportunidades.
- Monje: regular cuerpo y mente y mantener equilibrio.

### 8.3 Primera elección

La primera clase debe sentirse como una decisión de identidad, no como una optimización matemática obligatoria.

---

## 9. Misiones y eventos

### 9.1 Principio

Las misiones envuelven las tareas reales en situaciones fantásticas. No deben parecer checklists de productividad.

### 9.2 Tipos de misión

- diaria;
- simple;
- compuesta;
- historia;
- bounty;
- clase;
- evento;
- expedición;
- investigación;
- preparación.

### 9.3 Objetivos internos y presentación visible

El motor puede registrar categoría, frecuencia, cantidad y tipo de evento. La interfaz debe mostrar consecuencias y acciones dentro del mundo.

### 9.4 Eventos temporales

Los eventos deben ofrecer una atmósfera especial y una razón para volver, sin crear miedo a perderse contenido importante.

Un evento puede:

- cambiar encuentros;
- abrir una línea narrativa;
- ofrecer recompensas cosméticas o de colección;
- alterar temporalmente los temas de tareas;
- introducir una amenaza o visitante.

### 9.5 Fracaso y regreso

La pérdida de continuidad no debe borrar grandes cantidades de progreso. Las misiones pueden:

- quedar en pausa;
- cambiar de estado;
- ofrecer una ruta de recuperación;
- registrar que el mundo esperó;
- transformar un fracaso en una pista o aprendizaje.

---

## 10. Inventario, equipo y recompensas

### 10.1 Función del loot

Los objetos deben crear identidad, curiosidad y decisiones. No deben convertirse en una lluvia de recompensas sin significado.

### 10.2 Tipos

- armas;
- armaduras;
- accesorios;
- artefactos;
- consumibles;
- materiales;
- habilidades;
- objetos de quest;
- cosméticos o títulos futuros.

### 10.3 Recompensas con sentido

Una recompensa puede:

- mejorar un estilo de juego;
- abrir una opción;
- servir para una futura preparación;
- contar una historia;
- cambiar cómo se presenta una tarea;
- facilitar una decisión.

### 10.4 Balance

El progreso debe ser frecuente, pero los objetos potentes deben conservar significado. No se debe resolver la motivación únicamente aumentando XP o drop rate.

---

## 11. Interfaz y experiencia de uso

### 11.1 No requiere instalación manual

El contenido oficial debe venir integrado en la versión publicada de la app. El jugador no debe ejecutar comandos ni pulsar un botón técnico para instalarlo.

### 11.2 Posible función futura del Oráculo

El Oráculo puede servir para:

- revisar el estado de las tareas;
- actualizar frecuencias;
- retirar tareas obsoletas;
- activar una temporada oficial;
- importar o exportar datos;
- consultar el estado de la campaña.

No debe ser necesario para cargar el contenido básico.

### 11.3 Siguiente acción

La pantalla principal debe priorizar una acción clara y rápida. La interfaz puede ser rica, pero nunca debe hacer que elegir qué hacer sea más difícil que hacerlo.

### 11.4 Lenguaje prohibido en la capa narrativa

Evitar:

- productividad;
- objetivos semanales;
- mantener hábitos;
- cumplir cuotas;
- tarea pendiente;
- mejorar la disciplina;
- rendimiento personal.

Preferir:

- preparar;
- investigar;
- reforzar;
- descubrir;
- responder a una llamada;
- seguir una pista;
- restaurar;
- entrenar;
- proteger;
- reclamar una recompensa.

La terminología técnica puede existir en ajustes, importación/exportación y herramientas de mantenimiento.

---

## 12. Revisión periódica del contenido

La revisión periódica es parte del juego y de la operación del sistema.

Internamente se revisa:

- qué tareas siguen siendo relevantes;
- qué tareas se completan con frecuencia;
- cuáles se evitan;
- qué frecuencias funcionan;
- qué categorías están infrautilizadas;
- qué tareas son demasiado ambiguas o grandes;
- qué contenido narrativo sigue teniendo sentido.

Ficcionalmente puede presentarse como:

- consulta al Oráculo;
- revisión del mapa;
- preparación de la siguiente expedición;
- renovación de contratos;
- reorganización del refugio;
- lectura de presagios.

---

## 13. Mapa de contenido inicial

La primera gran actualización debe diseñarse como un paquete coherente, no como listas independientes.

Debe definir:

- contenido por niveles;
- sistemas activos en cada etapa;
- cobertura de las tareas reales de Àngel;
- tipos de misión disponibles;
- ritmo de recompensas;
- primer misterio o amenaza;
- primera elección de clase;
- variedad suficiente para el primer mes;
- estructura de una primera temporada con principio, desarrollo y cierre.

Antes de codificar se crearán estas tablas:

1. mapa de contenido por niveles;
2. matriz de tareas reales;
3. matriz de motivación y fricción;
4. tabla de balance;
5. tabla de inspiración aplicada.

---

## 14. Requisitos técnicos de contenido

### 14.1 Integración

El contenido oficial se integra directamente en:

- `game.js` para tareas y lógica base;
- `items.js` para objetos y drops;
- `enemies.js` para enemigos y encuentros;
- `quests.js` para misiones;
- `classes.js` para clases y progresión.

### 14.2 Compatibilidad

Toda actualización debe:

- conservar partidas existentes;
- evitar duplicados por `id`;
- validar referencias a tareas, objetos y enemigos;
- incluir migración de estado si cambia la estructura del save;
- no requerir comandos desde la app;
- no añadir contenido que el motor no pueda ejecutar;
- documentar cualquier cambio de versión.

### 14.3 Validación

Antes de entregar código se debe comprobar:

- sintaxis JavaScript;
- IDs únicos;
- referencias válidas;
- objetos de recompensas existentes;
- temas de drops existentes;
- enemigos seleccionables por nivel y tipo;
- quests que pueden avanzar y completarse;
- balance de XP, oro y drops;
- comportamiento con una partida nueva y una partida existente.

---

## 15. Preguntas abiertas para revisión

- `[REVISAR]` ¿Qué grado de oscuridad debe tener el mundo en el primer arco?
- `[REVISAR]` ¿Qué elementos de la fantasía personal de Àngel deben aparecer desde el inicio?
- `[REVISAR]` ¿Qué actividades o temas deben quedar fuera del mundo?
- `[REVISAR]` ¿La primera temporada debe cubrir exactamente 8, 10 o 12 semanas?
- `[REVISAR]` ¿Qué nivel de complejidad narrativa es sostenible para la primera versión?
- `[REVISAR]` ¿Qué tipos de recompensas emocionan más: equipo, habilidades, títulos, lugares, aliados o cosméticos?

---

## 16. Resumen ejecutivo

LifeXP es un RPG de fantasía real que utiliza las tareas elegidas por Àngel como acciones del protagonista.

La app no debe parecer una herramienta de productividad con decoración fantástica. Debe parecer un juego en el que prepararse, aprender, cuidar el entorno, entrenar, resolver asuntos y ayudar a otros son las formas reales de avanzar.

La descripción práctica de cada tarea mantiene el vínculo con la realidad. Todo lo demás pertenece al mundo, a la historia y al viaje del personaje.
