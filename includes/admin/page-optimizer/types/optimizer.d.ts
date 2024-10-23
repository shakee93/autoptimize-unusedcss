

interface OptimizerResults  {
    performance: number
    job_id?: string;
    audits: Audit[]
    metrics: Metric[],
    settingsMode: PerformanceGear,
    loadingExperience?: LoadingExperience
    originLoadingExperience?: LoadingExperience
    grouped: {
        passed_audits: Audit[],
        opportunities: Audit[],
        diagnostics: Audit[],
        attention_required: Audit[],
    }
    meta: {
        controls : {
            dropdown_options: {
                type: string
                options: string[]
            }[]
        }
    }
}

interface LoadingExperience {
    id: string
    initial_url: string
    overall_category: string,
    timestamp: number,
    metrics: {
        [metricName: string]: {
            percentile: number;
            distributions: {
                min: number;
                max?: number;
                proportion: number;
            }[];
            category: string;
        };
    }
}

type AuditTypes = keyof OptimizerResults['grouped'] | 'configurations'

interface AuditFileBase  {
    overallSavingsBytes: number;
    type: 'list' | 'table' | 'opportunity' | 'criticalrequestchain';
    headings?: AuditHeadings[];
    sortedBy: string[];
    overallSavingsMs?: number;
}

interface ListItems extends AuditFileBase {
    type: 'list'
    items: AuditListResource[]
}

interface TableItems extends AuditFileBase {
    type: 'table' | 'opportunity'
    items: AuditTableResource[];
    grouped_items: GroupedAuditResource[];
}

interface CriticalRequestChainItems extends AuditFileBase {
    type: 'criticalrequestchain'
    chains: {
        [key: string] : CriticalChainTreeNodeType
    };
    longestChain : {
        transferSize: number
        duration: number
        length: number
    }
    grouped_items: GroupedAuditResource[];
    items: any
}

interface GroupedAuditResource {
 type: string;
 items: AuditTableResource[]
}

type FileTypes = 'css' | 'js' | 'image' | 'font' | string

type AuditResource = AuditTableResource | AuditListResource

type AuditFiles = TableItems | ListItems | CriticalRequestChainItems

interface AuditTableResource {
    wastedBytes?: number;
    totalBytes?: number;
    action?: {
        value: string,
        control_type: string
        control_values: string[]
    };
    wastedPercent?: number;
    url?: {
        url: string,
        file_type: {
            label: string
            value: string
        }
    } | string
    pattern?: string
    passed?: boolean
    subItems?: AuditColumnSubItems
}


interface AuditListResource {
    headings: AuditHeadings[]
    items: AuditTableResource[]
    type: 'table' | string
    subItems?: AuditColumnSubItems
}

interface AuditColumnSubItems {
    type: string
    items: [{
        [p: string]: string
    }]
}



interface Audit {
    id: string;
    name: string;
    description: string;
    icon: string;
    files: AuditFiles
    type: string;
    score: number;
    scoreDisplayMode: string;
    displayValue: string;
    settings: AuditSetting[];
    metrics: Metric[]
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

interface AuditSetting {
    name: string;
    key: string,
    category: string;
    description: string;
    inputs: AuditSettingInput[];
    audits: Audit[];
    status?: {
        status: 'failed' | 'queued' | 'processing' | 'success' | 'Hit' | 'Miss' | boolean
        stats: []
        warnings: []
        error: any
        message: string
    }
}

interface AuditSettingInput {
    control_type: ControlTypes;
    control_values:  ControlValue[] | string [] ;
    control_payload: string;
    control_label: string;
    control_icon: string;
    control_accordion_name: string;
    control_description: string;
    control_values_description?: ControlValuesDescription[];
    control_values_suffix: string;
    control_visibility?: {
        key: string, value: string
    }[]
    value: any;
    key: any;
    action: string
    inputs?: AuditSettingInput[]
    actions?: AuditSettingInput[]
    readonly?: boolean
    placeholder?: string
    control_props?: {
        [key: string]: any;
    };
}

interface ControlValue {
    type: string;
    name: string;
    id: string;
    isSelected: boolean;
    exclusions: string[];
}

type ControlTypes = 'checkbox' | 'textarea' | 'tickbox' | string

type ControlValuesDescription = {
    value: string;
    description: string;
};
interface Metric {
    id: string;
    title: string;
    description: string;
    displayValue: string;
    icon: string;
    score: number;
    color?: string,
    refs: {
        relevantAudits: string[]
        acronym: string
        weight: number
    }
    potentialGain: number
}

type ReportType = 'mobile' | 'desktop'

interface CSSJobStatus {
    status: string;
    error: {
        code: number;
        message: string;
    };
}

interface CSSStatusResponse {
    uucss: CSSJobStatus;
    cpcss: CSSJobStatus;
}

interface TestMode {
    status: boolean;
}

interface Revision {
    created_at: string
    id: number
    job_id: number
    strategy: ReportType
    data: OptimizerResults
    timestamp: number
}

type CriticalChainRequest = {
    url: string;
    startTime: number;
    transferSize: number;
    responseReceivedTime: number;
    endTime: number;
};

// Define the tree node type
type CriticalChainTreeNodeType = {
    request: CriticalChainRequest;
    children?: {
        [key: string]: CriticalChainTreeNodeType;
    };
};

interface RapidLoadSetOptimizerEvent extends Event {
    detail?: {
        status: boolean;
    };
}

type CssErrorKeys = 'Critical CSS' | 'Unused CSS';


type BasePerformanceGear = 'starter' | 'accelerate' | 'turboMax';
type PerformanceGear = BasePerformanceGear | 'custom' ;