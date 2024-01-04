
let currentlyDragging = null;

document.getElementById('sticky-notes-container').addEventListener('mousedown', function (event) {
    const target = event.target;

    if (target.classList.contains('sticky-note')) {
        currentlyDragging = target;
        startDrag(event);
    }
});

document.addEventListener('mousemove', dragMove);
document.addEventListener('mouseup', endDrag);

function startDrag(event) {
    offsetX = event.clientX - currentlyDragging.getBoundingClientRect().left;
    offsetY = event.clientY - currentlyDragging.getBoundingClientRect().top;
}

function dragMove(event) {
    if (currentlyDragging) {
        const newX = event.clientX - offsetX;
        const newY = event.clientY - offsetY;

        currentlyDragging.style.left = `${newX}px`;
        currentlyDragging.style.top = `${newY}px`;
    }
}

function endDrag() {
    currentlyDragging = null;
}