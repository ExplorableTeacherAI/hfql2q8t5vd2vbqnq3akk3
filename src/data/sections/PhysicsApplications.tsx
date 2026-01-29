import { useState, useEffect, useRef } from "react";
import { Section } from "@/components/templates";
import { FullWidthLayout, GridLayout } from "@/components/layouts";
import { Heading } from "@/components/molecules/Heading";
import { Paragraph } from "@/components/molecules/Paragraph";

/**
 * Coupled Oscillators Animation
 * Shows how eigenvalues determine natural frequencies
 */
const CoupledOscillators = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mode, setMode] = useState<"mode1" | "mode2" | "both">("both");
    const [time, setTime] = useState(0);
    const animationRef = useRef<number>();

    // Eigenvalues determine frequencies
    // Mode 1: both masses move together (slower, λ₁ = 1)
    // Mode 2: masses move opposite (faster, λ₂ = 3)
    const omega1 = 1; // sqrt(λ₁)
    const omega2 = Math.sqrt(3); // sqrt(λ₂)

    useEffect(() => {
        const animate = () => {
            setTime((t) => t + 0.03);
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Clear
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(0, 0, width, height);

        // Base positions
        const wallLeft = 30;
        const wallRight = width - 30;
        const centerY = height / 2;
        const restPos1 = width * 0.35;
        const restPos2 = width * 0.65;
        const amplitude = 40;

        // Calculate displacements based on mode
        let x1 = 0,
            x2 = 0;
        if (mode === "mode1") {
            // Both move together (in-phase)
            x1 = amplitude * Math.cos(omega1 * time);
            x2 = amplitude * Math.cos(omega1 * time);
        } else if (mode === "mode2") {
            // Move opposite (out-of-phase)
            x1 = amplitude * Math.cos(omega2 * time);
            x2 = -amplitude * Math.cos(omega2 * time);
        } else {
            // Superposition of both modes
            x1 = (amplitude / 2) * Math.cos(omega1 * time) + (amplitude / 2) * Math.cos(omega2 * time);
            x2 = (amplitude / 2) * Math.cos(omega1 * time) - (amplitude / 2) * Math.cos(omega2 * time);
        }

        const pos1 = restPos1 + x1;
        const pos2 = restPos2 + x2;

        // Draw walls
        ctx.fillStyle = "#374151";
        ctx.fillRect(wallLeft - 10, centerY - 40, 10, 80);
        ctx.fillRect(wallRight, centerY - 40, 10, 80);

        // Draw springs (zigzag)
        const drawSpring = (startX: number, endX: number, y: number, color: string) => {
            const segments = 12;
            const segmentWidth = (endX - startX) / segments;
            const zigHeight = 8;

            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(startX, y);
            for (let i = 0; i < segments; i++) {
                const xStart = startX + i * segmentWidth;
                const xMid = xStart + segmentWidth / 2;
                const xEnd = xStart + segmentWidth;
                const yOffset = i % 2 === 0 ? zigHeight : -zigHeight;
                ctx.lineTo(xMid, y + yOffset);
                ctx.lineTo(xEnd, y);
            }
            ctx.stroke();
        };

        // Springs
        drawSpring(wallLeft, pos1 - 20, centerY, "#6b7280");
        drawSpring(pos1 + 20, pos2 - 20, centerY, "#8b5cf6");
        drawSpring(pos2 + 20, wallRight, centerY, "#6b7280");

        // Masses
        const massSize = 40;
        ctx.fillStyle = "#3b82f6";
        ctx.fillRect(pos1 - massSize / 2, centerY - massSize / 2, massSize, massSize);
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(pos2 - massSize / 2, centerY - massSize / 2, massSize, massSize);

        // Labels
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 16px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("m₁", pos1, centerY + 5);
        ctx.fillText("m₂", pos2, centerY + 5);

        // Mode info
        ctx.fillStyle = "#6b7280";
        ctx.font = "12px system-ui";
        ctx.textAlign = "left";
        if (mode === "mode1") {
            ctx.fillText("Mode 1: In-phase (ω = 1)", 10, 20);
            ctx.fillText("Eigenvalue λ₁ = 1", 10, 35);
        } else if (mode === "mode2") {
            ctx.fillText("Mode 2: Out-of-phase (ω = √3)", 10, 20);
            ctx.fillText("Eigenvalue λ₂ = 3", 10, 35);
        } else {
            ctx.fillText("Both modes superimposed", 10, 20);
        }
    }, [time, mode, omega1, omega2]);

    return (
        <div className="space-y-3">
            <canvas
                ref={canvasRef}
                width={340}
                height={180}
                className="border border-border rounded-lg w-full"
            />
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setMode("mode1")}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        mode === "mode1"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                    }`}
                >
                    Mode 1 (slow)
                </button>
                <button
                    onClick={() => setMode("mode2")}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        mode === "mode2"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                    }`}
                >
                    Mode 2 (fast)
                </button>
                <button
                    onClick={() => setMode("both")}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        mode === "both"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                    }`}
                >
                    Both
                </button>
            </div>
        </div>
    );
};

/**
 * Stability Analysis Visualization
 * Shows how eigenvalue signs determine system behavior
 */
const StabilityAnalysis = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scenario, setScenario] = useState<"stable" | "unstable" | "saddle">("stable");
    const [time, setTime] = useState(0);
    const animationRef = useRef<number>();

    useEffect(() => {
        const animate = () => {
            setTime((t) => t + 0.02);
            animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 30;

        // Clear
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(0, 0, width, height);

        // Draw axes
        ctx.strokeStyle = "#d1d5db";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();

        // Eigenvalues based on scenario
        let lambda1: number, lambda2: number;
        let color1: string, color2: string;
        let description: string;

        if (scenario === "stable") {
            lambda1 = -0.5;
            lambda2 = -0.8;
            color1 = "#22c55e";
            color2 = "#22c55e";
            description = "λ₁ < 0, λ₂ < 0 → Stable (decay)";
        } else if (scenario === "unstable") {
            lambda1 = 0.5;
            lambda2 = 0.3;
            color1 = "#ef4444";
            color2 = "#ef4444";
            description = "λ₁ > 0, λ₂ > 0 → Unstable (growth)";
        } else {
            lambda1 = 0.5;
            lambda2 = -0.5;
            color1 = "#ef4444";
            color2 = "#22c55e";
            description = "λ₁ > 0, λ₂ < 0 → Saddle point";
        }

        // Draw trajectory particles
        const numParticles = 8;
        ctx.lineWidth = 2;

        for (let i = 0; i < numParticles; i++) {
            const angle = (i / numParticles) * 2 * Math.PI;
            const initR = 3;

            // Calculate position at current time
            // Using eigenvector directions (simplified: along axes)
            const x0 = initR * Math.cos(angle);
            const y0 = initR * Math.sin(angle);

            // Evolution: x(t) = x0 * e^(λ₁*t), y(t) = y0 * e^(λ₂*t)
            const modTime = time % 8; // Reset periodically
            const x = x0 * Math.exp(lambda1 * modTime);
            const y = y0 * Math.exp(lambda2 * modTime);

            // Draw trail
            ctx.strokeStyle = i % 2 === 0 ? color1 + "60" : color2 + "60";
            ctx.beginPath();
            for (let t = 0; t <= modTime; t += 0.1) {
                const tx = x0 * Math.exp(lambda1 * t);
                const ty = y0 * Math.exp(lambda2 * t);
                if (t === 0) {
                    ctx.moveTo(centerX + tx * scale, centerY - ty * scale);
                } else {
                    ctx.lineTo(centerX + tx * scale, centerY - ty * scale);
                }
            }
            ctx.stroke();

            // Draw particle
            ctx.beginPath();
            ctx.arc(centerX + x * scale, centerY - y * scale, 4, 0, 2 * Math.PI);
            ctx.fillStyle = i % 2 === 0 ? color1 : color2;
            ctx.fill();
        }

        // Origin point
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "#374151";
        ctx.fill();

        // Description
        ctx.fillStyle = "#374151";
        ctx.font = "13px system-ui";
        ctx.textAlign = "left";
        ctx.fillText(description, 10, 20);
    }, [time, scenario]);

    return (
        <div className="space-y-3">
            <canvas
                ref={canvasRef}
                width={340}
                height={180}
                className="border border-border rounded-lg w-full"
            />
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setScenario("stable")}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        scenario === "stable"
                            ? "bg-green-500 text-white"
                            : "bg-muted hover:bg-muted/80"
                    }`}
                >
                    Stable
                </button>
                <button
                    onClick={() => setScenario("unstable")}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        scenario === "unstable"
                            ? "bg-red-500 text-white"
                            : "bg-muted hover:bg-muted/80"
                    }`}
                >
                    Unstable
                </button>
                <button
                    onClick={() => setScenario("saddle")}
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        scenario === "saddle"
                            ? "bg-amber-500 text-white"
                            : "bg-muted hover:bg-muted/80"
                    }`}
                >
                    Saddle
                </button>
            </div>
        </div>
    );
};

