
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

interface AuditFile  {
    id: number,
    file_type: string,
    urls: string,
    trasnsfer_size: string,
    potential_savings: string,
    actions: string,
}

interface Audit {
    name: string,
    icon: 'pass' | 'fail' | 'average',
    files: AuditFile[],
    settings: AuditSettings[],
    tags: Array<AuditTypes>,
}
