import { useState, useEffect, useRef } from "react";
import { Section } from "@/components/templates";
import { SplitLayout } from "@/components/layouts";
import { Heading } from "@/components/molecules/Heading";
import { Paragraph } from "@/components/molecules/Paragraph";
import { Slider } from "@/components/atoms/ui/slider";

/**
 * Interactive Matrix Transformation Visualization
 */
const MatrixViz = ({
    matrix,
}: {
    matrix: { a: number; b: number; c: number; d: number };
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const transformVector = (vx: number, vy: number) => ({
        x: matrix.a * vx + matrix.b * vy,
        y: matrix.c * vx + matrix.d * vy,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const scale = 50;
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.fillStyle = "#fafafa";
        ctx.fillRect(0, 0, width, height);

        // Draw transformed grid
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;

        for (let i = -4; i <= 4; i++) {
            const start = transformVector(i, -4);
            const end = transformVector(i, 4);
            ctx.beginPath();
            ctx.moveTo(centerX + start.x * scale, centerY - start.y * scale);
            ctx.lineTo(centerX + end.x * scale, centerY - end.y * scale);
            ctx.stroke();
        }

        for (let i = -4; i <= 4; i++) {
            const start = transformVector(-4, i);
            const end = transformVector(4, i);
            ctx.beginPath();
            ctx.moveTo(centerX + start.x * scale, centerY - start.y * scale);
            ctx.lineTo(centerX + end.x * scale, centerY - end.y * scale);
            ctx.stroke();
        }

        // Draw axes
        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();

        // Draw arrow helper
        const drawArrow = (
            fromX: number,
            fromY: number,
            toX: number,
            toY: number,
            color: string,
            lineWidth: number = 2
        ) => {
            const headLength = 8;
            const dx = toX - fromX;
            const dy = toY - fromY;
            const length = Math.sqrt(dx * dx + dy * dy);
            if (length < 5) return;

            const angle = Math.atan2(dy, dx);

            ctx.strokeStyle = color;
            ctx.fillStyle = color;
            ctx.lineWidth = lineWidth;

            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(toX, toY);
            ctx.lineTo(
                toX - headLength * Math.cos(angle - Math.PI / 6),
                toY - headLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.lineTo(
                toX - headLength * Math.cos(angle + Math.PI / 6),
                toY - headLength * Math.sin(angle + Math.PI / 6)
            );
            ctx.closePath();
            ctx.fill();
        };

        // Basis vectors
        const vectors = [
            { x: 1, y: 0, color: "#22c55e", label: "î" },
            { x: 0, y: 1, color: "#3b82f6", label: "ĵ" },
        ];

        vectors.forEach((v) => {
            const transformed = transformVector(v.x, v.y);

            // Original (faded)
            drawArrow(
                centerX,
                centerY,
                centerX + v.x * scale,
                centerY - v.y * scale,
                v.color + "40",
                2
            );

            // Transformed
            drawArrow(
                centerX,
                centerY,
                centerX + transformed.x * scale,
                centerY - transformed.y * scale,
                v.color,
                3
            );

            ctx.fillStyle = v.color;
            ctx.font = "bold 14px system-ui";
            ctx.fillText(
                v.label,
                centerX + transformed.x * scale + 8,
                centerY - transformed.y * scale - 8
            );
        });

        // Determinant info
        const det = matrix.a * matrix.d - matrix.b * matrix.c;
        ctx.fillStyle = "#6b7280";
        ctx.font = "13px system-ui";
        ctx.fillText(`det(A) = ${det.toFixed(2)}`, 10, height - 30);

        if (det < 0) {
            ctx.fillStyle = "#ef4444";
            ctx.fillText("Orientation flipped!", 10, height - 10);
        } else if (Math.abs(det) < 0.1) {
            ctx.fillStyle = "#f97316";
            ctx.fillText("Space is being squished!", 10, height - 10);
        }
    }, [matrix]);

    return (
        <canvas
            ref={canvasRef}
            width={380}
            height={320}
            className="border border-border rounded-lg w-full"
        />
    );
};

/**
 * Full Transformation Explorer Section with shared state
 */
export const TransformationExplorerFull = () => {
    const [matrix, setMatrix] = useState({ a: 1, b: 0, c: 0, d: 1 });

    const handleMatrixChange = (key: "a" | "b" | "c" | "d", value: number) => {
        setMatrix((prev) => ({ ...prev, [key]: value }));
    };

    const presets = [
        { name: "Identity", values: { a: 1, b: 0, c: 0, d: 1 } },
        { name: "Scale 2x", values: { a: 2, b: 0, c: 0, d: 2 } },
        { name: "Rotate 45°", values: { a: 0.71, b: -0.71, c: 0.71, d: 0.71 } },
        { name: "Shear", values: { a: 1, b: 1, c: 0, d: 1 } },
        { name: "Reflection", values: { a: -1, b: 0, c: 0, d: 1 } },
    ];

    return (
        <SplitLayout ratio="1:1" gap="lg">
            <Section id="transform-controls">
                <div className="space-y-4">
                    <Heading level={2}>Explore Transformations</Heading>

                    <Paragraph className="leading-relaxed">
                        A 2×2 matrix transforms every point in space. Adjust the sliders
                        and watch how the <span style={{ color: "#22c55e" }}>green (î)</span> and{" "}
                        <span style={{ color: "#3b82f6" }}>blue (ĵ)</span> basis vectors change.
                    </Paragraph>

                    {/* Matrix display */}
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <div className="text-center font-mono">
                            <span className="text-lg">A = </span>
                            <span className="text-lg">
                                [ {matrix.a.toFixed(1)} , {matrix.b.toFixed(1)} ]
                            </span>
                            <br />
                            <span className="text-lg ml-8">
                                [ {matrix.c.toFixed(1)} , {matrix.d.toFixed(1)} ]
                            </span>
                        </div>
                    </div>

                    {/* Sliders */}
                    <div className="space-y-4">
                        {(["a", "b", "c", "d"] as const).map((key) => (
                            <div key={key}>
                                <label className="text-sm font-medium flex justify-between">
                                    <span>{key}</span>
                                    <span className="text-muted-foreground">{matrix[key].toFixed(1)}</span>
                                </label>
                                <Slider
                                    value={[matrix[key]]}
                                    onValueChange={([v]) => handleMatrixChange(key, v)}
                                    min={-2}
                                    max={2}
                                    step={0.1}
                                    className="mt-2"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Presets */}
                    <div>
                        <p className="text-sm font-medium mb-2">Try these presets:</p>
                        <div className="flex flex-wrap gap-2">
                            {presets.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => setMatrix(preset.values)}
                                    className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
                                >
                                    {preset.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            <Section id="transform-viz">
                <div className="space-y-4">
                    <Heading level={3}>Live Transformation</Heading>
                    <MatrixViz matrix={matrix} />

                    <div className="bg-muted/50 p-3 rounded-lg text-sm">
                        <p className="font-medium mb-1">What to observe:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                            <li>The grid shows how entire space transforms</li>
                            <li>Try "Shear" - one basis vector stays fixed!</li>
                            <li>When det ≈ 0, space squishes to a line</li>
                        </ul>
                    </div>
                </div>
            </Section>
        </SplitLayout>
    );
};
