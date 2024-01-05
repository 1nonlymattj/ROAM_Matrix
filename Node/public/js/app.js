const socket = io();
const notesContainer = document.getElementById('sticky-notes-container');

socket.on('initialNotes', (initialNotes) => {
    initialNotes.forEach((note) => appendNoteElement(note));
});

socket.on('updateNotes', (updatedNotes) => {
    notesContainer.innerHTML = ''; // Clear existing notes
    updatedNotes.forEach((note) => appendNoteElement(note));
});

function appendNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.className = 'sticky-note';
    noteElement.style.backgroundColor = note.color;
    noteElement.style.left = note.left + 'px';
    noteElement.style.top = note.top + 'px';
    noteElement.textContent = note.text;

    // Enable draggable behavior
    noteElement.draggable = true;
    noteElement.addEventListener('dragend', () => updateNotePosition(noteElement, note));

    notesContainer.appendChild(noteElement);
}

function updateNotePosition(noteElement, note) {
    const rect = noteElement.getBoundingClientRect();
    const updatedNote = {
        id: note.id,
        text: noteElement.textContent,
        color: noteElement.style.backgroundColor,
        left: rect.left,
        top: rect.top,
    };

    socket.emit('updateNote', updatedNote);
}

// Handle adding a new note
document.addEventListener('click', (event) => {
    if (event.target === document.body) {
        const newNote = {
            id: generateUniqueId(),
            text: 'New Note',
            color: getRandomColor(),
            left: event.clientX,
            top: event.clientY,
        };

        socket.emit('updateNote', newNote);
    }
});

function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}