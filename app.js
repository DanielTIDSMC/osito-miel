const NOTES = [
    'Si pudiera guardar mis momentos favoritos en un frasquito, estaría llenito de ratitos contigo.',
    'Recordatorio importante: eres mi persona favorita para contarle hasta las cosas más chiquitas.',
    'Ojalá este mensajito te dé un abrazo aunque hoy no pueda dártelo en persona.',
    'Me encantas cuando ríes, cuando cuentas tus cosas y hasta cuando no sabes qué pedir de comer.',
    'No tienes que hacer nada especial para que te quiera muchísimo. Con ser tú, basta.',
    'Te mando un besito en la frente y un abrazo de esos que duran un poquito más.',
    'Mi plan favorito sigue siendo pasar tiempo contigo, aunque sea haciendo nada.',
    'Si tu día está pesado, acuérdate: aquí tienes a alguien que está de tu lado.',
    'Eres como un día bonito que aparece justo cuando más lo necesitaba.',
    'Me gusta construir recuerdos contigo. Hasta los días sencillos se vuelven especiales.',
    'Un apapacho, un besito y una cucharadita extra de cariño. Todo es para ti.',
    'Gracias por existir cerquita de mi vida. La haces más bonita.'
];

const MEMORIES_KEY = 'osito-miel.memories.v1';
const THEME_KEY = 'osito-miel.theme.v1';
const REMINDER_KEY = 'osito-miel.reminder-time.v1';
const DATE_IDEAS_KEY = 'osito-miel.date-ideas.v1';
const SAVED_DATES_KEY = 'osito-miel.saved-dates.v1';
const PICKED_DATE_KEY = 'osito-miel.next-date.v1';
const COMPLETED_DATES_KEY = 'osito-miel.completed-dates.v1';
const DATE_STATES_KEY = 'osito-miel.date-states.v1';
const DAILY_ANSWERS_KEY = 'osito-miel.daily-answers.v1';
const ANNIVERSARY_KEY = 'osito-miel.special-date.v1';
const CLOUD_CONFIG_KEY = 'osito-miel.sync-config.v1';
const CLOUD_UPDATED_KEY = 'osito-miel.sync-updated-at.v1';
const CLOUD_REVISION_KEY = 'osito-miel.sync-revision.v1';
const DELETED_PLACES_KEY = 'osito-miel.deleted-places.v1';
const PLACE_OVERRIDES_KEY = 'osito-miel.place-overrides.v1';
const PLACES_DATABASE = 'osito-miel-places';
const PLACES_STORE = 'places';
const MAX_SYNC_PLACE_PHOTO_BYTES = 2 * 1024 * 1024;
const MAX_SYNC_PHOTOS_BYTES = 7 * 1024 * 1024;
const MAX_PLACE_PHOTOS = 5;
const PUSH_DEVICE_ID_KEY = 'osito-miel.push-device-id.v1';
const PUSH_ENABLED_KEY = 'osito-miel.push-enabled.v1';

const DATE_IDEAS = [
    { id: 'sunset-picnic', title: 'Picnic al atardecer', category: 'Aire libre', detail: 'Lleven algo rico, una mantita y vean cómo se pinta el cielo.', emoji: '🌇', art: 'sunset', caption: 'una tardecita juntos' },
    { id: 'coffee-date', title: 'Cafecito y plática', category: 'Comida', detail: 'Busquen una cafetería nueva y pidan algo que nunca hayan probado.', emoji: '☕', art: 'cafe', caption: 'cafecito para dos' },
    { id: 'paint-together', title: 'Pintar algo juntitos', category: 'Creativo', detail: 'Pongan música, preparen colores y pinten un retrato chistoso del otro.', emoji: '🎨', art: 'canvas', caption: 'arte con risas' },
    { id: 'stargazing', title: 'Caminata para ver estrellas', category: 'Aire libre', detail: 'Salgan cuando baje el sol, lleven una bebida calientita y busquen constelaciones.', emoji: '🌙', art: 'stars', caption: 'bajo el mismo cielo' },
    { id: 'food-market', title: 'Probar antojitos nuevos', category: 'Comida', detail: 'Vayan a un mercado o puestito y compartan algo que ninguno conozca.', emoji: '🍓', art: 'market', caption: 'un antojito y otro' },
    { id: 'bookstore', title: 'Tarde de librería', category: 'Creativo', detail: 'Elijan un libro para el otro y luego lean sus partes favoritas en un cafecito.', emoji: '📚', art: 'books', caption: 'historias para compartir' },
    { id: 'cook-together', title: 'Cocinar una receta nueva', category: 'En casa', detail: 'Escojan una receta sencilla, cocinen en equipo y califiquen el resultado.', emoji: '🍝', art: 'cooking', caption: 'chef y ayudante' },
    { id: 'photo-walk', title: 'Paseo de fotos bonitas', category: 'Aventura', detail: 'Exploren un lugar nuevo y tómense una foto favorita en cada parada.', emoji: '📸', art: 'adventure', caption: 'nuestro pequeño tour' },
    { id: 'game-night', title: 'Noche de juegos y snacks', category: 'En casa', detail: 'Elijan un juego, preparen sus botanas y que gane quien dé más abrazos.', emoji: '🎲', art: 'games', caption: 'la revancha va en serio' },
    { id: 'sunrise-breakfast', title: 'Desayuno tempranito', category: 'Comida', detail: 'Pónganse una alarma, busquen un lugar rico y comiencen el día juntos.', emoji: '🥐', art: 'cafe', caption: 'buenos días, cariño' },
    { id: 'bowling', title: 'Boliche o mini golf', category: 'Aventura', detail: 'Hagan una competencia amistosa; quien pierda invita el postre.', emoji: '🎳', art: 'adventure', caption: 'la revancha queda pendiente' },
    { id: 'museum', title: 'Visitar un museo', category: 'Aventura', detail: 'Elijan su pieza favorita y cuenten qué historia imaginan detrás.', emoji: '🖼️', art: 'canvas', caption: 'una tarde diferente' },
    { id: 'bake-sweets', title: 'Hornear algo dulce', category: 'En casa', detail: 'Preparen galletas o un pastelito; no pasa nada si queda chueco.', emoji: '🧁', art: 'cooking', caption: 'hecho con amor' },
    { id: 'playlist-swap', title: 'Intercambiar playlists', category: 'Creativo', detail: 'Armen cinco canciones para el otro y escúchenlas camino a algún lado.', emoji: '🎧', art: 'games', caption: 'esta canción me recuerda a ti' },
    { id: 'town-walk', title: 'Explorar un lugar cercano', category: 'Aventura', detail: 'Escojan una calle, parque o pueblito que no conozcan y paseen sin prisa.', emoji: '🗺️', art: 'adventure', caption: 'perdernos un ratito' },
    { id: 'karaoke', title: 'Karaoke sin pena', category: 'En casa', detail: 'Canten sus canciones favoritas como si estuvieran en un concierto.', emoji: '🎤', art: 'games', caption: 'una canción más' },
    { id: 'ice-cream-walk', title: 'Helado y paseo', category: 'Aire libre', detail: 'Elijan un sabor nuevo y den una vuelta sin mirar el celular.', emoji: '🍦', art: 'market', caption: 'pasito a pasito' },
    { id: 'puzzle-date', title: 'Rompecabezas con música', category: 'En casa', detail: 'Pongan su música favorita y armen algo entre los dos, pieza por pieza.', emoji: '🧩', art: 'canvas', caption: 'equipo perfecto' },
    { id: 'sunset-viewpoint', title: 'Ver el atardecer desde otro lugar', category: 'Aire libre', detail: 'Busquen un parque o mirador tranquilo y lleven algo para compartir.', emoji: '🌄', art: 'sunset', caption: 'nuestro cielo favorito' },
    { id: 'photo-challenge', title: 'Reto de fotos por colores', category: 'Creativo', detail: 'Elijan un color y encuentren cinco cosas de ese tono durante su paseo.', emoji: '📷', art: 'market', caption: 'mirar el mundo juntos' }
];

const DAILY_QUESTIONS = [
    '¿Qué detalle chiquito de esta semana te hizo sentir querido/a?',
    '¿Qué lugar te gustaría conocer conmigo y por qué?',
    '¿Cuál de nuestros recuerdos te hace sonreír más rápido?',
    '¿Qué canción te gustaría que fuera parte de nuestra historia?',
    '¿Qué plan sencillo te gustaría repetir más seguido?',
    '¿Qué cosa nueva te gustaría aprender conmigo?',
    '¿Qué fue lo primero que te llamó la atención de mí?',
    '¿Qué te ayuda a sentirte acompañado/a cuando tienes un día pesado?',
    '¿Qué comida deberíamos probar juntos la próxima vez?',
    '¿Cómo sería para ti un día perfecto a mi lado?',
    '¿Qué meta chiquita podríamos cumplir juntos este mes?',
    '¿Qué apodo cariñoso te gusta más y por qué?',
    '¿Qué tradición bonita podríamos inventar para nosotros?',
    '¿Qué te gustaría que nunca dejáramos de hacer como pareja?'
];

const PLACE_SUGGESTIONS = [
    { name: "Cafetería Regina's", date: '2026-08-16' },
    { name: 'Cafetería Granel & más', date: '2026-09-23' },
    { name: 'Restaurante 601', date: '2026-09-23' },
    { name: 'Café Country', date: '2026-10-04' },
    { name: 'Comida japonesa por Av. 5 (UV Idiomas)', date: '2026-10-04' },
    { name: 'Café Ripoll', date: '2026-10-04' }
];

