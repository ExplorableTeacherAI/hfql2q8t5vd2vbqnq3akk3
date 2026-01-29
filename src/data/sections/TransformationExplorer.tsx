import { useState, useEffect, useRef } from "react";
import { Heading } from "@/components/molecules/Heading";
import { Paragraph } from "@/components/molecules/Paragraph";
import { Slider } from "@/components/atoms/ui/slider";
import { Equation } from "@/components/atoms/Equation";

/**
 * Interactive Matrix Transformation Explorer
 * Students can adjust matrix values and see real-time transformations
 */
const MatrixTransformationExplorer = ({
    matrix,
    onMatrixChange,
}: {
    matrix: { a: number; b: number; c: number; d: number };
    onMatrixChange: (key: "a" | "b" | "c" | "d", value: number) => void;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Generate a grid of vectors to show the transformation
    const gridVectors: { x: number; y: number }[] = [];
    for (let x = -2; x <= 2; x += 0.5) {
        for (let y = -2; y <= 2; y += 0.5) {
            if (x !== 0 || y !== 0) {
                gridVectors.push({ x, y });
            }
        }
    }

    // Special vectors to highlight
    const specialVectors = [
        { x: 1, y: 0, color: "#22c55e", label: "î" },
        { x: 0, y: 1, color: "#3b82f6", label: "ĵ" },
    ];

    const transformVector = (vx: number, vy: number) => {
        return {
            x: matrix.a * vx + matrix.b * vy,
            y: matrix.c * vx + matrix.d * vy,
        };
    };

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

        // Clear canvas
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines (transformed)
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;

        // Vertical grid lines (transformed)
        for (let i = -4; i <= 4; i++) {
            const start = transformVector(i, -4);
            const end = transformVector(i, 4);
            ctx.beginPath();
            ctx.moveTo(centerX + start.x * scale, centerY - start.y * scale);
            ctx.lineTo(centerX + end.x * scale, centerY - end.y * scale);
            ctx.stroke();
        }

        // Horizontal grid lines (transformed)
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
            if (length < 5) return; // Don't draw very short arrows

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

        // Draw special vectors (basis vectors transformed)
        specialVectors.forEach((v) => {
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

            // Label
            ctx.fillStyle = v.color;
            ctx.font = "bold 14px system-ui";
            ctx.fillText(
                v.label,
                centerX + transformed.x * scale + 8,
                centerY - transformed.y * scale - 8
            );
        });

        // Draw determinant info
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
            height={340}
            className="border border-border rounded-lg w-full"
        />
    );
};

/**
 * Matrix Controls Component
 */
