const display = {
    work: document.querySelector("#work"),
    break: document.querySelector("#break")
};
const bgColor = {
    work: getComputedStyle(document.documentElement)
            .getPropertyValue('--work-bg'),
    break: getComputedStyle(document.documentElement)
            .getPropertyValue('--break-bg')
};
const body = document.querySelector("body");
const status = document.querySelector(".status");
const clock = document.querySelector(".time");
const buttons = document.querySelectorAll(".time__button");
const toggle = document.querySelector(".toggle");
const statusToggle = document.querySelectorAll(".status__button");
const reset = document.querySelector(".reset");
buttons.forEach(button => button.addEventListener('click', changeTime));
statusToggle.forEach(button => button.addEventListener("click", toggleStatus));
toggle.addEventListener("click", toggleTimer);
reset.addEventListener("click", resetClock);
clock.addEventListener("transitionend", tick);

const maxTime = 60;
const minTime = 1;
let started = false;
let running = false;
let workMode = true;
let secsLeft;

function changeTime() {
    const element = display[this.dataset.type];
    let newTime = parseInt(element.textContent) + parseInt(this.dataset.adjust);
    newTime = Math.max(minTime, Math.min(newTime, maxTime))
    element.textContent = newTime;

    if (!started && status.textContent == this.dataset.type)
        updateDisplay(newTime * 60);
}

function updateDisplay(seconds) {
    clock.textContent = secondsToStr(seconds);
    clock.style.transform = "scale(1.01,1.05)";
}

function secondsToStr(seconds) {
    const mins = (Math.floor(seconds / 60)).toString();
    const secs = (seconds % 60).toString();
    return `${mins.padStart(2, '0')}:${secs.padStart(2, '0')}`;
}

function timer(seconds) {
    secsLeft = seconds;
    updateDisplay(secsLeft);
    countdown = setInterval(() => {
        if(secsLeft <= 0) {
            clearInterval(countdown);
            swapTimer();
            startTimer();
            return;
        }
        updateDisplay(--secsLeft);
    }, 1000);
}

function startTimer() {
    const mode = workMode ? "work" : "break";
    const mins = parseInt(display[mode].textContent);
    timer(mins * 60);
    statusToggle.forEach(button => button.disabled = true);
}

function swapTimer() {
    workMode = !workMode;
    const mode = workMode ? "work" : "break";

    const mins = parseInt(display[mode].textContent);
    updateDisplay(mins * 60);

    document.documentElement.style.setProperty('--body-bg', bgColor[mode]);
    statusToggle.forEach(button => button.classList.toggle("active"));
    status.textContent = mode;
}

function toggleTimer() {
    if (!running) {
        if (!started) {
            startTimer();
            started = true;
        }
        else {
            timer(secsLeft);
        }
        clock.classList.remove("pause");
        clock.classList.add("play");
    }
    else {
        clearInterval(countdown);
        clock.classList.add("pause");
        clock.classList.remove("play");
    }

    running = !running;
    toggle.textContent = running ? "❚❚" : "►";
    toggle.classList.toggle("pressed");
}

function toggleStatus() {
    const mode = workMode ? "work" : "break";
    if (mode != this.dataset.type) {
        swapTimer();
    }
}

function resetClock() {
    if (running) {
        clearInterval(countdown); 
        running = false;
    } 

    if (!workMode) {
        swapTimer();
    }
    else {
        updateDisplay(parseInt(display["work"].textContent) * 60);
    }

    started = false;
    clock.classList.remove("play");
    clock.classList.remove("pause");
    toggle.classList.remove("pressed");
    toggle.textContent = "►";
    statusToggle.forEach(button => button.disabled = false);
}

function tick(e) {
    if (e.propertyName == "transform")
        clock.style.transform = "scale(1,1)";
}
