# RapidLoad WordPress Hooks

This document lists all WordPress hooks (actions and filters) used in the RapidLoad plugin's modules.

## Core Hooks

### Actions
- `plugins_loaded` - Initialize plugin functionality
- `wp_initialize_site` - Initialize database tables for new site
- `wp_uninitialize_site` - Clean up database tables when site is deleted
- `rest_api_init` - Initialize REST API endpoints
- `wp_enqueue_scripts` - Enqueue frontend scripts and styles

### Filters
- `determine_current_user` - Handle user determination for preview mode
- `plugin_row_meta` - Add plugin meta links
- `plugin_action_links` - Add plugin action links
- `uucss/enqueue/content` - Filter content during enqueue
- `uucss/cache-base-dir` - Filter cache base directory

## Third-Party Plugin Compatibility

### Actions
- `kinsta_cache_init` - Initialize Kinsta cache compatibility
- `autoptimize_action_cachepurged` - Handle Autoptimize cache purge
- `uucss/cached` - Handle various cache plugins when content is cached
- `uucss/cache_cleared` - Handle various cache plugins when cache is cleared

### Filters
- `wpsc_protected_directories` - Add CSS files to WP Super Cache protected directories
- `uucss/sitemap-path` - Handle sitemap paths for SEO plugins (Yoast, RankMath)
- `uucss/url/exclude` - Handle URL exclusions for various plugins
- `uucss/cache/bust` - Handle cache busting for various plugins
- `uucss/enabled` - Control plugin functionality based on other plugins
- `uucss/enqueue/before/wrap-inline-js` - Handle inline JS wrapping
- `rapidload/image/exclude_from_modern_image_format` - Exclude images from modern format conversion

## Database Module

### Actions
- `wp_initialize_site` - Initialize database tables for new site
- `wp_uninitialize_site` - Clean up database tables when site is deleted
- `wp_ajax_rapidload_db_update` - Handle database updates via AJAX

## Enqueue Module

### Actions
- `wp_enqueue_scripts` - Handle script and style enqueuing

### Filters
- `uucss/enqueue/content` - Filter content during enqueue
- `uucss/enqueue/content/update` - Update content during enqueue
- `uucss/enqueue/before/wrap-inline-js` - Handle inline JS wrapping

## Cache Module

### Actions
- `wp_initialize_site` - Install cache functionality when a new site is initialized
- `wp_uninitialize_site` - Uninstall cache when a site is uninitialized
- `upgrader_process_complete` - Handle cache when upgrades are completed
- `save_post` - Clear cache when a post is saved
- `pre_post_update` - Handle cache before a post is updated
- `wp_trash_post` - Clear cache when a post is trashed
- `comment_post` - Handle cache when a comment is posted
- `edit_comment` - Handle cache when a comment is edited
- `transition_comment_status` - Handle cache when comment status changes
- `saved_term` - Handle cache when a term is saved
- `edit_terms` - Handle cache when terms are edited
- `delete_term` - Handle cache when a term is deleted
- `user_register` - Handle cache when a user registers
- `profile_update` - Handle cache when a user profile is updated
- `delete_user` - Handle cache when a user is deleted
- `deleted_user` - Handle cache when a user is deleted
- `rapidload_cache_clear_complete_cache` - Clear complete cache
- `rapidload_cache_clear_site_cache` - Clear site cache
- `rapidload_cache_clear_expired_cache` - Clear expired cache
- `rapidload_cache_clear_page_cache_by_post` - Clear page cache by post
- `rapidload_cache_clear_page_cache_by_url` - Clear page cache by URL
- `rapidload_cache_page_cache_created` - Handle when page cache is created
- `rapidload_cache_site_cache_cleared` - Handle when site cache is cleared
- `rapidload_cache_page_cache_cleared` - Handle when page cache is cleared
- `admin_bar_menu` - Add cache-related items to admin bar

