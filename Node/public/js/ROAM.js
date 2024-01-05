document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    createTable();
});

let noteIdCounter = 0; // Initialize the counter
let savedPickKey = "";
let selectedIdArray = [];

const socket = io();
const notesContainer = document.getElementById('sticky-notes-container');


socket.on('initialNotes', (initialNotes) => {
    initialNotes.forEach((note) => appendNoteElement(note));
});

socket.on('updateNote', (updatedNote) => {
    updateNoteElement(updatedNote);
});

function loadNotes() {
    const notesContainer = document.getElementById('sticky-notes-container');
    notesContainer.innerHTML = '';

    const savedNotes = JSON.parse(localStorage.getItem('stickyNotes')) || [];

    savedNotes.forEach(note => {
        const noteElement = createNoteElement(note);
        notesContainer.appendChild(noteElement);
    });
}

function createNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.id = getNoteId();
    noteElement.className = 'sticky-note';
    noteElement.innerHTML = `<button class="delete-button" onclick="deleteNote('${noteElement.id}')"><i class="fa-solid fa-trash-can"></i></button>\n`;
    noteElement.innerHTML += note.text;
    noteElement.style.backgroundColor = note.color || '#e86969';
    noteElement.style.left = note.left || '50px';
    noteElement.style.top = note.top || '50px';

    noteElement.setAttribute('draggable', 'true');
    noteElement.setAttribute('contenteditable', 'true');
    noteElement.setAttribute('resizable', 'true');
    noteElement.addEventListener('input', saveNotes);

    return noteElement;
}

function addRisk() {
    noteIdCounter++;
    let teamName = document.getElementById('teamName').value;
    let newLine = '\n\n';
    let newNoteText = document.getElementById('newNote').value;

    const notesContainer = document.getElementById('sticky-notes-container');
    const noteElement = createNoteElement({
        text: teamName + newLine + newNoteText,
        color: getRiskColor(),
        left: '50px',
        top: '50px'
    });

    notesContainer.appendChild(noteElement);
    //makeNotesDraggable();
    saveNotes();

    document.getElementById('newNote').value = '';
}

function deleteNote(noteId) {
    const notesContainer = document.getElementById('sticky-notes-container');
    const noteToRemove = document.getElementById(noteId);

    notesContainer.removeChild(noteToRemove);
    deleteNoteFromLocalStorage(noteId);
}

function deleteNoteFromLocalStorage(noteId) {
    const savedNotes = JSON.parse(localStorage.getItem('stickyNotes')) || [];

    // Find the index of the note with the specified ID
    const noteIndex = savedNotes.findIndex(note => note.id === noteId);

    if (noteIndex !== -1) {
        // Remove the note from the array
        savedNotes.splice(noteIndex, 1);

        // Save the updated array back to local storage
        localStorage.setItem('stickyNotes', JSON.stringify(savedNotes));
    }
}

function saveNotes() {
    const notes = [];
    const notesElements = document.querySelectorAll('.sticky-note');

    notesElements.forEach(noteElement => {
        const note = {
            id: noteElement.id, // Retrieve the id property
            text: noteElement.innerText,
            color: noteElement.style.backgroundColor,
            left: noteElement.style.left,
            top: noteElement.style.top
        };

        notes.push(note);
    });

    localStorage.setItem('stickyNotes', JSON.stringify(notes));
}

function getRiskColor() {
    let color = '#86969';
    return color;
}

function getNoteId() {
    for (i = 0; i < noteIdCounter; i++) {
        num = i + 1;
        savedPickKey = 'note- ' + num;
    }
    return savedPickKey;
}

function updateNoteElement(updatedNote) {
    const noteElement = document.getElementById(updatedNote.id);

    if (noteElement) {
        // Update note position
        noteElement.style.left = updatedNote.left + 'px';
        noteElement.style.top = updatedNote.top + 'px';
    } else {
        // Create a new note
        const newNoteElement = document.createElement('div');
        newNoteElement.id = updatedNote.id;
        newNoteElement.className = 'sticky-note';
        newNoteElement.style.backgroundColor = updatedNote.color;
        newNoteElement.style.left = updatedNote.left + 'px';
        newNoteElement.style.top = updatedNote.top + 'px';
        newNoteElement.textContent = updatedNote.text;

        // Enable draggable behavior
        newNoteElement.draggable = true;
        newNoteElement.addEventListener('dragend', () => updateNotePosition(newNoteElement, updatedNote));

        notesContainer.appendChild(newNoteElement);
    }
}

function updateNotePosition(noteElement, updatedNote) {
    const rect = noteElement.getBoundingClientRect();
    const updatedNoteData = {
        id: updatedNote.id,
        text: updatedNote.text,
        color: updatedNote.color,
        left: rect.left,
        top: rect.top,
    };

    socket.emit('updateNote', updatedNoteData);
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