const exercises = [
    { name: "Kettlebell Swings", duration: 45, instructions: "Stand with feet shoulder-width apart, swing the kettlebell between your legs and then up to chest height." },
    { name: "Swiss Ball Plank", duration: 45, instructions: "Place your forearms on the Swiss ball, extend your legs behind you, and hold a plank position." },
    { name: "Kettlebell Goblet Squats", duration: 45, instructions: "Hold the kettlebell close to your chest with both hands, perform a deep squat while keeping your back straight." },
    { name: "Swiss Ball Russian Twists", duration: 45, instructions: "Sit on the ground with your knees bent, hold the Swiss ball with both hands, lean back slightly, and twist your torso from side to side." },
    { name: "Kettlebell Sumo Deadlift High Pull", duration: 45, instructions: "Stand with feet wider than shoulder-width, hold the kettlebell with both hands between your legs, squat down and then stand up while lifting the kettlebell to chin height, leading with your elbows." },
    { name: "Swiss Ball Push-Ups", duration: 45, instructions: "Place your hands on the floor and your feet on the Swiss ball, perform a push-up." },
    { name: "Kettlebell One-Arm Row", duration: 45, instructions: "Support yourself with one hand on a sturdy surface, lean forward, and lift the kettlebell with your free hand in a rowing motion." },
    { name: "Swiss Ball Leg Curl", duration: 45, instructions: "Lie on your back, place your heels on the Swiss ball, lift your hips, and roll the ball towards your body using your legs." },
    // Repeat this pattern for four rounds
];

let currentExercise = 0;
let timeLeft;
let intervalId;
let repetitions = 0;
let isResting = false;

// Create an instance of AudioContext
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function updateExercise() {
    let exerciseDisplay = "Exercise " + (currentExercise + 1) + ": " + exercises[currentExercise].name;
    let repetitionDisplay = " (Repetition " + (repetitions + 1) + " of 4)";

    if (isResting) {
        document.getElementById('exerciseName').innerText = "Rest";
        document.getElementById('instructions').innerText = "Take a short break, breathe deeply.";
    } else {
        document.getElementById('exerciseName').innerText = exerciseDisplay + repetitionDisplay;
        document.getElementById('instructions').innerText = exercises[currentExercise].instructions;
    }

    timeLeft = isResting ? 15 : exercises[currentExercise].duration;
}

function countdown() {
    if (timeLeft == 0) {
        if (isResting) {
            beep(200, 520); // Beep for 200 ms with a frequency of 520Hz at the end of a set
            repetitions++;
            isResting = false;
            if (repetitions >= 4) {
                repetitions = 0;
                currentExercise++;
                if (currentExercise >= exercises.length) {
                    currentExercise = 0; // Restart the circuit if at the end
                }
            }
        } else {
            beep(200, 440); // Beep for 200 ms with a frequency of 440Hz at the end of a set
            isResting = true;
        }
        updateExercise();
    } else {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft + " seconds";
    }
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowRight') {
        skipExercise();
    }
});

function skipExercise() {
    clearInterval(intervalId);
    repetitions = 0;
    currentExercise++;
    if (currentExercise >= exercises.length) {
        currentExercise = 0; // Restart if at the end
    }
    updateExercise();
    intervalId = setInterval(countdown, 1000);
}

function beep(duration, frequency) {
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (!frequency) {
        frequency = 440;
    }
    oscillator.frequency.value = frequency;

    oscillator.start();

    setTimeout(function() {
        oscillator.stop();
    }, duration);
}

document.getElementById('startButton').addEventListener('click', function() {
    updateExercise();
    intervalId = setInterval(countdown, 1000);
    this.style.display = 'none'; // Hide the start button
});
