const Common = {};

Common.now = function() {
    // http://stackoverflow.com/questions/221294/how-do-you-get-a-timestamp-in-javascript
    // https://gist.github.com/davidwaterston/2982531
    const perf = window.performance;

    if (perf) {
        perf.now = perf.now || perf.webkitNow || perf.msNow || perf.oNow || perf.mozNow;
        return +(perf.now());
    }
    
    return +(new Date());
}

Common.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame || window.msRequestAnimationFrame 
    || function(cb) { window.setTimeout(() => cb(now()), DELTA); };

Common.cancelAnimFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame 
    || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;

export default Common;