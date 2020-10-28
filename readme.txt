=== UnusedCSS Power-Up for Autoptimize ===
Contributors: Shakeeb Sadikeen, futtta
Donate link:
Tags: unusedcss, unused css, autoptimize
Requires at least: 4.0
Tested up to: 5.5
Stable tag: trunk
Requires PHP: 5.4
License: GPLv3
License URI: [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)

Makes your site even faster and lighter by automatically removing Unused CSS from your website.

== Description ==

**Automated UnusedCSS removal for WordPress**
â˜…â˜…â˜…â˜…â˜…<br>

Many Wordpress themes and plugins load all of their CSS everywhere by default - not just the places you need it. Why make your user load (and wait for) code they don’t need?

UnusedCSS extends Autoptimize to automatically find CSS that is not being used and prevent it from being unnecessarily loaded on the page. By reducing the total CSS file size and total page weight, UnusedCSS can significantly reduce load times and even improve the performance of other optimizing plugins and extensions, such as CriticalCSS.

Simply install and activate the plugin (you will need to have Autoptimize up and running), connect & activate ([unusedcss.io](http://unusedcss.io/)) your plugin, and then start your first job rest will be taken care by the plugin.

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/plugin-name` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the Settings->Plugin Name screen to configure the plugin
4. (Make your instructions match the desired user flow for activating and installing your plugin. Include any steps that might be needed for explanatory purposes)

== Frequently Asked Questions ==

= How does this plugin speed up my site? =

UnusedCSS analyzes the content of your Wordpress pages and the CSS files used by your themes and plugins. It checks for CSS that is being loaded, but not applied and removes those unused CSS selectors from your files, reducing the overall file size and page weight. Smaller files = faster sites!

= Do I need to run this every time I make a change? =

No! UnusedCSS works in the background, so any new stylesheets that are added will be analyzed and optimized on the fly. Just set it and forget it!

= Will this plugin work with Woocommerce? =

Absolutely. UnusedCSS works with Woocommerce, Woocommerce themes, and Woocommerce plugins.

= Will this plugin work with other caching plugins? =

UnusedCSS works with all major caching plugins. If you are using a little known caching plugin and are experiencing issues with UnusedCSS, please submit your issue and caching plugin name to our support team and we will review.

= How is this plugin different from CriticalCSS? =

UnusedCSS looks for CSS that is not being applied at all and stops it from being loaded. CriticalCSS looks for CSS that needs to be applied when the page begins loading and reorders it based on priority.

= How do exclusions work? =

UnusedCSS accepts both broad and RegEx exclusions of CSS selectors. You can add your exclusions in the UnusedCSS tab of the Autoptimize plugin settings.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif).
2. This is the second screen shot

== Changelog ==

== Upgrade Notice ==