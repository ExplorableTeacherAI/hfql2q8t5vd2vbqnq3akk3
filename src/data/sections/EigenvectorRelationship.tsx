import { useState, useEffect, useRef, useCallback } from "react";
import { Section } from "@/components/templates";
import { FullWidthLayout } from "@/components/layouts";
import { Heading } from "@/components/molecules/Heading";
import { Paragraph } from "@/components/molecules/Paragraph";
import {
    ColoredEquationProvider,
    ColoredEquation,
    HighlightedTerm,
} from "@/components/atoms/ColoredEquation";

/**
 * Interactive Eigenvector Finder
 * Students can drag a vector to see if it's an eigenvector
 */
const EigenvectorFinder = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [vectorAngle, setVectorAngle] = useState(0); // Angle in radians
    const [isDragging, setIsDragging] = useState(false);

    // Matrix with known eigenvectors
    // Matrix: [[2, 1], [0, 1]]
    // Eigenvalue 2: eigenvector [1, 0]
    // Eigenvalue 1: eigenvector [-1, 1] (normalized)
    const matrix = { a: 2, b: 1, c: 0, d: 1 };

    // Eigenvector angles (in radians)
    const eigenvectorAngles = [
        0, // [1, 0] -> angle 0
        (3 * Math.PI) / 4, // [-1, 1] -> angle 135°
    ];
    const eigenvalues = [2, 1];

    const transformVector = (vx: number, vy: number) => ({
        x: matrix.a * vx + matrix.b * vy,
        y: matrix.c * vx + matrix.d * vy,
    });

    // Check if current angle is close to an eigenvector
    const getEigenvectorMatch = () => {
        const tolerance = 0.15; // radians (~8.5 degrees)
        for (let i = 0; i < eigenvectorAngles.length; i++) {
            let diff = Math.abs(vectorAngle - eigenvectorAngles[i]);
            // Handle wrap-around
            if (diff > Math.PI) diff = 2 * Math.PI - diff;
            if (diff < tolerance) {
                return { index: i, eigenvalue: eigenvalues[i] };
            }
        }
        return null;
    };

    const eigenvectorMatch = getEigenvectorMatch();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const scale = 80;
        const centerX = width / 2;
        const centerY = height / 2;

        // Clear
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = "#e5e7eb";
        ctx.lineWidth = 1;
        for (let i = -3; i <= 3; i++) {
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

        // Draw eigenvector directions (hints)
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = "#22c55e50";
        ctx.lineWidth = 2;
        eigenvectorAngles.forEach((angle) => {
            const length = 150;
            ctx.beginPath();
            ctx.moveTo(centerX - length * Math.cos(angle), centerY + length * Math.sin(angle));
            ctx.lineTo(centerX + length * Math.cos(angle), centerY - length * Math.sin(angle));
            ctx.stroke();
        });
        ctx.setLineDash([]);

        // Current vector
        const vx = Math.cos(vectorAngle);
        const vy = Math.sin(vectorAngle);
        const vectorLength = 1.5;

        // Transformed vector
        const transformed = transformVector(vx * vectorLength, vy * vectorLength);

        // Draw arrow helper
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

        // Original vector (blue)
        drawArrow(
            centerX,
            centerY,
            centerX + vx * vectorLength * scale,
            centerY - vy * vectorLength * scale,
            "#3b82f6",
            3
        );

        // Transformed vector (orange)
        drawArrow(
            centerX,
            centerY,
            centerX + transformed.x * scale,
            centerY - transformed.y * scale,
            "#f97316",
            3
        );

        // Labels
        ctx.font = "bold 14px system-ui";
        ctx.fillStyle = "#3b82f6";
        ctx.fillText(
            "v",
            centerX + vx * vectorLength * scale + 10,
            centerY - vy * vectorLength * scale - 5
        );
        ctx.fillStyle = "#f97316";
        ctx.fillText(
            "Av",
            centerX + transformed.x * scale + 10,
            centerY - transformed.y * scale - 5
        );

        // Drag handle circle
        ctx.beginPath();
        ctx.arc(
            centerX + vx * vectorLength * scale,
            centerY - vy * vectorLength * scale,
            12,
            0,
            2 * Math.PI
        );
        ctx.fillStyle = isDragging ? "#3b82f6" : "#3b82f680";
        ctx.fill();
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Status message
        ctx.font = "14px system-ui";
        if (eigenvectorMatch) {
            ctx.fillStyle = "#22c55e";
            ctx.fillText(
                `✓ Eigenvector found! λ = ${eigenvectorMatch.eigenvalue}`,
                10,
                height - 10
            );
        } else {
            ctx.fillStyle = "#6b7280";
            ctx.fillText("Drag the blue vector to find eigenvectors", 10, height - 10);
        }
    }, [vectorAngle, isDragging, eigenvectorMatch]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - canvas.width / 2;
        const y = -(e.clientY - rect.top - canvas.height / 2);

        // Check if clicking near the vector tip
        const vx = Math.cos(vectorAngle) * 1.5 * 80;
        const vy = Math.sin(vectorAngle) * 1.5 * 80;
        const dist = Math.sqrt((x - vx) ** 2 + (y - vy) ** 2);

        if (dist < 30) {
            setIsDragging(true);
        }
    };

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (!isDragging) return;

            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left - canvas.width / 2;
            const y = -(e.clientY - rect.top - canvas.height / 2);

            setVectorAngle(Math.atan2(y, x));
        },
        [isDragging]
    );

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <canvas
            ref={canvasRef}
            width={500}
            height={350}
            className="border border-border rounded-lg cursor-grab active:cursor-grabbing mx-auto block"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        />
    );
};

