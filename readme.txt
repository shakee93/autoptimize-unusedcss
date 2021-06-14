=== RapidLoad Power-Up for Autoptimize ===
Contributors: shakee93, futtta
Donate link:
Tags: unusedcss, unused css, autoptimize, rapidload
Requires at least: 4.0
Tested up to: 5.7
Stable tag: trunk
Requires PHP: 5.4
License: GPLv3
License URI: [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)

Makes your site even faster and lighter by automatically removing Unused CSS from your website.

== Description ==

**Automated unused CSS removal for WordPress [PAID PREMIUM PLUGIN]**

Many Wordpress themes and plugins load all of their CSS **everywhere** by default - not just the places you need it. This slows down your website & damages the user experience… directly impacting your bottom line.

**RapidLoad can reduce CSS file sizes up to 95%**. It’s automatic too - which means it will continue removing UnusedCSS when users view your pages.

RapidLoad extends Autoptimize to automatically find CSS that’s not being used, then prevents it from loading on the page. By reducing the total CSS file size and page weight, RapidLoad can significantly reduce load times. It even improves the performance of other optimizing plugins and extensions, like CriticalCSS. RapidLoad for Autoptimize plugin integrates with the 3rd party service [rapidload.io API](https://rapidload.io) to remove unused CSS. (See [Pricing plans - https://rapidload.io/pricing](https://rapidload.io/pricing))

Simply install, activate the plugin, and follow the onboarding steps. This will quickly connect you to the [rapidload.io](https://rapidload.io) service, and you can see the results for yourself.

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/plugin-name` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the Settings->Plugin Name screen to configure the plugin
4. (Make your instructions match the desired user flow for activating and installing your plugin. Include any steps that might be needed for explanatory purposes)

== Frequently Asked Questions ==

= How much does it cost to purchase a license of RapidLoad and where can I buy one? =

You can purchase the license for as little as $10/m. Just sign up directly via [rapidload.io](https://rapidload.io) website.

= What are the Terms and Conditions of rapidload.io usage =

Read it here : [https://rapidload.io/terms-conditions/](https://rapidload.io/terms-conditions/)

= How does this plugin speed up my site? =

RapidLoad analyzes the content of your Wordpress pages and the CSS files used by your themes and plugins. It checks for CSS that is being loaded, but not applied and removes those unused CSS selectors from your files, reducing the overall file size and page weight. Smaller files = faster sites!

= Still seeing remove unused css flag in Google page speed insights ? =

Run a GPSI status test on your optimization url to confirm whether RapidLoad optimizations are properly reflected to public users. if it is pending it is because of the page cache in your site. clear your page cache and try again.

= My Site is broken after using RapidLoad. What can i do ? =

There is a possibility the page can be broken with RapidLoad as it does the removal automatically. you can easily fix broken elements with safelist rules. we recommend to turn on "Load Original CSS files" and add safelist rules. if you are not sure how to add safelist rules create a support ticket in [https://rapidload.zendesk.com/hc/en-us](https://rapidload.zendesk.com/hc/en-us) one of our support member will help you out .

= Do I need to run this every time I make a change? =

No! RapidLoad works in the background, so any new stylesheets that are added will be analyzed and optimized on the fly. Just set it and forget it!

= Will this plugin work with Woocommerce? =

Absolutely. RapidLoad works with Woocommerce, Woocommerce themes, and Woocommerce plugins.

= Will this plugin work with other caching plugins? =

RapidLoad works with all major caching plugins. If you are using a little known caching plugin and are experiencing issues with RapidLoad, please submit your issue and caching plugin name to our support team and we will review.

= How is this plugin different from CriticalCSS? =

RapidLoad looks for CSS that is not being applied at all and stops it from being loaded. CriticalCSS looks for CSS that needs to be applied when the page begins loading and reorders it based on priority.

= How do exclusions work? =

RapidLoad accepts both broad and star(*) expressions and regular expression exclusions of CSS selectors. You can add your exclusions in the unused CSS tab of the Autoptimize plugin settings.

== Screenshots ==

1. Analyze the site before connecting to the service.
2. Successfully completed jobs.
3. Google page speed insight + GTMetrix test.
4. RapidLoad options.

== Changelog ==

= 1.4.14 - 14/06/2021 =
 * improve: set default sitemap url from robots.txt

= 1.4.13 - 14/06/2021 =
 * feat: add Proxy Cache Purge plugin support
 * fix: options cleared on deactivation

= 1.4.12 - 10/06/2021 =
 * improve: Load original CSS as default option to prevent layout breaks
 * improve: rule based injection with regex pattern
 * fix: undefined is_product function in Woocommerce rule based injection
 * improve: add Cloudflare cache busting query param to RapidLoad

= 1.4.11 - 20/05/2021 =
 * feat: (beta) rule based injection

= 1.4.10 - 19/05/2021 =
 * feat: added select all option in optimization table
 * improve: support for wp super cache
 * improve: add option to disable requeue jobs on warnings
 * improve: handle jobs hanging in processing status
 * fix: url trailing slash with query param

= 1.4.9 - 04/05/2021 =
 * feat: add support to W3 Total Cache
 * improve: exclude elementor preview url from RapidLoad
 * fix: is_file warning File name is longer than allowed path length

= 1.4.8 - 27/04/2021 =
 * feat: add filter to disable original file name suffix
 * improve: exclude customizer from rapidload

= 1.4.7 - 22/04/2021 =
 * feat: add support to WP Super Cache plugin
 * improve: improved job queueing process

= 1.4.6 - 17/04/2021 =
 * improve: add filter to allow users to stop re-queueing jobs on fail or warnings
 * improve: clear page cache for failed jobs

= 1.4.5 - 17/04/2021 =
 * improve: improved job queueing process

= 1.4.4 - 15/04/2021 =
 * improve: improved job queueing process
 * improve: improved error handling for jobs

= 1.4.3 - 12/04/2021 =
 * feat: added new 'waiting' job status
 * improve: improved error handling for jobs

= 1.4.2 - 06/04/2021 =
 * fix: improved and faster job processing

= 1.4.1 - 05/04/2021 =
 * NOTE: It is recommended to update immediately to v1.4.1
 * ROLLBACK: rolling back to older queue processing method.

= 1.4.0 - 05/04/2021 =
 * NOTE: It is recommended to update immediately to v1.4
 * feat: improved and faster job processing

= 1.3.21 - 02/04/2021 =
 * improve: update filter stylesheet patch

= 1.3.20 - 02/04/2021 =
 * feat: removing unused css for inline css
 * feat: add support to Google Mod Page Speed plugin
 * improve: add filter to allow users to stop adding items to the queues dynamically

= 1.3.19 - 18/03/2021 =
 * feat: tested with WordPress 5.7
 * feat: add support to Yoast SEO plugin
 * feat: add support to Rankmath SEO plugin
 * feat: add option to requeue and remove multiple jobs
 * feat: add option to select jobs per page
 * feat: url and file exclusion with wild card expressions
 * improve: requeue when autoptimize cache cleared
 * fix: immediate jobs being held in processing

= 1.3.18 - 17/03/2021 =
 * fix: media update on load original css

= 1.3.17 - 16/03/2021 =
 * fix: Kinsta Cache clear cache

= 1.3.16 - 16/03/2021 =
 * feat: add support to WP Engine Cache plugin
 * feat: add support to Kinsta Cache plugin
 * fix: base dir double slash in url
 * fix: disable refresh table when popup is open
 * fix: null error on rapidload menu registration

= 1.3.15 - 03/03/2021 =
 * feat: add support to WP Fastest Cache plugin
 * feat: add support to Cookie Notice plugin
 * feat: add support to AUTOPTIMIZE_CACHE_CHILD_DIR constant
 * feat: inbuilt Faq section
 * fix: WP Rocket clear cache
 * improve: file path filtering on frontend

= 1.3.12 - 25/02/2021 =
 * feat: allow users to disable adding jobs to queue on user visits
 * feat: add support to WP Optimize plugin
 * feat: add support to Cloudflare plugin
 * feat: add support to Optimole plugin
 * improve: add cdn url filter
 * improve: file path filtering on frontend
 * fix: pending jobs status not reflecting properly
 * fix: allow non unicode url exclusion

= 1.3.11 - 18/02/2021 =
 * feat: server side paginate optimizations to improve performance
 * feat: allow users to view page speed insight tool withing GPSI success result
 * feat: allow users to remove, requeue jobs through extra actions in the optimizations table
 * fix: exclude URL option breaks when there is a query param
 * fix: logs are not being created on some servers

= 1.3.10 - 16/02/2021 =
 * fix: `is_plugin_active` is not defined

= 1.3.9 - 16/02/2021 =
 * feat: allow users to pass custom headers and query params to API request (Authentication)
 * feat: add support to LS Cache plugin
 * feat: allow users to add custom URLs
 * feat: allow users to add optimizations through sitemap
 * feat: add "Clear page cache" action to supported plugins in the optimization table
 * fix: some CDN URLs are firing warnings

= 1.3.8 - 12/02/2021 =
 * feat: log optimizations table errors
 * feat: allow pending jobs to be re-queued
 * improve: cache enabler plugin support
 * improve: wp-rocket plugin support
 * fix: index drop query throwing a warning

= 1.3.7 - 10/02/2021 =
 * improve: wp-rocket cache clearing
 * fix: some CDN URLs not being optimized
 * feat: allow URL column to add lengthier URLs
 * refactor: update text copies

= 1.3.6 =
 * feat: retry jobs with warnings couple of more times
 * feat: allow queued jobs to run immediately with "refresh button"
 * refactor: update text copies in the plugin
 * fix: run wp_enqueue_script callback at last as possible

= 1.3.5 =
 * feat: add debug mode to the plugin with logs.
 * refactor: move advanced settings option positions
 * feat: change option "Disable Cache busting" to "Cache busting" (enable)

= 1.3.4 =
 * refactor: temporarily remove GPSI article link

= 1.3.3 =
 * feat: allow user to disable cache busting
 * feat: view optimization status with google page speed insight and gtmetrix
 * feat: search exact url's in optimizations table
 * fix: first job is shows a blank result in onboarding
 * fix: optimized files not being injected when using CDN

= 1.3.2 =
 * fix: noscript link tags being marked as warnings
 * fix: show queue attempts when there are any
 * feat: add warning filter in optimizations filter
 * refactor: minor text updates

= 1.3.1 =
 * NOTE: refresh optimization jobs
 * fix: api options not being passed when job ran via the interval queue.
 * fix: page safelist options not being passed to the api via the interval queue.

= 1.3.0 =
 * feat: migrate to native php filesystem from wp filesystem
 * feat: increase the max limit of jobs per minute
 * feat: add warning when ao non-static option is enabled
 * fix: reduce queue retry attempts to 1
 * fix: extra trailing slash added on the content
 * refactor: minor text updates

= 1.2.6 =
 * feat: retry jobs in attempts when cache files are obsolete
 * feat: basic support to autoptimize non-static files
 * fix: handle database migration fails on plugin activation

= 1.2.5 =
 * fix: bug in : 0 files returned jobs marked as processing forever
 * fix: use WP_CONTENT_DIR constant to get the wp content dir

= 1.2.4 =
 * fix: console warnings in admin panel
 * fix: 0 files returned jobs marked as processing forever
 * fix: detect failed uucss cache directory creation
 * feat: add wp-rocket cache busting support to the api
 * feat [API]: supports url cache busting with headers/queries
 * feat [API]: api busts page caches by itself

= 1.2.3 =
 * fix: reduce varchar length to fix "The maximum column size is 767 bytes" error
 * fix: adds a wrong warning about excluded files as not found.
 * fix: run first job immediately without adding to the queue.

= 1.2.2 =
 * fix: exclude missing ao cache files from being optimized
 * fix: optimized google fonts are not being saved as css
 * feat: refresh jobs immediately on user request

= 1.2.1 =
 * feat: improve the optimizations table ui
 * fix: redirected urls are marked as 'processing'
 * fix: missing vertical scroll of the info tooltip

= 1.2.0 =
 * feat: multisite support added
 * feat: run jobs in queue
 * feat: specify the queue job interval and jobs per interval
 * feat: filter jobs with its status
 * feat: search job urls in optimizations
 * feat: add warnings when optimized files are missing
 * feat: wordpress filter hook to api request options
 * feat: button texts makes more sense now
 * feat: allow users to refresh optimizations within optimizations table
 * feat: show proper errors when activating with license key
 * fix: post blocklists not being sent to api
 * fix: license key verification fails for some users
 * fix: cron not working notification shown even with successful jobs

= 1.1.2 =
 * fix: blank option value doesn't clear the cache
 * fix: activating from blank api-key breaks the option values

= 1.1.1 =
 * fix: check for file permissions in plugin cache dir instead of the whole wp-content
 * feat : allow users to connect to the app with the license key as well
 * version : 1.0.18 === 1.1.1

= 1.1.0 =
 * feat: migrate from wp options api to wp table api to manage options - faster
 * feat: load original css on user interaction
 * feat: show job warnings
 * feat: only clear cache if required
 * feat: don’t clear cache on options update, requeue instead
 * feat: show queue status of jobs
 * feat: limit failed job retries to 5
 * feat: deactivate without redirecting to the app
 * feat: request for feedback on plugin deactivation
 * feat: analyze site before connecting to the api
 * fix: scrolling the body div in onboard
 * fix: do domain verification call only to options page
 * fix: load admin bar script with jQuery dependency

= 1.0.17 =
 * fix: clearing all caches on new page/post creation
 * fix: composer autoload file not being loaded on some servers
 * fix: autoptimize optimized files are not being injected with CDN usage

= 1.0.16 =
 * feat: add compatibility to wordpress 5.6
 * fix: don't strip lines in html
 * fix: broken remove rule icon in options fixed

= 1.0.15 =
 * fix: slash omitted in uucss job urls

= 1.0.14 =
 * fix: don't force auto close html tags

= 1.0.13 =
 * feat: improve getting current url in request
 * fix: homepage with latest posts not running the jobs

= 1.0.12 =
 * feat: improve inaccessible file system handling
 * feat: refresh styles and scripts with plugin version
 * fix: minor plugin option ui improvements

= 1.0.10 =
 * fix: `getallheaders` undefined on some servers

= 1.0.9 =
 * fix: plugin fails to access the wp filesystem breaks the activation

= 1.0.8 =
 * feat: update support links in plugin

= 1.0.7 =
 * fix: php warning in safelist option
 * feat: improve user agent detection

= 1.0.6 =
 * fix: simplehtmldom conflicts with other plugin

= 1.0.5.1 =
 * Rebranding with name RapidLoad
 * Animated logo added
