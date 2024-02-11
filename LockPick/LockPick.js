var timerInterval = null;
var secondsRemaining = 11;
var currentCircle = 1;
var isLocked = false;
function updateTimerDisplay() {
    var timerProgress = document.querySelector(".timer-progress-bar");
    var percentageLeft = Math.floor(100 * secondsRemaining / 11);
    if (timerProgress) {
        timerProgress.style.width = "".concat(percentageLeft, "%");
    }
}
function runTimer() {
    timerInterval = setInterval(function () {
        secondsRemaining--;
        updateTimerDisplay();
        if (secondsRemaining <= 0) {
            resetGame("lose");
        }
    }, 1000);
}
function resetGame(status) {
    // Remove existing lock circles and SVG elements
    var timerProgress = document.querySelector(".timer-progress-bar");
    var lockContainer = document.querySelector('.lock-container');
    var svgCircle = document.querySelector('.position-container svg');
    var overlay = document.querySelector(".overlay");
    // Block new input from the user when game over
    overlay.style.display = "block";
    isLocked = true;
    setTimeout(function () {
        lockContainer.innerHTML = '';
        currentCircle = 1;
        if (svgCircle) {
            svgCircle.innerHTML = '';
        }
        overlay.style.display = 'none';
        isLocked = false;
        generateLines();
        generateHack();
        shuffleLock();
        runTimer();
    }, 2000);
    if (timerInterval) {
        clearInterval(timerInterval);
        timerProgress.style.display = "none";
        timerProgress.style.width = "100%";
        setTimeout(function () {
            timerProgress.style.removeProperty('display');
        }, 1000);
        secondsRemaining = 12;
    }
    if (status === "win") {
        var winMsg_1 = document.querySelector(".win-message");
        winMsg_1.style.display = "flex";
        setTimeout(function () {
            winMsg_1.style.display = "none";
        }, 2000);
    }
    else if (status === "lose") {
        var loseMsg_1 = document.querySelector(".lose-message");
        loseMsg_1.style.display = "flex";
        indicateFailed(currentCircle);
        setTimeout(function () {
            loseMsg_1.style.display = "none";
        }, 2000);
    }
    // Generate a new game
}
function indicateFailed(circleNum) {
    var lockCircle = document.getElementById("lock-circle".concat(circleNum));
    if (lockCircle) {
        var balls = lockCircle.querySelectorAll('.ball');
        var svgCircle = document.querySelector('.position-container svg');
        if (svgCircle) {
            var semiCircles = svgCircle.querySelectorAll('.position-circle');
            semiCircles.forEach(function (semiCircle) {
                if (semiCircle.id.includes("circle".concat(circleNum))) {
                    var svgElement = semiCircle;
                    svgElement.style.stroke = 'rgb(255, 84, 84)';
                }
            });
        }
        else {
            console.log('SVG element not found in indicateCompleted');
        }
        lockCircle.style.outlineColor = 'rgb(255, 84, 84)';
        balls.forEach(function (ball) {
            ball.style.backgroundColor = 'rgb(255, 84, 84)';
        });
    }
    else {
        console.log("Lock circle ".concat(circleNum, " not found in indicateCompleted"));
    }
}
function nextLock() {
    var cracked = checkLockStatus(currentCircle);
    if (cracked && currentCircle <= 4) {
        indicateCompleted(currentCircle);
        currentCircle++;
        var lockCircle = document.getElementById("lock-circle".concat(currentCircle));
        lockCircle.style.outlineColor = 'rgb(203, 245, 66)';
    }
    else if (currentCircle === 5) {
        indicateCompleted(currentCircle);
        resetGame("win");
    }
    else {
        resetGame("lose");
    }
}
function indicateCompleted(circleNum) {
    var lockCircle = document.getElementById("lock-circle".concat(circleNum));
    if (lockCircle) {
        var balls = lockCircle.querySelectorAll('.ball');
        var svgCircle = document.querySelector('.position-container svg');
        if (svgCircle) {
            var semiCircles = svgCircle.querySelectorAll('.position-circle');
            semiCircles.forEach(function (semiCircle) {
                if (semiCircle.id.includes("circle".concat(circleNum))) {
                    var svgElement = semiCircle;
                    svgElement.style.stroke = 'rgba(48, 221, 189, 0.815)';
                }
            });
        }
        else {
            console.log('SVG element not found in indicateCompleted');
        }
        lockCircle.style.outlineColor = 'rgb(173, 173, 173)';
        balls.forEach(function (ball) {
            ball.style.backgroundColor = 'rgba(48, 221, 189, 0.815)';
        });
    }
    else {
        console.log("Lock circle ".concat(circleNum, " not found in indicateCompleted"));
    }
}
//Function that runs to randomize the position of the balls compared to their original position
function shuffleLock() {
    for (var i = 1; i < 6; i++) {
        var shuffleTimes = Math.floor(Math.random() * (12 - 1) + 1);
        currentCircle = i;
        for (var j = 0; j < shuffleTimes; j++) {
            rotateBalls("Right");
        }
    }
    currentCircle = 1;
}
function checkLockStatus(circleNum) {
    var lockCircle = document.getElementById("lock-circle".concat(circleNum));
    var svgCircle = document.querySelector('.position-container svg');
    var semiCircles = svgCircle.querySelectorAll('.position-circle');
    var balls = lockCircle.querySelectorAll('div');
    var allLocks = true;
    var currPositionCheck = {};
    balls.forEach(function (ball) {
        var position = getRotateZValue(ball.style.transform) % 360;
        currPositionCheck[position] = { color: ball.style.backgroundColor };
    });
    semiCircles.forEach(function (semiCircle) {
        var _a, _b;
        if (semiCircle.id.includes("circle".concat(circleNum))) {
            var semiCircleElem = semiCircle;
            var semiCirclePos = parseInt(semiCircle.id.split('-')[1], 10);
            var semiCircleColor = semiCircleElem.style.stroke;
            if (((_a = currPositionCheck[semiCirclePos]) === null || _a === void 0 ? void 0 : _a.color) !== undefined &&
                ((_b = currPositionCheck[semiCirclePos]) === null || _b === void 0 ? void 0 : _b.color) !== semiCircleColor) {
                allLocks = false;
            }
        }
    });
    return allLocks;
}
function shufflePositions(array) {
    var _a;
    for (var a = array.length - 1; a > 0; a--) {
        var b = Math.floor(Math.random() * (a + 1));
        _a = [array[b], array[a]], array[a] = _a[0], array[b] = _a[1];
    }
    return array;
}
function generateLines() {
    var hackContainer = document.querySelector('.hack-box');
    for (var i = 1; i < 7; i++) {
        var line = document.createElement('div');
        line.className = 'line';
        line.id = "line".concat(i);
        line.style.transform = "rotateZ(".concat(30 * (i - 1), "deg)");
        hackContainer.appendChild(line);
    }
}
function generateCircle(circleNum) {
    var lockContainer = document.querySelector('.lock-container');
    var lockCircle = document.createElement('div');
    if (circleNum === 1) { //Ensure the selector is on the first circle at start
        lockCircle.style.outlineColor = 'rgb(203, 245, 66)';
    }
    lockCircle.id = "lock-circle".concat(circleNum);
    lockCircle.className = 'lock-circle';
    lockCircle.style.width = "".concat(30+70 * circleNum, "px");
    lockCircle.style.height = "".concat(30+70 * circleNum, "px");
    lockContainer.appendChild(lockCircle);
    return lockCircle;
}
function generateSemiCircle(circleNum, position, color) {
    var semiCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    var svgCircle = document.querySelector('.position-container svg');
    var r = 29 + circleNum * 35; //The radius needed for the different lockCircles
    semiCircle.setAttribute("class", "position-circle");
    semiCircle.setAttribute("id", "circle".concat(circleNum, "-").concat(position));
    semiCircle.setAttribute("cx", "50%");
    semiCircle.setAttribute("cy", "50%");
    semiCircle.setAttribute("r", "".concat(r));
    semiCircle.style.transform = "rotate(".concat(-15 + position, "deg)");
    semiCircle.style.stroke = color;
    semiCircle.style.strokeDasharray = "".concat(2 * r * Math.PI);
    semiCircle.style.strokeDashoffset = "".concat(11 * (2 * r * Math.PI) / 12);
    svgCircle === null || svgCircle === void 0 ? void 0 : svgCircle.appendChild(semiCircle);
}
function generateHack() {
    var positions = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]; //Available positions (deg) for the balls
    var colors = ['rgb(202, 39, 97)', 'rgb(239, 181, 17)', 'rgb(46, 134, 213)']; //Available colors for the balls
    //Generate between 2-12 balls in different colors for each lock-circle
    for (var i = 1; i < 6; i++) {
        var positionChecks = Math.floor(Math.random() * (10 - 4) + 4); //The semi-circles that indicate which color needs to be where
        var ballAmt = Math.floor(Math.random() * (13 - 5) + 5);
        var shuffledPositions = shufflePositions(positions);
        var lockCircle = generateCircle(i);
        for (var j = 0; j < ballAmt; j++) {
            var randomColor = colors[Math.floor(Math.random() * colors.length)];
            var ballElem = document.createElement('div');
            if (j < positionChecks) {
                generateSemiCircle(i, shuffledPositions[j], randomColor);
            }
            ballElem.id = "C".concat(i, "ball").concat(j);
            ballElem.className = 'ball';
            ballElem.style.transform = "translate(-50%, -50%) rotateZ(".concat(shuffledPositions[j], "deg) translate(").concat(21+35* i, "px, 0px)");//partially useless code?
            ballElem.style.backgroundColor = randomColor;
            lockCircle === null || lockCircle === void 0 ? void 0 : lockCircle.appendChild(ballElem);
        }
    }
    currentCircle = 1;
}
function getRotateZValue(transformValue) {
    var matches = transformValue.match(/rotateZ\(([^deg)]+)deg\)/);
    return matches && matches[1] ? parseFloat(matches[1]) : 0;
}
function rotateBalls(dir) {
    var lockCircle = document.getElementById("lock-circle".concat(currentCircle));
    var balls = lockCircle.querySelectorAll('div');
    balls.forEach(function (ball) {
        var currentRotateZ = getRotateZValue(ball.style.transform);
        var newRotateZ;
        if (dir === 'Right') {
            newRotateZ = currentRotateZ + 30;
        }
        else {
            newRotateZ = currentRotateZ - 30;
        }
        ball.style.transform = "translate(-50%, -50%) rotateZ(".concat(newRotateZ, "deg) translate(").concat(16+35 * currentCircle, "px, 0px)");
    });
}
function handleKeyPress(event) {
    if (isLocked)
        return; //Game is over, key presses are ignored
    if (event.key === "ArrowLeft") {
        rotateBalls('Left');
    }
    else if (event.key === "ArrowRight") {
        rotateBalls('Right');
    }
    else if (event.key === "Enter") {
        nextLock();
    }
    else {
        return;
    }
}
document.addEventListener('DOMContentLoaded', function (event) {
    resetGame("init");
});
document.addEventListener('keydown', handleKeyPress);
