
interface Tab {
    key: AuditTypes;
    name: string;
}


interface AuditAction {
    type: 'checkbox' | 'options' ,
    selected?: string
}

interface AuditSettings {
    category: string,
    name: string,
    ajax_action: string,
    action: AuditAction[],
    settings: boolean,
    status: string,
}

type AuditTypes = "attention_required" | "opportunity"| "diagnostics" | "passed_audits"

interface Options{
    id: number,
    label: string,
}

interface AuditFile  {
    totalBytes: number,
    url: string,
    wastedMs: number,
    file_type : string,
    options: Options[],
}

interface  Metrics{
    id : string,
    title : string,
    description : string,
    displayValue : string,
    icon: string,
}

interface PageSpeed{
    performance: number,
    metrics : Metrics[] | undefined,
}
interface Help{
    help: boolean,
    title : string,
    content: string,
}
// interface Audit {
//     id: string,
//     title: string,
//     icon: 'pass' | 'fail' | 'average',
//     files: AuditFile[],
//     settings: AuditSettings[],
//     tags: Array<AuditTypes>,
//     help: Help[],
// }

// interface Audit{
//     id: string,
//     title: string,
//     icon: string,
//     files: AuditFile[],
//     tags: Array<AuditTypes>,
//     settings: AuditSettings[],
//     help: Help[],
//
// }

interface Window {
    uucss_global: {
        ajax_url: string;
        nonce: string;

    };
    rapidload : WordPressOptions
}


interface File {
    wastedBytes: number;
    totalBytes: number;
    url: string;
    wastedPercent?: number;
}

interface Audit {
    id: string;
    name: string;
    icon: string;
    files: {
        overallSavingsBytes: number;
        items: File[];
        type: string;
        headings: {
            key: string;
            valueType?: string;
            label?: string;
            subItemsHeading?: {
                key: string;
                valueType: string;
            };
        }[];
        sortedBy: string[];
        overallSavingsMs?: number;
    };
    type: string;
    score: number;
    settings: {
        name: string;
        category: string;
        ajax_action: string;
        control_type: string;
        control_values: string[];
        control_payload?: string;
    }[];
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