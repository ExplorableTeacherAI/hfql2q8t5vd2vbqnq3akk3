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
];