const surpriseCard = document.querySelector('#surprise-card');
const surpriseText = document.querySelector('#surprise-text');
const toast = document.querySelector('#toast');
const memoryList = document.querySelector('#memory-list');
const memoryEmpty = document.querySelector('#memory-empty');
const reminderForm = document.querySelector('#reminder-form');
const reminderTime = document.querySelector('#reminder-time');
const reminderStatus = document.querySelector('#reminder-status');
const reminderCancel = document.querySelector('#reminder-cancel');
const dateGrid = document.querySelector('#date-grid');
const datePickStatus = document.querySelector('#date-pick-status');
const dateProgress = document.querySelector('#date-progress');
const dateFilters = document.querySelector('#date-filters');
const dailyQuestion = document.querySelector('#daily-question');
const dailyQuestionForm = document.querySelector('#daily-question-form');
const dailyQuestionStatus = document.querySelector('#daily-question-status');
const anniversaryForm = document.querySelector('#anniversary-form');
const anniversaryDateInput = document.querySelector('#anniversary-date');
const anniversaryStatus = document.querySelector('#anniversary-status');
const placeForm = document.querySelector('#place-form');
const placePhotoInput = document.querySelector('#place-photo');
const placePhotoPreview = document.querySelector('#place-photo-preview');
const placePhotoCount = document.querySelector('#place-photo-count');
const placesGrid = document.querySelector('#places-grid');
const placesCount = document.querySelector('#places-count');
const placesEmpty = document.querySelector('#places-empty');
const placeSuggestions = document.querySelector('#place-suggestions');
const placeSuggestionList = document.querySelector('#place-suggestion-list');
const syncForm = document.querySelector('#sync-form');
const syncApiUrlInput = document.querySelector('#sync-api-url');
const syncPasswordInput = document.querySelector('#sync-room-password');
const syncStatus = document.querySelector('#sync-status');
const syncConnectButton = document.querySelector('#sync-connect-button');
const syncNowButton = document.querySelector('#sync-now-button');
const syncDisconnectButton = document.querySelector('#sync-disconnect-button');
const pushNotificationsButton = document.querySelector('#push-notifications-button');
const pushNotificationsStatus = document.querySelector('#push-notifications-status');

let activeDateFilter = 'Todas';
let pickedDateId = null;
let placesDatabasePromise;
let previewPhotoUrl;
let placePhotoUrls = [];
let cloudConfig = null;
let cloudSyncTimer;
let cloudSyncPromise = null;
let cloudRevision = null;
let archivedPlacesPromise;
let lastNoteIndex = -1;
let toastTimer;
let installPrompt;
let reminderTimer;
let activeReminderTime = null;

function getInitialTheme() {
    try {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    } catch (error) {
        console.error('No se pudo leer el tema guardado:', error);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')
        .setAttribute('content', isDark ? '#171512' : '#fff8eb');
    document.querySelector('#theme-toggle').setAttribute('aria-pressed', String(isDark));
    document.querySelector('#theme-toggle').setAttribute(
        'aria-label',
        isDark ? 'Activar modo claro' : 'Activar modo oscuro'
    );
    document.querySelector('#theme-icon').textContent = isDark ? '☀' : '☾';
    document.querySelector('#theme-label').textContent = isDark ? 'Modo claro' : 'Modo oscuro';
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200);
}

function showSurprise() {
    let index = Math.floor(Math.random() * NOTES.length);
    if (NOTES.length > 1 && index === lastNoteIndex) index = (index + 1) % NOTES.length;
    lastNoteIndex = index;
    surpriseText.textContent = NOTES[index];
    surpriseCard.hidden = false;
    surpriseCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updateReminderStatus(time) {
    const isActive = Boolean(time);
    reminderCancel.hidden = !isActive;
    reminderForm.querySelector('.reminder-button').textContent =
        isActive ? 'Cambiar hora' : 'Activar recordatorio';
    reminderStatus.textContent = isActive
        ? `Tu notita está programada para todos los días a las ${time}. Deja esta página abierta para recibirla.`
        : 'Recibe una notita diaria. Para que llegue, deja esta página abierta.';
}

function getNextReminderDelay(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const nextReminder = new Date();
    nextReminder.setHours(hours, minutes, 0, 0);
    if (nextReminder <= new Date()) nextReminder.setDate(nextReminder.getDate() + 1);
    return nextReminder.getTime() - Date.now();
}

async function showReminderNotification() {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
        throw new Error('Las notificaciones ya no están permitidas en este navegador.');
    }
    if (!('serviceWorker' in navigator)) {
        throw new Error('Este navegador no permite mostrar notificaciones de la app.');
    }

    const registration = await navigator.serviceWorker.ready;
    const noteIndex = Math.floor(Math.random() * NOTES.length);
    await registration.showNotification('Un abracito de tu Osito Pooh ♡', {
        body: NOTES[noteIndex],
        icon: './assets/icons/icon.svg',
        badge: './assets/icons/icon.svg',
        tag: 'osito-miel-daily-reminder',
        data: { url: new URL('./', window.location.href).href }
    });
}

function scheduleReminder(time) {
    clearTimeout(reminderTimer);
    activeReminderTime = time;
    reminderTimer = setTimeout(async () => {
        try {
            await showReminderNotification();
        } catch (error) {
            console.error('No se pudo mostrar el recordatorio diario:', error);
            showToast('No se pudo mostrar la notita. Revisa los permisos de notificación.');
        }
        if (activeReminderTime === time) scheduleReminder(time);
    }, getNextReminderDelay(time));
}

function loadReminderTime() {
    try {
        const savedTime = localStorage.getItem(REMINDER_KEY);
        return savedTime && /^([01]\d|2[0-3]):[0-5]\d$/.test(savedTime) ? savedTime : null;
    } catch (error) {
        console.error('No se pudo leer el recordatorio guardado:', error);
        showToast('No se pudo leer el recordatorio guardado en este dispositivo.');
        return null;
    }
}

function loadStoredList(key, isValid) {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) return [];
        const items = JSON.parse(stored);
        if (!Array.isArray(items) || !items.every(isValid)) {
            throw new Error('El formato de las ideas guardadas no es válido.');
        }
        return items;
    } catch (error) {
        console.error(`No se pudieron cargar los datos guardados (${key}):`, error);
        showToast('No se pudieron cargar algunos planes guardados en este dispositivo.');
        return [];
    }
}

function loadPlaceOverrides() {
    try {
        const saved = JSON.parse(localStorage.getItem(PLACE_OVERRIDES_KEY) || '{}');
        if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
        return saved;
    } catch (error) {
        console.error('No se pudieron cargar las fechas de lugares actualizadas:', error);
        return {};
    }
}

function savePlaceOverrides(overrides) {
    try {
        localStorage.setItem(PLACE_OVERRIDES_KEY, JSON.stringify(overrides));
    } catch (error) {
        console.error('No se pudieron guardar las fechas actualizadas:', error);
        throw error;
    }
}

function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function loadDateStates() {
    try {
        const saved = JSON.parse(localStorage.getItem(DATE_STATES_KEY) || '{}');
        if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
            throw new Error('El formato de cambios de planes no es válido.');
        }
        return Object.fromEntries(Object.entries(saved).filter(([, state]) =>
            state && typeof state.saved === 'boolean' && typeof state.completed === 'boolean' &&
            typeof state.updatedAt === 'string'
        ));
    } catch (error) {
        console.error('No se pudieron cargar los cambios guardados en planes:', error);
        showToast('No se pudieron recuperar algunos cambios de planes en este dispositivo.');
        return {};
    }
}

function recordDateState(id, update) {
    const previous = dateStates[id] || { saved: false, completed: false, updatedAt: '' };
    const next = { ...previous, ...update, updatedAt: new Date().toISOString() };
    try {
        dateStates = { ...dateStates, [id]: next };
        localStorage.setItem(DATE_STATES_KEY, JSON.stringify(dateStates));
        localStorage.setItem(CLOUD_UPDATED_KEY, next.updatedAt);
    } catch (error) {
        console.error('No se pudo registrar el cambio del plan:', error);
        showToast('El cambio se aplicó aquí, pero no se pudo preparar para sincronizar.');
    }
}

let customDates = loadStoredList(
    DATE_IDEAS_KEY,
    (idea) => idea && typeof idea.id === 'string' && typeof idea.title === 'string' &&
        typeof idea.category === 'string' && typeof idea.detail === 'string' &&
        typeof idea.emoji === 'string' && typeof idea.art === 'string' && typeof idea.caption === 'string'
);
let savedDateIds = loadStoredList(SAVED_DATES_KEY, (id) => typeof id === 'string');
let completedDateIds = loadStoredList(COMPLETED_DATES_KEY, (id) => typeof id === 'string');
let dateStates = loadDateStates();
let dailyAnswers = loadStoredList(
    DAILY_ANSWERS_KEY,
    (entry) => entry && /^\d{4}-\d{2}-\d{2}$/.test(entry.date) &&
        typeof entry.question === 'string' && typeof entry.first === 'string' &&
        typeof entry.second === 'string'
);

try {
    const savedPickedId = localStorage.getItem(PICKED_DATE_KEY);
    if ([...DATE_IDEAS, ...customDates].some((idea) => idea.id === savedPickedId)) {
        pickedDateId = savedPickedId;
    }
} catch (error) {
    console.error('No se pudo leer el plan elegido:', error);
    showToast('No se pudo recuperar el plan elegido en este dispositivo.');
}

try {
    const savedAnniversary = localStorage.getItem(ANNIVERSARY_KEY);
    if (savedAnniversary && /^\d{4}-\d{2}-\d{2}$/.test(savedAnniversary)) {
        anniversaryDateInput.value = savedAnniversary;
    }
} catch (error) {
    console.error('No se pudo leer la fecha especial guardada:', error);
    showToast('No se pudo recuperar su fecha especial en este dispositivo.');
}

function getVisibleDates() {
    const allDates = [...DATE_IDEAS, ...customDates];
    if (activeDateFilter === 'Guardadas') {
        return allDates.filter((idea) => savedDateIds.includes(idea.id));
    }
    if (activeDateFilter === 'Hechas') {
        return allDates.filter((idea) => completedDateIds.includes(idea.id));
    }
    if (activeDateFilter === 'Todas') return allDates;
    return allDates.filter((idea) => idea.category === activeDateFilter);
}

