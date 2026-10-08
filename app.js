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
const surpriseCard = document.querySelector('#surprise-card');
const surpriseText = document.querySelector('#surprise-text');
const toast = document.querySelector('#toast');
const memoryList = document.querySelector('#memory-list');
const memoryEmpty = document.querySelector('#memory-empty');
let lastNoteIndex = -1;
let toastTimer;
let installPrompt;

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

renderMemories();
