=== UnusedCSS Power-Up for Autoptimize ===
Contributors: shakee93, futtta
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

Many Wordpress themes and plugins load all of their CSS **everywhere** by default - not just the places you need it. Why make your visitor wait for code to load when they don’t even need it?

UnusedCSS extends Autoptimize to automatically find CSS that’s not being used and prevents it from unnecessarily loading on the page. By reducing the total CSS file size and total page weight, UnusedCSS can significantly reduce load times. It even improves the performance of other optimizing plugins and extensions, like CriticalCSS.  For this purpose, this plugin integrates with (UnusedCSS.io)[https://unusedcss.io], a 3rd party service, to have it generate UnusedCSS for your website. (See [FAQ section for pricing and terms](#faq)

Simply install and activate the plugin and follow the onboarding steps. This will connect you to the [UnusedCSS.io](https://unusedcss.io) service, so you can start your first job and see the results for yourself.

**UnusedCSS can reduce CSS file sizes up to 95%**. It will continue removing UnusedCSS when users view your pages.

[UnusedCSS.io](https://unusedcss.io)

== Installation ==

This section describes how to install the plugin and get it working.

e.g.

1. Upload the plugin files to the `/wp-content/plugins/plugin-name` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the Settings->Plugin Name screen to configure the plugin
4. (Make your instructions match the desired user flow for activating and installing your plugin. Include any steps that might be needed for explanatory purposes)

== Frequently Asked Questions ==

= How much does it cost to purchase a license of UnusedCSS and where can I buy one? =

You can purchase the license for $9.99/m. Just sign up directly via [UnusedCSS.io](https://unusedcss.io) website.

= What are the Terms and Conditions of UnusedCSS.io usage =

Read it here : [https://unusedcss.io/terms-conditions/](https://unusedcss.io/terms-conditions/)

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

UnusedCSS accepts both broad and star(*) expressions and regular expression exclusions of CSS selectors. You can add your exclusions in the UnusedCSS tab of the Autoptimize plugin settings.

== Screenshots ==

1. This screen shot description.
2. This is the second screen shot

== Changelog ==

== Upgrade Notice ==