function renderDates() {
    dateGrid.replaceChildren();
    dateProgress.textContent = `${completedDateIds.length} ${completedDateIds.length === 1 ? 'plan ya se volvió' : 'planes ya se volvieron'} un recuerdo ♡`;
    const ideas = getVisibleDates();
    if (!ideas.length) {
        const empty = document.createElement('p');
        empty.className = 'date-empty';
        empty.textContent = activeDateFilter === 'Guardadas'
            ? 'Todavía no guardan ningún plan. Toquen el corazoncito de sus favoritos.'
            : 'No hay ideas en esta categoría todavía.';
        dateGrid.append(empty);
        return;
    }

    ideas.forEach((idea) => {
        const card = document.createElement('article');
        const isCompleted = completedDateIds.includes(idea.id);
        card.className = `date-card${idea.id === pickedDateId ? ' is-picked' : ''}${isCompleted ? ' is-completed' : ''}`;
        const art = document.createElement('div');
        art.className = `date-art date-art--${idea.art}`;
        const emoji = document.createElement('span');
        emoji.className = 'date-art-emoji';
        emoji.textContent = idea.emoji;
        emoji.setAttribute('aria-hidden', 'true');
        const caption = document.createElement('span');
        caption.className = 'date-art-caption';
        caption.textContent = idea.caption;
        caption.setAttribute('aria-hidden', 'true');
        const saveButton = document.createElement('button');
        const isSaved = savedDateIds.includes(idea.id);
        saveButton.className = 'save-date-button';
        saveButton.type = 'button';
        saveButton.setAttribute('aria-pressed', String(isSaved));
        saveButton.setAttribute('aria-label', `${isSaved ? 'Quitar de guardadas' : 'Guardar'}: ${idea.title}`);
        saveButton.textContent = isSaved ? '♥' : '♡';
        saveButton.addEventListener('click', () => toggleSavedDate(idea.id));
        art.append(emoji, caption, saveButton);

        const copy = document.createElement('div');
        copy.className = 'date-copy';
        const category = document.createElement('span');
        category.className = 'date-category';
        category.textContent = idea.category;
        const title = document.createElement('h3');
        title.textContent = idea.title;
        const detail = document.createElement('p');
        detail.textContent = idea.detail;
        const pickButton = document.createElement('button');
        pickButton.className = 'date-plan-button';
        pickButton.type = 'button';
        pickButton.textContent = idea.id === pickedDateId ? '¡Este plan va! ♡' : 'Elegir este plan';
        pickButton.addEventListener('click', () => pickDate(idea));
        const completedButton = document.createElement('button');
        completedButton.className = 'date-complete-button';
        completedButton.type = 'button';
        completedButton.setAttribute('aria-pressed', String(isCompleted));
        completedButton.textContent = isCompleted ? 'Ya es un recuerdo ♥' : 'Marcar como hecha';
        completedButton.addEventListener('click', () => toggleCompletedDate(idea.id));
        copy.append(category, title, detail, pickButton, completedButton);
        card.append(art, copy);
        dateGrid.append(card);
    });
}

function toggleSavedDate(id) {
    const nextSavedDates = savedDateIds.includes(id)
        ? savedDateIds.filter((savedId) => savedId !== id)
        : [...savedDateIds, id];
    try {
        localStorage.setItem(SAVED_DATES_KEY, JSON.stringify(nextSavedDates));
    } catch (error) {
        console.error('No se pudo guardar este plan:', error);
        showToast('No se pudo guardar el plan en este dispositivo.');
        return;
    }
    savedDateIds = nextSavedDates;
    recordDateState(id, { saved: nextSavedDates.includes(id) });
    renderDates();
    scheduleCloudSync();
}

function toggleCompletedDate(id) {
    const nextCompletedDates = completedDateIds.includes(id)
        ? completedDateIds.filter((completedId) => completedId !== id)
        : [...completedDateIds, id];
    try {
        localStorage.setItem(COMPLETED_DATES_KEY, JSON.stringify(nextCompletedDates));
    } catch (error) {
        console.error('No se pudo actualizar el plan realizado:', error);
        showToast('No se pudo actualizar este plan en el dispositivo.');
        return;
    }
    completedDateIds = nextCompletedDates;
    recordDateState(id, { completed: nextCompletedDates.includes(id) });
    renderDates();
    scheduleCloudSync();
    showToast(completedDateIds.includes(id) ? '¡Un plan más para recordar! ♡' : 'Plan regresado a su lista pendiente.');
}

function pickDate(idea) {
    try {
        localStorage.setItem(PICKED_DATE_KEY, idea.id);
    } catch (error) {
        console.error('No se pudo guardar el plan elegido:', error);
        showToast('No se pudo guardar el plan elegido en este dispositivo.');
        return;
    }
    pickedDateId = idea.id;
    datePickStatus.textContent = `Plan elegido: ${idea.title}. ¡Ya tienen una próxima cita pendiente!`;
    renderDates();
    scheduleCloudSync();
}

function pickRandomDate() {
    const ideas = getVisibleDates();
    if (!ideas.length) {
        showToast('Guarden un plan o elijan otra categoría para recibir una sorpresa.');
        return;
    }
    let idea = ideas[Math.floor(Math.random() * ideas.length)];
    if (ideas.length > 1 && idea.id === pickedDateId) {
        idea = ideas[(ideas.findIndex((item) => item.id === pickedDateId) + 1) % ideas.length];
    }
    pickDate(idea);
    document.querySelector(`#date-grid .date-card.is-picked`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

function getQuestionForDate(dateKey) {
    const dateNumber = Number(dateKey.replace(/-/g, ''));
    return DAILY_QUESTIONS[dateNumber % DAILY_QUESTIONS.length];
}

function renderDailyQuestion() {
    const today = getLocalDateKey();
    const question = getQuestionForDate(today);
    const answer = dailyAnswers.find((entry) => entry.date === today);
    dailyQuestion.textContent = question;
    document.querySelector('#first-answer').value = answer?.first || '';
    document.querySelector('#second-answer').value = answer?.second || '';
    if (answer) {
        const hasFirst = Boolean(answer.first);
        const hasSecond = Boolean(answer.second);
        dailyQuestionStatus.textContent = hasFirst && hasSecond
            ? '¡Los dos respondieron la pregunta de hoy! ♡'
            : 'Una respuesta quedó guardada; pueden completar la otra cuando quieran.';
    }

    const history = document.querySelector('#daily-history');
    history.replaceChildren();
    dailyAnswers
        .filter((entry) => entry.date !== today)
        .sort((first, second) => second.date.localeCompare(first.date))
        .slice(0, 5)
        .forEach((entry) => {
            const item = document.createElement('article');
            item.className = 'daily-history-item';
            const heading = document.createElement('h3');
            heading.textContent = new Intl.DateTimeFormat('es-MX', {
                dateStyle: 'medium'
            }).format(new Date(`${entry.date}T12:00:00`));
            const prompt = document.createElement('p');
            prompt.className = 'daily-history-question';
            prompt.textContent = entry.question;
            item.append(heading, prompt);
            if (entry.first) {
                const first = document.createElement('p');
                first.textContent = `Tu respuesta: ${entry.first}`;
                item.append(first);
            }
            if (entry.second) {
                const second = document.createElement('p');
                second.textContent = `Su respuesta: ${entry.second}`;
                item.append(second);
            }
            history.append(item);
        });
}

function compareLocalDates(first, second) {
    return Date.UTC(first.getFullYear(), first.getMonth(), first.getDate()) -
        Date.UTC(second.getFullYear(), second.getMonth(), second.getDate());
}

function makeAnniversaryDate(year, month, day) {
    const finalDay = Math.min(day, new Date(year, month, 0).getDate());
    return new Date(year, month - 1, finalDay, 12);
}

function updateAnniversaryStatus(dateValue) {
    if (!dateValue) {
        anniversaryStatus.textContent = 'Guarda su fecha y aquí verán cuánto falta para celebrarla.';
        return;
    }
    const [startYear, month, day] = dateValue.split('-').map(Number);
    const startDate = makeAnniversaryDate(startYear, month, day);
    const today = new Date();
    const daysSinceStart = Math.floor(compareLocalDates(today, startDate) / 86400000);
    if (daysSinceStart < 0) {
        const daysUntil = Math.ceil(Math.abs(compareLocalDates(startDate, today)) / 86400000);
        anniversaryStatus.textContent = `Faltan ${daysUntil} ${daysUntil === 1 ? 'día' : 'días'} para su fecha especial ♡`;
        return;
    }

    let nextAnniversary = makeAnniversaryDate(today.getFullYear(), month, day);
    if (compareLocalDates(nextAnniversary, today) < 0) {
        nextAnniversary = makeAnniversaryDate(today.getFullYear() + 1, month, day);
    }
    const daysUntil = Math.round(compareLocalDates(nextAnniversary, today) / 86400000);
    const yearsTogether = nextAnniversary.getFullYear() - startYear;
    if (daysUntil === 0) {
        anniversaryStatus.textContent = `¡Hoy celebran su fecha especial! Llevan ${daysSinceStart} días compartiendo momentos ♡`;
        return;
    }
    anniversaryStatus.textContent =
        `Llevan ${daysSinceStart} días compartiendo momentos; faltan ${daysUntil} días para su aniversario${yearsTogether > 0 ? ` número ${yearsTogether}` : ''} ♡`;
}

function showPlaceFormError(message, error) {
    console.error(message, error);
    const errorText = 'No se pudo guardar o cargar el álbum. Revisa el espacio disponible e inténtalo de nuevo.';
    document.querySelector('#places-count').textContent = errorText;
    showToast(errorText);
}

function openPlacesDatabase() {
    if (!('indexedDB' in window)) {
        return Promise.reject(new Error('Este navegador no permite guardar fotos localmente.'));
    }
    if (!placesDatabasePromise) {
        placesDatabasePromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(PLACES_DATABASE, 1);
            request.onupgradeneeded = () => {
                if (!request.result.objectStoreNames.contains(PLACES_STORE)) {
                    request.result.createObjectStore(PLACES_STORE, { keyPath: 'id' });
                }
            };
            request.onsuccess = () => {
                const database = request.result;
                database.onversionchange = () => database.close();
                resolve(database);
            };
            request.onerror = () => reject(request.error || new Error('No se pudo abrir el álbum de fotos.'));
            request.onblocked = () => reject(new Error('Cierra otras pestañas de la app para actualizar el álbum.'));
        }).catch((error) => {
            placesDatabasePromise = null;
            throw error;
        });
    }
    return placesDatabasePromise;
}

