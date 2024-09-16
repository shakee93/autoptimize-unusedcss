
interface Window {
    rapidload_optimizer: WordPressOptions;
}
interface WordPressOptions {
    ajax_url: string
    optimizer_url: string
    page_optimizer_base: string
    page_optimizer_package_base : string
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
}

type RapidLoadOptimizerModes ='normal' | 'onboard' | 'preview'

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

interface Help{
    help: boolean,
    title : string,
    content: string,
}

type SettingsCategory = 'cache' | 'cdn' | 'image' | 'javascript' | 'js' | 'font' | 'css';

declare const __OPTIMIZER_VERSION__ : string