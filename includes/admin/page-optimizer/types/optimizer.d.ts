

interface OptimizerResults  {
    performance: number
    audits: Audit[]
    metrics: Metric[],
    grouped: {
        passed_audits: Audit[],
        opportunities: Audit[],
        diagnostics: Audit[],
    }
}

type AuditTypes = keyof OptimizerResults['grouped']

interface Audit {
    id: string;
    name: string;
    icon: string;
    files: {
        overallSavingsBytes: number;
        items: AuditFile[];
        type: string;
        headings: AuditHeadings[];
        sortedBy: string[];
        overallSavingsMs?: number;
    };
    type: string;
    score: number;
    settings: AuditSetting[];
}

interface AuditHeadings {
    key: string;
    valueType?: string;
    label?: string;
    subItemsHeading?: {
        key: string;
        valueType: string;
    };
    control_type: string
    control_values: string[],
    granularity: number
}

interface AuditFile {
    wastedBytes: number;
    totalBytes: number;
    action: {
        value: string,
        control_type: string
        control_values: string[]
    };
    wastedPercent?: number;
    url: {
        url: string,
        file_type: {
            label: string
            value: string
        }
    }
    pattern: string
}

interface AuditSetting {
    name: string;
    key: string,
    category: string;
    inputs: AuditSettingInput[];
}

interface AuditSettingInput {
    control_type: ControlTypes;
    control_values: string[];
    control_payload: string;
    value: any;
    key: any;
}

type ControlTypes = 'checkbox' | 'textarea' | string

interface Metric {
    id: string;
    title: string;
    description: string;
    displayValue: string;
    icon: string;
    score: number;
}

type ReportType = 'mobile' | 'desktop'

interface Revision {
    created_at: string
    id: number
    job_id: number
    strategy: ReportType
    data: OptimizerResults
}

