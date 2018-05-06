var chooseProtocol = (function() {

    return {
        loadTimer: function(protocolName) {
            location.href = './timer/timer.html?timer=' + protocolName;
        }
    }
})();
