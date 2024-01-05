const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public')); // Assume your HTML and JS files are in a 'public' folder

const notes = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send existing notes to the newly connected user
    socket.emit('initialNotes', notes);

    // Handle incoming note updates
    socket.on('updateNote', (updatedNote) => {
        const existingNoteIndex = notes.findIndex((note) => note.id === updatedNote.id);

        if (existingNoteIndex !== -1) {
            // Update existing note
            notes[existingNoteIndex] = updatedNote;
        } else {
            // Add new note
            notes.push(updatedNote);
        }

        // Broadcast the updated notes to all connected clients
        io.emit('updateNotes', notes);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});