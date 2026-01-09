import { useState, useEffect } from 'react';

export function useCountUp(end: number, duration: number = 2000, start: number = 0) {
    const [count, setCount] = useState(start);

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;

            if (progress < duration) {
                // Ease out expo: 1 - pow(2, -10 * t)
                // This gives a nice "fast start, slow stop" feel
                const t = progress / duration;
                const easeOut = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

                setCount(start + (end - start) * easeOut);
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [end, duration, start]);

    return count;
}
