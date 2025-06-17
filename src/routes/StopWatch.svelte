<script>
    import { onMount, onDestroy } from 'svelte';

    let opacity = 0;
    let running = false;
    let pulsing = false;
    let rafOpacity;
    let pulseStart = 0;
    let opacityMin = 0.1;
    let opacityMax = 0.5;
    let pulseDuration = 10000; // Pulse duration in milliseconds
    let rotation = 0;
    let rotateInterval = null;

    function rotateStart() {
        rotateStop();
        rotateInterval = setInterval(() => {
            rotation = (rotation - 6) % 360; // 6° per second
        }, 1000); // 1000 ms = 1 second
    }

    function rotateStop() {
        if (rotateInterval) clearInterval(rotateInterval);
        rotateInterval = null;
    }

    function fadeTo(target, duration, cb) {
        let startVal = opacity;
        let startTime;
        function step(now) {
            if (!startTime)
                startTime = now;

            let t = Math.min((now - startTime) / duration, 1);
            opacity = startVal + (target - startVal) * t;
            if (t < 1) {
                rafOpacity = requestAnimationFrame(step);
            } else {
                opacity = target;
                if (cb)
                    cb();
            }
        }

        // cancelAnimations();
        rafOpacity = requestAnimationFrame(step);
    }

    function pulse(now) {
        if (!pulsing) return;
        if (pulseStart === 0) pulseStart = now; // Only set if exactly 0
        const t = (now - pulseStart) / pulseDuration;
        opacity = opacityMin + (opacityMax - opacityMin) * 0.5 * (1 + Math.cos(t * Math.PI * 2));
        rafOpacity = requestAnimationFrame(pulse);
    }

    export function start() {
        running = true;
        pulsing = false;
        pulseStart = 0; // Reset pulseStart
        // let fadeInDuration = (pulseDuration * 0.5) * (opacityMin / (opacityMax - opacityMin));
        let fadeInDuration = 775;
        fadeTo(opacityMax, fadeInDuration, () => {
            if (running) {
                pulsing = true;
                pulseStart = 0; // Ensure pulseStart is reset before pulsing
                rafOpacity = requestAnimationFrame(pulse);
            }
        });
        rotateStart();
    }

    export function stop() {
        running = false;
        pulsing = false;
        fadeTo(0, 225, () => {
            cancelAnimations();
            opacity = 0;
            rotateStop();
        });
    }

    onDestroy(() => {
        running = false;
        pulsing = false;
        cancelAnimations();
    });

    function cancelAnimations() {
        if (typeof window !== 'undefined') {
            cancelAnimationFrame(rafOpacity);
        }
    }
</script>

