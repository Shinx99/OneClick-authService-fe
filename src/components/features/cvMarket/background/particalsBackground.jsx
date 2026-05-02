"use client";

import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setInit(true));
    }, []);

    const particlesLoaded = useCallback(async () => { }, []);

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            className="absolute inset-0 z-0"
            options={{
                background: {
                    color: { value: "#ffffff" },
                },
                fpsLimit: 60,
                interactivity: {
                    events: {
                        onClick: { enable: true, mode: "push" }, // click tạo điểm mới
                        onHover: { enable: true, mode: "grab" }, // hover kéo đường
                    },
                    modes: {
                        push: { quantity: 3 },
                        grab: { distance: 160 },
                    },
                },
                particles: {
                    color: { value: "#22c55e" }, // ← màu xanh lá
                    links: {
                        color: "#22c55e",
                        distance: 150,
                        enable: true,
                        opacity: 0.3,
                        width: 1,
                    },
                    move: {
                        enable: true,
                        speed: 1.5,
                        outModes: { default: "bounce" },
                    },
                    number: {
                        value: 80,
                        density: { enable: true },
                    },
                    opacity: { value: 0.5 },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 3 } },
                },
                detectRetina: true,
            }}
        />
    );
};

export default ParticlesBackground;