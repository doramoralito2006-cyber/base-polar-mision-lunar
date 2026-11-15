(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  // Idiomas de interfaz. Las traducciones se aplican también a textos dinámicos
  // (bitácora, eventos, avisos y resultados) sin modificar la lógica de la misión.
  const LANGUAGE_KEY = "basePolarLanguage";
  let currentLanguage = "en";
  try { currentLanguage = localStorage.getItem(LANGUAGE_KEY) === "es" ? "es" : "en"; } catch(error) { currentLanguage = "en"; }
  const LANGUAGE_PAIRS = [
    ["Base Polar","Polar Base"],["Control de misión","Mission Control"],["Iniciar misión","Start mission"],["Continuar misión","Continue mission"],["Cómo jugar","How to play"],["Datos científicos","Scientific data"],["Ajustes","Settings"],["Volver al inicio","Back to home"],["Volver","Back"],
    ["Manual de misión","Mission manual"],["Administra tus recursos","Manage your resources"],["Usa tus puntos de acción","Use your action points"],["Supera los eventos","Overcome events"],["Investiga","Research"],["Fin de cada periodo:","End of each period:"],
    ["Oxígeno","Oxygen"],["Agua","Water"],["Energía","Energy"],["Comida","Food"],["Moral","Morale"],["Polvo lunar","Lunar dust"],["Ciencia","Science"],["Ciencia acumulada","Accumulated science"],
    ["TELEMETRÍA","TELEMETRY"],["Estado de la base","Base status"],["EN VIVO","LIVE"],["REGISTRO","LOG"],["Bitácora","Mission log"],["ÚLTIMOS DATOS","LATEST DATA"],["OBJETIVO PRINCIPAL","PRIMARY OBJECTIVE"],["de investigación completada","of research completed"],
    ["PLANIFICACIÓN","PLANNING"],["Acciones disponibles","Available actions"],["Cultivar invernadero","Grow greenhouse"],["Extraer hielo lunar","Extract lunar ice"],["Generar oxígeno","Generate oxygen"],["Limpiar polvo","Clean dust"],["Instalar reactor","Install reactor"],["Instalar baterías","Install batteries"],["Experimento científico","Scientific experiment"],["Avanzar 5 días","Advance 5 days"],["Selecciona una acción para preparar la base.","Select an action to prepare the base."],
    ["DÍA ","DAY "],[" / 30"," / 30"],["FASE: ","PHASE: "],["OPERACIONES","OPERATIONS"],["EVENTO","EVENT"],["ECONOMÍA","ECONOMY"],["EVALUACIÓN","EVALUATION"],["PREFERENCIAS","PREFERENCES"],["Música","Music"],["Efectos de sonido","Sound effects"],["Guardar progreso","Save progress"],["Salir al menú principal","Exit to main menu"],["Cerrar ajustes","Close settings"],["Idioma / Language","Language / Idioma"],["Seleccionar idioma","Select language"],
    ["CENTRO DE CONTROL","CONTROL CENTER"],["ARCHIVO DE INVESTIGACIÓN","RESEARCH ARCHIVE"],["INFORME FINAL DE MISIÓN","FINAL MISSION REPORT"],["Misión completada","Mission completed"],["Misión incompleta","Mission incomplete"],["Misión fallida","Mission failed"],["Jugar de nuevo","Play again"],["Reintentar misión","Retry mission"],["Menú principal","Main menu"],["Clasificación de la misión","Mission ranking"],["Decisiones clave","Key decisions"],["Tormenta solar: refugio","Solar storm: shelter"],["Tormenta solar: exposición","Solar storm: exposure"],["Noche lunar: baterías activadas","Lunar night: batteries activated"],["Noche lunar: reactor activado","Lunar night: reactor activated"],["Noche lunar: sin respaldo","Lunar night: no backup power"],["Micrometeorito: invernadero reparado","Micrometeorite: greenhouse repaired"],["Micrometeorito: invernadero sellado","Micrometeorite: greenhouse sealed"],["Oscuridad prolongada: continuar","Extended darkness: continue"],["Solar storm: refugio","Solar storm: shelter"],["Solar storm: exposición","Solar storm: exposure"],["Micrometeorite: invernadero reparado","Micrometeorite: greenhouse repaired"],["Micrometeorite: invernadero sellado","Micrometeorite: greenhouse sealed"],["Lunar night: baterías activadas","Lunar night: batteries activated"],["Lunar night: reactor activado","Lunar night: reactor activated"],["Lunar night: sin respaldo","Lunar night: no backup power"],["Extended darkness: continuar","Extended darkness: continue"],["APRENDIZAJE STEM","STEM LEARNING"],["Día alcanzado","Day reached"],
    ["Reactor de fisión","Fission reactor"],["Invernaderos y LEAF","Greenhouses and LEAF"],["Agua y baja gravedad","Water and low gravity"],["Polvo y regolito","Dust and regolith"],["Noches y regiones polares","Nights and polar regions"],
    ["Sistemas de hábitat nominales","Habitat systems nominal"],["Sistemas nominales","Systems nominal"],["Respaldo energético: no instalado","Power backup: not installed"],["Respaldo: reactor ","Backup: reactor "],["Respaldo: baterías","Backup: batteries"],["energía almacenada","stored energy"],["ACTIVO","ACTIVE"],["ACTIVAS","ACTIVE"],["instalado / sin activar","installed / inactive"],["instaladas / sin activar","installed / inactive"],
    ["¡Objetivo científico cumplido! Sobrevive y conserva oxígeno, agua y energía hasta el día 30.","Scientific objective achieved! Survive and maintain oxygen, water, and energy until day 30."],["Consigue 100 puntos de ciencia y mantén con vida los sistemas críticos hasta el día 30.","Earn 100 science points and keep critical systems running until day 30."],

    ["ALERTA:","ALERT:"],["Qué hacer ahora:","What to do now:"],
    ["Oxígeno bajo: genera oxígeno antes de avanzar el periodo. Si está por debajo del 25%, prioriza esta acción y evita gastar energía en tareas no esenciales.","Low oxygen: generate oxygen before advancing the period. Below 25%, prioritize this action and avoid spending energy on non-essential tasks."],
    ["Agua baja: extrae hielo lunar para recuperar reservas. Ten en cuenta que extraer hielo consume oxígeno y genera polvo.","Low water: extract lunar ice to restore reserves. Remember that ice extraction consumes oxygen and creates dust."],
    ["Energía baja: instala baterías o un reactor antes de la noche lunar. En los días de oscuridad, activa el respaldo cuando aparezca el evento.","Low energy: install batteries or a reactor before lunar night. During dark periods, activate backup when the event appears."],
    ["Comida agotada: cultiva el invernadero para recuperar alimentos y moral. Sin comida, la moral disminuye en cada periodo.","Food depleted: grow the greenhouse to restore food and morale. Without food, morale decreases every period."],
    ["Moral crítica: recupera alimentos con el invernadero y evita decisiones que reduzcan más la moral.","Critical morale: restore food with the greenhouse and avoid choices that reduce morale further."],
    ["Polvo lunar elevado: usa Limpiar polvo antes de avanzar. El polvo alto reduce energía y moral.","High lunar dust: use Clean dust before advancing. High dust reduces energy and morale."],
    ["Invernadero dañado: revisa el evento y compara el coste de reparar con sellarlo. Si reparas, vigila especialmente el oxígeno y el polvo.","Greenhouse damaged: review the event and compare the cost of repairing it with sealing it. If you repair it, watch oxygen and dust closely."],
    ["Sistemas estables: continúa vigilando los recursos y prepara el respaldo energético antes de la noche lunar.","Systems stable: keep monitoring resources and prepare power backup before lunar night."],
    ["Tormenta solar: refugiarse protege a la tripulación, pero cuesta 50 de energía. Comprueba tus reservas antes de elegir.","Solar storm: sheltering protects the crew but costs 50 energy. Check your reserves before choosing."],
    ["Noche lunar: sin luz solar, la energía puede caer rápidamente. Activa el reactor o las baterías instaladas; continuar sin respaldo puede agotar la energía.","Lunar night: without sunlight, energy can drop quickly. Activate the installed reactor or batteries; continuing without backup can drain power."],
    ["Micrometeorito: reparar consume oxígeno y aumenta el polvo. Sellar evita ese coste, pero pierdes el invernadero para el resto de la misión.","Micrometeorite: repairing consumes oxygen and increases dust. Sealing avoids that cost, but you lose the greenhouse for the rest of the mission."],
    ["Oscuridad prolongada: esta decisión reduce la moral. Mantén comida suficiente y evita acumular más penalizaciones.","Extended darkness: this decision reduces morale. Keep enough food and avoid additional penalties."],
    ["Lee el coste de cada opción antes de elegir. La decisión se aplica inmediatamente y después se calcula el consumo del periodo.","Read each option's cost before choosing. The decision applies immediately, then the period's resource consumption is calculated."],
    ["La misión comienza. La base dispone de tres puntos de acción.","The mission begins. The base has three action points."],["Selecciona acciones para preparar la base. Cada periodo dispone de 3 PA.","Select actions to prepare the base. Each period provides 3 AP."],["Progreso recuperado. Continúa tu misión.","Progress restored. Continue your mission."],["No se pudo guardar el progreso en este navegador.","Progress could not be saved in this browser."],["Progreso guardado. Ya puedes continuar la misión desde la portada.","Progress saved. You can continue the mission from the home screen."],["No puedes realizar esa acción ahora.","You cannot perform that action now."],["La misión ha terminado.","The mission has ended."],["Acciones bloqueadas durante un evento o la resolución del periodo.","Actions are locked during an event or period resolution."],["Puntos de acción insuficientes: requiere ","Not enough action points: requires "],[" PA."," AP."],["Invernadero fuera de servicio.","Greenhouse out of service."],["No disponible: ya instalaste las baterías.","Unavailable: batteries are already installed."],["El reactor ya está instalado.","The reactor is already installed."],["No disponible: ya instalaste el reactor.","Unavailable: the reactor is already installed."],["Las baterías ya están instaladas.","Batteries are already installed."],
    ["Oxígeno crítico","Critical oxygen"],["Agua crítica","Critical water"],["Energía crítica","Critical energy"],[" · supervivencia en riesgo"," · survival at risk"],["Sin alimentos · moral −20 por periodo","No food · morale −20 per period"],["Moral de la tripulación crítica","Crew morale critical"],["Acumulación crítica de polvo lunar","Critical lunar dust buildup"],["Reservas de energía bajas","Low energy reserves"],
    ["Día ","Day "],["Tormenta solar","Solar storm"],["Una tormenta solar se aproxima a la base. Debes decidir cómo proteger a la tripulación.","A solar storm is approaching the base. Decide how to protect the crew."],["Refugiarse en el hábitat (−50 energía)","Shelter in the habitat (−50 energy)"],["Ignorar la tormenta (−30 moral)","Ignore the storm (−30 morale)"],["La tripulación se refugió. Energía −50.","The crew took shelter. Energy −50."],["Se ignoró la tormenta. Moral −30.","The storm was ignored. Morale −30."],["Inicio de la noche lunar","Start of lunar night"],["La base entra en un periodo sin aporte solar. ¿Deseas activar el sistema de respaldo (","The base enters a period without solar input. Do you want to activate the backup system ("],["Activar ","Activate "],["Continuar sin respaldo","Continue without backup"],["Sistema de respaldo activado para los periodos nocturnos.","Backup system activated for nighttime periods."],["Se decidió no activar el respaldo energético.","The power backup was not activated."],["Comienza la noche lunar. No hay sistema de respaldo instalado.","Lunar night begins. No backup system is installed."],["Micrometeorito: fuga en el invernadero","Micrometeorite: greenhouse leak"],["Un micrometeorito dañó el invernadero. Puedes reparar la fuga con recursos o sellar y abandonar la instalación.","A micrometeorite damaged the greenhouse. You can repair the leak using resources or seal and abandon the facility."],["Reparar (−30 oxígeno, +40 polvo, −15 moral)","Repair (−30 oxygen, +40 dust, −15 morale)"],["Sellar y abandonar el invernadero","Seal and abandon the greenhouse"],["Oscuridad prolongada","Extended darkness"],["La oscuridad y el aislamiento afectan al ánimo de la tripulación.","Darkness and isolation affect the crew's morale."],["Continuar la misión (−15 moral)","Continue the mission (−15 morale)"],
    ["Periodo finalizado. Se restablecieron los 3 puntos de acción.","Period completed. The 3 action points have been restored."],["Nuevo periodo: selecciona hasta 3 puntos de acción para preparar la base.","New period: select up to 3 action points to prepare the base."],["Avance temporal: la misión alcanza el día ","Time advance: the mission reaches day "],["Periodo en resolución: espera el evento y el balance de recursos.","Period resolving: wait for the event and resource balance."],
    ["¡Misión Artemis completada!","Artemis Mission Completed!"],["La base polar resistió los 30 días y alcanzó el objetivo científico. La tripulación logró la victoria con reservas alimentarias agotadas y moral reducida: una supervivencia ajustada.","The polar base survived all 30 days and achieved the science objective. The crew won with depleted food reserves and low morale: a narrow survival."],["La base polar resistió los 30 días y alcanzó el objetivo científico. La investigación abre el camino para futuras misiones lunares.","The polar base survived all 30 days and achieved the science objective. This research paves the way for future lunar missions."],["La tripulación llegó al día 30, pero no alcanzó los 100 puntos de ciencia necesarios para completar la misión.","The crew reached day 30 but did not achieve the 100 science points required to complete the mission."],["Uno de los sistemas vitales llegó a cero. La supervivencia de la base quedó comprometida antes de completar el objetivo.","A critical system reached zero. The base's survival was compromised before the objective could be completed."],["Supervivencia ajustada","Narrow survival"],["Misión sostenible","Sustainable mission"],["Investigación pendiente","Research incomplete"],["Base no estabilizada","Unstable base"],["Dato STEM: las regiones polares lunares tienen zonas con iluminación prolongada y cráteres en sombra permanente; por eso la ubicación y el almacenamiento de energía son esenciales.","STEM fact: lunar polar regions have areas with prolonged sunlight and permanently shadowed craters; location and energy storage are therefore essential."],["Dato STEM: el regolito lunar es abrasivo y puede afectar sellos, trajes y mecanismos; controlar el polvo es parte importante del diseño de una base.","STEM fact: lunar regolith is abrasive and can affect seals, suits, and mechanisms; dust control is an important part of base design."],
    ["Cultivar invernadero: +25 comida, +10 moral, −15 agua y −20 energía.","Greenhouse grown: +25 food, +10 morale, −15 water, and −20 energy."],["Hielo extraído: +40 agua, +10 ciencia, −15 oxígeno y +20 polvo.","Ice extracted: +40 water, +10 science, −15 oxygen, and +20 dust."],["Generación de oxígeno: +35 oxígeno y −25 energía.","Oxygen generated: +35 oxygen and −25 energy."],["Limpieza completada: −30 polvo lunar.","Cleaning complete: −30 lunar dust."],["Reactor instalado: +20 ciencia. Recuerda activarlo en el evento nocturno.","Reactor installed: +20 science. Remember to activate it during the nighttime event."],["Baterías instaladas: 300 unidades de energía almacenada. Recuerda activarlas en el evento nocturno.","Batteries installed: 300 units of stored energy. Remember to activate them during the nighttime event."],["Experimento completado: +15 ciencia, −10 energía y −5 oxígeno.","Experiment complete: +15 science, −10 energy, and −5 oxygen."],
    ["Una nueva frontera. Una misión de 30 días. Tu objetivo: establecer una base sostenible en el polo sur lunar.","A new frontier. A 30-day mission. Your goal: establish a sustainable base at the lunar south pole."],
    ["Vigila oxígeno, agua, energía, comida, moral y polvo lunar. Si oxígeno, agua o energía llegan a cero, la misión termina.","Monitor oxygen, water, energy, food, morale, and lunar dust. If oxygen, water, or energy reaches zero, the mission ends."],
    ["Cada periodo dispones de 3 PA. Las acciones tienen costes y efectos distintos. Los puntos no se acumulan.","You have 3 AP per period. Actions have different costs and effects. Action points do not accumulate."],
    ["En los días 5, 10, 15 y 20 tendrás que responder a situaciones que afectan a la base.","On days 5, 10, 15, and 20, you will face situations that affect the base."],
    ["Alcanza al menos 100 puntos de ciencia antes de terminar el día 30 para completar la misión.","Earn at least 100 science points before the end of day 30 to complete the mission."],
    ["consumo básico de oxígeno (25), agua (20) y comida (20). La energía depende de si es periodo diurno o nocturno.","basic consumption of oxygen (25), water (20), and food (20). Energy depends on whether it is a daytime or nighttime period."],
    ["Los sistemas de fisión de superficie se estudian como una posible fuente de energía continua para futuras bases lunares. Un reactor puede aportar electricidad durante periodos sin luz solar, pero requiere diseño, blindaje, gestión térmica y sistemas de seguridad.","Surface fission systems are being studied as a possible continuous energy source for future lunar bases. A reactor can provide electricity during periods without sunlight, but requires careful design, shielding, thermal management, and safety systems."],
    ["LEAF (Lunar Effects on Agricultural Flora) es un experimento diseñado para estudiar cómo responden las plantas a las condiciones de la Luna. No debe confundirse con un invernadero lunar operativo ni con resultados agrícolas ya confirmados en la superficie.","LEAF (Lunar Effects on Agricultural Flora) is an experiment designed to study how plants respond to lunar conditions. It should not be confused with an operational lunar greenhouse or with confirmed agricultural results on the surface."],
    ["La gravedad lunar equivale aproximadamente a una sexta parte de la terrestre. La tensión superficial y la capilaridad influyen en el movimiento del agua; los sistemas hidropónicos o aeropónicos deben controlar cuidadosamente humedad, nutrientes, luz y temperatura.","Lunar gravity is approximately one-sixth of Earth's. Surface tension and capillary action affect how water moves; hydroponic or aeroponic systems must carefully control humidity, nutrients, light, and temperature."],
    ["El regolito es la capa de material suelto que cubre la superficie. Sus partículas pueden ser abrasivas, adherirse a superficies y afectar trajes, sellos, paneles y mecanismos. Reducir la entrada de polvo es importante para proteger equipos y tripulación.","Regolith is the layer of loose material covering the surface. Its particles can be abrasive, cling to surfaces, and affect suits, seals, panels, and mechanisms. Limiting dust intrusion is important to protect equipment and crew."],
    ["La iluminación del polo sur lunar varía mucho según el relieve. Algunas elevaciones reciben luz durante periodos prolongados, mientras que ciertos cráteres permanecen en sombra. Por eso, la planificación energética depende de la ubicación concreta y no de una noche uniforme para toda la región.","Lighting at the lunar south pole varies greatly with terrain. Some high points receive sunlight for extended periods, while certain craters remain in shadow. Energy planning therefore depends on the exact location, not on one uniform night across the region."],
    ["La gravedad lunar","Lunar gravity"],["baterías","batteries"],["reactor","reactor"],["PA","AP"],
    ["La misión comienza. La base dispone de tres puntos de acción.","The mission begins. The base has three action points."],
    ["Selecciona una acción para preparar la base.","Select an action to prepare the base."],
    ["Ciencia acumulada","Accumulated science"],["de investigación completada","of research completed"],
    ["Guardar progreso","Save progress"],["Salir al menú principal","Exit to main menu"],
    ["TRIPULACIÓN ","CREW "],["PANELES SOLARES · PREPARADOS","SOLAR ARRAYS · READY"],["PANELES SOLARES · +100","SOLAR ARRAYS · +100"],["NOCHE LUNAR · −173 °C","LUNAR NIGHT · −173 °C"],["Astronautas supervivientes","Surviving astronauts"],["DÍA ","DAY "],["Día ","Day "],["día ","day "],["Misión","Mission"],["completada","completed"],["fallida","failed"],
    ["CONTROL DE MISIÓN","MISSION CONTROL"],["Cultivar invernadero. Cuesta 1 punto de acción.","Grow greenhouse. Costs 1 action point."],["Extraer hielo lunar. Cuesta 2 puntos de acción.","Extract lunar ice. Costs 2 action points."],["Generar oxígeno. Cuesta 1 punto de acción.","Generate oxygen. Costs 1 action point."],["Limpiar polvo lunar. Cuesta 1 punto de acción.","Clean lunar dust. Costs 1 action point."],["Instalar reactor de fisión. Cuesta 3 puntos de acción.","Install fission reactor. Costs 3 action points."],["Instalar baterías de reserva. Cuesta 2 puntos de acción.","Install backup batteries. Costs 2 action points."],["Realizar experimento científico. Cuesta 1 punto de acción.","Perform scientific experiment. Costs 1 action point."],["INFRAESTRUCTURA","INFRASTRUCTURE"],["Estructuras de la base","Base structures"],
    ["Módulo habitacional lunar","Lunar habitat module"],["Módulo habitacional","Habitat module"],
    ["Invernadero lunar","Lunar greenhouse"],["Invernadero","Greenhouse"],
    ["Paneles solares lunares","Lunar solar panels"],["Paneles solares","Solar panels"],
    ["Vehículo rover lunar","Lunar rover vehicle"],["Rover lunar","Lunar rover"],
    ["Estación de comunicaciones","Communications station"],["Torre de comunicaciones","Communications tower"],
    ["Reactor de energía","Power reactor"],["Reactor","Reactor"],
    ["Baterías de reserva","Backup batteries"],["Baterías","Batteries"],
    ["Sistema de soporte vital","Life support system"],["Soporte vital","Life support"],
    ["Relación con la misión:","Mission relevance:"],["+25 comida · +10 moral","+25 food · +10 morale"],["−15 agua · −20 energía","−15 water · −20 energy"],["+40 agua · +10 ciencia","+40 water · +10 science"],["−15 oxígeno · +20 polvo","−15 oxygen · +20 dust"],["+35 oxígeno · −25 energía","+35 oxygen · −25 energy"],["−30 polvo lunar","−30 lunar dust"],["+20 ciencia · respaldo nocturno","+20 science · night backup"],["+300 energía almacenada · respaldo nocturno","+300 stored energy · night backup"],["+15 ciencia · −10 energía","+15 science · −10 energy"],["−5 oxígeno","−5 oxygen"],    ["DECISIÓN DE MISIÓN","MISSION DECISION"],["Evento","Event"],["Sistema de hábitat","Habitat system"],["Puntos de acción","Action points"],["Decisión de misión","Mission decision"],["Volumen de música","Music volume"],["Volumen de efectos","Effects volume"],["Silenciar música y efectos","Mute music and effects"],["Abrir ajustes","Open settings"],["Regresar al juego","Return to game"],["Misión en curso","Mission in progress"],["Objetivo científico","Science objective"],
  ];


  const LANGUAGE_MAP = Object.fromEntries(LANGUAGE_PAIRS);
  const REVERSE_LANGUAGE_MAP = Object.fromEntries(LANGUAGE_PAIRS.map(([es,en]) => [en,es]));
  const LANGUAGE_KEYS = {
    en: Object.keys(LANGUAGE_MAP).sort((a,b)=>b.length-a.length),
    es: Object.keys(REVERSE_LANGUAGE_MAP).sort((a,b)=>b.length-a.length)
  };
  function translateText(value) {
    if (!value || typeof value !== "string") return value;
    const map = currentLanguage === "en" ? LANGUAGE_MAP : REVERSE_LANGUAGE_MAP;
    let result = value;
    LANGUAGE_KEYS[currentLanguage].forEach(source=>{
      if(result.includes(source)) result=result.split(source).join(map[source]);
    });
    return result;
  }
  function buildLetterHeading(element, words) {
    if (!element || element.dataset.language === currentLanguage) return;
    element.replaceChildren();
    let globalGlowIndex = 0;
    words.forEach((word, index) => {
      if (index) element.appendChild(document.createTextNode(" "));
      const wordSpan = document.createElement("span");
      wordSpan.className = "title-word";
      [...word].forEach((letter) => {
        const span = document.createElement("span");
        span.className = "title-letter";
        span.style.setProperty("--glow-index", globalGlowIndex);
        span.textContent = letter;
        span.setAttribute("aria-hidden", "true");
        wordSpan.appendChild(span);
        globalGlowIndex++;
      });
      element.appendChild(wordSpan);
    });
    element.setAttribute("aria-label", words.join(" "));
    element.dataset.language = currentLanguage;
  }
  function updateHomeMissionTitle() {
    buildLetterHeading(document.querySelector("#screen-home .home-title-mark"), ["BASE","POLAR"]);
    buildLetterHeading(document.querySelector("#screen-home h1"), currentLanguage === "en" ? ["LUNAR","MISSION"] : ["MISIÓN","LUNAR"]);
  }
  function translateSubtree(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      const next=translateText(root.nodeValue);
      if(next!==root.nodeValue) root.nodeValue=next;
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      const next=translateText(node.nodeValue);
      if(next!==node.nodeValue) node.nodeValue=next;
    });
    if(root.nodeType===Node.ELEMENT_NODE){
      root.querySelectorAll("[title],[aria-label],[placeholder]").forEach(el=>{
        ["title","aria-label","placeholder","alt"].forEach(attr=>{
          const value=el.getAttribute(attr);
          if(value){const next=translateText(value);if(next!==value)el.setAttribute(attr,next);}
        });
      });
    }
  }
  function applyLanguage(root=document.body) {
    document.documentElement.lang = currentLanguage;
    updateHomeMissionTitle();
    document.title = translateText("Base Polar: Misión Lunar");
    const descriptionMeta = document.querySelector("meta[name=description]");
    if(descriptionMeta) descriptionMeta.setAttribute("content", translateText("Base Polar: Misión Lunar, videojuego educativo de gestión lunar por turnos."));
    translateSubtree(root);
    const selector=document.querySelector("#language-select");
    if(selector&&selector.value!==currentLanguage) selector.value=currentLanguage;
  }
  function setLanguage(language) {
    currentLanguage = language === "es" ? "es" : "en";
    try { localStorage.setItem(LANGUAGE_KEY,currentLanguage); } catch(error) {}
    applyLanguage();
  }
  // Observar únicamente nodos añadidos. Observar characterData aquí provoca
  // un bucle: algunas traducciones contienen el texto de origen como prefijo
  // (por ejemplo, "Moral" -> "Morale"), y se traducirían una y otra vez.
  // Los cambios dinámicos hechos con textContent/innerHTML generan childList.
  const languageObserver = new MutationObserver(records=>{
    records.forEach(record=>{
      if(record.type==="childList") record.addedNodes.forEach(translateSubtree);
    });
  });
  languageObserver.observe(document.body,{subtree:true,childList:true});
  const screens = ["home", "instructions", "encyclopedia", "game", "result"];
  const RESOURCE_META = [
    { key: "oxygen", label: "Oxígeno", image: "assets/recursos/OXÍGENO.png", max: 150, color: "#4FD1C5", critical: true },
    { key: "water", label: "Agua", image: "assets/recursos/AGUA.png", max: 150, color: "#63B3ED", critical: true },
    { key: "energy", label: "Energía", image: "assets/recursos/ENERGIA.png", max: 500, color: "#F6E05E", critical: true },
    { key: "food", label: "Comida", image: "assets/recursos/COMIDA.png", max: 100, color: "#9AE6B4" },
    { key: "morale", label: "Moral", image: "assets/recursos/MORAL.png", max: 100, color: "#F6AD55" },
    { key: "dust", label: "Polvo lunar", image: "assets/recursos/POLVO_LUNAR.png", max: 100, color: "#C5A77A", inverse: true },
    { key: "science", label: "Ciencia", image: "assets/recursos/CIENCIA.png", max: 100, color: "#75D7F0" }
  ];

  const ACTIONS = {
    grow: { name: "Cultivar invernadero", cost: 1 },
    ice: { name: "Extraer hielo lunar", cost: 2 },
    oxygen: { name: "Generar oxígeno", cost: 1 },
    clean: { name: "Limpiar polvo", cost: 1 },
    reactor: { name: "Instalar reactor", cost: 3 },
    battery: { name: "Instalar baterías", cost: 2 },
    experiment: { name: "Experimento científico", cost: 1 }
  };

  const initialState = () => ({
    day: 0, oxygen: 100, water: 100, energy: 300, batteryCharge: 0, food: 100, crewAlive: 4,
    morale: 80, dust: 0, science: 0, actionPoints: 3,
    reactorInstalled: false, batteryInstalled: false,
    backupActive: false, greenhouseDestroyed: false,
    alertActive: false, gameOver: false, phase: 0,
    processedEventDays: [], processedEconomyDays: [], log: [], decisions: []
  });

  const IMAGE_PATHS = {
    day: "assets/fondos/FONDO%2001%20-%20Base%20Lunar%20Diurna.png",
    night: "assets/fondos/FONDO%2002%20-%20Base%20Lunar%20Nocturna.png",
    solar: "assets/fondos/FONDO%2004%20-%20Tormento%20Solar.png",
    meteorite: "assets/fondos/FONDO%2005%20-%20Impacto%20de%20Micrometeorito.png",
    victory: "assets/fondos/FONDO%2006%20-%20Victoria.png",
    failed: "assets/fondos/FONDO%2007%20-%20Derrota.png",
    incomplete: "assets/fondos/FONDO%2008%20-%20Misi%C3%B3n%20Incompleta.png"
  };

  function getMissionBackground() {
    if (state.day === 5) return IMAGE_PATHS.solar;
    if (state.day === 15) return IMAGE_PATHS.meteorite;
    if ([10, 20].includes(state.day)) return IMAGE_PATHS.night;
    return IMAGE_PATHS.day;
  }

  function setImageBackground(element, path) {
    element.style.backgroundImage = 'url("' + path + '")';
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center center";
    element.style.backgroundRepeat = "no-repeat";
  }

  let state = initialState();
  let toastTimer = null;
  let pendingEvent = null;
  // Cada consejo se muestra como máximo una vez por partida, pero un consejo
  // nuevo aparece cuando cambia el problema o se resuelve un evento especial.
  let guidanceSeenKeys = new Set();

  function showMissionGuidance(key, message) {
    const modal = $("#guidance-modal");
    if (!modal || !key || !message || state.gameOver) return;
    const gameScreen = $("#screen-game");
    if (!gameScreen || gameScreen.classList.contains("hidden")) return;
    if (guidanceSeenKeys.has(key)) return;
    guidanceSeenKeys.add(key);
    const messageNode = $("#guidance-message");
    const titleNode = $("#guidance-title");
    const eyebrowNode = $("#guidance-eyebrow");
    const closeNode = $("#close-guidance-btn");
    if (messageNode) messageNode.textContent = translateText(message);
    if (titleNode) titleNode.textContent = currentLanguage === "es" ? "Consejo de misión" : "Mission guidance";
    if (eyebrowNode) eyebrowNode.textContent = currentLanguage === "es" ? "ORIENTACIÓN DE MISIÓN" : "MISSION GUIDANCE";
    if (closeNode) closeNode.setAttribute("aria-label", currentLanguage === "es" ? "Cerrar orientación" : "Close guidance");
    modal.dataset.dismissed = "";
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function showScreen(name) {
    if (!screens.includes(name)) return;
    screens.forEach((screenName) => {
      const screenElement = $("#screen-" + screenName);
      if (!screenElement) return;
      const isActive = screenName === name;
      screenElement.classList.toggle("hidden", !isActive);
      screenElement.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function addLog(message, type = "") {
    state.log.unshift({ message, type, day: state.day });
    state.log = state.log.slice(0, 18);
    renderLog();
  }

  function notify(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function renderLog() {
    const list = $("#log-list");
    list.innerHTML = state.log.map((entry) =>
      '<div class="log-entry ' + entry.type + '"><strong>Día ' + entry.day + ':</strong> ' + entry.message + '</div>'
    ).join("");
    list.scrollTop = 0;
  }

  function resourceClass(value, max, inverse) {
    const ratio = max ? value / max : 0;
    if (inverse) {
      if (ratio >= .7) return "danger";
      if (ratio >= .5) return "warning";
      return "";
    }
    if (ratio < .25) return "danger";
    if (ratio < .5) return "warning";
    return "";
  }

  function renderResources() {
    const list = $("#resource-list");
    const circumference = 2 * Math.PI * 22;
    if (!list.dataset.initialized) {
      list.innerHTML = RESOURCE_META.map((resource) => {
        return '<div class="resource-row" data-resource="' + resource.key + '" style="--resource-color:' + resource.color + '">' +
          '<div class="resource-ring" role="progressbar" aria-label="' + resource.label + '" aria-valuemin="0" aria-valuemax="' + resource.max + '" aria-valuenow="0">' +
            '<svg viewBox="0 0 56 56" aria-hidden="true"><circle class="ring-track" cx="28" cy="28" r="22"></circle><circle class="ring-progress" cx="28" cy="28" r="22" style="stroke-dasharray:' + circumference.toFixed(2) + ';stroke-dashoffset:' + circumference.toFixed(2) + '"></circle></svg>' +
            '<span class="ring-value">0</span>' +
          '</div>' +
          '<div class="resource-info"><div class="resource-title"><img class="resource-icon-image" src="' + resource.image + '" alt="" aria-hidden="true"><span>' + resource.label + '</span></div><div class="resource-value">0 / ' + resource.max + '</div></div>' +
        '</div>';
      }).join("");
      list.dataset.initialized = "true";
    }
    RESOURCE_META.forEach((resource) => {
      const row = list.querySelector('[data-resource="' + resource.key + '"]');
      if (!row) return;
      const value = state[resource.key];
      const displayValue = resource.key === "science" ? Math.min(100, value) : value;
      const accessibleValue = Math.max(0, Math.min(resource.max, value));
      const ratio = clamp(value / resource.max, 0, 1);
      const ring = row.querySelector(".resource-ring");
      // El nombre visible y accesible se actualiza explícitamente al cambiar idioma.
      // Así "Morale" nunca queda en pantalla cuando el idioma seleccionado es español.
      const resourceName = translateText(resource.label);
      const resourceNameNode = row.querySelector(".resource-title span");
      if (resourceNameNode && resourceNameNode.textContent !== resourceName) {
        resourceNameNode.textContent = resourceName;
      }
      ring.setAttribute("aria-label", translateText(resource.label + ": " + displayValue + " de " + resource.max));
      ring.setAttribute("aria-valuenow", String(accessibleValue));
      const ringProgress = ring.querySelector(".ring-progress");
      const alertClass = resourceClass(value, resource.max, resource.inverse);
      ringProgress.classList.toggle("warning", alertClass === "warning");
      ringProgress.classList.toggle("danger", alertClass === "danger");
      ringProgress.style.strokeDashoffset = (circumference * (1 - ratio)).toFixed(2);
      row.querySelector(".ring-value").textContent = displayValue;
      row.querySelector(".resource-value").textContent = displayValue + " / " + resource.max;
    });
    $("#science-value").textContent = state.science + " / 100";
    $("#science-bar").style.width = clamp(state.science, 0, 100) + "%";
    $("#objective-science").textContent = Math.min(100, state.science) + "%";
    $("#objective-bar").style.width = clamp(state.science, 0, 100) + "%";
    const objectiveText = $(".objective-panel p:last-child");
    objectiveText.textContent = state.science >= 100
      ? "¡Objetivo científico cumplido! Sobrevive y conserva oxígeno, agua y energía hasta el día 30."
      : "Consigue 100 puntos de ciencia y mantén con vida los sistemas críticos hasta el día 30.";
  }

    function renderActions() {
    document.querySelectorAll(".action-card").forEach((button) => {
      const key = button.dataset.action;
      const action = ACTIONS[key];
      let disabled = state.phase !== 0 || state.gameOver || state.alertActive || state.actionPoints < action.cost;
      if (key === "grow" && state.greenhouseDestroyed) disabled = true;
      if (key === "reactor" && (state.reactorInstalled || state.batteryInstalled)) disabled = true;
      if (key === "battery" && (state.batteryInstalled || state.reactorInstalled)) disabled = true;
      button.disabled = disabled;
      let reason = "";
      if (state.gameOver) reason = "La misión ha terminado.";
      else if (state.alertActive || state.phase !== 0) reason = "Acciones bloqueadas durante un evento o la resolución del periodo.";
      else if (state.actionPoints < action.cost) reason = "Puntos de acción insuficientes: requiere " + action.cost + " PA.";
      else if (key === "grow" && state.greenhouseDestroyed) reason = "Invernadero fuera de servicio.";
      else if (key === "reactor" && state.batteryInstalled) reason = "No disponible: ya instalaste las baterías.";
      else if (key === "reactor" && state.reactorInstalled) reason = "El reactor ya está instalado.";
      else if (key === "battery" && state.reactorInstalled) reason = "No disponible: ya instalaste el reactor.";
      else if (key === "battery" && state.batteryInstalled) reason = "Las baterías ya están instaladas.";
      button.title = disabled ? reason : action.name + " (" + action.cost + " PA)";
    });
    $("#ap-count").textContent = state.actionPoints;
    $("#advance-btn").disabled = state.phase !== 0 || state.gameOver || state.alertActive;
  }

  function render() {
    $("#day-label").textContent = "DÍA " + state.day + " / 30";
    const crewLabel = $("#crew-status");
    if (crewLabel) crewLabel.textContent = "TRIPULACIÓN " + state.crewAlive + " / 4";
    const environmentLabel = $("#environment-status");
    if (environmentLabel) {
      const isNight = [10, 15, 20].includes(state.day);
      const isSolarDay = [5, 25, 30].includes(state.day);
      environmentLabel.textContent = isNight
        ? "NOCHE LUNAR · −173 °C"
        : isSolarDay ? "PANELES SOLARES · +75 NETOS" : "PANELES SOLARES · PREPARADOS";
      environmentLabel.classList.toggle("night-state", isNight);
      environmentLabel.classList.toggle("solar-state", isSolarDay);
    }
    const phaseNames = ["OPERACIONES", "EVENTO", "ECONOMÍA", "EVALUACIÓN"];
    $("#phase-label").textContent = "FASE: " + (phaseNames[state.phase] || "OPERACIONES");
    setImageBackground($("#screen-game"), getMissionBackground());
    const criticalResource = [
      ["oxygen", "Oxígeno crítico"],
      ["water", "Agua crítica"],
      ["energy", "Energía crítica"]
    ].find(([key]) => state[key] / RESOURCE_META.find((item) => item.key === key).max < .25);
    let statusText = "Sistemas de hábitat nominales";
    let statusLevel = "";
    if (state.greenhouseDestroyed) {
      statusText = "Invernadero fuera de servicio";
      statusLevel = "danger";
    } else if (criticalResource) {
      statusText = criticalResource[1] + " · supervivencia en riesgo";
      statusLevel = "danger";
    } else if (state.food <= 0) {
      statusText = "Sin alimentos · moral −20 por periodo";
      statusLevel = "warning";
    } else if (state.morale < 25) {
      statusText = "Moral de la tripulación crítica";
      statusLevel = "warning";
    } else if (state.dust >= 70) {
      statusText = "Acumulación crítica de polvo lunar";
      statusLevel = "warning";
    } else if (state.energy / 500 < .35) {
      statusText = "Reservas de energía bajas";
      statusLevel = "warning";
    }
    let advice = "Sistemas estables: continúa vigilando los recursos y prepara el respaldo energético antes de la noche lunar.";
    let adviceKey = "stable";
    if (state.greenhouseDestroyed) {
      adviceKey = "greenhouse-destroyed";
      advice = "Invernadero dañado: revisa el evento y compara el coste de reparar con sellarlo. Si reparas, vigila especialmente el oxígeno y el polvo.";
    } else if (criticalResource?.[0] === "oxygen") {
      adviceKey = "critical-oxygen";
      advice = "Oxígeno bajo: genera oxígeno antes de avanzar el periodo. Si está por debajo del 25%, prioriza esta acción y evita gastar energía en tareas no esenciales.";
    } else if (criticalResource?.[0] === "water") {
      adviceKey = "critical-water";
      advice = "Agua baja: extrae hielo lunar para recuperar reservas. Ten en cuenta que extraer hielo consume oxígeno y genera polvo.";
    } else if (criticalResource?.[0] === "energy" || state.energy / 500 < .35) {
      adviceKey = "critical-energy";
      advice = "Energía baja: instala baterías o un reactor antes de la noche lunar. En los días de oscuridad, activa el respaldo cuando aparezca el evento.";
    } else if (state.food <= 0) {
      adviceKey = "critical-food";
      advice = "Comida agotada: cultiva el invernadero para recuperar alimentos y moral. Sin comida, la moral disminuye en cada periodo.";
    } else if (state.morale < 25) {
      adviceKey = "critical-morale";
      advice = "Moral crítica: recupera alimentos con el invernadero y evita decisiones que reduzcan más la moral.";
    } else if (state.dust >= 70) {
      adviceKey = "critical-dust";
      advice = "Polvo lunar elevado: usa Limpiar polvo antes de avanzar. El polvo alto reduce energía y moral.";
    }
    showMissionGuidance(adviceKey, advice);
    const guidanceTitle = $("#guidance-title");
    const guidanceEyebrow = $("#guidance-eyebrow");
    const closeGuidance = $("#close-guidance-btn");
    if (guidanceTitle) guidanceTitle.textContent = currentLanguage === "es" ? "Consejo de misión" : "Mission guidance";
    if (guidanceEyebrow) guidanceEyebrow.textContent = currentLanguage === "es" ? "ORIENTACIÓN DE MISIÓN" : "MISSION GUIDANCE";
    if (closeGuidance) closeGuidance.setAttribute("aria-label", currentLanguage === "es" ? "Cerrar orientación" : "Close guidance");
    $("#system-status").textContent = statusText;
    $("#system-status").className = statusLevel;
    $(".status-dot").className = "status-dot " + statusLevel;
    $("#backup-status").textContent = state.reactorInstalled
      ? "Respaldo: reactor " + (state.backupActive ? "ACTIVO" : "instalado · pendiente de activar")
      : state.batteryInstalled
        ? "Respaldo: baterías " + (state.batteryCharge <= 0 ? "AGOTADAS · 0 / 300" : (state.backupActive ? "ACTIVAS · " : "instaladas · ") + state.batteryCharge + " / 300")
        : "Respaldo energético: no instalado";
    renderResources();
    renderActions();
    renderLog();
  }

  const SAVE_KEY = "basePolarMissionSaveV1";
  function readSavedGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) { return null; }
  }
  function saveCurrentGame() {
    if (state.gameOver || state.alertActive || state.phase !== 0) {
      notify("Guarda la misión cuando termine el evento y estés en la fase de operaciones.");
      return false;
    }
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ state, musicVolume: $("#music-volume").value, effectsVolume: $("#effects-volume").value }));
      return true;
    } catch (error) {
      notify("No se pudo guardar el progreso en este navegador.");
      return false;
    }
  }
  function updateStartButton() {
    const saved = readSavedGame();
    $("#start-btn").querySelector("span:nth-child(2)").textContent = saved && saved.state && !saved.state.gameOver ? "Continuar misión" : "Iniciar misión";
  }
  function resumeGame() {
    guidanceSeenKeys = new Set();
    const saved = readSavedGame();
    if (!saved || !saved.state || saved.state.gameOver) { startGame(); return; }
    state = Object.assign(initialState(), saved.state);
    state.crewAlive = Number.isFinite(state.crewAlive) ? clamp(state.crewAlive, 0, 4) : 4;
    state.energy = clamp(Number.isFinite(state.energy) ? state.energy : 300, 0, 500);
    state.batteryCharge = Number.isFinite(state.batteryCharge)
      ? clamp(state.batteryCharge, 0, 300)
      : (state.batteryInstalled ? 300 : 0);
    pendingEvent = null;
    $("#music-volume").value = saved.musicVolume ?? 50;
    $("#effects-volume").value = saved.effectsVolume ?? 70;
    updateAudioLevels();
    showScreen("game");
    render();
    $("#action-feedback").textContent = "Progreso recuperado. Continúa tu misión.";
  }
  function startGame() {
    guidanceSeenKeys = new Set();
    const guidancePopup = $("#guidance-modal");
    if (guidancePopup) { guidancePopup.dataset.dismissed = ""; guidancePopup.classList.add("hidden"); guidancePopup.setAttribute("aria-hidden", "true"); }
    state = initialState();
    pendingEvent = null;
    try { localStorage.removeItem(SAVE_KEY); } catch (error) {}
    addLog("La misión comienza. La base dispone de tres puntos de acción.", "");
    showScreen("game");
    render();
    $("#action-feedback").textContent = "Selecciona acciones para preparar la base. Cada periodo dispone de 3 PA.";
    updateStartButton();
  }

  function canAct(key) {
    const action = ACTIONS[key];
    if (!action || state.gameOver || state.alertActive || state.phase !== 0) return false;
    if (state.oxygen <= 0 || state.water <= 0 || state.energy <= 0) return false;
    if (state.actionPoints < action.cost) return false;
    if (key === "grow" && state.greenhouseDestroyed) return false;
    if (key === "reactor" && (state.reactorInstalled || state.batteryInstalled)) return false;
    if (key === "battery" && (state.batteryInstalled || state.reactorInstalled)) return false;
    return true;
  }

  function performAction(key) {
    if (!canAct(key)) {
      notify("No puedes realizar esa acción ahora.");
      return;
    }
    const cost = ACTIONS[key].cost;
    state.actionPoints -= cost;
    const messages = {
      grow: () => {
        state.food = clamp(state.food + 25, 0, 100);
        state.morale = clamp(state.morale + 10, 0, 100);
        state.water = clamp(state.water - 15, 0, 150);
        state.energy = clamp(state.energy - 20, 0, 500);
        return "Invernadero cultivado: +25 comida, +10 moral, −15 agua y −20 energía.";
      },
      ice: () => {
        state.water = clamp(state.water + 40, 0, 150);
        state.science += 10;
        state.oxygen = clamp(state.oxygen - 15, 0, 150);
        state.dust = clamp(state.dust + 20, 0, 100);
        return "Hielo extraído: +40 agua, +10 ciencia, −15 oxígeno y +20 polvo.";
      },
      oxygen: () => {
        state.oxygen = clamp(state.oxygen + 35, 0, 150);
        state.energy = clamp(state.energy - 25, 0, 500);
        return "Generación de oxígeno: +35 oxígeno y −25 energía.";
      },
      clean: () => {
        state.dust = clamp(state.dust - 30, 0, 100);
        return "Limpieza completada: −30 polvo lunar.";
      },
      reactor: () => {
        state.reactorInstalled = true;
        state.science += 20;
        return "Reactor instalado: +20 ciencia. Recuerda activarlo en el evento nocturno.";
      },
      battery: () => {
        state.batteryInstalled = true;
        state.batteryCharge = 300;
        return "Baterías instaladas: 300 unidades de energía almacenada. Recuerda activarlas en el evento nocturno.";
      },
      experiment: () => {
        state.science += 15;
        state.energy = clamp(state.energy - 10, 0, 500);
        state.oxygen = clamp(state.oxygen - 5, 0, 150);
        return "Experimento completado: +15 ciencia, −10 energía y −5 oxígeno.";
      }
    };
    const message = messages[key]();
    addLog(message);
    $("#action-feedback").textContent = message;
    // La especificación exige derrota inmediata cuando un sistema vital llega a cero.
    if (state.oxygen <= 0 || state.water <= 0 || state.energy <= 0) {
      finishGame("failed");
      return;
    }
    render();
  }

  function showEvent(config) {
    pendingEvent = config;
    const eventModal = $("#event-modal");
    eventModal.classList.remove("event-storm", "event-meteorite");
    if (config.background) eventModal.classList.add("event-" + config.background);
    state.alertActive = true;
    $("#event-icon").textContent = config.icon;
    $("#event-title").textContent = config.title;
    $("#event-description").textContent = config.description;
    const eventAdvice = $("#event-advice");
    if (eventAdvice) eventAdvice.textContent = translateText(config.advice || "Lee el coste de cada opción antes de elegir. La decisión se aplica inmediatamente y después se calcula el consumo del periodo.");

    $("#event-options").innerHTML = "";
    config.options.forEach((option) => {
      const button = document.createElement("button");
      button.className = "btn " + (option.primary ? "btn-primary" : "btn-secondary");
      button.textContent = option.label;
      button.addEventListener("click", () => {
        if (!state.alertActive || state.gameOver) return;
        button.disabled = true;
        $("#event-options").querySelectorAll("button").forEach((choice) => { choice.disabled = true; });
        option.effect();
        $("#event-modal").classList.add("hidden");
        $("#event-modal").classList.remove("event-storm", "event-meteorite");
        state.alertActive = false;
        if (option.decision) state.decisions.push(option.decision);
        state.phase = 2;
        addLog(option.log, "alert");
        render();
        runEconomy();
        showMissionGuidance("event-day-" + state.day, config.advice || "Lee el coste de cada opción antes de elegir. La decisión se aplica inmediatamente y después se calcula el consumo del periodo.");
      });
      $("#event-options").appendChild(button);
    });
    $("#event-modal").classList.remove("hidden");
    renderActions();
  }

  function processEvent() {
    const day = state.day;
    if (state.processedEventDays.includes(day)) {
      state.phase = 2;
      runEconomy();
      return;
    }
    state.processedEventDays.push(day);
    state.phase = 1;
    if (day === 5) {
      showEvent({
        background: "storm",
        icon: "☀", title: "Tormenta solar",
        advice: "Tormenta solar: refugiarse protege a la tripulación, pero cuesta 50 de energía. Comprueba tus reservas antes de elegir.",
        description: "Una tormenta solar se aproxima a la base. Debes decidir cómo proteger a la tripulación.",
        options: [
          { label: "Refugiarse en el hábitat (−50 energía)", primary: true, effect: () => { state.energy = clamp(state.energy - 50, 0, 500); }, log: "La tripulación se refugió. Energía −50.", decision: "Tormenta solar: refugio" },
          { label: "Ignorar la tormenta (−30 moral)", effect: () => { state.morale = clamp(state.morale - 30, 0, 100); }, log: "Se ignoró la tormenta. Moral −30.", decision: "Tormenta solar: exposición" }
        ]
      });
    } else if (day === 10) {
      if (state.reactorInstalled || state.batteryInstalled) {
        const options = [];
        if (state.batteryInstalled) {
          options.push({
            label: "Activar baterías de reserva (−10 moral)",
            primary: true,
            effect: () => {
              state.backupActive = true;
              state.morale = clamp(state.morale - 10, 0, 100);
            },
            log: "Baterías activadas. La energía almacenada cubrirá el consumo nocturno; moral −10 por el modo de bajo consumo.",
            decision: "Noche lunar: baterías activadas"
          });
        }
        if (state.reactorInstalled) {
          options.push({
            label: "Activar reactor de fisión (+20 moral)",
            primary: true,
            effect: () => {
              state.backupActive = true;
              state.morale = clamp(state.morale + 20, 0, 100);
            },
            log: "Reactor de fisión activado. Su producción continua compensa el consumo nocturno; moral +20.",
            decision: "Noche lunar: reactor activado"
          });
        }
        options.push({
          label: "Continuar sin respaldo",
          effect: () => { state.backupActive = false; },
          log: "Se decidió no activar el respaldo energético.",
          decision: "Noche lunar: sin respaldo"
        });
        showEvent({
          icon: "☾",
          title: "Inicio de la noche lunar",
          advice: "Noche lunar: sin luz solar, la energía puede caer rápidamente. Activa el reactor o las baterías instaladas; continuar sin respaldo puede agotar la energía.",
          description: "La base entra en un periodo sin luz solar. Elige cómo afrontar el frío y el consumo energético durante la noche lunar.",
          options
        });
      } else {
        state.phase = 2;
        addLog("Comienza la noche lunar. No hay sistema de respaldo instalado.", "alert");
        runEconomy();
      }
    } else if (day === 15) {
      showEvent({
        background: "meteorite",
        icon: "☄", title: "Micrometeorito: fuga en el invernadero",
        advice: "Micrometeorito: reparar consume oxígeno y aumenta el polvo. Sellar evita ese coste, pero pierdes el invernadero para el resto de la misión.",
        description: "Un micrometeorito dañó el invernadero. Puedes reparar la fuga con recursos o sellar y abandonar la instalación.",
        options: [
          { label: "Reparar (−30 oxígeno, +40 polvo, −15 moral)", primary: true, effect: () => {
            state.oxygen = clamp(state.oxygen - 30, 0, 150);
            state.dust = clamp(state.dust + 40, 0, 100);
            state.morale = clamp(state.morale - 15, 0, 100);
          }, log: "Invernadero reparado: oxígeno −30, polvo lunar +40 y moral −15.", decision: "Micrometeorito: invernadero reparado" },
          { label: "Sellar y abandonar el invernadero", effect: () => { state.greenhouseDestroyed = true; }, log: "El invernadero fue sellado y quedó fuera de servicio.", decision: "Micrometeorito: invernadero sellado" }
        ]
      });
    } else if (day === 20) {
      showEvent({
        icon: "◐", title: "Oscuridad prolongada",
        advice: "Oscuridad prolongada: esta decisión reduce la moral. Mantén comida suficiente y evita acumular más penalizaciones.",
        description: "La oscuridad y el aislamiento afectan al ánimo de la tripulación.",
        options: [
          { label: "Continuar la misión (−15 moral)", primary: true, effect: () => { state.morale = clamp(state.morale - 15, 0, 100); }, log: "La oscuridad prolongada redujo la moral en 15 puntos.", decision: "Oscuridad prolongada: continuar" }
        ]
      });
    } else {
      state.phase = 2;
      runEconomy();
    }
  }

  function runEconomy() {
    if (state.processedEconomyDays.includes(state.day)) {
      evaluateTurn();
      return;
    }
    state.phase = 2;
    state.processedEconomyDays.push(state.day);
    state.oxygen = clamp(state.oxygen - 25, 0, 150);
    state.water = clamp(state.water - 20, 0, 150);
    state.food = clamp(state.food - 20, 0, 100);

    if ([5, 25, 30].includes(state.day)) {
      state.energy = clamp(state.energy + 75, 0, 500);
      addLog("Balance diurno: +100 energía solar y −25 de consumo base (neto +75).");
    } else if ([10, 15, 20].includes(state.day)) {
      if (state.backupActive && state.reactorInstalled) {
        addLog("Balance nocturno: reactor +150 y consumo −150 (neto 0).");
      } else if (state.backupActive && state.batteryInstalled && state.batteryCharge > 0) {
        const batteryUsed = Math.min(150, state.batteryCharge);
        const energyDeficit = 150 - batteryUsed;
        state.batteryCharge = clamp(state.batteryCharge - batteryUsed, 0, 300);
        if (energyDeficit > 0) state.energy = clamp(state.energy - energyDeficit, 0, 500);
        addLog("Balance nocturno: baterías −" + batteryUsed + " de energía almacenada" + (energyDeficit > 0 ? "; energía de la base −" + energyDeficit : "; consumo cubierto") + ". Reserva restante: " + state.batteryCharge + ".");
      } else {
        state.energy = clamp(state.energy - 150, 0, 500);
        addLog("Balance nocturno sin respaldo: −150 energía.");
      }
    } else {
      state.energy = clamp(state.energy - 150, 0, 500);
      addLog("Balance energético del periodo nocturno: −150 energía.");
    }

    if (state.food <= 0) {
      state.morale = clamp(state.morale - 20, 0, 100);
      addLog("Sin comida disponible: moral −20.", "alert");
    }
    if (state.dust >= 70) {
      state.energy = clamp(state.energy - 10, 0, 500);
      state.morale = clamp(state.morale - 10, 0, 100);
      addLog("Acumulación crítica de polvo: energía −10 y moral −10.", "alert");
    }
    addLog("Consumo básico del periodo: oxígeno −25, agua −20 y comida −20.");
    state.phase = 3;
    render();
    evaluateTurn();
  }

  function evaluateTurn() {
    if (state.oxygen <= 0 || state.water <= 0 || state.energy <= 0) {
      finishGame("failed");
      return;
    }
    if (state.day >= 30) {
      finishGame(state.science >= 100 ? "victory" : "incomplete");
      return;
    }
    state.actionPoints = 3;
    state.phase = 0;
    state.alertActive = false;
    addLog("Periodo finalizado. Se restablecieron los 3 puntos de acción.");
    render();
    $("#action-feedback").textContent = "Nuevo periodo: selecciona hasta 3 puntos de acción para preparar la base.";
  }

  function advanceTurn() {
    if (state.phase !== 0 || state.gameOver || state.alertActive) return;
    if (state.day >= 30) return;
    state.day = Math.min(30, state.day + 5);
    state.phase = 1;
    addLog("Avance temporal: la misión alcanza el día " + state.day + ".");
    render();
    $("#action-feedback").textContent = "Periodo en resolución: espera el evento y el balance de recursos.";
    processEvent();
  }

  function finishGame(result) {
    state.gameOver = true;
    state.phase = 3;
    try { localStorage.removeItem(SAVE_KEY); } catch (error) {}
    updateStartButton();
    state.alertActive = false;
    $("#event-modal").classList.add("hidden");
    $("#event-modal").classList.remove("event-storm", "event-meteorite");
    const resultScreen = $("#screen-result");
    resultScreen.classList.remove("result-victory", "result-failed", "result-incomplete");
    resultScreen.classList.add("result-" + result);
    const victoryDescription = state.food <= 0 || state.morale <= 20
      ? "La base polar resistió los 30 días y alcanzó el objetivo científico. La tripulación logró la victoria con reservas alimentarias agotadas y moral reducida: una supervivencia ajustada."
      : "La base polar resistió los 30 días y alcanzó el objetivo científico. La investigación abre el camino para futuras misiones lunares.";
    const config = {
      victory: { symbol: "✦", title: "¡Misión Artemis completada!", description: victoryDescription },
      incomplete: { symbol: "⌬", title: "Misión incompleta", description: "La tripulación llegó al día 30, pero no alcanzó los 100 puntos de ciencia necesarios para completar la misión." },
      failed: { symbol: "⚠", title: "Misión fallida", description: "Uno de los sistemas vitales llegó a cero. La supervivencia de la base quedó comprometida antes de completar el objetivo." }
    }[result];
    $("#restart-btn").textContent = result === "victory" ? "Jugar de nuevo" : "Reintentar misión";
    $("#result-symbol").textContent = config.symbol;
    $("#result-title").textContent = config.title;
    $("#result-description").textContent = config.description;
    const rank = result === "victory"
      ? (state.morale <= 20 || state.food <= 0 ? "Supervivencia ajustada" : "Misión sostenible")
      : result === "incomplete" ? "Investigación pendiente" : "Base no estabilizada";
    const decisionsHtml = state.decisions.length
      ? '<div class="result-decisions"><strong>Decisiones clave</strong><span>' + state.decisions.join(" · ") + '</span></div>'
      : "";
    const scienceFact = result === "victory"
      ? "Dato STEM: las regiones polares lunares tienen zonas con iluminación prolongada y cráteres en sombra permanente; por eso la ubicación y el almacenamiento de energía son esenciales."
      : "Dato STEM: el regolito lunar es abrasivo y puede afectar sellos, trajes y mecanismos; controlar el polvo es parte importante del diseño de una base.";
    $("#result-stats").innerHTML = [
      ["Día alcanzado", state.day + " / 30"],
      ["Tripulación registrada", state.crewAlive + " / 4"],
      ["Ciencia", state.science],
      ["Oxígeno", state.oxygen],
      ["Agua", state.water],
      ["Energía", state.energy],
      ["Moral", state.morale],
      ["Comida", state.food],
      ["Polvo lunar", state.dust]
    ].map((item) => '<div class="stat-box"><strong>' + item[1] + '</strong><span>' + item[0] + '</span></div>').join("")
      + '<div class="result-rank"><strong>' + rank + '</strong><span>Clasificación de la misión</span></div>'
      + decisionsHtml
      + '<div class="result-fact"><strong>APRENDIZAJE STEM</strong><span>' + scienceFact + '</span></div>';
    showScreen("result");
  }

  // Ajustes de volumen preparados para conectar los archivos de audio más adelante.
  function updateAudioLevels() {
    [["music-volume","music-volume-value"],["effects-volume","effects-volume-value"]].forEach(([sliderId,outputId])=>{
      const slider=$("#"+sliderId), output=$("#"+outputId);
      if(slider&&output){output.textContent=slider.value+"%";slider.style.setProperty("--audio-level",slider.value+"%");}
    });
  }
  [["music-volume","music-volume-value"],["effects-volume","effects-volume-value"]].forEach(([sliderId])=>{
    const slider=$("#"+sliderId);
    if(slider) slider.addEventListener("input",updateAudioLevels);
  });
  updateAudioLevels();
  const languageSelect = $("#language-select");
  if(languageSelect){languageSelect.value=currentLanguage;languageSelect.addEventListener("change",()=>setLanguage(languageSelect.value));}
  // La traducción inicial se aplica después de registrar todos los controles,
  // para que un fallo visual del traductor nunca deje la interfaz sin botones.
  function openSettings(){ $("#settings-modal").classList.remove("hidden"); applyLanguage($("#settings-modal")); }
  function closeSettings(){ $("#settings-modal").classList.add("hidden"); }
  $("#home-settings-btn").addEventListener("click",openSettings);
  $("#game-settings-btn").addEventListener("click",openSettings);
  $("#close-settings-btn").addEventListener("click",closeSettings);
  $("#settings-modal").addEventListener("click",(event)=>{if(event.target.id==="settings-modal")closeSettings();});
  $("#save-settings-btn").addEventListener("click",()=>{
    if(saveCurrentGame()){updateStartButton();notify("Progreso guardado. Ya puedes continuar la misión desde la portada.");}
  });
  $("#exit-settings-btn").addEventListener("click",()=>{
    closeSettings();
    showScreen("home");
    updateStartButton();
  });

  const guidanceModal = $("#guidance-modal");
  const closeGuidanceButton = $("#close-guidance-btn");
  function dismissGuidance() {
    if (!guidanceModal) return;
    guidanceModal.classList.add("hidden");
    guidanceModal.setAttribute("aria-hidden", "true");
    guidanceModal.dataset.dismissed = "1";

  }
  if (closeGuidanceButton) closeGuidanceButton.addEventListener("click", dismissGuidance);
  if (guidanceModal) guidanceModal.addEventListener("click", (event) => {
    if (event.target === guidanceModal) dismissGuidance();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && guidanceModal && !guidanceModal.classList.contains("hidden")) dismissGuidance();
  });
  $("#start-btn").addEventListener("click", () => { const saved=readSavedGame(); if(saved&&saved.state&&!saved.state.gameOver) resumeGame(); else startGame(); });
  $("#instructions-btn").addEventListener("click", () => showScreen("instructions"));
  // La enciclopedia recuerda desde qué pantalla se abrió para que la X
  // cierre el panel sin sacar al jugador de una misión en curso.
  let encyclopediaReturnScreen = "home";
  $("#encyclopedia-btn").addEventListener("click", () => {
    encyclopediaReturnScreen = "home";
    showScreen("encyclopedia");
  });
  $("#game-encyclopedia-btn").addEventListener("click", () => {
    encyclopediaReturnScreen = "game";
    showScreen("encyclopedia");
  });
  const closeInstructionsButton = $("#close-instructions-btn");
  if (closeInstructionsButton) {
    closeInstructionsButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showScreen("home");
    });
  }
  const closeEncyclopediaButton = $("#close-encyclopedia-btn");
  if (closeEncyclopediaButton) {
    closeEncyclopediaButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showScreen(encyclopediaReturnScreen);
    });
  }
  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      showScreen(button.dataset.returnTo || button.dataset.go);
    });
  });
  document.querySelectorAll(".action-card").forEach((button) => {
    button.addEventListener("click", () => performAction(button.dataset.action));
  });
  $("#advance-btn").addEventListener("click", advanceTurn);
  $("#restart-btn").addEventListener("click", startGame);

  // Los eventos quedan conectados antes de cualquier renderizado o traducción.
  try {
    render();
    updateStartButton();
  } catch (error) {
    console.error("Error al iniciar la interfaz de Base Polar:", error);
    const feedback = $("#action-feedback");
    if (feedback) feedback.textContent = "Interface initialization warning. You can still use the menu.";
  }
  try {
    applyLanguage();
  } catch (error) {
    console.error("Error al aplicar el idioma:", error);
  }
})();