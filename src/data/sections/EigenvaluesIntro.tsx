import { useState, useEffect, useRef } from "react";
import { Heading } from "@/components/molecules/Heading";
import { Paragraph } from "@/components/molecules/Paragraph";
import { Stepper } from "@/components/annotations/Stepper";
import { Equation } from "@/components/atoms/Equation";

/**
 * Interactive 2D Vector Transformation Visualization
 * Shows how matrices transform vectors, highlighting eigenvectors
 */
const VectorTransformationViz = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [animationProgress, setAnimationProgress] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [showEigenvector, setShowEigenvector] = useState(false);

    // Simple 2x2 matrix that has clear eigenvectors
    // Matrix: [[2, 1], [0, 1]] has eigenvalues 2 and 1
    // Eigenvector for λ=2 is [1, 0], for λ=1 is [-1, 1]
    const matrix = { a: 2, b: 1, c: 0, d: 1 };

    // Sample vectors to transform
    const vectors = [
        { x: 1, y: 0.5, color: "#6366f1", label: "v₁" },      // Regular vector
        { x: 0.5, y: 1, color: "#f97316", label: "v₂" },      // Regular vector
        { x: 1, y: 0, color: "#22c55e", label: "e₁", isEigen: true }, // Eigenvector!
    ];

    const transformVector = (vx: number, vy: number, t: number) => {
        const newX = vx + t * (matrix.a * vx + matrix.b * vy - vx);
        const newY = vy + t * (matrix.c * vx + matrix.d * vy - vy);
        return { x: newX, y: newY };
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const scale = 60;
        const centerX = width / 2;
        const centerY = height / 2;

        // Clear canvas
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;
        for (let i = -5; i <= 5; i++) {
            ctx.beginPath();
            ctx.moveTo(centerX + i * scale, 0);
            ctx.lineTo(centerX + i * scale, height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, centerY + i * scale);
            ctx.lineTo(width, centerY + i * scale);
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

        // Draw vectors
        const drawArrow = (
            fromX: number,
            fromY: number,
            toX: number,
            toY: number,
            color: string,
            lineWidth: number = 3
        ) => {
            const headLength = 10;
            const dx = toX - fromX;
            const dy = toY - fromY;
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

        // Draw each vector
        vectors.forEach((v) => {
            if (v.isEigen && !showEigenvector) return;

            const transformed = transformVector(v.x, v.y, animationProgress);

            // Original vector (faded)
            if (animationProgress > 0) {
                drawArrow(
                    centerX,
                    centerY,
                    centerX + v.x * scale,
                    centerY - v.y * scale,
                    v.color + "40",
                    2
                );
            }

            // Current/transformed vector
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
                centerX + transformed.x * scale + 10,
                centerY - transformed.y * scale - 10
            );
        });

        // Add instruction text
        ctx.fillStyle = "#6b7280";
        ctx.font = "13px system-ui";
        if (animationProgress === 0) {
            ctx.fillText("Click 'Transform' to apply the matrix", 10, height - 10);
        } else if (animationProgress === 1) {
            ctx.fillText("Notice: green vector only stretched, not rotated!", 10, height - 10);
        }
    }, [animationProgress, showEigenvector, vectors]);

    const handleTransform = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setShowEigenvector(true);

        let progress = 0;
        const animate = () => {
            progress += 0.02;
            if (progress >= 1) {
                setAnimationProgress(1);
                setIsAnimating(false);
                return;
            }
            setAnimationProgress(progress);
            requestAnimationFrame(animate);
        };
        animate();
    };

    const handleReset = () => {
        setAnimationProgress(0);
        setShowEigenvector(false);
    };

    return (
        <div className="space-y-4">
            <canvas
                ref={canvasRef}
                width={350}
                height={300}
                className="border border-border rounded-lg w-full"
            />
            <div className="flex gap-2">
                <button
                    onClick={handleTransform}
                    disabled={isAnimating || animationProgress === 1}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                    Transform
                </button>
                <button
                    onClick={handleReset}
                    disabled={isAnimating || animationProgress === 0}
                    className="px-4 py-2 bg-muted text-muted-foreground rounded-md font-medium text-sm hover:bg-muted/80 disabled:opacity-50 transition-colors"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

/**
 * Introduction Section Content
 */
export const EigenvaluesIntroContent = () => {
    return (
        <div className="space-y-4">
            <Heading level={1}>What Makes Eigenvalues Special?</Heading>

            <Paragraph className="text-lg leading-relaxed">
                Imagine you have a transformation that stretches, rotates, or skews space.
                When you apply this transformation to most vectors, they change both their
                <strong> direction</strong> and their <strong>length</strong>.
            </Paragraph>

            <Paragraph className="leading-relaxed">
                But here's the fascinating part: for every transformation, there exist some
                <em> special vectors</em> that <strong>don't change direction</strong> —
                they only get stretched or shrunk along their original line.
            </Paragraph>

            <div className="bg-muted/50 p-4 rounded-lg border border-border my-4">
                <Paragraph className="font-medium text-foreground mb-2">
                    Key Insight:
                </Paragraph>
                <Paragraph>
                    These special vectors are called <strong className="text-primary">eigenvectors</strong>,
                    and the factor by which they stretch is called the <strong className="text-primary">eigenvalue</strong>.
                </Paragraph>
            </div>

            <Paragraph className="leading-relaxed">
                In the visualization on the right, watch what happens when we apply a matrix
                transformation. The <span style={{ color: "#6366f1" }}>purple</span> and{" "}
                <span style={{ color: "#f97316" }}>orange</span> vectors rotate AND stretch.
                But the <span style={{ color: "#22c55e" }}>green</span> vector? It only stretches —
                that's an eigenvector!
            </Paragraph>
        </div>
    );
};

/**
 * Visualization Section Content
 */
export const EigenvaluesIntroViz = () => {
    return (
        <div className="space-y-4">
            <Heading level={3}>Interactive Transformation</Heading>
            <Paragraph className="text-muted-foreground text-sm">
                Click "Transform" to see how the matrix affects different vectors.
            </Paragraph>
            <VectorTransformationViz />
        </div>
    );
};