const MatrixControls = ({
    matrix,
    onMatrixChange,
}: {
    matrix: { a: number; b: number; c: number; d: number };
    onMatrixChange: (key: "a" | "b" | "c" | "d", value: number) => void;
}) => {
    const presets = [
        { name: "Identity", values: { a: 1, b: 0, c: 0, d: 1 } },
        { name: "Scale 2x", values: { a: 2, b: 0, c: 0, d: 2 } },
        { name: "Rotate 45°", values: { a: 0.71, b: -0.71, c: 0.71, d: 0.71 } },
        { name: "Shear", values: { a: 1, b: 1, c: 0, d: 1 } },
        { name: "Reflection", values: { a: -1, b: 0, c: 0, d: 1 } },
    ];

    return (
        <div className="space-y-6">
            {/* Matrix display */}
            <div className="bg-muted/50 p-4 rounded-lg border border-border">
                <div className="text-center mb-4">
                    <span className="text-lg font-medium">Matrix A = </span>
                    <span className="text-xl font-mono">
                        [{matrix.a.toFixed(1)}, {matrix.b.toFixed(1)}]
                        <br />
                        <span className="ml-[4.5rem]">[{matrix.c.toFixed(1)}, {matrix.d.toFixed(1)}]</span>
                    </span>
                </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium flex justify-between">
                        <span>a (top-left)</span>
                        <span className="text-muted-foreground">{matrix.a.toFixed(1)}</span>
                    </label>
                    <Slider
                        value={[matrix.a]}
                        onValueChange={([v]) => onMatrixChange("a", v)}
                        min={-2}
                        max={2}
                        step={0.1}
                        className="mt-2"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium flex justify-between">
                        <span>b (top-right)</span>
                        <span className="text-muted-foreground">{matrix.b.toFixed(1)}</span>
                    </label>
                    <Slider
                        value={[matrix.b]}
                        onValueChange={([v]) => onMatrixChange("b", v)}
                        min={-2}
                        max={2}
                        step={0.1}
                        className="mt-2"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium flex justify-between">
                        <span>c (bottom-left)</span>
                        <span className="text-muted-foreground">{matrix.c.toFixed(1)}</span>
                    </label>
                    <Slider
                        value={[matrix.c]}
                        onValueChange={([v]) => onMatrixChange("c", v)}
                        min={-2}
                        max={2}
                        step={0.1}
                        className="mt-2"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium flex justify-between">
                        <span>d (bottom-right)</span>
                        <span className="text-muted-foreground">{matrix.d.toFixed(1)}</span>
                    </label>
                    <Slider
                        value={[matrix.d]}
                        onValueChange={([v]) => onMatrixChange("d", v)}
                        min={-2}
                        max={2}
                        step={0.1}
                        className="mt-2"
                    />
                </div>
            </div>

            {/* Presets */}
            <div>
                <p className="text-sm font-medium mb-2">Try these presets:</p>
                <div className="flex flex-wrap gap-2">
                    {presets.map((preset) => (
                        <button
                            key={preset.name}
                            onClick={() => {
                                onMatrixChange("a", preset.values.a);
                                onMatrixChange("b", preset.values.b);
                                onMatrixChange("c", preset.values.c);
                                onMatrixChange("d", preset.values.d);
                            }}
                            className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

/**
 * Section 2: Transformation Explorer - Left Content
 */
export const TransformationExplorerContent = () => {
    const [matrix, setMatrix] = useState({ a: 1, b: 0, c: 0, d: 1 });

    const handleMatrixChange = (key: "a" | "b" | "c" | "d", value: number) => {
        setMatrix((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4">
            <Heading level={2}>Explore Transformations</Heading>

            <Paragraph className="leading-relaxed">
                A 2×2 matrix transforms every point in space. Adjust the matrix values below
                and watch how the <span style={{ color: "#22c55e" }}>green (î)</span> and{" "}
                <span style={{ color: "#3b82f6" }}>blue (ĵ)</span> basis vectors move.
            </Paragraph>

            <Paragraph className="text-sm text-muted-foreground">
                The faded arrows show the original vectors; the solid arrows show where they land after transformation.
            </Paragraph>

            <MatrixControls matrix={matrix} onMatrixChange={handleMatrixChange} />
        </div>
    );
};

/**
 * Section 2: Transformation Explorer - Right Visualization
 */
export const TransformationExplorerViz = () => {
    const [matrix, setMatrix] = useState({ a: 1, b: 0, c: 0, d: 1 });

    const handleMatrixChange = (key: "a" | "b" | "c" | "d", value: number) => {
        setMatrix((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-4">
            <Heading level={3}>Live Transformation</Heading>
            <MatrixTransformationExplorer matrix={matrix} onMatrixChange={handleMatrixChange} />

            <div className="bg-muted/50 p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">What to observe:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>The grid lines show how the entire space is transformed</li>
                    <li>Try the "Shear" preset - notice one basis vector stays fixed!</li>
                    <li>When determinant ≈ 0, space gets squished to a line</li>
                </ul>
            </div>
        </div>
    );
};

/**
 * Combined component that shares state between controls and visualization
 */
export const TransformationExplorerCombined = () => {
    const [matrix, setMatrix] = useState({ a: 1, b: 0, c: 0, d: 1 });

    const handleMatrixChange = (key: "a" | "b" | "c" | "d", value: number) => {
        setMatrix((prev) => ({ ...prev, [key]: value }));
    };

    return {
        controls: (
            <div className="space-y-4">
                <Heading level={2}>Explore Transformations</Heading>

                <Paragraph className="leading-relaxed">
                    A 2×2 matrix transforms every point in space. Adjust the matrix values below
                    and watch how the <span style={{ color: "#22c55e" }}>green (î)</span> and{" "}
                    <span style={{ color: "#3b82f6" }}>blue (ĵ)</span> basis vectors move.
                </Paragraph>

                <Paragraph className="text-sm text-muted-foreground">
                    The faded arrows show the original vectors; the solid arrows show where they land.
                </Paragraph>

                <MatrixControls matrix={matrix} onMatrixChange={handleMatrixChange} />
            </div>
        ),
        viz: (
            <div className="space-y-4">
                <Heading level={3}>Live Transformation</Heading>
                <MatrixTransformationExplorer matrix={matrix} onMatrixChange={handleMatrixChange} />

                <div className="bg-muted/50 p-3 rounded-lg text-sm">
                    <p className="font-medium mb-1">What to observe:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        <li>The grid shows how the entire space transforms</li>
                        <li>Try "Shear" - one basis vector stays fixed!</li>
                        <li>When det ≈ 0, space squishes to a line</li>
                    </ul>
                </div>
            </div>
        ),
    };
};

/**
 * Single component wrapper for shared state
 */
export const TransformationExplorerSection = () => {
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

    const applyPreset = (preset: typeof presets[0]) => {
        setMatrix(preset.values);
    };

    return { matrix, handleMatrixChange, presets, applyPreset };
};
