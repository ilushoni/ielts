//main recorder check for browsers
(function() {
    var promiseFieldOldGUM = function(constraints, successCallback, errorCallback) {
        // First get ahold of getUserMedia, if present
        var getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if(!getUserMedia) {
            //The Promise object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value.
            //A Promise is a proxy for a value not necessarily known when the promise is created
            //The constructor is primarily used to wrap functions that do not already support promises
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }
        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(successCallback, errorCallback) { //A function that is passed with the arguments resolve and reject
            getUserMedia.call(navigator, constraints, successCallback, errorCallback); //the executor is called before the Promise constructor even returns the created object
        });
    }
    // Older browsers might not implement mediaDevices at all, so we set an empty object first
    if(navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }
    // Some browsers partially implement mediaDevices. We can't just assign an object
    // with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if(navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = promiseFieldOldGUM;
    }
})();