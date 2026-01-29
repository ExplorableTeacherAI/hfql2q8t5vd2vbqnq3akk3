import { Section } from "@/components/templates";
import { FullWidthLayout, GridLayout } from "@/components/layouts";
import { Heading } from "@/components/molecules/Heading";
import { Paragraph } from "@/components/molecules/Paragraph";
import { Equation } from "@/components/atoms/Equation";

/**
 * Key Concept Card Component
 */
const ConceptCard = ({
    icon,
    title,
    description,
    color,
}: {
    icon: string;
    title: string;
    description: string;
    color: string;
}) => {
    return (
        <div
            className="p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
            style={{ borderLeftWidth: "4px", borderLeftColor: color }}
        >
            <div className="text-3xl mb-3">{icon}</div>
            <h4 className="font-semibold text-lg mb-2">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
};

/**
 * Section 6: Summary & Key Takeaways
 */
export const SummarySection = () => {
    const concepts = [
        {
            icon: "🎯",
            title: "Eigenvectors Stay on Their Line",
            description:
                "When a matrix transforms an eigenvector, it only stretches or shrinks — it never rotates off its original direction.",
            color: "#3b82f6",
        },
        {
            icon: "📏",
            title: "Eigenvalues Are Stretch Factors",
            description:
                "The eigenvalue λ tells you exactly how much an eigenvector gets scaled: λ > 1 stretches, 0 < λ < 1 shrinks, λ < 0 flips.",
            color: "#22c55e",
        },
        {
            icon: "🔢",
            title: "The Defining Equation",
            description:
                "Av = λv — this simple equation captures the entire relationship between a matrix, its eigenvectors, and eigenvalues.",
            color: "#8b5cf6",
        },
        {
            icon: "🔍",
            title: "det(A - λI) = 0 Finds Eigenvalues",
            description:
                "When this determinant equals zero, the transformation squishes space — and λ at that moment is an eigenvalue.",
            color: "#f97316",
        },
        {
            icon: "🎵",
            title: "Physics: Natural Frequencies",
            description:
                "In vibrating systems, eigenvalues determine the natural frequencies — how fast things oscillate in their normal modes.",
            color: "#ec4899",
        },
        {
            icon: "⚖️",
            title: "Physics: Stability",
            description:
                "Negative eigenvalues mean stability (decay), positive mean instability (growth). This predicts system behavior!",
            color: "#14b8a6",
        },
    ];

    return (
        <>
            <FullWidthLayout maxWidth="xl">
                <Section id="summary-header">
                    <div className="text-center mb-6">
                        <Heading level={2}>Key Takeaways</Heading>
                        <Paragraph className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                            You've explored the intuition behind eigenvalues. Here's what to remember:
                        </Paragraph>
                    </div>
                </Section>
            </FullWidthLayout>

            <GridLayout columns={3} gap="md">
                {concepts.map((concept, index) => (
                    <Section id={`summary-card-${index}`} key={index} padding="none">
                        <ConceptCard {...concept} />
                    </Section>
                ))}
            </GridLayout>

            <FullWidthLayout maxWidth="xl">
                <Section id="summary-final">
                    <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-border">
                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-4">The Big Picture</h3>
                            <div className="text-2xl mb-4">
                                <Equation latex="A\vec{v} = \lambda\vec{v}" />
                            </div>
                            <Paragraph className="max-w-2xl mx-auto">
                                Eigenvalues and eigenvectors reveal the <strong>essential character</strong> of
                                a transformation. They tell us which directions are "special" (eigenvectors)
                                and how much those directions get scaled (eigenvalues). This insight is
                                foundational across mathematics, physics, engineering, and data science.
                            </Paragraph>
                        </div>
                    </div>

                    <div className="mt-8 p-5 bg-muted/50 rounded-lg border border-border">
                        <h4 className="font-semibold mb-3">You should now be able to:</h4>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span>Explain what an eigenvector is geometrically</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span>Understand eigenvalues as "stretch factors"</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span>Visualize how det(A - λI) = 0 relates to finding eigenvalues</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                <span>Connect eigenvalues to real physics applications</span>
                            </li>
                        </ul>
                    </div>
                </Section>
            </FullWidthLayout>
        </>
    );
};
