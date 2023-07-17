
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

interface Audit{
    id: string,
    title: string,
    icon: string,
    files: AuditFile[],
    tags: Array<AuditTypes>,
    settings: AuditSettings[],
    help: Help[],

}
interface Window {
    uucss_global: {
        ajax_url: string;
        nonce: string;

    };
}