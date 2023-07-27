
interface Window {
    rapidload : WordPressOptions
}

interface WordPressOptions {
    ajax_url: string
    optimizer_url: string
    page_optimizer_base: string
    plugin_url: string
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

