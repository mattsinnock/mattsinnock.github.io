const workouts = {
    kettlebellSwissBall: [
        { name: "Kettlebell Swings", duration: 45, instructions: "Stand with feet shoulder-width apart, swing the kettlebell between your legs and then up to chest height." },
        { name: "Swiss Ball Plank", duration: 45, instructions: "Place your forearms on the Swiss ball, extend your legs behind you, and hold a plank position." },
        { name: "Kettlebell Goblet Squats", duration: 45, instructions: "Hold the kettlebell close to your chest with both hands, perform a deep squat while keeping your back straight." },
        { name: "Swiss Ball Russian Twists", duration: 45, instructions: "Sit on the ground with your knees bent, hold the Swiss ball with both hands, lean back slightly, and twist your torso from side to side." },
        // { name: "Kettlebell Sumo Deadlift High Pull", duration: 45, instructions: "Stand with feet wider than shoulder-width, hold the kettlebell with both hands between your legs, squat down and then stand up while lifting the kettlebell to chin height, leading with your elbows." },
        { name: "Swiss Ball Push-Ups", duration: 45, instructions: "Place your hands on the floor and your feet on the Swiss ball, perform a push-up." },
        { name: "Kettlebell One-Arm Row", duration: 45, instructions: "Support yourself with one hand on a sturdy surface, lean forward, and lift the kettlebell with your free hand in a rowing motion." },
        { name: "Swiss Ball Leg Curl", duration: 45, instructions: "Lie on your back, place your heels on the Swiss ball, lift your hips, and roll the ball towards your body using your legs." },
    ],
    bodyWeight: [
        { name: "Push-Ups", duration: 45, instructions: "Place your hands on the floor shoulder-width apart and perform a push-up." },
        { name: "Body Weight Squats", duration: 45, instructions: "Stand with feet shoulder-width apart, lower down as if sitting in an invisible chair, then stand back up." },
        { name: "Burpees", duration: 45, instructions: "Start in a standing position, drop into a squat with your hands on the ground, kick your feet back into a push-up position, return to squat, then jump up." },
        { name: "Mountain Climbers", duration: 45, instructions: "Start in a plank position, drive one knee up towards your chest, then quickly switch legs, continuing to alternate." },
        { name: "Plank", duration: 45, instructions: "Hold a plank position, keeping your core tight and body straight from head to heels." },
        { name: "High Knees", duration: 45, instructions: "Run in place, bringing your knees up towards your chest as high as possible." },
        { name: "Jump Squats", duration: 45, instructions: "Perform a regular squat, then jump up explosively from the bottom of the squat, landing back in the squat position." }
    ],
        combined: [
        { name: "Kettlebell Swings", duration: 45, instructions: "Stand with feet shoulder-width apart, swing the kettlebell between your legs and then up to chest height." },
        { name: "Push-Ups", duration: 45, instructions: "Place your hands on the floor shoulder-width apart and perform a push-up." },
        { name: "Swiss Ball Plank", duration: 45, instructions: "Place your forearms on the Swiss ball, extend your legs behind you, and hold a plank position." },
        { name: "Body Weight Squats", duration: 45, instructions: "Stand with feet shoulder-width apart, lower down as if sitting in an invisible chair, then stand back up." },
        { name: "Kettlebell Goblet Squats", duration: 45, instructions: "Hold the kettlebell close to your chest with both hands, perform a deep squat while keeping your back straight." },
        { name: "Swiss Ball Hamstring Curl", duration: 45, instructions: "Lie on your back, place your heels on the Swiss ball, lift your hips, and roll the ball towards your body using your legs." },
        { name: "Burpees", duration: 45, instructions: "Start in a standing position, drop into a squat with your hands on the ground, kick your feet back into a push-up position, return to squat, then jump up." }
    ],
    gluteStretches: [
        {
            name: "Glute Bridges",
            duration: 45,
            instructions: "Lie on your back with your knees bent and feet flat on the floor, hip-width apart. Squeeze your glutes and lift your hips towards the ceiling. Hold for a second at the top, then slowly lower back down."
        },
        {
            name: "Dead Bug",
            duration: 45,
            instructions: "Lie on your back with your arms extended toward the ceiling and legs bent at 90 degrees. Lower your right arm and left leg towards the floor, keeping your lower back pressed into the ground. Return to the start and switch sides."
        },
        {
            name: "Clamshells",
            duration: 45,
            instructions: "Lie on your side with knees bent at a 90-degree angle. Keep your feet together and lift your top knee as high as you can while keeping your hips stacked. Lower slowly and repeat."
        },
        {
            name: "Bird Dog",
            duration: 45,
            instructions: "Start on all fours with hands under shoulders and knees under hips. Extend your right arm forward and left leg back, keeping your core tight. Hold for a moment, then return to start and switch sides."
        },
        {
            name: "Standing Hamstring Stretch",
            duration: 45,
            instructions: "Stand tall and extend one leg in front with your heel on the ground. Keeping your back straight, hinge forward from the hips until you feel a stretch in the hamstrings. Hold and switch sides."
        },
        {
            name: "Seated Piriformis Stretch",
            duration: 45,
            instructions: "Sit on a chair and cross one ankle over the opposite knee. Keeping your back straight, lean forward slightly until you feel a stretch in the glutes. Hold and switch sides."
        }
    ]
};

