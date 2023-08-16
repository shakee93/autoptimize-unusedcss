import {
    RowData
} from "@tanstack/react-table";

interface Window {

    rapidload_optimizer : WordPressOptions
}

interface WordPressOptions {
    ajax_url: string
    optimizer_url: string
    page_optimizer_base: string
    plugin_url: string
    nonce?: string
    timezone: string
}

interface Tab {
    key: AuditTypes;
    name: string;
    color: string
    activeColor: string
}

interface Help{
    help: boolean,
    title : string,
    content: string,
}

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        title: string
        type?: string
    }
}

