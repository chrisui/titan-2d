import {requestAnimFrame, cancelAnimFrame} from 'Common';
import assign from 'lodash/object/assign';

const FPS = 60;
const DELTA_SAMPLE_SIZE = FPS;
const DELTA = 1000 / FPS;

const Runner = {};

Runner.create = function(state, tick, preTick = runner => runner) {
    let counterTimestamp = 0;
    let frameCounter = 0;
    let deltaHistory = [];
    let timePrev;
    let timeScalePrev = 1;

    const runner = assign({
        fps: FPS,
        timestamp: 0,
        delta: DELTA,
        correction: 1,
        deltaMin: 1000 / FPS,
        deltaMax: 1000 / (FPS * 0.5),
        timeScale: 1,
        isFixed: false,
        frameRequestId: 0,
        enabled: true,
        frameCount: 0
    }, state);

    function step(time) {
        let delta;
        let correction = 1;

        runner.frameRequestId = requestAnimFrame(step);

        if (!runner.enabled) {
            return;
        }

        preTick(runner);

        if (runner.isFixed) {
            // fixed timestep
            delta = runner.delta;
        } else {
            // dynamic timestep based on wall clock between calls
            delta = (time - timePrev) || runner.delta;
            timePrev = time;

            // optimistically filter delta over a few frames, to improve stability
            deltaHistory.push(delta);
            deltaHistory = deltaHistory.slice(-DELTA_SAMPLE_SIZE);
            delta = Math.min.apply(null, deltaHistory);
            
            // limit delta
            delta = delta < runner.deltaMin ? runner.deltaMin : delta;
            delta = delta > runner.deltaMax ? runner.deltaMax : delta;

            // time correction for delta
            correction = delta / runner.delta;

            // update engine timing object
            runner.delta = delta;
        }

        // time correction for time scaling
        if (timeScalePrev !== 0) {
            correction *= runner.timeScale / timeScalePrev;
        }

        if (runner.timeScale === 0) {
            correction = 0;
        }

        timeScalePrev = runner.timeScale;
        
        // fps counter
        frameCounter += 1;
        if (time - counterTimestamp >= 1000) {
            runner.fps = frameCounter * ((time - counterTimestamp) / 1000);
            counterTimestamp = time;
            frameCounter = 0;
        }

        runner.frameCount += 1;

        tick(delta, correction, runner);
    }

    runner.frameRequestId = requestAnimFrame(step);

    return runner;
};

Runner.destroy = function(runner) {
    cancelAnimFrame(runner.frameRequestId);
};

export default Runner;