document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    createTable();
});

let noteIdCounter = 0; // Initialize the counter
let savedPickKey = "";
let selectedIdArray = [];


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

// function takeScreenshot() {
//     const element = document.getElementById('contentToScreenshot');

//     html2canvas(element).then(function (canvas) {
//         // Convert the canvas to an image and open it in a new window
//         const screenshotImage = new Image();
//         screenshotImage.src = canvas.toDataURL();
//         const newWindow = window.open();
//         newWindow.document.write("<img src='" + screenshotImage.src + "' alt='Screenshot'>");
//     });
// }

function takeAndSaveScreenshot() {
    const element = document.getElementById('contentToScreenshot');

    html2canvas(element).then(function (canvas) {
        // Convert the canvas to a data URL
        const dataURL = canvas.toDataURL();

        // Create a link element to download the image
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'screenshot.png';
        link.click();
    });
}