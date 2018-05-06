var chooseProtocal = (function() {

    return {
        loadTimer: function(protocalName) {
            location.href = './timer/timer.html?timer=' + protocalName;
        }
    }
})();