/**
 * Color map for the eigenvalue equation
 */
const eigenColorMap = {
    matrix: "#8b5cf6", // purple
    eigenvector: "#3b82f6", // blue
    eigenvalue: "#22c55e", // green
};

/**
 * Section 3: Eigenvector and Eigenvalue Relationship
 */
export const EigenvectorRelationshipSection = () => {
    return (
        <FullWidthLayout maxWidth="xl">
            <Section id="eigenvector-relationship">
                <div className="space-y-6">
                    <Heading level={2}>The Eigenvector Equation</Heading>

                    <ColoredEquationProvider colorMap={eigenColorMap}>
                        <Paragraph className="text-lg leading-relaxed">
                            The defining equation of eigenvalues is beautifully simple:
                        </Paragraph>

                        <div className="text-center py-6 text-3xl">
                            <ColoredEquation latex="\clr{matrix}{A}\clr{eigenvector}{\vec{v}} = \clr{eigenvalue}{\lambda}\clr{eigenvector}{\vec{v}}" />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 my-6">
                            <div className="bg-muted/50 p-4 rounded-lg border border-border">
                                <p className="font-semibold mb-1">
                                    <HighlightedTerm name="matrix">A</HighlightedTerm> — The Matrix
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    The transformation we're analyzing
                                </p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg border border-border">
                                <p className="font-semibold mb-1">
                                    <HighlightedTerm name="eigenvector">v</HighlightedTerm> — Eigenvector
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    A special vector that doesn't change direction
                                </p>
                            </div>
                            <div className="bg-muted/50 p-4 rounded-lg border border-border">
                                <p className="font-semibold mb-1">
                                    <HighlightedTerm name="eigenvalue">λ</HighlightedTerm> — Eigenvalue
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    The stretch factor (how much v scales)
                                </p>
                            </div>
                        </div>

                        <Paragraph className="leading-relaxed">
                            In words: when we multiply{" "}
                            <HighlightedTerm name="matrix">matrix A</HighlightedTerm> by an{" "}
                            <HighlightedTerm name="eigenvector">eigenvector v</HighlightedTerm>, the
                            result is the same as simply multiplying{" "}
                            <HighlightedTerm name="eigenvector">v</HighlightedTerm> by a number{" "}
                            <HighlightedTerm name="eigenvalue">λ</HighlightedTerm>. The vector stays
                            on its original line — it just gets longer or shorter!
                        </Paragraph>
                    </ColoredEquationProvider>

                    <div className="border-t border-border pt-6 mt-6">
                        <Heading level={3} className="mb-4">
                            Find the Eigenvectors
                        </Heading>
                        <Paragraph className="mb-4 text-muted-foreground">
                            Drag the <span style={{ color: "#3b82f6" }}>blue vector (v)</span> around.
                            When v and <span style={{ color: "#f97316" }}>Av (orange)</span> point in
                            the same direction, you've found an eigenvector! The dashed green lines
                            show hints.
                        </Paragraph>
                        <EigenvectorFinder />
                    </div>
                </div>
            </Section>
        </FullWidthLayout>
    );
};
