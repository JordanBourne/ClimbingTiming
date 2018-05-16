var timerSetup = (function() {
    var protocolName;
    let urlParams = utility.parseURLParams(location.search);
    let readyTime = 10;
    initTimerSetup(urlParams.timer);

    function initTimerSetup(protocol) {
        protocolName = protocol;
        drawSetup(protocol);
    }

    function drawSetup(protocolName) {
        const bodyContainer = document.getElementById("bodyContainer");
        const timerSetupTemplate = document.getElementById("timerSetup");
        utility.replaceElements(bodyContainer, timerSetupTemplate.content.cloneNode(true));

        addTimerSettings(bodyContainer, protocolName);
    }

    function addTimerSettings(container, protocolName) {
        protocolConfig[protocolName].settings.forEach((setting) => {
            let settingTemplate = document.getElementById(`timerSetting${utility.nameCase(setting.settingType)}`);
			settingTemplate.content.querySelector('span').innerHTML = utility.nameCase(setting.settingName);
			settingTemplate.content.querySelector('input').id = setting.settingName;
            container.appendChild(settingTemplate.content.cloneNode(true));
        });

        let startButtonTemplate = document.getElementById("timerStart");
        container.appendChild(startButtonTemplate.content.cloneNode(true));
    }

    function getSetInfo() {
        var repNumber = 1;
        var setNumber = 1;

        if (document.getElementById("numberOfReps")) {
            repNumber = document.getElementById("numberOfReps").value;
        }
        if (document.getElementById("numberOfSets")) {
            setNumber = document.getElementById("numberOfSets").value;
        }

        return {
            reps: repNumber,
            sets: setNumber
        }
    }

    function setProtocolName(protocol) {
        protocolName = protocol;
        return;
    }

    function constructTimer(setInfo) {
        var repTime = getRepTime(protocolName);
        console.log('Rep Time: ', repTime);
        var intervals = {
            oneArm: [],
            standard: []
        };
        //Start buffer
        intervals.standard.push({
            time: readyTime,
            text: "Get Ready"
        });
        intervals.oneArm.push({
            time: readyTime,
            text: "Get Ready"
        });
        //Build sets
        for(var i = setInfo.sets; i > 0; i--) {
            intervals.standard = buildWorkoutIntervals(intervals.standard, repTime, setInfo);
            intervals.oneArm = buildWorkoutIntervals(intervals.oneArm, repTime, setInfo);
            intervals.oneArm.push({
                time: Math.max(repTime.rest, readyTime),
                text: "Switch Hands"
            });
            intervals.oneArm = buildWorkoutIntervals(intervals.oneArm, repTime, setInfo);
            //Dont rest after last set
            if (i > 1) {
                intervals.standard.push({
                    time: 60 * 3,
                    text: "Rest"
                });
                intervals.oneArm.push({
                    time: 60 * 3,
                    text: "Rest"
                });
            }
        }

        return intervals;
    }

    function buildWorkoutIntervals(intervalSet, repTime, setInfo) {
        //Build reps within set
        for(var j = setInfo.reps; j > 0; j--) {
            intervalSet.push({
                time: repTime.work,
                text: "Hang"
            });
            //Dont rest after last set
            if (j > 1) {
                intervalSet.push({
                    time: repTime.rest,
                    text: "Break"
                });
            }
        }

        return intervalSet;
    }

    function getRepTime(protocolName) {
        console.log("Protocol Name: ", protocolName);
        if (protocolName === "customTimer") {
            console.log("Getting Times");
            return getCustomTimes();
        }
        return protocolConfig[protocolName].repTimes;
    }

    function getCustomTimes() {
        var hangTime = document.getElementById("hangTime").value;
        var timeBetweenReps = document.getElementById("timeBetweenReps").value;

        console.log('Times: ', {
            work: hangTime,
            rest: timeBetweenReps
        });

        return {
            work: hangTime,
            rest: timeBetweenReps
        }
    }

    return {
        buildIntervals: function() {
            var setInfo = getSetInfo();
            var timerIntervals = constructTimer(setInfo);
            var useOneArmHang = document.getElementById("oneArmHangs").checked;
            if (useOneArmHang) {
                return timer.initTimer(timerIntervals.oneArm);
            } else {
                timer.initTimer(timerIntervals.standard);
            }
        }
    }
})();
