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
        const bodyContainer = document.getElementById('bodyContainer');
        const timerSetupTemplate = document.getElementById('timerSetup');
        utility.replaceElements(bodyContainer, timerSetupTemplate.content.cloneNode(true));
    }

    function getSetInfo() {
        var repNumber = document.getElementById("repNumber").value;
        var setNumber = document.getElementById("setNumber").value;

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
        var repTimes;
        switch(protocolName) {
            case "sevenFiftyThree":
                repTimes = {
                    work: 7,
                    rest: 53
                };
                break;
            case "sevenThreeRepeaters":
                repTimes = {
                    work: 7,
                    rest: 3
                };
                break;
            case "maxHang":
                repTimes = {
                    work: 10,
                    rest: 0
                };
                break;
        }

        return repTimes;
    }

    return {
        buildIntervals: function() {
            var setInfo = getSetInfo();
            var timerIntervals = constructTimer(setInfo);
            var useOneArmHang = document.getElementById("oneArmHang").checked;
            if (useOneArmHang) {
                return timer.initTimer(timerIntervals.oneArm);
            } else {
                timer.initTimer(timerIntervals.standard);
            }
        }
    }
})();
