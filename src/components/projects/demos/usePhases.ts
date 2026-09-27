import { useEffect, useState } from "react";

/**
 * Steps a demo through timed phases. `durations[i]` is how long phase i lasts
 * in ms; a negative duration holds that phase until `advance()` is called
 * (e.g. waiting for the visitor to click).
 */
export const usePhases = (durations: readonly number[]) => {
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        if (phase >= durations.length || durations[phase] < 0) return;
        const t = window.setTimeout(() => setPhase((p) => p + 1), durations[phase]);
        return () => window.clearTimeout(t);
    }, [phase, durations]);

    return {
        phase,
        done: phase >= durations.length,
        advance: () => setPhase((p) => p + 1),
        replay: () => setPhase(0),
    };
};