var currentWorkout = []; // Holds the currently selected workout exercises
var isRunning = false;
var isPaused = false;
var currentExercise = 0;
var sets = 0;
var isResting = false;
var intervalId;

let timeLeft;


// Create an instance of AudioContext
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var isAudioUnlocked = false;

function updateExercise() {
    if (isResting) {
        // Calculate next exercise and set
        let nextExercise = currentExercise;
        let nextSet = sets + 1;
        
        if (nextSet >= 4) {
            nextSet = 0;
            nextExercise++;
            if (nextExercise >= currentWorkout.length) {
                nextExercise = 0;
            }
        }
        
        // Display rest message with next exercise info
        document.getElementById('exerciseName').innerText = "Rest";
        document.getElementById('instructions').innerText = 
            `Next up - Exercise ${nextExercise + 1}/${currentWorkout.length}: ` +
            `${currentWorkout[nextExercise].name} (Set ${nextSet + 1} of 4)\n\n` +
            `${currentWorkout[nextExercise].instructions}`;
    } else {
        let exerciseDisplay = `Exercise ${currentExercise + 1}/${currentWorkout.length}: ${currentWorkout[currentExercise].name}`;
        let setDisplay = ` (Set ${sets + 1} of 4)`;
        
        document.getElementById('exerciseName').innerText = exerciseDisplay + setDisplay;
        document.getElementById('instructions').innerText = currentWorkout[currentExercise].instructions;
    }

    timeLeft = isResting ? 15 : currentWorkout[currentExercise].duration;
}

function countdown() {
    if (timeLeft == 0) {
        if (isResting) {
            beep(200, 520); // Beep for 200 ms with a frequency of 520Hz at the end of a set
            sets++;
            isResting = false;
            if (sets >= 4) {
                sets = 0;
                currentExercise++;
                if (currentExercise >= currentWorkout.length) {
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

// Function to load the selected workout
function loadWorkout(workoutType) {
    currentWorkout = workouts[workoutType];
    currentExercise = 0;
    sets = 0;
    isResting = false;
}

function skipExercise() {
    clearInterval(intervalId);
    sets = 0;
    currentExercise++;
    if (currentExercise >= currentWorkout.length) {
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

document.getElementById('startPauseButton').addEventListener('click', function() {
    if (!isRunning) {
        // Unlock audio on mobile devices
        if (!isAudioUnlocked) {
            // Create and play an empty buffer to unlock the audio
            var buffer = audioCtx.createBuffer(1, 1, 22050);
            var source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.start(0);

            // Update the flag
            isAudioUnlocked = true;
        }

        // Start the workout
        var selectedWorkout = document.getElementById('workoutSelector').value;
        loadWorkout(selectedWorkout); // Load the selected workout
        updateExercise();
        intervalId = setInterval(countdown, 1000);
        this.innerText = 'Pause';
        isRunning = true;
        isPaused = false;
        this.innerText = 'Pause';
        document.getElementById('workoutSelector').disabled = true; // Disable selector once started
    } else if (!isPaused) {
        // pause
        clearInterval(intervalId);
        this.innerText = 'Resume';
        isPaused = true;
    } else {
        // Resume
        intervalId = setInterval(countdown, 1000);
        this.innerText = 'Pause';
        isPaused = false;
    }
});

