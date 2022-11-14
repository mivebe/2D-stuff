window.addEventListener('keydown', handleKeyDown)
window.addEventListener('keyup', handleKeyUp)

let keys = {};
const velocity = 1.5

function handleKeyDown(e) {
    console.log(e);
    keys[e.keyCode] = true;
}

function handleKeyUp(e) {
    // console.log(e);
    keys[e.keyCode] = false;
}


export function handleKeyboardMovement() {
    const keysDiv = document.querySelector("#keys");
    keysDiv.innerHTML = JSON.stringify(keys)
    let finalX = 0;
    let finalY = 0;

    if (keys[87] || keys[38]) { finalY -= velocity } // W
    if (keys[65] || keys[37]) { finalX -= velocity } // A
    if (keys[83] || keys[40]) { finalY += velocity } // S
    if (keys[68] || keys[39]) { finalX += velocity } // D
    if (keys[32]) { console.log("Shoot"); } // Space
    if (keys[16]) { console.log('Run'); } // Shift
    if (keys[17]) { console.log('Ground / Crouch'); } // Ctrl
    if (keys[18]) { console.log('Throw'); } // Alt

    return { x: finalX, y: finalY }
}