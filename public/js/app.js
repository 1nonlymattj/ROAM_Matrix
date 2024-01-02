// app.js

document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

function loadNotes() {
    const notesContainer = document.getElementById('sticky-notes-container');
    notesContainer.innerHTML = '';

    const savedNotes = JSON.parse(localStorage.getItem('stickyNotes')) || [];

    savedNotes.forEach(note => {
        const noteElement = createNoteElement(note);
        notesContainer.appendChild(noteElement);
    });

    makeNotesDraggable();
}

function createNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.className = 'sticky-note';
    noteElement.innerText = note.text;
    noteElement.style.backgroundColor = note.color || 'red';
    noteElement.style.left = note.left || '100px';
    noteElement.style.top = note.top || '100px';

    noteElement.setAttribute('draggable', 'true');
    noteElement.setAttribute('contenteditable', 'true');
    noteElement.setAttribute('onmousedown', 'bringToFront(event)');
    noteElement.setAttribute('resizeable', 'true');
    noteElement.addEventListener('dragstart', drag);
    noteElement.addEventListener('input', saveNotes);

    return noteElement;
}

function makeNotesDraggable() {
    const notes = document.querySelectorAll('.sticky-note');
    notes.forEach(note => {
        note.addEventListener('dragstart', drag);
    });
}

function bringToFront(event) {
    const selectedNote = event.target.closest('.sticky-note');
    const notes = document.querySelectorAll('.sticky-note');

    notes.forEach(note => {
        note.style.zIndex = 1;
    });

    selectedNote.style.zIndex = 2;
}

function drag(event) {
    event.dataTransfer.setData('text/plain', JSON.stringify({ id: event.target.id, x: event.clientX, y: event.clientY }));
    document.addEventListener('dragover', dragOver);
    document.addEventListener('dragend', dragEnd);
}

function dragOver(event) {
    event.preventDefault();

    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    const offsetX = event.clientX - data.x;
    const offsetY = event.clientY - data.y;

    const noteElement = document.getElementById(data.id);
    const rect = noteElement.getBoundingClientRect();

    noteElement.style.left = rect.left + offsetX + 'px';
    noteElement.style.top = rect.top + offsetY + 'px';

    data.x = event.clientX;
    data.y = event.clientY;
}

function dragEnd() {
    document.removeEventListener('dragover', dragOver);
    document.removeEventListener('dragend', dragEnd);
    saveNotes();
}

function addNote() {
    const newNoteText = document.getElementById('new-note').value;

    if (newNoteText.trim() === '') {
        alert('Please enter a note before adding.');
        return;
    }

    const notesContainer = document.getElementById('sticky-notes-container');
    const noteElement = createNoteElement({
        text: newNoteText,
        color: getRiskColor(),
        left: '50px',
        top: '50px'
    });

    notesContainer.appendChild(noteElement);
    makeNotesDraggable();
    saveNotes();

    document.getElementById('new-note').value = '';
}

function saveNotes() {
    const notes = [];
    const notesElements = document.querySelectorAll('.sticky-note');

    notesElements.forEach(noteElement => {
        const note = {
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
    let color = '#e86969';
    return color;
}