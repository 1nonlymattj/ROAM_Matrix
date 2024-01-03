document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

let noteIdCounter = 0; // Initialize the counter
let savedPickKey = "";

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
    noteElement.id = note.id || 'note-${noteIdCounter++}'; // Set the id property for the note element
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

function addRisk() {
    noteIdCounter++;
    let teamName = document.getElementById('teamName').value;
    let newLine = '\n\n';
    let newNoteText = document.getElementById('newNote').value;

    if (newNoteText.trim() == '') {
        alert('Please enter a note before adding.');
        return;
    }

    const notesContainer = document.getElementById('sticky-notes-container');
    const noteElement = createNoteElement({
        text: teamName + newLine + newNoteText,
        color: getRiskColor(),
        left: '50px',
        top: '50px'
    });

    notesContainer.appendChild(noteElement);
    makeNotesDraggable();
    saveNotes();

    document.getElementById('newNote').value = '';
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

function CreateRiskDialog() {
    $('<div id = dialog align =center > ' +
        '<form id = note-form class= form-group>' +
        ' <input type= name name= TeamName class= form-control id= teamName placeholder= "Team Name" required>' +
        '<br><br>' +
        '<textarea id= newNote class= form-control-textfield rows = 5 col = 10 maxlength= 600 placeholder= "Type your risk here" resize:none required></textarea>' +
        '<br><br><br><br><br>' +
        ' </form>' + ' </div>'
    ).dialog({
        title: 'Identify New Risk',
        autoOpen: true,
        modal: true,
        width: $(window).width() > 400 ? 400 : 'auto',
        resizable: false,
        draggable: false,
        buttons: {
            'Ok': {
                text: 'Add Risk',
                'class': 'dialogButton',
                'id': 'confim',
                click: function () {
                    addRisk();
                    $(this).dialog('destroy');
                }
            },
            'Close': {
                text: 'Cancel',
                'class': 'dialogButton',
                'id': 'confim',
                click: function () {
                    $(this).dialog('destroy');
                }
            }
        }
    });
}
