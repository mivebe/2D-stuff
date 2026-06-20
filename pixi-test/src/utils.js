export function disableContextMenu() {
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    function ctrlShiftKey(e, keyCode) {
        return e.ctrlKey && e.shiftKey && e.keyCode === keyCode.charCodeAt(0);
    }

    document.onkeydown = (e) => {
        // Disable F12, Ctrl + Shift + I, Ctrl + Shift + J, Ctrl + U
        if (
            e.keyCode === 123 ||
            e.keyCode === 83 ||
            ctrlShiftKey(e, 'I') ||
            ctrlShiftKey(e, 'J') ||
            ctrlShiftKey(e, 'C') ||
            (e.ctrlKey && e.code === 'KeyU')
        )
            return false;
    };
}

export function showProgress(e) {
    // console.log(e);
    const value = `${parseInt(100 * e)}%`
    const container = document.querySelector('.progress')
    const bar = document.querySelector('.progress-bar')
    const message = document.querySelector('.message')
    const percentage = document.querySelector('.percentage')

    container.classList.remove('hidden')
    bar.style.width = value
    bar.style.backgroundColor = '#FFCC00'
    message.innerText = 'Loading'
    percentage.innerText = value

    if (e === 1) {
        bar.style.backgroundColor = 'darkgreen'
        message.innerText = 'Complete'
        setTimeout(() => container.classList.add('hidden'), 2000)
    }
}