
interface Window {
    rapidload_optimizer: WordPressOptions;
    uucss_global: uucssGlobal;
}
interface WordPressOptions {
    ajax_url: string
    optimizer_url: string
    page_optimizer_base: string
    page_optimizer_package_base: string
    plugin_url: string
    dashboard_url?: string
    nonce?: string
    timezone: string
    load_optimizer: boolean
    actions: RapidLoadGlobalAction[]
    admin_url?: string
    rapidload_version: string
    titan_stylesheet_url?: string
    api_root?: string
    rest_url: string
    license_key?: string
    test_mode?: boolean
    rapidload_titan_gear?: string
    ai_root?: string
}

type RapidLoadOptimizerModes = 'normal' | 'onboard' | 'preview'

interface RapidLoadOptimizerModeData {
    connect_url: string
    target?: string
}

interface RapidLoadGlobalAction {
    href: string
    icon: 'clear_cache' | 'clear_optimization' | 'clear_page_cache'
    tooltip: string
    loading?: boolean
}

interface Tab {
    key: AuditTypes;
    name: string;
    color: string
    activeColor: string
}

interface Help {
    help: boolean,
    title: string,
    content: string,
}


interface GeneralSettings {
    uucss_excluded_links: string[];
    rapidload_minify_html: boolean;
    uucss_query_string: boolean;
    preload_internal_links: boolean;
    uucss_enable_debug: boolean;
    uucss_jobs_per_queue: number;
    uucss_queue_interval: number;
    uucss_disable_add_to_queue: boolean;
    uucss_disable_add_to_re_queue: boolean;
}

interface Message {
    role: string;
    content: string;
}

interface Conversation {
    id: string;
    title: string;
    active: boolean;
    messages: Message[];
}

type SettingsCategory = 'cache' | 'cdn' | 'image' | 'javascript' | 'js' | 'font' | 'css';

declare const __OPTIMIZER_VERSION__: string