<div style="opacity: {opacity}; transition: opacity 0.01s;">
    <svg width="800px" height="800px" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
         role="img" class="iconify iconify--noto" preserveAspectRatio="xMidYMid meet">

        <path fill="#607d8b" d="M68.324 17.126v11.04h-8.71v-11.04z"/>
        <path d="M55.19 6.84c0-.7.39-1.35 1.02-1.66C57.3 4.63 59.54 4 64 4s6.7.63 7.8 1.18c.63.31 1.02.96 1.02 1.66v9.01c0 1.35-1.26 1.54-2.28 1.54l-13.6-.16c-1.57-.22-1.73-.36-1.73-1.38V6.84z"
              fill="#b0bec5"/>
        <ellipse cx="64" cy="16.56" rx="8.65" ry="1.56" fill="#607d8b"/>
        <path fill="#607d8b" d="M108.04 36.527l-6.556 6.555l-5.176-5.176l6.555-6.555z"/>
        <path d="M106.34 22.61a1.54 1.54 0 0 1 1.59-.38c.98.33 2.68 1.28 5.33 3.93s3.6 4.35 3.93 5.33c.19.56.03 1.17-.38 1.59l-5.35 5.35c-.8.8-1.66.17-2.27-.44l-7.99-8.18c-.8-1.06-.82-1.24-.21-1.85l5.35-5.35z"
              fill="#b0bec5"/>
        <ellipse transform="rotate(-45.001 105.802 33.623)" cx="105.8" cy="33.62" rx="1.31" ry="7.27" fill="#607d8b"/>
        <circle cx="64" cy="73.06" r="50.94" fill="#b0bec5"/>
        <circle cx="64" cy="73.06" r="40.87" fill="#fafafa"/>
        <g>
            <path d="M64 43.08c-.81 0-1.47-.66-1.47-1.47v-4.4c0-.81.66-1.47 1.47-1.47c.81 0 1.47.66 1.47 1.47v4.4c0 .82-.66 1.47-1.47 1.47z" fill="#b2947c"/>
            <path d="M64 110.67c-.81 0-1.47-.66-1.47-1.47v-4.4c0-.81.66-1.47 1.47-1.47c.81 0 1.47.66 1.47 1.47v4.4c0 .81-.66 1.47-1.47 1.47z" fill="#b2947c"/>
            <path d="M99.99 74.68h-4.4c-.81 0-1.47-.66-1.47-1.47c0-.81.66-1.47 1.47-1.47h4.4c.81 0 1.47.66 1.47 1.47c0 .81-.66 1.47-1.47 1.47z" fill="#b2947c"/>
            <path d="M32.41 74.68h-4.4c-.81 0-1.47-.66-1.47-1.47c0-.81.66-1.47 1.47-1.47h4.4c.81 0 1.47.66 1.47 1.47c0 .81-.66 1.47-1.47 1.47z" fill="#b2947c"/>
            <path d="M64 43.08c-.81 0-1.47-.66-1.47-1.47v-4.4c0-.81.66-1.47 1.47-1.47c.81 0 1.47.66 1.47 1.47v4.4c0 .82-.66 1.47-1.47 1.47z" fill="#b2947c"/>
            <path d="M64 110.67c-.81 0-1.47-.66-1.47-1.47v-4.4c0-.81.66-1.47 1.47-1.47c.81 0 1.47.66 1.47 1.47v4.4c0 .81-.66 1.47-1.47 1.47z" fill="#b2947c"/>
            <path d="M46.93 46.58l-2.2-3.81c-.41-.7-.17-1.6.54-2.01c.7-.41 1.6-.17 2.01.54l2.2 3.81c.41.7.17 1.6-.54 2.01c-.7.4-1.6.16-2.01-.54z" fill="#b2947c"/>
            <path d="M80.73 105.11l-2.2-3.81c-.41-.7-.16-1.6.54-2.01c.7-.41 1.6-.16 2.01.54l2.2 3.81c.41.7.16 1.6-.54 2.01c-.71.41-1.61.17-2.01-.54z"
                  fill="#b2947c"/>
        </g>
        <path d="M46.93 46.58l-2.2-3.81c-.41-.7-.17-1.6.54-2.01c.7-.41 1.6-.17 2.01.54l2.2 3.81c.41.7.17 1.6-.54 2.01c-.7.4-1.6.16-2.01-.54z" fill="#b2947c"/>
        <path d="M80.73 105.11l-2.2-3.81c-.41-.7-.16-1.6.54-2.01c.7-.41 1.6-.16 2.01.54l2.2 3.81c.41.7.16 1.6-.54 2.01c-.71.41-1.61.17-2.01-.54z" fill="#b2947c"/>
        <g>
            <g>
                <path d="M35.91 58.68l-3.81-2.2c-.7-.41-.94-1.3-.54-2.01c.41-.7 1.3-.94 2.01-.54l3.81 2.2c.7.41.94 1.3.54 2.01c-.41.71-1.31.95-2.01.54z"
                      fill="#b2947c"/>
                <path d="M94.44 92.48l-3.81-2.2c-.7-.41-.94-1.3-.54-2.01c.41-.7 1.3-.94 2.01-.54l3.81 2.2c.7.41.94 1.3.54 2.01c-.41.7-1.31.94-2.01.54z"
                      fill="#b2947c"/>
            </g>
            <g>
                <path d="M79.06 47.12c-.7-.41-.94-1.3-.54-2.01l2.2-3.81c.41-.7 1.3-.94 2.01-.54c.7.41.94 1.3.54 2.01l-2.2 3.81c-.41.7-1.31.94-2.01.54z"
                      fill="#b2947c"/>
                <path d="M45.27 105.65c-.7-.41-.94-1.3-.54-2.01l2.2-3.81c.41-.7 1.3-.94 2.01-.54c.7.41.94 1.3.54 2.01l-2.2 3.81c-.41.71-1.31.95-2.01.54z"
                      fill="#b2947c"/>
            </g>

            <g>
                <path d="M90.09 58.15c-.41-.7-.17-1.6.54-2.01l3.81-2.2c.7-.41 1.6-.16 2.01.54c.41.7.16 1.6-.54 2.01l-3.81 2.2c-.71.4-1.61.16-2.01-.54z" fill="#b2947c"/>
                <path d="M31.56 91.94c-.41-.7-.16-1.6.54-2.01l3.81-2.2c.7-.41 1.6-.16 2.01.54c.41.7.16 1.6-.54 2.01l-3.81 2.2c-.71.4-1.61.16-2.01-.54z" fill="#b2947c"/>
            </g>
        </g>
        <!-- Original Path: scaled to 90% -->
        <path d="M65.5 38.63s.17-3.27-1.54-3.27s-1.54 3.27-1.54 3.27l-1.16 34.58h5.5L65.5 38.63z"
              fill="#563428"
              transform="translate(64,73.16) scale(0.75) rotate({rotation}) translate(-64,-73.16)"
        />
        <!-- Rotated Copy: 90 deg and scaled to 50% -->
<!--        <path d="M65.5 38.63s.17-3.27-1.54-3.27s-1.54 3.27-1.54 3.27l-1.16 34.58h5.5L65.5 38.63z"-->
<!--              fill="#563428"-->
<!--              transform="translate(64,73.16) rotate(90) scale(0.5) translate(-64,-73.16)"-->
<!--        />-->
        <circle cx="64" cy="73.16" r="4.11" fill="#563428"/>
        <path d="M52.04 31.4c-5.45 1.58-13.09 4-21.25 13.76c-8.07 9.65-9.74 20.86-10.25 28.6c0 0-4.66 5.83-4.88 4.74c-1.76-8.45 1.79-27.33 11.07-37.31c10.8-11.62 24.85-15.74 29.92-16.51c.88-.13-2.95 6.24-4.61 6.72z"
              opacity=".64" fill="#eceff1"/>
    </svg>
</div>

<style>
    div {
        opacity: 1.0;
        scale: 0.45;
        pointer-events: none;
    }
</style>

