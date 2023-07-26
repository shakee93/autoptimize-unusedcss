
interface Tab {
    key: keyof OptimizerResults['data']['grouped'];
    name: string;
}

interface AuditAction {
    type: 'checkbox' | 'options' ,
    selected?: string
}


interface Help{
    help: boolean,
    title : string,
    content: string,
}


interface Window {
    rapidload : WordPressOptions
}


interface AuditFile {
    wastedBytes: number;
    totalBytes: number;
    url: string;
    wastedPercent?: number;
}

interface AuditSettings {
    name: string;
    category: string;
    ajax_action: string;
    control_type: string;
    control_values: string[];
    control_payload?: string;
}

interface Audit {
    id: string;
    name: string;
    icon: string;
    files: {
        overallSavingsBytes: number;
        items: AuditFile[];
        type: string;
        headings: {
            key: string;
            valueType?: string;
            label?: string;
            subItemsHeading?: {
                key: string;
                valueType: string;
            };
            control_type: string
            control_values: string[]
        }[];
        sortedBy: string[];
        overallSavingsMs?: number;
    };
    type: string;
    score: number;
    settings: AuditSettings[];
}

interface Metric {
    id: string;
    title: string;
    description: string;
    displayValue: string;
    icon: string;
    score: number;
}

interface MetricsData {
    success: boolean;
    data: {
        metrics: Metric[];
        audits: Audit[];
        performance: number;
    };
}

interface WordPressOptions {
    ajax_url: string
    optimizer_url: string
    page_optimizer_base: string
    plugin_url: string
}

interface OptimizerResults {
    data : {
        performance: number
        audits: Audit[]
        metrics: Metric[],
        grouped: {
            passed_audits: Audit[],
            opportunities: Audit[],
            diagnostics: Audit[],
        }
    },
    success: boolean
}

type AuditTypes = keyof OptimizerResults["data"]['grouped']