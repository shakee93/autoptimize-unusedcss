
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

interface Audit {
    name: string,
    icon: 'pass' | 'fail' | 'average',
    files: [],
    settings: AuditSettings[],
    tags: Array<AuditTypes>,
}
