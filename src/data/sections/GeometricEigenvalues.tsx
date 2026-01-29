import { useState, useEffect, useRef } from "react";
import { Section } from "@/components/templates";
import { FullWidthLayout } from "@/components/layouts";
import { Heading } from "@/components/molecules/Heading";
import { Paragraph } from "@/components/molecules/Paragraph";
import { Slider } from "@/components/atoms/ui/slider";
import {
    ColoredEquationProvider,
    ColoredEquation,
    HighlightedTerm,
} from "@/components/atoms/ColoredEquation";

/**
 * Interactive Determinant Visualization
 * Shows how det(A - λI) changes as λ varies
 */
const DeterminantExplorer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [lambda, setLambda] = useState(0);

    // Matrix A = [[3, 1], [0, 2]]
    // Eigenvalues are 3 and 2
    const matrixA = { a: 3, b: 1, c: 0, d: 2 };

    // A - λI
    const matrixAminusLambdaI = {
        a: matrixA.a - lambda,
        b: matrixA.b,
        c: matrixA.c,
        d: matrixA.d - lambda,
    };

    const determinant =
        matrixAminusLambdaI.a * matrixAminusLambdaI.d -
        matrixAminusLambdaI.b * matrixAminusLambdaI.c;

    // Check if we're at an eigenvalue
    const isAtEigenvalue = Math.abs(determinant) < 0.15;
    const eigenvalues = [2, 3];
    const nearestEigenvalue = eigenvalues.find((ev) => Math.abs(lambda - ev) < 0.15);

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

        // Clear
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

        // Transform function for (A - λI)
        const transform = (vx: number, vy: number) => ({
            x: matrixAminusLambdaI.a * vx + matrixAminusLambdaI.b * vy,
            y: matrixAminusLambdaI.c * vx + matrixAminusLambdaI.d * vy,
        });

        // Draw unit square and its transformation
        const unitSquare = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 1 },
        ];

        // Original unit square (faded)
        ctx.strokeStyle = "#3b82f640";
        ctx.fillStyle = "#3b82f610";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX + unitSquare[0].x * scale, centerY - unitSquare[0].y * scale);
        for (let i = 1; i < unitSquare.length; i++) {
            ctx.lineTo(centerX + unitSquare[i].x * scale, centerY - unitSquare[i].y * scale);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Transformed parallelogram
        const transformedSquare = unitSquare.map((v) => transform(v.x, v.y));

        ctx.strokeStyle = isAtEigenvalue ? "#22c55e" : "#f97316";
        ctx.fillStyle = isAtEigenvalue ? "#22c55e20" : "#f9731620";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(
            centerX + transformedSquare[0].x * scale,
            centerY - transformedSquare[0].y * scale
        );
        for (let i = 1; i < transformedSquare.length; i++) {
            ctx.lineTo(
                centerX + transformedSquare[i].x * scale,
                centerY - transformedSquare[i].y * scale
            );
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw basis vectors after transformation
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
            if (length < 3) return;

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

        // Transformed basis vectors
        const e1 = transform(1, 0);
        const e2 = transform(0, 1);

        drawArrow(centerX, centerY, centerX + e1.x * scale, centerY - e1.y * scale, "#ef4444", 3);
        drawArrow(centerX, centerY, centerX + e2.x * scale, centerY - e2.y * scale, "#8b5cf6", 3);

        // Labels
        ctx.font = "13px system-ui";
        ctx.fillStyle = "#6b7280";
        ctx.fillText("(A - λI) transforms the unit square", 10, 20);

        if (isAtEigenvalue && nearestEigenvalue !== undefined) {
            ctx.fillStyle = "#22c55e";
            ctx.font = "bold 14px system-ui";
            ctx.fillText(
                `✓ det = 0 at λ = ${nearestEigenvalue}! This is an eigenvalue!`,
                10,
                height - 10
            );
        } else {
            ctx.fillStyle = "#6b7280";
            ctx.fillText(`det(A - λI) = ${determinant.toFixed(2)}`, 10, height - 10);
        }
    }, [lambda, matrixAminusLambdaI, determinant, isAtEigenvalue, nearestEigenvalue]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <canvas
                    ref={canvasRef}
                    width={450}
                    height={350}
                    className="border border-border rounded-lg"
                />

                <div className="flex-1 space-y-4 min-w-[280px]">
                    {/* Lambda slider */}
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <label className="text-sm font-medium flex justify-between mb-2">
                            <span>λ (lambda)</span>
                            <span className="font-mono text-primary">{lambda.toFixed(2)}</span>
                        </label>
                        <Slider
                            value={[lambda]}
                            onValueChange={([v]) => setLambda(v)}
                            min={-1}
                            max={5}
                            step={0.05}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Slide to find where det(A - λI) = 0
                        </p>
                    </div>

                    {/* Matrix display */}
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <p className="text-sm font-medium mb-2">Matrix A:</p>
                        <div className="font-mono text-center">
                            [ 3 , 1 ]<br />
                            [ 0 , 2 ]
                        </div>
                    </div>

                    {/* A - λI display */}
                    <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <p className="text-sm font-medium mb-2">A - λI:</p>
                        <div className="font-mono text-center">
                            [ {matrixAminusLambdaI.a.toFixed(1)} , {matrixAminusLambdaI.b.toFixed(1)} ]<br />
                            [ {matrixAminusLambdaI.c.toFixed(1)} , {matrixAminusLambdaI.d.toFixed(1)} ]
                        </div>
                    </div>

                    {/* Determinant */}
                    <div
                        className={`p-4 rounded-lg border ${
                            isAtEigenvalue
                                ? "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800"
                                : "bg-muted/50 border-border"
                        }`}
                    >
                        <p className="text-sm font-medium mb-1">Determinant:</p>
                        <p
                            className={`text-2xl font-mono font-bold ${
                                isAtEigenvalue ? "text-green-600 dark:text-green-400" : ""
                            }`}
                        >
                            {determinant.toFixed(3)}
                        </p>
                        {isAtEigenvalue && (
                            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                Eigenvalue found at λ = {nearestEigenvalue}!
                            </p>
                        )}
                    </div>

                    {/* Hints */}
                    <div className="text-sm text-muted-foreground">
                        <p className="font-medium mb-1">Hint:</p>
                        <p>Try λ = 2 and λ = 3</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Color map for the characteristic equation
 */
const charColorMap = {
    matrix: "#8b5cf6",
    lambda: "#22c55e",
    identity: "#f97316",
};

/**
 * Section 4: Finding Eigenvalues Geometrically
 */
export const GeometricEigenvaluesSection = () => {
    return (
        <FullWidthLayout maxWidth="xl">
            <Section id="geometric-eigenvalues">
                <div className="space-y-6">
                    <Heading level={2}>Finding Eigenvalues: The Geometric View</Heading>

                    <ColoredEquationProvider colorMap={charColorMap}>
                        <Paragraph className="text-lg leading-relaxed">
                            To find eigenvalues, we need to solve a famous equation called the{" "}
                            <strong>characteristic equation</strong>:
                        </Paragraph>

                        <div className="text-center py-4 text-2xl">
                            <ColoredEquation latex="\det(\clr{matrix}{A} - \clr{lambda}{\lambda}\clr{identity}{I}) = 0" />
                        </div>

                        <Paragraph className="leading-relaxed">
                            But what does this actually <em>mean</em> geometrically? When{" "}
                            <HighlightedTerm name="matrix">A</HighlightedTerm> minus{" "}
                            <HighlightedTerm name="lambda">λ</HighlightedTerm> times the{" "}
                            <HighlightedTerm name="identity">identity matrix I</HighlightedTerm>{" "}
                            has determinant zero, it means that transformation{" "}
                            <strong>squishes all of space onto a lower dimension</strong> — a line or even a point!
                        </Paragraph>

                        <div className="bg-muted/50 p-4 rounded-lg border border-border my-4">
                            <Paragraph>
                                <strong>The key insight:</strong> When det(A - λI) = 0, the transformation
                                collapses space. The direction it collapses <em>onto</em> is exactly
                                the eigenvector direction, and λ is the eigenvalue!
                            </Paragraph>
                        </div>
                    </ColoredEquationProvider>

                    <div className="border-t border-border pt-6">
                        <Heading level={3} className="mb-4">
                            Interactive: Find the Eigenvalues
                        </Heading>
                        <Paragraph className="mb-4 text-muted-foreground">
                            Adjust λ with the slider. Watch the orange parallelogram — when it
                            collapses to a line, you've found an eigenvalue!
                        </Paragraph>
                        <DeterminantExplorer />
                    </div>
                </div>
            </Section>
        </FullWidthLayout>
    );
};
