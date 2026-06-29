export interface PrescriptiveEvidenceSummary {
    description: string;
    soruce: string;
    date: Date;
}


export interface PrescriptiveRecommendationSummary {
    recommendation: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGHT' | 'CRITICAL';
}

export interface PrescriptiveActionLog {
    actionTaken: string;
    responsible: string;
    executionDate: Date;
}

export interface PrescriptiveFieldReport {
    id: string;
    detectedProblem: string;
    location: string;
    evidence: PrescriptiveEvidenceSummary[];
    rootCause: string;
    recommendation: string;
    actionLog: PrescriptiveActionLog[];
    pendingItems: string[];
}