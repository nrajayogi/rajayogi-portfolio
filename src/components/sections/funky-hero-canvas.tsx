"use client";

import React, { useEffect, useRef, useState } from "react";

interface WaveRibbon {
    frequency: number;
    amplitude: number;
    speed: number;
    color: string;
    yOffset: number;
    phase: number;
    lineWidth: number;
}

interface SplashShockwave {
    x: number;
    y: number;
    radius: number;
    maxRadius: number;
    color: string;
    alpha: number;
    particles: Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        color: string;
        size: number;
        life: number;
    }>;
}

export function FunkyHeroCanvas() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [mouseCoord, setMouseCoord] = useState({ x: 0, y: 0, vel: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        // Hyper-saturated funky electric palette
        const colors = {
            acidLime: "#CCFF00",
            electricPink: "#FF007F",
            cyberCyan: "#00F0FF",
            violetPulse: "#8B5CF6",
            warmAmber: "#FF9900",
            pureWhite: "#FFFFFF"
        };

        // Sine wave ribbons
        const ribbons: WaveRibbon[] = [
            { frequency: 0.003, amplitude: 90, speed: 0.015, color: colors.cyberCyan, yOffset: 0.45, phase: 0, lineWidth: 2 },
            { frequency: 0.002, amplitude: 120, speed: 0.012, color: colors.electricPink, yOffset: 0.52, phase: 1.5, lineWidth: 2.5 },
            { frequency: 0.0035, amplitude: 70, speed: 0.02, color: colors.acidLime, yOffset: 0.4, phase: 3.2, lineWidth: 1.8 },
            { frequency: 0.0025, amplitude: 100, speed: 0.018, color: colors.violetPulse, yOffset: 0.58, phase: 4.8, lineWidth: 2.2 },
        ];

        // Shockwaves on click
        const shockwaves: SplashShockwave[] = [];

        // Mouse tracking with velocity
        let lastX = width / 2;
        let lastY = height / 2;
        const mouse = {
            x: width / 2,
            y: height / 2,
            targetX: width / 2,
            targetY: height / 2,
            vx: 0,
            vy: 0,
            speed: 0,
            isHovered: false
        };

        // Floating ambient glowing orbs
        const orbs = [
            { x: width * 0.25, y: height * 0.35, radius: 260, color: "rgba(255, 0, 127, 0.18)", vx: 0.4, vy: 0.3 },
            { x: width * 0.75, y: height * 0.4, radius: 280, color: "rgba(0, 240, 255, 0.16)", vx: -0.3, vy: 0.4 },
            { x: width * 0.5, y: height * 0.65, radius: 240, color: "rgba(204, 255, 0, 0.14)", vx: 0.2, vy: -0.3 },
            { x: width * 0.85, y: height * 0.75, radius: 220, color: "rgba(139, 92, 246, 0.16)", vx: -0.2, vy: -0.2 }
        ];

        // Cursor ripple fluid trail
        const trail: Array<{ x: number; y: number; age: number; color: string; size: number }> = [];

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.targetX = e.clientX - rect.left;
            mouse.targetY = e.clientY - rect.top;
            mouse.isHovered = true;

            const dx = mouse.targetX - lastX;
            const dy = mouse.targetY - lastY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            mouse.speed = dist;
            lastX = mouse.targetX;
            lastY = mouse.targetY;

            // Spawn trail drops when moving
            if (dist > 3) {
                const trailColors = [colors.cyberCyan, colors.electricPink, colors.acidLime, colors.violetPulse];
                trail.push({
                    x: mouse.targetX + (Math.random() - 0.5) * 20,
                    y: mouse.targetY + (Math.random() - 0.5) * 20,
                    age: 1,
                    color: trailColors[Math.floor(Math.random() * trailColors.length)],
                    size: Math.min(dist * 0.4 + 3, 14)
                });
            }

            if (Math.random() < 0.2) {
                setMouseCoord({
                    x: Math.round(mouse.targetX),
                    y: Math.round(mouse.targetY),
                    vel: Math.round(dist * 10) / 10
                });
            }
        };

        const onMouseDown = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;

            // Hyper splash burst!
            const burstParticles: SplashShockwave["particles"] = [];
            const burstColors = [colors.acidLime, colors.electricPink, colors.cyberCyan, colors.warmAmber, colors.violetPulse];

            for (let i = 0; i < 40; i++) {
                const angle = (Math.PI * 2 / 40) * i + Math.random() * 0.2;
                const spd = Math.random() * 6 + 2;
                burstParticles.push({
                    x: clickX,
                    y: clickY,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    color: burstColors[Math.floor(Math.random() * burstColors.length)],
                    size: Math.random() * 4 + 2,
                    life: 1
                });
            }

            shockwaves.push({
                x: clickX,
                y: clickY,
                radius: 5,
                maxRadius: Math.random() * 180 + 120,
                color: burstColors[Math.floor(Math.random() * burstColors.length)],
                alpha: 0.9,
                particles: burstParticles
            });
        };

        const onMouseLeave = () => {
            mouse.isHovered = false;
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseleave", onMouseLeave);

        let time = 0;

        const render = () => {
            time += 0.016;
            ctx.clearRect(0, 0, width, height);

            // Interpolate mouse smoothly
            mouse.x += (mouse.targetX - mouse.x) * 0.15;
            mouse.y += (mouse.targetY - mouse.y) * 0.15;

            // 1. Draw ambient chromatic glow orbs
            orbs.forEach(orb => {
                orb.x += orb.vx;
                orb.y += orb.vy;
                if (orb.x < 0 || orb.x > width) orb.vx *= -1;
                if (orb.y < 0 || orb.y > height) orb.vy *= -1;

                const g = ctx.createRadialGradient(orb.x, orb.y, 10, orb.x, orb.y, orb.radius);
                g.addColorStop(0, orb.color);
                g.addColorStop(1, "rgba(0,0,0,0)");
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, width, height);
            });

            // 3. Draw Kinetic Wave Ribbons (Fluids)
            ribbons.forEach((r, idx) => {
                ctx.beginPath();
                ctx.lineWidth = r.lineWidth;
                ctx.strokeStyle = r.color;
                ctx.globalAlpha = 0.55;

                const baseY = height * r.yOffset;

                for (let x = 0; x <= width; x += 10) {
                    // Base sinusoidal wave
                    let y = baseY + Math.sin(x * r.frequency + time * r.speed * 20 + r.phase) * r.amplitude;

                    // Mouse turbulence / ripple
                    const dx = x - mouse.x;
                    const dy = y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 180 && mouse.isHovered) {
                        const push = (1 - dist / 180) * 45 * Math.sin(dist * 0.08 - time * 8);
                        y += push;
                    }

                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
                ctx.globalAlpha = 1;
            });

            // 4. Draw & update cursor trail droplets
            for (let i = trail.length - 1; i >= 0; i--) {
                const d = trail[i];
                d.age -= 0.025;
                d.size *= 0.96;

                if (d.age <= 0) {
                    trail.splice(i, 1);
                    continue;
                }

                ctx.beginPath();
                ctx.arc(d.x, d.y, Math.max(d.size, 1), 0, Math.PI * 2);
                ctx.fillStyle = d.color;
                ctx.globalAlpha = d.age * 0.7;
                ctx.fill();

                // Glow ring
                ctx.beginPath();
                ctx.arc(d.x, d.y, Math.max(d.size + 4, 3), 0, Math.PI * 2);
                ctx.strokeStyle = d.color;
                ctx.globalAlpha = d.age * 0.3;
                ctx.stroke();
                ctx.globalAlpha = 1;
            }

            // 5. Draw & update Shockwaves & Bursts
            for (let i = shockwaves.length - 1; i >= 0; i--) {
                const s = shockwaves[i];
                s.radius += (s.maxRadius - s.radius) * 0.08 + 2;
                s.alpha -= 0.02;

                if (s.alpha <= 0) {
                    shockwaves.splice(i, 1);
                    continue;
                }

                // Primary expanding chromatic ring
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.strokeStyle = s.color;
                ctx.lineWidth = 3;
                ctx.globalAlpha = s.alpha;
                ctx.stroke();

                // Secondary echo ring
                ctx.beginPath();
                ctx.arc(s.x, s.y, Math.max(s.radius - 16, 0), 0, Math.PI * 2);
                ctx.strokeStyle = colors.pureWhite;
                ctx.lineWidth = 1;
                ctx.globalAlpha = s.alpha * 0.5;
                ctx.stroke();

                // Update & draw burst sparks
                s.particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vx *= 0.95;
                    p.vy *= 0.95;
                    p.life -= 0.02;

                    if (p.life > 0) {
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = p.life * s.alpha;
                        ctx.fill();
                    }
                });

                ctx.globalAlpha = 1;
            }

            // 6. Interactive Spatial Targeting Reticle around cursor
            if (mouse.isHovered) {
                const targetSize = 28;
                ctx.strokeStyle = colors.acidLime;
                ctx.lineWidth = 1.5;
                ctx.globalAlpha = 0.8;

                // Corner brackets
                const len = 7;
                // Top-left
                ctx.beginPath();
                ctx.moveTo(mouse.x - targetSize, mouse.y - targetSize + len);
                ctx.lineTo(mouse.x - targetSize, mouse.y - targetSize);
                ctx.lineTo(mouse.x - targetSize + len, mouse.y - targetSize);
                ctx.stroke();
                // Top-right
                ctx.beginPath();
                ctx.moveTo(mouse.x + targetSize - len, mouse.y - targetSize);
                ctx.lineTo(mouse.x + targetSize, mouse.y - targetSize);
                ctx.lineTo(mouse.x + targetSize, mouse.y - targetSize + len);
                ctx.stroke();
                // Bottom-left
                ctx.beginPath();
                ctx.moveTo(mouse.x - targetSize, mouse.y + targetSize - len);
                ctx.lineTo(mouse.x - targetSize, mouse.y + targetSize);
                ctx.lineTo(mouse.x - targetSize + len, mouse.y + targetSize);
                ctx.stroke();
                // Bottom-right
                ctx.beginPath();
                ctx.moveTo(mouse.x + targetSize - len, mouse.y + targetSize);
                ctx.lineTo(mouse.x + targetSize, mouse.y + targetSize);
                ctx.lineTo(mouse.x + targetSize, mouse.y + targetSize - len);
                ctx.stroke();

                // Center crosshair dot
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = colors.electricPink;
                ctx.fill();

                ctx.globalAlpha = 1;
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseleave", onMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-auto"
                style={{ zIndex: 1 }}
            />
            {/* Real-time HUD Coordinate Overlay */}
            <div className="absolute top-24 right-8 z-20 hidden lg:flex items-center gap-3 font-sans text-[10px] text-white/40 pointer-events-none select-none">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-ping" />
                <span>SPATIAL HUD: [X: {mouseCoord.x.toString().padStart(4, '0')} | Y: {mouseCoord.y.toString().padStart(4, '0')} | VEL: {mouseCoord.vel}px/s]</span>
            </div>
        </>
    );
}