### Filters
- `uucss/notifications` - Add cache-related notifications
- `uucss/third-party/plugins` - Add RapidLoad to third-party plugins list
- `uucss/enqueue/content/update` - Update content during enqueue
- `rapidload/active-module/options` - Update module options

## CSS Modules

### Critical CSS

#### Actions
- `wp_ajax_cpcss_purge_url` - Handle AJAX purge URL request
- `uucss/options/css` - Render CSS options
- `cpcss_async_queue` - Initialize async store
- `rapidload/vanish` - Handle vanish action
- `rapidload/vanish/css` - Handle CSS-specific vanish
- `rapidload/job/purge` - Handle job purge
- `rapidload/job/handle` - Handle various job actions
- `rapidload/job/updated` - Handle job updates
- `rapidload/cdn/validated` - Update CDN URLs in cached files
- `rapidload/admin-bar-actions` - Add admin bar actions
- `rapidload/cpcss/job/handle` - Handle CPCSS jobs
- `save_post` - Cache on post actions
- `untrash_post` - Cache on untrash
- `wp_trash_post` - Clear on trash

### Unused CSS

#### Actions
- `template_redirect` - Handle 404 fallback
- `add_meta_boxes` - Add meta boxes
- `save_post` - Save meta box options
- `rapidload/uucss/job/handle` - Initialize UUCSS job

#### Filters
- `uucss/link` - Update links
- `uucss/enqueue/cache-file-url` - Handle cache file URLs

### Minify CSS

#### Actions
- `cron_rapidload_minify_css_storage_clean` - Clean minify file storage
- `rapidload/job/handle` - Handle minification
- `rapidload/vanish` - Handle vanish action
- `rapidload/vanish/css` - Handle CSS-specific vanish

#### Filters
- `uucss/enqueue/css-minified-url` - Handle minified CSS URLs
- `rapidload/cpcss/minify` - Handle CPCSS minification

## JavaScript Module

### Actions
- `rapidload/vanish/js` - Handle JavaScript vanish action
- `rapidload/admin-bar-actions` - Add admin bar actions

### Filters
- `rapidload/js/excluded-files` - Handle excluded JavaScript files
- `rapidload/delay-script/enable` - Enable script delay

## Font Module

### Actions
- `rapidload/job/handle` - Handle font optimization
- `rapidload/vanish` - Handle vanish action
- `rapidload/vanish/font` - Handle font-specific vanish
- `rapidload/admin-bar-actions` - Add admin bar actions
- `rapidload/cdn/validated` - Update CDN URLs in cached files

### Filters
- `rapidload/cpcss/minify` - Add display swap to inline styles
- `uucss/excluded-files` - Exclude Google fonts from UUCSS
- `rapidload/cache_file_creating/css` - Add display swap to inline styles
- `rapidload/webfont/handle` - Handle web font JavaScript

## CDN Module

### Actions
- `wp_ajax_validate_cdn` - Validate CDN for logged-in users
- `wp_ajax_nopriv_validate_cdn` - Validate CDN for non-logged-in users
- `rapidload/validate-cdn` - Validate CDN
- `rapidload/job/handle` - Replace CDN HTML
- `rapidload/vanish` - Handle vanish action

### Filters
- `uucss/enqueue/cdn` - Replace CDN URL
- `rapidload/cdn/enabled` - Check if CDN is enabled
- `rapidload/cache_file_creating/css` - Replace CDN for CSS content

## Image Module

### Actions
- `wp_footer` - Enqueue frontend JavaScript
- `rapidload/job/handle` - Optimize images

### Filters
- `intermediate_image_sizes_advanced` - Handle image sizes
- `rapidload/cache_file_creating/css` - Optimize CSS file images

## HTML Module

### Actions
- `rapidload/job/handle` - Minify HTML

### Filters
- `uucss/enqueue/content/update` - Update content during enqueue

## Link Preload Module

### Actions
- `rapidload/job/handle` - Preload links

### Filters
- `uucss/enqueue/content/update` - Update content during enqueue 