async function getPlaces() {
    const database = await openPlacesDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(PLACES_STORE, 'readonly');
        const request = transaction.objectStore(PLACES_STORE).getAll();
        let places;
        request.onsuccess = () => { places = request.result; };
        transaction.oncomplete = () => resolve(places.sort((first, second) => (second.date || '').localeCompare(first.date || '')));
        transaction.onerror = () => reject(transaction.error || new Error('No se pudo leer el álbum.'));
        transaction.onabort = () => reject(transaction.error || new Error('Se interrumpió la lectura del álbum.'));
    });
}

function setSyncStatus(message, state = '') {
    syncStatus.textContent = message;
    if (state) syncStatus.dataset.state = state;
    else delete syncStatus.dataset.state;
}

function normalizeApiUrl(value) {
    const url = new URL(value);
    const isLocalHttp = ['localhost', '127.0.0.1'].includes(url.hostname) && url.protocol === 'http:';
    if (url.protocol !== 'https:' && !isLocalHttp) {
        throw new Error('La dirección del servicio debe usar HTTPS.');
    }
    if (url.username || url.password || url.search || url.hash || (url.pathname !== '/' && url.pathname !== '')) {
        throw new Error('Pega solo la dirección base del servicio, sin rutas ni parámetros.');
    }
    return url.origin;
}

function updateSyncControls() {
    syncNowButton.hidden = !cloudConfig;
    syncDisconnectButton.hidden = !cloudConfig;
    syncConnectButton.textContent = cloudConfig ? 'Guardar conexión y sincronizar' : 'Conectar y sincronizar';
    updatePushControls();
}

function getPushDeviceId() {
    let id = localStorage.getItem(PUSH_DEVICE_ID_KEY);
    if (!id) { id = crypto.randomUUID(); localStorage.setItem(PUSH_DEVICE_ID_KEY, id); }
    return id;
}

function setPushStatus(message, state = '') {
    pushNotificationsStatus.hidden = !message;
    pushNotificationsStatus.textContent = message;
    if (state) pushNotificationsStatus.dataset.state = state;
    else delete pushNotificationsStatus.dataset.state;
}

async function updatePushControls() {
    if (!pushNotificationsButton) return;
    const supported = Boolean(cloudConfig && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window);
    pushNotificationsButton.hidden = !supported;
    if (!supported) { setPushStatus('Conecta la sincronizaci\u00f3n para activar avisos cuando Osito agregue recuerdos.'); return; }
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription && Notification.permission === 'granted' && localStorage.getItem(PUSH_ENABLED_KEY) === 'true') {
            pushNotificationsButton.textContent = 'Notificaciones activadas';
            pushNotificationsButton.disabled = true;
            setPushStatus('Este celular recibir\u00e1 avisos cuando haya recuerdos nuevos.');
        } else {
            pushNotificationsButton.textContent = 'Activar notificaciones push';
            pushNotificationsButton.disabled = false;
            setPushStatus(Notification.permission === 'denied' ? 'Las notificaciones est\u00e1n bloqueadas en los ajustes del navegador.' : 'Act\u00edvalas una vez en cada celular para recibir avisos de nuevos recuerdos.');
        }
    } catch (error) {
        pushNotificationsButton.disabled = false;
        setPushStatus('Este navegador todav\u00eda no permite activar notificaciones push.');
    }
}

function urlBase64ToUint8Array(value) {
    const padding = '='.repeat((4 - value.length % 4) % 4);
    const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/');
    return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}

function loadCloudConfig() {
    try {
        const saved = JSON.parse(localStorage.getItem(CLOUD_CONFIG_KEY) || 'null');
        if (saved && typeof saved.apiUrl === 'string' && typeof saved.password === 'string') {
            cloudConfig = { apiUrl: normalizeApiUrl(saved.apiUrl), password: saved.password };
            cloudRevision = Number(localStorage.getItem(CLOUD_REVISION_KEY));
            if (!Number.isSafeInteger(cloudRevision) || cloudRevision < 0) cloudRevision = null;
            syncApiUrlInput.value = cloudConfig.apiUrl;
            syncPasswordInput.value = cloudConfig.password;
            updateSyncControls();
            if (navigator.onLine) {
                void runCloudSync();
            } else {
                setSyncStatus('Sin conexión. Sus cambios siguen guardados aquí y se sincronizarán al volver a estar en línea.');
            }
        }
    } catch (error) {
        console.error('No se pudo recuperar la conexión compartida:', error);
        setSyncStatus('No se pudo leer la conexión guardada. Vuelve a introducir la dirección y la clave.', 'error');
    }
}

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error || new Error('No se pudo preparar una foto para sincronizar.'));
        reader.readAsDataURL(blob);
    });
}

function dataUrlToBlob(dataUrl) {
    const match = /^data:image\/jpeg;base64,([A-Za-z0-9+/]*={0,2})$/.exec(dataUrl);
    if (!match) throw new Error('El servicio devolvió una foto con formato inválido.');
    const binary = atob(match[1]);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return new Blob([bytes], { type: 'image/jpeg' });
}

async function getLocalSharedData() {
    const places = await getPlaces();
    const deletedPlaceIds = loadStoredList(DELETED_PLACES_KEY, (id) => typeof id === 'string');
    const placeOverrides = loadPlaceOverrides();
    const activePlaces = places.filter((place) =>
        place && typeof place === 'object' && typeof place.id === 'string' &&
        !deletedPlaceIds.includes(place.id)
    );
    const getPhotoSizes = (place) => [
        ...(place.photo instanceof Blob ? [place.photo.size] : []),
        ...(Array.isArray(place.additionalPhotos) ? place.additionalPhotos.filter((photo) => photo instanceof Blob).map((photo) => photo.size) : [])
    ];
    const totalPhotoBytes = activePlaces.reduce((total, place) => total + getPhotoSizes(place).reduce((sum, size) => sum + size, 0), 0);
    if (activePlaces.some((place) => getPhotoSizes(place).some((size) => size > MAX_SYNC_PLACE_PHOTO_BYTES)) ||
        totalPhotoBytes > MAX_SYNC_PHOTOS_BYTES) {
        throw new Error('Las fotos superan el l\u00edmite seguro para sincronizar. Reduce su tama\u00f1o o sincroniza menos fotos a la vez.');
    }
    return {
        memories,
        dateIdeas: customDates,
        savedDateIds,
        pickedDateId,
        completedDateIds,
        dateStates,
        dailyAnswers,
        anniversary: anniversaryDateInput.value,
        deletedPlaceIds,
        placeOverrides,
        places: await Promise.all(activePlaces.map(async (place) => ({
            id: place.id,
            name: place.name,
            date: place.date,
            note: place.note,
            photo: place.photo instanceof Blob ? await blobToDataUrl(place.photo) : null,
            additionalPhotos: await Promise.all((place.additionalPhotos || []).filter((photo) => photo instanceof Blob).map((photo) => blobToDataUrl(photo)))
        })))
    };
}

function mergeEntries(first, second, getKey) {
    const entries = new Map();
    [...first, ...second].forEach((entry) => entries.set(getKey(entry), entry));
    return [...entries.values()];
}

function mergeSharedData(local, remote, remoteUpdatedAt) {
    let localUpdatedAt = '';
    try {
        localUpdatedAt = localStorage.getItem(CLOUD_UPDATED_KEY) || '';
    } catch (error) {
        console.error('No se pudo leer la fecha de sincronización local:', error);
    }
    const localIsNewer = Boolean(localUpdatedAt && (!remoteUpdatedAt || localUpdatedAt > remoteUpdatedAt));
    const dateStates = {};
    const dateStateIds = new Set([
        ...local.savedDateIds,
        ...local.completedDateIds,
        ...(remote.savedDateIds || []),
        ...(remote.completedDateIds || []),
        ...Object.keys(local.dateStates || {}),
        ...Object.keys(remote.dateStates || {})
    ]);
    dateStateIds.forEach((id) => {
        const localState = local.dateStates?.[id];
        const remoteState = remote.dateStates?.[id];
        if (localState && remoteState) {
            dateStates[id] = localState.updatedAt > remoteState.updatedAt ? localState : remoteState;
        } else if (localState || remoteState) {
            dateStates[id] = localState || remoteState;
        } else {
            dateStates[id] = {
                saved: local.savedDateIds.includes(id) || (remote.savedDateIds || []).includes(id),
                completed: local.completedDateIds.includes(id) || (remote.completedDateIds || []).includes(id),
                updatedAt: ''
            };
        }
    });
    const deletedPlaceIds = [...new Set([
        ...(local.deletedPlaceIds || []),
        ...(remote.deletedPlaceIds || [])
    ])];
    const mergedOverrides = { ...(remote.placeOverrides || {}), ...(local.placeOverrides || {}) };

    return {
        memories: mergeEntries(local.memories, remote.memories || [], (entry) => `${entry.date}\0${entry.text}`)
            .sort((first, second) => second.date.localeCompare(first.date)).slice(0, 1000),
        dateIdeas: mergeEntries(local.dateIdeas, remote.dateIdeas || [], (idea) => idea.id).slice(0, 1000),
        savedDateIds: Object.entries(dateStates).filter(([, state]) => state.saved).map(([id]) => id),
        pickedDateId: localIsNewer ? (local.pickedDateId || remote.pickedDateId || null) : (remote.pickedDateId || local.pickedDateId || null),
        completedDateIds: Object.entries(dateStates).filter(([, state]) => state.completed).map(([id]) => id),
        dateStates,
        dailyAnswers: mergeEntries(
            localIsNewer ? (remote.dailyAnswers || []) : local.dailyAnswers,
            localIsNewer ? local.dailyAnswers : (remote.dailyAnswers || []),
            (entry) => entry.date
        )
            .sort((first, second) => second.date.localeCompare(first.date)).slice(0, 1000),
        anniversary: localIsNewer ? (local.anniversary || remote.anniversary || '') : (remote.anniversary || local.anniversary || ''),
        deletedPlaceIds,
        placeOverrides: mergedOverrides,
        places: mergeEntries(
            localIsNewer ? (remote.places || []) : local.places,
            localIsNewer ? local.places : (remote.places || []),
            (place) => place.id
        )
            .filter((place) => !deletedPlaceIds.includes(place.id))
    };
}

