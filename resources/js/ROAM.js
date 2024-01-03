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
    noteElement.style.backgroundColor = note.color || 'yellow';
    noteElement.style.left = note.left || '50px';
    noteElement.style.top = note.top || '50px';

    noteElement.setAttribute('draggable', 'true');
    noteElement.setAttribute('contenteditable', 'true');
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

function drag(event) {
    event.dataTransfer.setData('text/plain', JSON.stringify({
        id: event.target.id,
        offsetX: event.clientX - event.target.getBoundingClientRect().left,
        offsetY: event.clientY - event.target.getBoundingClientRect().top
    }));

    document.addEventListener('dragover', dragOver);
    document.addEventListener('dragend', dragEnd);
}

function dragOver(event) {
    event.preventDefault();

    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    const noteElement = document.getElementById(data.id);

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const newLeft = mouseX - data.offsetX;
    const newTop = mouseY - data.offsetY;

    noteElement.style.left = `${newLeft}px`;
    noteElement.style.top = `${newTop}px`;
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