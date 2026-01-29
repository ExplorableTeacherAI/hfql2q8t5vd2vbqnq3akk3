import { type ReactElement } from "react";
import { Section } from "@/components/templates";
import { FullWidthLayout, SplitLayout } from "@/components/layouts";
import { Heading } from "@/components/molecules/Heading";

// Initialize variables from this file's variable definitions
import { useVariableStore } from "@/stores";
import { getDefaultValues } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());

// Import section components
import { EigenvaluesIntroContent, EigenvaluesIntroViz } from "./sections/EigenvaluesIntro";
import { TransformationExplorerFull } from "./sections/TransformationExplorerWrapper";
import { EigenvectorRelationshipSection } from "./sections/EigenvectorRelationship";
import { GeometricEigenvaluesSection } from "./sections/GeometricEigenvalues";
import { PhysicsApplicationsSection } from "./sections/PhysicsApplications";
import { SummarySection } from "./sections/Summary";

/**
 * Eigenvalues Lesson
 * Target: High School Students
 * Objective: Intuitive understanding of eigenvalues with physics applications
 */

export const sections: ReactElement[] = [
    // ========================================
    // LESSON HEADER
    // ========================================
    <FullWidthLayout key="lesson-header" maxWidth="xl">
        <Section id="lesson-header" padding="lg">
            <div className="text-center mb-2">
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                    Linear Algebra
                </span>
            </div>
            <Heading level={1} className="text-center text-4xl md:text-5xl font-bold mb-4">
                Understanding Eigenvalues
            </Heading>
            <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
                Discover the special vectors that reveal how transformations really work
            </p>
        </Section>
    </FullWidthLayout>,

    // ========================================
    // SECTION 1: Introduction - What Makes Eigenvalues Special?
    // ========================================
    <SplitLayout key="section-1-intro" ratio="1:1" gap="lg">
        <Section id="intro-content">
            <EigenvaluesIntroContent />
        </Section>
        <Section id="intro-viz">
            <EigenvaluesIntroViz />
        </Section>
    </SplitLayout>,

    // ========================================
    // SECTION 2: Visualizing Transformations
    // ========================================
    <TransformationExplorerFull key="section-2-transform" />,

    // ========================================
    // SECTION 3: The Eigenvector and Eigenvalue Relationship
    // ========================================
    <EigenvectorRelationshipSection key="section-3-relationship" />,

    // ========================================
    // SECTION 4: Finding Eigenvalues Geometrically
    // ========================================
    <GeometricEigenvaluesSection key="section-4-geometric" />,

    // ========================================
    // SECTION 5: Physics Applications
    // ========================================
    <PhysicsApplicationsSection key="section-5-physics" />,

    // ========================================
    // SECTION 6: Summary & Key Takeaways
    // ========================================
    <SummarySection key="section-6-summary" />,
];