async function saveLocalSharedData(data) {
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(data.memories));
    localStorage.setItem(DATE_IDEAS_KEY, JSON.stringify(data.dateIdeas));
    localStorage.setItem(SAVED_DATES_KEY, JSON.stringify(data.savedDateIds));
    localStorage.setItem(PICKED_DATE_KEY, data.pickedDateId || '');
    localStorage.setItem(COMPLETED_DATES_KEY, JSON.stringify(data.completedDateIds));
    localStorage.setItem(DATE_STATES_KEY, JSON.stringify(data.dateStates || {}));
    localStorage.setItem(DAILY_ANSWERS_KEY, JSON.stringify(data.dailyAnswers));
    localStorage.setItem(DELETED_PLACES_KEY, JSON.stringify(data.deletedPlaceIds || []));
    savePlaceOverrides(data.placeOverrides || {});
    if (data.anniversary) localStorage.setItem(ANNIVERSARY_KEY, data.anniversary);
    else localStorage.removeItem(ANNIVERSARY_KEY);

    const database = await openPlacesDatabase();
    await new Promise((resolve, reject) => {
        const transaction = database.transaction(PLACES_STORE, 'readwrite');
        const store = transaction.objectStore(PLACES_STORE);
        data.places.forEach((place) => store.put({
            id: place.id,
            name: place.name,
            date: place.date,
            note: place.note,
            photo: place.photo ? dataUrlToBlob(place.photo) : null,
            additionalPhotos: (place.additionalPhotos || []).map((photo) => dataUrlToBlob(photo))
        }));
        (data.deletedPlaceIds || []).forEach((id) => store.delete(id));
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error || new Error('No se pudieron guardar las fotos sincronizadas.'));
        transaction.onabort = () => reject(transaction.error || new Error('Se interrumpió la importación de fotos.'));
    });

    memories = data.memories;
    customDates = data.dateIdeas;
    savedDateIds = data.savedDateIds;
    pickedDateId = data.pickedDateId;
    completedDateIds = data.completedDateIds;
    dateStates = data.dateStates || {};
    dailyAnswers = data.dailyAnswers;
    anniversaryDateInput.value = data.anniversary;
    renderMemories();
    renderDates();
    renderDailyQuestion();
    updateAnniversaryStatus(data.anniversary);
    await renderPlaces();
}

