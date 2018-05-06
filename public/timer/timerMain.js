let timer = (function() {
    let intervals;
    let timerActive;
    let timeDiff;
    let timer;
    let initialInveralSetup;
    let buttonConfig = {
        stop: {
            text: "Stop",
            button: "rightButton",
            buttonFunction: stopTimer
        },
        start: {
            text: "Start",
            button: "rightButton",
            buttonFunction: startTimer
        },
        reset: {
            text: "Reset",
            button: "leftButton",
            buttonFunction: resetTimer
        },
        edit: {
            text: "Edit",
            button: "leftButton",
            buttonFunction: editTimer
        },
        skip: {
            text: "Skip",
            button: "leftButton",
            buttonFunction: skipTimer
        },
        leftButtonFunction: editTimer,
        rightButtonFunction: startTimer,
    }

    function setIntervals(hangIntervals) {
        intervals = hangIntervals;
        initialInveralSetup = hangIntervals.slice(0);
    }

    function drawTimer() {
        const bodyContainer = document.getElementById('bodyContainer');
        const timerMainTemplate = document.getElementById('timerMain');
		timerMainTemplate.content.querySelector('#clockSeconds').innerHTML = intervals[0].time;
        utility.replaceElements(bodyContainer, timerMainTemplate.content.cloneNode(true));
    }

    function rightButton() {
        buttonConfig.rightButtonFunction();
    }

    function leftButton() {
        buttonConfig.leftButtonFunction();
    }

    function editTimer() {
        return true;
    }

    function stopTimer() {
        let intervalText = document.getElementById("instruction").innerHTML;
        timerActive = false;
        intervals.unshift({
            time: timeDiff / 1000,
            text: intervalText
        });
        updateButton(buttonConfig.start);
        updateButton(buttonConfig.reset);
        document.getElementById("instruction").innerHTML = "Paused";
        clearInterval(timer);
    }

    function startTimer() {
        updateButton(buttonConfig.stop);
        updateButton(buttonConfig.skip);

        if(intervals.length === 0) {
            return finishTimer();
        }

        let currentInterval = intervals.shift();
        document.getElementById("instruction").innerHTML = currentInterval.text;
        let currentTime = new Date().getTime();
        let endTime = currentTime + currentInterval.time * 1000;
        timer = setInterval(function() {
            timerActive = true;

            currentTime = new Date().getTime();
            timeDiff = endTime - currentTime;
            let remainingTime = {
                minutes: Math.floor(timeDiff / 60 / 1000),
                seconds: Math.floor((timeDiff / 1000) % 60),
                centiseconds: Math.floor((timeDiff % 1000) / 10)
            }

            if(currentTime >= endTime) {
                //move on to next interval when current interval finishes
                clearInterval(timer);
                // timerActive = false;
                if(intervals.length) {
                    startTimer();
                }
            } else {
                displayTime(remainingTime);
            }
        }, 10);
    }

    function resetTimer() {
        intervals = initialInveralSetup.slice(0);
        timeDiff = intervals[0].time * 1000
        updateButton(buttonConfig.edit);
        drawTimer();
    }

    function skipTimer() {
        clearInterval(timer);
        startTimer();
    }

    function displayTime(remainingTime) {
        document.getElementById('clock').innerHTML = `${utility.twoDigits(remainingTime.minutes)}:${utility.twoDigits(remainingTime.seconds)}.${utility.twoDigits(remainingTime.centiseconds)}`
    }

    function updateButton(buttonSetting) {
        let button = document.getElementById(buttonSetting.button);
        button.innerHTML = buttonSetting.text;
        buttonConfig[`${buttonSetting.button}Function`] = buttonSetting.buttonFunction;
    }

    return {
        initTimer: function(hangIntervals) {
            setIntervals(hangIntervals);
            drawTimer(hangIntervals);
        },

        pressedLeftButton: function() {
            leftButton();
            return;
        },

        pressedRightButton: function() {
            rightButton();
            return;
        }
    }
})();
