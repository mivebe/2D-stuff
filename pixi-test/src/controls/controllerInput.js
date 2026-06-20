

export function handleContorollerInput() {
    const refreshRate = 100;
    const output = document.getElementById('output');

    setInterval(getGamepadState, refreshRate);

    function getGamepadState() {

        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0];

        if (!gamepad) {
            console.log('No gamepad found.');
            return;
        }

        const pressedButtons = gamepad.buttons
            .map((button, id) => ({ id, button }))
            .filter(isPressed);
        for (const button of pressedButtons) {
            console.log(button);
            log(`Button ${button.id} was pressed.`)
        }

    }

    function isPressed({ button: { pressed } }) {
        return !!pressed;
    }

    function log(message) {
        const date = new Date().toISOString();
        output.innerHTML += `${date}: ${message}\n`;
    }
}

export function handleContorollerInput2() {
    const gamepad = navigator.getGamepads()[0];
    if (!gamepad) { return []; }

    return [{
        x: gamepad.axes[0],
        y: gamepad.axes[1]
    }, {
        x: gamepad.axes[2],
        y: gamepad.axes[3]
    }]
}