async function cloudRequest(path, options = {}) {
    const response = await fetch(`${cloudConfig.apiUrl}${path}`, {
        ...options,
        cache: 'no-store',
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${cloudConfig.password}`
        }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok && response.status !== 409) {
        if (response.status === 401) throw new Error('La clave compartida no coincide. Revisen que sea idéntica en los dos celulares.');
        if (response.status === 413) throw new Error('Las fotos ocupan demasiado espacio para sincronizar. Elijan fotos más pequeñas.');
        if (response.status === 429) throw new Error('Hubo muchos intentos con la clave. Esperen 15 minutos y vuelvan a intentar.');
        throw new Error(body.error || `El servicio respondió con error ${response.status}.`);
    }
    return { response, body };
}

async function syncSharedData() {
    if (!cloudConfig) return;
    if (!navigator.onLine) {
        setSyncStatus('Sin conexión. Sus cambios siguen guardados aquí y se sincronizarán automáticamente al volver a estar en línea.');
        return;
    }

    setSyncStatus('Sincronizando sus recuerdos y fotos…');
    const { body: initialState } = await cloudRequest('/api/state');
    let remoteState = initialState;

    for (let attempt = 0; attempt < 5; attempt += 1) {
        const localData = await getLocalSharedData();
        const mergedData = mergeSharedData(localData, remoteState.data, remoteState.updatedAt);
        await saveLocalSharedData(mergedData);
        const serializedData = JSON.stringify(mergedData);
        if (serializedData === JSON.stringify(remoteState.data)) {
            localStorage.setItem(CLOUD_UPDATED_KEY, remoteState.updatedAt || new Date().toISOString());
            cloudRevision = remoteState.revision;
            localStorage.setItem(CLOUD_REVISION_KEY, String(cloudRevision));
            setSyncStatus(`Todo está al día${remoteState.updatedAt ? ` · ${new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(remoteState.updatedAt))}` : ''}.`);
            syncStatus.dataset.state = 'connected';
            return;
        }

        const { response, body } = await cloudRequest('/api/state', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ revision: remoteState.revision, data: mergedData, deviceId: getPushDeviceId() })
        });
        if (response.status === 409) {
            remoteState = body;
            continue;
        }
        localStorage.setItem(CLOUD_UPDATED_KEY, body.updatedAt);
        cloudRevision = body.revision;
        localStorage.setItem(CLOUD_REVISION_KEY, String(cloudRevision));
        setSyncStatus(`Todo está al día · ${new Intl.DateTimeFormat('es-MX', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(body.updatedAt))}.`);
        syncStatus.dataset.state = 'connected';
        return;
    }
    throw new Error('Hubo cambios simultáneos en ambos celulares. Vuelve a sincronizar para unirlos.');
}

function runCloudSync() {
    if (cloudSyncPromise) return cloudSyncPromise;
    cloudSyncPromise = syncSharedData()
        .catch((error) => {
            console.error('No se pudo sincronizar la sala:', error);
            setSyncStatus(`${error.message} Tus datos locales siguen guardados.`, 'error');
        })
        .finally(() => {
            cloudSyncPromise = null;
        });
    return cloudSyncPromise;
}

async function checkForCloudChanges() {
    if (!cloudConfig || !navigator.onLine || document.hidden || cloudRevision === null) return;
    try {
        const { body } = await cloudRequest('/api/state?metadata=1');
        if (Number.isSafeInteger(body.revision) && body.revision !== cloudRevision) await runCloudSync();
    } catch (error) {
        console.error('No se pudo revisar si hay cambios compartidos:', error);
        setSyncStatus('No se pudieron consultar cambios. Se reintentara en breve.', 'error');
    }
}

function scheduleCloudSync() {
    if (!cloudConfig) return;
    try {
        localStorage.setItem(CLOUD_UPDATED_KEY, new Date().toISOString());
    } catch (error) {
        console.error('No se pudo registrar el cambio pendiente de sincronizar:', error);
        setSyncStatus('No se pudo preparar la sincronización en este dispositivo. Revisa el espacio disponible.', 'error');
        return;
    }
    clearTimeout(cloudSyncTimer);
    setSyncStatus(navigator.onLine ? 'Cambios guardados aquí. Sincronizando en un momento…' : 'Cambios guardados sin conexión; se subirán al recuperar internet.');
    cloudSyncTimer = setTimeout(() => void runCloudSync(), 900);
}

syncForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let apiUrl;
    try {
        apiUrl = normalizeApiUrl(syncApiUrlInput.value.trim());
    } catch (error) {
        setSyncStatus(error.message, 'error');
        return;
    }
    const password = syncPasswordInput.value;
    if (new TextEncoder().encode(password).length < 24) {
        setSyncStatus('La clave compartida debe tener al menos 24 bytes. Usen la misma clave privada en ambos celulares.', 'error');
        return;
    }
    if (!navigator.onLine) {
        setSyncStatus('Conéctense a internet para verificar el servicio por primera vez.', 'error');
        return;
    }

    syncConnectButton.disabled = true;
    setSyncStatus('Verificando el servicio privado…');
    try {
        const response = await fetch(`${apiUrl}/health`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`El servicio respondió con error ${response.status}.`);
        const health = await response.json();
        if (health.status !== 'ok') throw new Error('El servicio respondió, pero no confirmó que está listo.');
        cloudConfig = { apiUrl, password };
        localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(cloudConfig));
        updateSyncControls();
        await runCloudSync();
    } catch (error) {
        console.error('No se pudo conectar al servicio compartido:', error);
        setSyncStatus(`${error.message || 'No se pudo conectar al servicio.'} Comprueba su dirección y que esté desplegado.`, 'error');
    } finally {
        syncConnectButton.disabled = false;
    }
});

pushNotificationsButton.addEventListener('click', async () => {
    if (!cloudConfig) return;
    pushNotificationsButton.disabled = true;
    try {
        const permission = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
        if (permission !== 'granted') throw new Error('El navegador no autoriz\u00f3 las notificaciones.');
        const registration = await navigator.serviceWorker.ready;
        const { body: keyData } = await cloudRequest('/api/push/public-key');
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(keyData.publicKey)
            });
        }
        await cloudRequest('/api/push/subscriptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId: getPushDeviceId(), subscription: subscription.toJSON() })
        });
        localStorage.setItem(PUSH_ENABLED_KEY, 'true');
        setPushStatus('Este celular recibir\u00e1 avisos cuando haya recuerdos nuevos.');
        pushNotificationsButton.textContent = 'Notificaciones activadas';
    } catch (error) {
        setPushStatus(error.message || 'No se pudieron activar las notificaciones.', 'error');
    } finally {
        pushNotificationsButton.disabled = false;
        await updatePushControls();
    }
});

syncNowButton.addEventListener('click', () => {
    clearTimeout(cloudSyncTimer);
    void runCloudSync();
});

syncDisconnectButton.addEventListener('click', async () => {
    try {
        if ('serviceWorker' in navigator && cloudConfig) {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                try { await cloudRequest('/api/push/subscriptions', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deviceId: getPushDeviceId() }) }); } catch (error) { console.warn('No se pudo quitar la suscripcion remota; se limpiara al intentar enviar el siguiente aviso.'); }
                await subscription.unsubscribe();
            }
        }
        localStorage.removeItem(PUSH_ENABLED_KEY);
        localStorage.removeItem(CLOUD_CONFIG_KEY);
        localStorage.removeItem(CLOUD_UPDATED_KEY);
        localStorage.removeItem(CLOUD_REVISION_KEY);
        cloudRevision = null;
        cloudConfig = null;
        updateSyncControls();
        setSyncStatus('Dispositivo desconectado. No se borró ningún recuerdo de este celular.');
    } catch (error) {
        console.error('No se pudo desconectar este dispositivo:', error);
        setSyncStatus('No se pudo borrar la conexión guardada. Inténtalo de nuevo.', 'error');
    }
});

window.addEventListener('online', () => {
    if (cloudConfig) void runCloudSync();
});
window.addEventListener('offline', () => {
    if (cloudConfig) setSyncStatus('Sin conexión. Sus cambios siguen guardados aquí y se sincronizarán al volver a estar en línea.');
});
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && cloudConfig) void runCloudSync();
});

setInterval(() => void checkForCloudChanges(), 15_000);

async function savePlace(place) {
    const database = await openPlacesDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(PLACES_STORE, 'readwrite');
        transaction.objectStore(PLACES_STORE).add(place);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error || new Error('No se pudo guardar el lugar.'));
        transaction.onabort = () => reject(transaction.error || new Error('Se interrumpió el guardado del lugar.'));
    });
}

async function updatePlace(place) {
    const database = await openPlacesDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(PLACES_STORE, 'readwrite');
        transaction.objectStore(PLACES_STORE).put(place);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error || new Error('No se pudo actualizar el lugar.'));
        transaction.onabort = () => reject(transaction.error || new Error('Se interrumpió la actualización del lugar.'));
    });
}

async function deletePlace(id) {
    const database = await openPlacesDatabase();
    return new Promise((resolve, reject) => {
        const transaction = database.transaction(PLACES_STORE, 'readwrite');
        transaction.objectStore(PLACES_STORE).delete(id);
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error || new Error('No se pudo eliminar el lugar.'));
        transaction.onabort = () => reject(transaction.error || new Error('Se interrumpió la eliminación del lugar.'));
    });
}

async function compressPlacePhoto(file) {
    if (!file.type.startsWith('image/')) throw new Error('El archivo elegido no es una imagen.');
    if (file.size > 15 * 1024 * 1024) throw new Error('La foto pesa más de 15 MB. Elige una más pequeña.');

    let bitmap;
    try {
        bitmap = await createImageBitmap(file);
    } catch (error) {
        throw new Error('No se pudo abrir esa foto. Prueba con JPG, PNG o WebP.');
    }
    const maxDimension = 1400;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) {
        bitmap.close();
        throw new Error('No se pudo preparar la foto en este navegador.');
    }
    context.fillStyle = '#fff8eb';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => blob
                ? resolve(blob)
                : reject(new Error('No se pudo optimizar la foto elegida.')),
            'image/jpeg',
            0.82
        );
    });
}

async function assertPlacePhotoBatchFits(placeId, newPhotos, replacePrimary = false) {
    if (newPhotos.some((photo) => photo.size > MAX_SYNC_PLACE_PHOTO_BYTES)) {
        throw new Error('Cada foto debe quedar por debajo de 2 MB. Elige imágenes más pequeñas.');
    }
    const places = await getPlaces();
    const existingBytes = places.reduce((total, place) => {
        const keepPrimary = !(replacePrimary && place.id === placeId);
        const primaryBytes = keepPrimary && place.photo instanceof Blob ? place.photo.size : 0;
        const additionalBytes = (place.additionalPhotos || [])
            .filter((photo) => photo instanceof Blob)
            .reduce((sum, photo) => sum + photo.size, 0);
        return total + primaryBytes + additionalBytes;
    }, 0);
    const addedBytes = newPhotos.reduce((total, photo) => total + photo.size, 0);
    if (existingBytes + addedBytes > MAX_SYNC_PHOTOS_BYTES) {
        throw new Error('El álbum puede sincronizar hasta 7 MB de fotos. Quita o reduce algunas antes de agregar más.');
    }
}

async function renderPlaces() {
    placePhotoUrls.forEach((url) => URL.revokeObjectURL(url));
    placePhotoUrls = [];
    placesGrid.replaceChildren();

    try {
        if (!archivedPlacesPromise) {
            archivedPlacesPromise = fetch('./assets/places/visited.json?v=8ec0d05')
                .then((response) => {
                    if (!response.ok) throw new Error(`No se pudieron cargar los lugares del chat (${response.status}).`);
                    return response.json();
                })
                .then((places) => {
                    if (!Array.isArray(places) || !places.every((place) =>
                        place && typeof place.id === 'string' && typeof place.name === 'string' &&
                        typeof place.date === 'string' && typeof place.note === 'string' &&
                        Array.isArray(place.photos) &&
                        (!place.ratings || ['precios', 'sabor', 'atencion', 'menu'].every((key) =>
                            Number.isInteger(place.ratings[key]) && place.ratings[key] >= 0 && place.ratings[key] <= 5
                        ))
                    )) {
                        throw new Error('El archivo de lugares importados tiene un formato inválido.');
                    }
                    return places.map((place) => ({ ...place, imported: true }));
                })
                .catch((error) => {
                    archivedPlacesPromise = null;
                    throw error;
                });
        }

        const [savedPlaces, archivedPlaces] = await Promise.all([getPlaces(), archivedPlacesPromise]);
        const deletedPlaceIds = loadStoredList(DELETED_PLACES_KEY, (id) => typeof id === 'string');
        const placeOverrides = loadPlaceOverrides();

        // 1. Crear un mapa para fusionar lugares sin duplicar por ID
        const placesMap = new Map();

        // Cargar lugares precargados aplicando overrides de fecha
        archivedPlaces.forEach((place) => {
            if (!deletedPlaceIds.includes(place.id)) {
                const overrideDate = placeOverrides[place.id];
                placesMap.set(place.id, {
                    ...place,
                    date: overrideDate !== undefined ? overrideDate : place.date
                });
            }
        });

        // 2. Fusionar con lugares dinámicos creados en IndexedDB
        savedPlaces.forEach((place) => {
            if (!deletedPlaceIds.includes(place.id)) {
                // Si el ID ya existe en los importados, conservar fotos e imagen pero actualizar fecha/campos
                if (placesMap.has(place.id)) {
                    const existing = placesMap.get(place.id);
                    placesMap.set(place.id, {
                        ...existing,
                        ...place,
                        photos: existing.photos || place.photos,
                        date: placeOverrides[place.id] !== undefined ? placeOverrides[place.id] : place.date,
                        additionalPhotos: place.additionalPhotos || existing.additionalPhotos || []
                    });
                } else {
                    placesMap.set(place.id, place);
                }
            }
        });

        const places = Array.from(placesMap.values())
            .sort((first, second) => (second.date || '').localeCompare(first.date || ''));

        placesCount.textContent = `${places.length} ${places.length === 1 ? 'lugar' : 'lugares'} en su álbum ♡`;
        placesEmpty.hidden = places.length > 0;
        renderPlaceSuggestions(places);

        places.forEach((place, index) => {
            const card = document.createElement('article');
            card.className = 'place-card';
            const photoStrip = document.createElement('div');
            photoStrip.className = 'place-photo-strip';
            const photos = [
                ...(place.photo instanceof Blob
                    ? [{ blob: place.photo, alt: `Foto actualizada de ${place.name}` }]
                    : (place.photos || [])),
                ...(place.additionalPhotos || []).map((blob, photoIndex) => ({
                    blob,
                    alt: `Foto adicional ${photoIndex + 1} de ${place.name}`
                }))
            ];
            photoStrip.dataset.photoCount = String(photos.length);

            if (photos.length) {
                photos.forEach((photoData, photoIndex) => {
                    const photo = document.createElement('img');
                    photo.src = photoData.blob ? URL.createObjectURL(photoData.blob) : photoData.src;
                    if (photoData.blob) placePhotoUrls.push(photo.src);
                    photo.alt = photoData.alt || `Foto de ${place.name}`;
                    photo.loading = index < 6 && photoIndex === 0 ? 'eager' : 'lazy';
                    photoStrip.append(photo);
                });
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'place-photo-placeholder';
                placeholder.setAttribute('aria-hidden', 'true');
                placeholder.textContent = '♡';
                photoStrip.append(placeholder);
            }

            const copy = document.createElement('div');
            copy.className = 'place-card-copy';
            const date = document.createElement('div');
            date.className = 'place-card-date';

            const dateLabel = document.createElement('span');
            dateLabel.className = 'place-card-date-label';
            dateLabel.textContent = place.date
                ? new Intl.DateTimeFormat('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
                    .format(new Date(`${place.date}T12:00:00`))
                : 'Fecha por confirmar';
            const dateInput = document.createElement('input');
            dateInput.type = 'date';
            dateInput.className = 'place-card-date-input';
            dateInput.value = place.date || '';
            dateInput.setAttribute('aria-label', `Elegir fecha para ${place.name}`);
            const confirmButton = document.createElement('button');
            confirmButton.type = 'button';
            confirmButton.className = 'place-confirm-date-button';
            confirmButton.textContent = place.date ? 'Cambiar fecha' : 'Confirmar fecha';
            confirmButton.addEventListener('click', async () => {
                try {
                    const newDate = dateInput.value;
                    if (!newDate) {
                        showToast('Elige primero una fecha en el calendario.');
                        return;
                    }
                    const currentOverrides = loadPlaceOverrides();
                    currentOverrides[place.id] = newDate;
                    savePlaceOverrides(currentOverrides);
                    await renderPlaces();
                    scheduleCloudSync();
                    showToast(`Fecha guardada para ${place.name}`);
                } catch (error) {
                    showPlaceFormError('No se pudo guardar la fecha:', error);
                }
            });
            date.append(dateLabel, dateInput, confirmButton);
            const title = document.createElement('h3');
            title.textContent = place.name;
            copy.append(date, title);

            if (place.note) {
                const note = document.createElement('p');
                note.className = 'place-card-note';
                note.textContent = place.note;
                copy.append(note);
            }

            if (place.ratings) {
                const ratingList = document.createElement('dl');
                ratingList.className = 'place-card-ratings';
                ratingList.setAttribute('aria-label', `Calificaciones de ${place.name}`);
                const categories = [
                    ['precios', 'Precios'],
                    ['sabor', 'Sabor'],
                    ['atencion', 'Atenci\u00f3n'],
                    ['menu', 'Men\u00fa']
                ];
                categories.forEach(([key, label]) => {
                    const score = place.ratings[key];
                    const item = document.createElement('div');
                    item.className = 'place-card-rating';
                    const term = document.createElement('dt');
                    term.textContent = label;
                    const value = document.createElement('dd');
                    value.className = 'place-card-rating-value';
                    value.setAttribute('aria-label', `${label}: ${score} de 5 estrellas`);
                    value.innerHTML = `<span class="place-rating-stars" aria-hidden="true">${'\u2605'.repeat(score)}${'\u2606'.repeat(5 - score)}</span><span>${score}/5</span>`;
                    item.append(term, value);
                    ratingList.append(item);
                });
                copy.append(ratingList);
            }

            const changePhotoButton = document.createElement('button');
            changePhotoButton.className = 'place-change-photo-button';
            changePhotoButton.type = 'button';
            changePhotoButton.textContent = photos.length ? 'Cambiar foto' : 'Agregar fotos';
            changePhotoButton.setAttribute('aria-label', photos.length ? `Cambiar foto de ${place.name}` : `Agregar fotos a ${place.name}`);
            const changePhotoInput = document.createElement('input');
            changePhotoInput.className = 'place-change-photo-input';
            changePhotoInput.type = 'file';
            changePhotoInput.accept = 'image/*';
            changePhotoInput.multiple = photos.length === 0;
            changePhotoInput.hidden = true;
            changePhotoInput.setAttribute('aria-label', `Elegir fotos para ${place.name}`);
            changePhotoButton.addEventListener('click', () => changePhotoInput.click());
            changePhotoInput.addEventListener('change', async () => {
                const files = Array.from(changePhotoInput.files || []);
                if (!files.length) return;
                if (photos.length === 0 && files.length > MAX_PLACE_PHOTOS) {
                    showToast(`Puedes agregar hasta ${MAX_PLACE_PHOTOS} fotos por lugar.`);
                    changePhotoInput.value = '';
                    return;
                }

                changePhotoButton.disabled = true;
                changePhotoButton.textContent = photos.length ? 'Guardando foto…' : 'Guardando fotos…';
                try {
                    const newPhotos = [];
                    for (const file of files) newPhotos.push(await compressPlacePhoto(file));
                    await assertPlacePhotoBatchFits(place.id, newPhotos);
                    const current = (await getPlaces()).find((saved) => saved.id === place.id);
                    await updatePlace({
                        id: place.id,
                        name: place.name,
                        date: current?.date || place.date || '',
                        note: current?.note || place.note || '',
                        photo: newPhotos[0],
                        additionalPhotos: [
                            ...(current?.additionalPhotos || []),
                            ...newPhotos.slice(1)
                        ]
                    });
                    await renderPlaces();
                    scheduleCloudSync();
                    showToast(newPhotos.length === 1
                        ? `Foto de ${place.name} actualizada ♡`
                        : `${newPhotos.length} fotos agregadas a ${place.name} ♡`);
                } catch (error) {
                    console.error(`No se pudieron guardar las fotos de ${place.name}:`, error);
                    showToast(error.message || 'No se pudieron guardar las fotos.');
                    changePhotoButton.disabled = false;
                    changePhotoButton.textContent = photos.length ? 'Cambiar foto' : 'Agregar fotos';
                } finally {
                    changePhotoInput.value = '';
                }
            });
            copy.append(changePhotoButton, changePhotoInput);
            const addPhotoButton = document.createElement('button');
            addPhotoButton.className = 'place-change-photo-button';
            addPhotoButton.type = 'button';
            addPhotoButton.textContent = 'Agregar fotos';
            addPhotoButton.hidden = !place.date || photos.length === 0 || photos.length >= MAX_PLACE_PHOTOS;
            addPhotoButton.setAttribute('aria-label', `Agregar fotos a ${place.name}`);
            const addPhotoInput = document.createElement('input');
            addPhotoInput.className = 'place-change-photo-input';
            addPhotoInput.type = 'file';
            addPhotoInput.accept = 'image/*';
            addPhotoInput.multiple = true;
            addPhotoInput.hidden = true;
            addPhotoInput.setAttribute('aria-label', `Elegir fotos para agregar a ${place.name}`);
            addPhotoButton.addEventListener('click', () => addPhotoInput.click());
            addPhotoInput.addEventListener('change', async () => {
                const files = Array.from(addPhotoInput.files || []);
                if (!files.length) return;
                const current = (await getPlaces()).find((saved) => saved.id === place.id);
                const currentPhotoCount = current?.photo instanceof Blob
                    ? 1 + (current.additionalPhotos || []).length
                    : (place.photos || []).length + (current?.additionalPhotos || []).length;
                const availableSlots = Math.max(0, MAX_PLACE_PHOTOS - currentPhotoCount);
                if (files.length > availableSlots) {
                    showToast(`En este lugar caben ${availableSlots} foto${availableSlots === 1 ? '' : 's'} más (máximo ${MAX_PLACE_PHOTOS}).`);
                    addPhotoInput.value = '';
                    return;
                }
                addPhotoButton.disabled = true;
                addPhotoButton.textContent = 'Agregando fotos…';
                try {
                    const newPhotos = [];
                    for (const file of files) newPhotos.push(await compressPlacePhoto(file));
                    await assertPlacePhotoBatchFits(place.id, newPhotos);
                    await updatePlace({
                        id: place.id,
                        name: place.name,
                        date: current?.date || place.date || '',
                        note: current?.note || place.note || '',
                        photo: current?.photo || null,
                        additionalPhotos: [...(current?.additionalPhotos || []), ...newPhotos]
                    });
                    await renderPlaces();
                    scheduleCloudSync();
                    showToast(newPhotos.length === 1
                        ? `Foto agregada a ${place.name}`
                        : `${newPhotos.length} fotos agregadas a ${place.name}`);
                } catch (error) {
                    console.error(`No se pudieron agregar fotos a ${place.name}:`, error);
                    showToast(error.message || 'No se pudieron agregar las fotos.');
                    addPhotoButton.disabled = false;
                    addPhotoButton.textContent = 'Agregar fotos';
                } finally {
                    addPhotoInput.value = '';
                }
            });
            copy.append(addPhotoButton, addPhotoInput);


            if (!place.imported) {
                const deleteButton = document.createElement('button');
                deleteButton.className = 'place-delete-button';
                deleteButton.type = 'button';
                deleteButton.textContent = 'Eliminar de nuestros lugares';
                deleteButton.setAttribute('aria-label', `Eliminar ${place.name} del álbum`);
                deleteButton.addEventListener('click', async () => {
                    if (!window.confirm(`¿Eliminar "${place.name}" del álbum?`)) return;
                    try {
                        await deletePlace(place.id);
                        const deletedIds = loadStoredList(DELETED_PLACES_KEY, (id) => typeof id === 'string');
                        localStorage.setItem(DELETED_PLACES_KEY, JSON.stringify([...new Set([...deletedIds, place.id])]));
                        await renderPlaces();
                        scheduleCloudSync();
                        showToast('Lugar eliminado del álbum.');
                    } catch (error) {
                        showPlaceFormError('No se pudo eliminar el lugar del álbum:', error);
                    }
                });
                copy.append(deleteButton);
            }

            card.append(photoStrip, copy);
            placesGrid.append(card);
        });
    } catch (error) {
        placesEmpty.hidden = false;
        placesEmpty.textContent = 'El álbum no está disponible en este navegador.';
        showPlaceFormError('No se pudo abrir el álbum de lugares:', error);
    }
}

function renderPlaceSuggestions(places) {
    placeSuggestionList.replaceChildren();
    const normalizePlaceName = (name) => name.toLocaleLowerCase('es-MX')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[^a-z0-9]+/g, '');
    const missingPlaces = PLACE_SUGGESTIONS.filter((suggestion) =>
        !places.some((place) =>
            normalizePlaceName(place.name) === normalizePlaceName(suggestion.name) &&
            place.date === suggestion.date
        )
    );
    placeSuggestions.hidden = missingPlaces.length === 0;
    missingPlaces.forEach((suggestion) => {
        const button = document.createElement('button');
        button.className = 'place-suggestion-button';
        button.type = 'button';
        button.textContent = `＋ ${suggestion.name} · ${new Intl.DateTimeFormat('es-MX', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(new Date(`${suggestion.date}T12:00:00`))}`;
        button.addEventListener('click', () => {
            document.querySelector('#place-name').value = suggestion.name;
            document.querySelector('#place-date').value = suggestion.date;
            document.querySelector('#place-name').focus();
            placeForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        placeSuggestionList.append(button);
    });
}

function loadMemories() {
    try {
        const saved = localStorage.getItem(MEMORIES_KEY);
        if (!saved) return [];
        const memories = JSON.parse(saved);
        if (!Array.isArray(memories)) throw new Error('El formato de recuerdos no es válido.');
        return memories.filter((memory) =>
            memory && typeof memory.text === 'string' &&
            typeof memory.date === 'string'
        );
    } catch (error) {
        console.error('No se pudieron cargar los recuerdos guardados:', error);
        showToast('No se pudieron abrir tus recuerdos guardados en este dispositivo.');
        return [];
    }
}

let memories = loadMemories();
applyTheme(getInitialTheme());
const savedReminderTime = loadReminderTime();
if (savedReminderTime) {
    reminderTime.value = savedReminderTime;
    updateReminderStatus(savedReminderTime);
    scheduleReminder(savedReminderTime);
}

function renderMemories() {
    memoryList.replaceChildren();
    memories.forEach((memory) => {
        const item = document.createElement('li');
        item.className = 'memory-item';
        const text = document.createElement('span');
        text.textContent = memory.text;
        item.append(text);
        memoryList.append(item);
    });
    memoryEmpty.hidden = memories.length > 0;
}

document.querySelector('#surprise-button').addEventListener('click', showSurprise);
document.querySelector('#another-button').addEventListener('click', showSurprise);
document.querySelector('#theme-toggle').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
        console.error('No se pudo guardar el tema elegido:', error);
        showToast('El tema cambió, pero no se pudo guardar la preferencia en este dispositivo.');
    }
});

reminderForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!('Notification' in window)) {
        showToast('Este navegador no permite notificaciones.');
        return;
    }
    if (!('serviceWorker' in navigator)) {
        showToast('Este navegador no permite recordatorios de la app.');
        return;
    }

    let permission = Notification.permission;
    if (permission === 'default') {
        try {
            permission = await Notification.requestPermission();
        } catch (error) {
            console.error('No se pudo solicitar permiso para notificaciones:', error);
            showToast('No se pudo solicitar permiso para las notificaciones.');
            return;
        }
    }
    if (permission !== 'granted') {
        showToast('Activa las notificaciones de esta página en los ajustes del navegador.');
        return;
    }

    const time = reminderTime.value;
    if (!time) {
        showToast('Elige una hora para tu recordatorio.');
        return;
    }
    try {
        localStorage.setItem(REMINDER_KEY, time);
    } catch (error) {
        console.error('No se pudo guardar la hora del recordatorio:', error);
        showToast('No se pudo guardar la hora en este dispositivo.');
        return;
    }
    updateReminderStatus(time);
    scheduleReminder(time);
    showToast(`Listo: te llegará una notita diaria a las ${time} ♡`);
});

reminderCancel.addEventListener('click', () => {
    try {
        localStorage.removeItem(REMINDER_KEY);
    } catch (error) {
        console.error('No se pudo desactivar el recordatorio:', error);
        showToast('No se pudo desactivar el recordatorio guardado.');
        return;
    }
    clearTimeout(reminderTimer);
    activeReminderTime = null;
    updateReminderStatus(null);
    showToast('Recordatorio desactivado.');
});

placePhotoInput.addEventListener('change', () => {
    if (previewPhotoUrl) URL.revokeObjectURL(previewPhotoUrl);
    const files = Array.from(placePhotoInput.files || []);
    if (files.length > MAX_PLACE_PHOTOS) {
        showToast(`Puedes agregar hasta ${MAX_PLACE_PHOTOS} fotos por lugar.`);
        placePhotoInput.value = '';
        placePhotoCount.textContent = '';
        placePhotoPreview.hidden = true;
        placePhotoPreview.removeAttribute('src');
        previewPhotoUrl = null;
        return;
    }
    if (!files.length) {
        placePhotoPreview.hidden = true;
        placePhotoPreview.removeAttribute('src');
        placePhotoCount.textContent = '';
        previewPhotoUrl = null;
        return;
    }
    placePhotoCount.textContent = `${files.length} foto${files.length === 1 ? '' : 's'} seleccionada${files.length === 1 ? '' : 's'}`;
    previewPhotoUrl = URL.createObjectURL(files[0]);
    placePhotoPreview.src = previewPhotoUrl;
    placePhotoPreview.hidden = false;
});

placeForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.querySelector('#place-name').value.trim();
    const date = document.querySelector('#place-date').value;
    const files = Array.from(placePhotoInput.files || []);
    if (!name || !date || !files.length) {
        showToast('Agrega el nombre, la fecha y al menos una foto del lugar.');
        return;
    }
    if (files.length > MAX_PLACE_PHOTOS) {
        showToast(`Puedes agregar hasta ${MAX_PLACE_PHOTOS} fotos por lugar.`);
        return;
    }

    const submitButton = placeForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    const id = `place-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    let photos = [];
    try {
        for (const file of files) photos.push(await compressPlacePhoto(file));
        await assertPlacePhotoBatchFits(id, photos);
    } catch (error) {
        console.error('No se pudieron preparar las fotos del lugar:', error);
        showToast(error.message || 'No se pudieron preparar las fotos elegidas.');
        submitButton.disabled = false;
        return;
    }

    const place = {
        id,
        name,
        date,
        note: document.querySelector('#place-note').value.trim(),
        photo: photos[0],
        additionalPhotos: photos.slice(1)
    };
    try {
        await savePlace(place);
        placeForm.reset();
        document.querySelector('#place-date').value = getLocalDateKey();
        placePhotoCount.textContent = '';
        if (previewPhotoUrl) URL.revokeObjectURL(previewPhotoUrl);
        previewPhotoUrl = null;
        placePhotoPreview.hidden = true;
        placePhotoPreview.removeAttribute('src');
        await renderPlaces();
        scheduleCloudSync();
        showToast('Lugar guardado en su álbum de aventuras ♡');
    } catch (error) {
        showPlaceFormError('No se pudo guardar el lugar en el álbum:', error);
    } finally {
        submitButton.disabled = false;
    }
});

dailyQuestionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const today = getLocalDateKey();
    const previousAnswer = dailyAnswers.find((entry) => entry.date === today);
    const first = document.querySelector('#first-answer').value.trim() || previousAnswer?.first || '';
    const second = document.querySelector('#second-answer').value.trim() || previousAnswer?.second || '';
    if (!first && !second) {
        showToast('Escriban al menos una respuesta para guardarla.');
        return;
    }
    const answer = {
        date: today,
        question: getQuestionForDate(today),
        first,
        second
    };
    const nextDailyAnswers = [
        answer,
        ...dailyAnswers.filter((entry) => entry.date !== today)
    ].slice(0, 60);
    try {
        localStorage.setItem(DAILY_ANSWERS_KEY, JSON.stringify(nextDailyAnswers));
    } catch (error) {
        console.error('No se pudieron guardar las respuestas de hoy:', error);
        showToast('No se pudieron guardar sus respuestas en este dispositivo.');
        return;
    }
    dailyAnswers = nextDailyAnswers;
    renderDailyQuestion();
    scheduleCloudSync();
    showToast('Sus respuestas de hoy quedaron guardadas ♡');
});

anniversaryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const date = anniversaryDateInput.value;
    if (!date) {
        showToast('Elijan primero su fecha especial.');
        return;
    }
    try {
        localStorage.setItem(ANNIVERSARY_KEY, date);
    } catch (error) {
        console.error('No se pudo guardar su fecha especial:', error);
        showToast('No se pudo guardar su fecha especial en este dispositivo.');
        return;
    }
    updateAnniversaryStatus(date);
    scheduleCloudSync();
    showToast('Su fecha especial quedó guardada ♡');
});

dateFilters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-filter]');
    if (!button) return;
    activeDateFilter = button.dataset.filter;
    dateFilters.querySelectorAll('.filter-button').forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle('is-active', isActive);
        filterButton.setAttribute('aria-pressed', String(isActive));
    });
    renderDates();
});

document.querySelector('#random-date-button').addEventListener('click', pickRandomDate);

document.querySelector('#custom-date-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const titleInput = document.querySelector('#custom-date-title');
    const title = titleInput.value.trim();
    if (!title) return;
    const idea = {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title,
        category: document.querySelector('#custom-date-category').value,
        detail: 'Una idea especial de ustedes. ¡Guárdenla para su próxima salida!',
        emoji: '♡',
        art: 'sunset',
        caption: 'un plan de ustedes'
    };
    const nextCustomDates = [...customDates, idea];
    try {
        localStorage.setItem(DATE_IDEAS_KEY, JSON.stringify(nextCustomDates));
    } catch (error) {
        console.error('No se pudo guardar la idea de cita:', error);
        showToast('No se pudo guardar el plan en este dispositivo.');
        return;
    }
    customDates = nextCustomDates;
    titleInput.value = '';
    activeDateFilter = 'Todas';
    dateFilters.querySelectorAll('.filter-button').forEach((button) => {
        const isActive = button.dataset.filter === activeDateFilter;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
    renderDates();
    scheduleCloudSync();
    showToast('Plan agregado a su lista de citas ♡');
});

document.querySelector('#memory-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.querySelector('#memory-input');
    const text = input.value.trim();
    if (!text) {
        showToast('Escribe primero el recuerdo que quieras guardar.');
        return;
    }

    const nextMemories = [{ text, date: new Date().toISOString() }, ...memories];
    try {
        localStorage.setItem(MEMORIES_KEY, JSON.stringify(nextMemories));
        memories = nextMemories;
        input.value = '';
        renderMemories();
        scheduleCloudSync();
        showToast('Recuerdo guardado con mucho cariño ♡');
    } catch (error) {
        console.error('No se pudo guardar el recuerdo:', error);
        showToast('No se pudo guardar. Comprueba el espacio disponible en el dispositivo.');
    }
});

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    installPrompt = event;
    document.querySelector('#install-button').hidden = false;
});

