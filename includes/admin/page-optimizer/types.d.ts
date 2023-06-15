
interface Tab {
    key: string;
    name: string;
}


interface AuditAction {
    type: 'checkbox' | 'options' ,
}

interface AuditSettings {
    category: string,
    name: string,
    ajax_action: string,
    action: AuditAction[],
    settings: boolean,
    status: string,
}

interface Audit {
    name: string,
    icon: 'pass' | 'fail' | 'average',
    files: [],
    settings: AuditSettings[],
    tags: Array<"attention_required" | "opportunity"| "diagnostics" | "passed_audits">,
}
