export interface ReportSection {
    title: string;
    professional: string;
    plain: string;
}

export interface FreeReport {
    identity: ReportSection;
    currentCycle: ReportSection;
    riskAssessment: {
        level: 'low' | 'medium' | 'high';
        title: string;
        professional: string;
        plain: string;
    };
}

export interface LockedReport {
    actions?: {
        title: string;
        items: Array<{
            label: string;
            professional: string;
            plain: string;
        }>;
    };
    timing?: {
        title: string;
        windows: Array<{
            period: string;
            focus: string;
            detail: string;
        }>;
    };
    elementStrategy?: ReportSection;
    decisionAnalysis?: ReportSection;
}