document.querySelector('#install-button').addEventListener('click', async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') showToast('¡Listo! Ya tienes este rinconcito en tu pantalla ♡');
    installPrompt = null;
    document.querySelector('#install-button').hidden = true;
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .catch((error) => {
                console.error('No se pudo preparar el modo sin conexión:', error);
                showToast('No se pudo preparar el modo sin conexión en este navegador.');
            });
    });
}

document.querySelector('#place-date').value = getLocalDateKey();
renderDailyQuestion();
updateAnniversaryStatus(anniversaryDateInput.value);
const initialContentReady = Promise.allSettled([renderPlaces(), renderMemories()]);
if (pickedDateId) {
    const pickedDate = [...DATE_IDEAS, ...customDates].find((idea) => idea.id === pickedDateId);
    if (pickedDate) datePickStatus.textContent = `Plan elegido: ${pickedDate.title}. ¡Ya tienen una próxima cita pendiente!`;
}
renderDates();
loadCloudConfig();

const loadingScreen = document.querySelector('#loading-screen');
const minimumLoadingTime = new Promise((resolve) => setTimeout(resolve, 500));
Promise.all([initialContentReady, minimumLoadingTime]).then(() => {
    loadingScreen.classList.add('is-hidden');
    window.setTimeout(() => loadingScreen.remove(), 450);
});
window.setTimeout(() => loadingScreen?.classList.add('is-hidden'), 3000);


const sectionMenuToggle = document.querySelector('#section-menu-toggle');
const sectionMenu = document.querySelector('#section-menu');
const appViews = [...document.querySelectorAll('[data-app-view]')];

function closeSectionMenu() {
    sectionMenu.hidden = true;
    sectionMenuToggle.setAttribute('aria-expanded', 'false');
}

sectionMenuToggle.addEventListener('click', () => {
    const isOpening = sectionMenu.hidden;
    sectionMenu.hidden = !isOpening;
    sectionMenuToggle.setAttribute('aria-expanded', String(isOpening));
});

sectionMenu.addEventListener('click', (event) => {
    const target = event.target.closest('[data-view-target]');
    if (!target) return;
    const selectedView = target.dataset.viewTarget;
    appViews.forEach((view) => {
        view.hidden = view.dataset.appView !== selectedView;
    });
    sectionMenu.querySelectorAll('[data-view-target]').forEach((button) => {
        if (button === target) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
    });
    closeSectionMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.section-nav-wrap')) closeSectionMenu();
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeSectionMenu();
});