/**
 * Section 5: Physics Applications
 */
export const PhysicsApplicationsSection = () => {
    return (
        <>
            <FullWidthLayout maxWidth="xl">
                <Section id="physics-intro">
                    <Heading level={2}>Physics Applications</Heading>
                    <Paragraph className="text-lg leading-relaxed mt-2">
                        Eigenvalues aren't just abstract math — they're everywhere in physics!
                        They determine how systems vibrate, whether they're stable, and much more.
                    </Paragraph>
                </Section>
            </FullWidthLayout>

            <GridLayout columns={2} gap="lg">
                <Section id="physics-oscillators">
                    <div className="space-y-4">
                        <Heading level={3}>Coupled Oscillators</Heading>
                        <Paragraph className="text-sm text-muted-foreground">
                            Two masses connected by springs have special "normal modes" —
                            patterns where everything oscillates at the same frequency.
                            These modes are the <strong>eigenvectors</strong>, and their
                            frequencies come from the <strong>eigenvalues</strong>!
                        </Paragraph>
                        <CoupledOscillators />
                        <div className="bg-muted/50 p-3 rounded-lg text-sm">
                            <p className="font-medium mb-1">Key insight:</p>
                            <p className="text-muted-foreground">
                                Larger eigenvalue → faster oscillation. This is why mode 2 vibrates
                                faster than mode 1!
                            </p>
                        </div>
                    </div>
                </Section>

                <Section id="physics-stability">
                    <div className="space-y-4">
                        <Heading level={3}>Stability Analysis</Heading>
                        <Paragraph className="text-sm text-muted-foreground">
                            Eigenvalues tell us if a system will grow, decay, or stay balanced.
                            This is crucial in engineering, ecology, and economics!
                        </Paragraph>
                        <StabilityAnalysis />
                        <div className="bg-muted/50 p-3 rounded-lg text-sm">
                            <p className="font-medium mb-1">The rule:</p>
                            <ul className="text-muted-foreground space-y-1">
                                <li>• <span className="text-green-600">Negative λ</span> → decay (stable)</li>
                                <li>• <span className="text-red-600">Positive λ</span> → growth (unstable)</li>
                                <li>• <span className="text-amber-600">Mixed signs</span> → saddle point</li>
                            </ul>
                        </div>
                    </div>
                </Section>
            </GridLayout>
        </>
    );
};
