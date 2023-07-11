import { useState } from "react";

import Header from "components/Header";
import PageSpeedScore from "components/performance-widgets/PageSpeedScore";
import {ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon} from "@heroicons/react/24/outline";
import ThemeSwitcher from "components/parts/theme-switcher";
import Card from "components/parts/card";
import Audits from "components/Audits";
import { useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<AuditTypes>("attention_required");
  const [togglePerformance, setTogglePerformance] = useState(false);
  const [url, setUrl] = useState("https://rapidload.io/");
  const [response, setResponse] = useState(null);

  const fetchData = async () => {
    try {

      const response = await fetch(`http://rapidload.local/wp-admin/admin-ajax.php?action=fetch_page_speed&url=${encodeURI(url)}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Error: ' + response.status);
      }

      const responseData = await response.json();
      setResponse(responseData);
      console.log("Data: ", responseData); // Handle the response data here
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    setUrl('https://rapidload.io/');

    fetchData();
  }, []);

  const pagespeed: PageSpeed[] = [
    {
      performance: 90,
      metrics: [
        {
          id: "first-contentful-paint",
          title: "LCP",
          description: "First Contentful Paint marks the time at which the first text or image is painted. [Learn more about the First Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/first-contentful-paint/).",
          displayValue: "1.9 s",
          icon: 'pass',
        },
        {
          id: "speed-index",
          title: "FID",
          description: "Speed Index shows how quickly the contents of a page are visibly populated. [Learn more about the Speed Index metric](https://developer.chrome.com/docs/lighthouse/performance/speed-index/).",
          displayValue: "4.0 s",
          icon: 'fail',
        },
        {
          id: "total-blocking-time",
          title: "CLS",
          description: "Sum of all time periods between FCP and Time to Interactive, when task length exceeded 50ms, expressed in milliseconds. [Learn more about the Total Blocking Time metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-total-blocking-time/).",
          displayValue: "6.0 s",
          icon: 'average',
        },
        {
          id: "largest-contentful-paint",
          title: "FCP",
          description: "Largest Contentful Paint marks the time at which the largest text or image is painted. [Learn more about the Largest Contentful Paint metric](https://developer.chrome.com/docs/lighthouse/performance/lighthouse-largest-contentful-paint/)",
          displayValue: "2.5 s",
          icon: 'fail',
        },
        {
          id: "cumulative-layout-shift",
          title: "INP",
          description: "Cumulative Layout Shift measures the movement of visible elements within the viewport. [Learn more about the Cumulative Layout Shift metric](https://web.dev/cls/).",
          displayValue: "0",
          icon: 'fail',
        }
      ],
    }
  ];
  const audits: Audit[] = [
    {
      name: "Eliminate render-blocking resources",
      icon: "fail",
      files: [
        {
          id: 1,
          file_type: "CSS",
          urls: "https://rapidload.io/..../autoptimize.css",
          trasnsfer_size: '136.4 KiB',
          potential_savings: '134 KiB',
          actions: '',
          options: [ { id: 1, label: 'None' },
            { id: 2, label: 'Defer' },
            { id: 3, label: 'User Interaction' }],
        },
        {
          id: 2,
          file_type: "CSS",
          urls: "https://rapidload.io/",
          trasnsfer_size: '100 KiB',
          potential_savings: '136.4 KiB',
          actions: '',
          options: [ { id: 1, label: 'None' },
            { id: 2, label: 'Defer' },
            { id: 3, label: 'User Interaction' }],
        },
        {
          id: 3,
          file_type: "CSS",
          urls: "https://rapidload.io/..../autoptimize.css",
          trasnsfer_size: '200.6 KiB',
          potential_savings: '300.7 KiB',
          actions: '',
          options: [ { id: 1, label: 'None' },
            { id: 2, label: 'Defer' },
            { id: 3, label: 'User Interaction' }],
        },
      ],
      settings: [
        {
          category: "css",
          name: "Generate critical CSS",
          ajax_action: "rapidload/settings/css/uucss",
          action: [
            {
              type: "checkbox",
            },
          ],
          settings: true,
          status: "progress",
        },

      ],
      tags: ["attention_required", "opportunity", "diagnostics"],
    },
    {
      name: "Reduce unused CSS",
      icon: "average",
      files: [
        {
          id: 1,
          file_type: "JS",
          urls: "https://rapidload.io/..../autoptimize.css",
          trasnsfer_size: '136.4 KiB',
          potential_savings: '134 KiB',
          actions: '',
          options: [ { id: 1, label: 'None' },
            { id: 2, label: 'Defer' },
            { id: 3, label: 'User Interaction' }],
        },
        {
          id: 2,
          file_type: "JS",
          urls: "https://rapidload.io/",
          trasnsfer_size: '100 KiB',
          potential_savings: '136.4 KiB',
          actions: '',
          options: [ { id: 1, label: 'None' },
            { id: 2, label: 'Defer' },
            { id: 3, label: 'User Interaction' }],
        },
        {
          id: 3,
          file_type: "JS",
          urls: "https://rapidload.io/..../autoptimize.css",
          trasnsfer_size: '200.6 KiB',
          potential_savings: '300.7 KiB',
          actions: '',
          options: [ { id: 1, label: 'None' },
            { id: 2, label: 'Defer' },
            { id: 3, label: 'User Interaction' }],
        },

      ],
      settings: [
        {
          category: "css",
          name: "Remove unused CSS",
          ajax_action: "rapidload/settings/css/uucss",
          action: [
            {
              type: "checkbox",
            },
          ],
          settings: true,
          status: "progress",
        },
        {
          category: "image",
          name: "Image compression level",
          ajax_action: "rapidload/settings/css/uucss",
          action: [
            {
              type: "checkbox",
            },
          ],
          settings: true,
          status: "live",
        },
      ],
      tags: ["attention_required", "opportunity", "diagnostics"],
    },
    {
      name: "Properly Sized Image",
      icon: "pass",
      files: [
        {
          id: 1,
          file_type: "JS",
          urls: "https://rapidload.io/..../autoptimize.css",
          trasnsfer_size: '136.4 KiB',
          potential_savings: '134 KiB',
          actions: '',
          options: [ { id: 1, label: 'None' },
            { id: 2, label: 'Defer' },
            { id: 3, label: 'User Interaction' }],
        },
        {
          id: 2,
          file_type: "JS",
          urls: "https://rapidload.io/",
          trasnsfer_size: '100 KiB',
          potential_savings: '136.4 KiB',
          actions: '',
          options: [ { id: 1, label: 'None' },
            { id: 2, label: 'Defer' },
            { id: 3, label: 'User Interaction' }],
        },
        {
          id: 3,
          file_type: "JS",
          urls: "https://rapidload.io/..../autoptimize.css",
          trasnsfer_size: '200.6 KiB',
          potential_savings: '300.7 KiB',
          actions: '',
          options: [ { id: 1, label: 'None' },
            { id: 2, label: 'Defer' },
            { id: 3, label: 'User Interaction' }],
        },

      ],
      settings: [
        {
          category: "css",
          name: "Properly Sized Image",
          ajax_action: "rapidload/settings/css/uucss",
          action: [
            {
              type: "checkbox",
            },
          ],
          settings: true,
          status: "progress",
        },
        {
          category: "css",
          name: "Properly Sized Image",
          ajax_action: "rapidload/settings/css/uucss",
          action: [
            {
              type: "checkbox",
            },
          ],
          settings: true,
          status: "live",
        },
        {
          category: "css",
          name: "Properly Sized Image",
          ajax_action: "rapidload/settings/css/uucss",
          action: [
            {
              type: "checkbox",
            },
          ],
          settings: true,
          status: "progress",
        },

      ],
      tags: ["attention_required", "opportunity"],
    },
  ];

  const tabs: Tab[] = [
    {
      key: "attention_required",
      name: "Attention Required",
    },
    {
      key: "opportunity",
      name: "Opportunity",
    },
    {
      key: "diagnostics",
      name: "Diagnostics",
    },
    {
      key: "passed_audits",
      name: "Passed Audits",
    },
  ];


  const renderTabs = () => {
    return tabs.map((tab) => {
      const isActive = activeTab === tab.key ? "font-medium border-b border-b-purple-750 text-black" : "text-gray-500/75";
      return (
          <div
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium  ${isActive}`}
              key={tab.key}
          >
            {tab.name}
          </div>
      );
    });
  };


  return (
      <main className="flex min-h-screen flex-col text-base items-center dark:text-white text-[#212427] dark:bg-zinc-900 bg-[#F7F9FA]">
        <Header url={url} />
        {/*<div>*/}
        {/*  <button onClick={fetchData}>Call</button>*/}
        {/*</div>*/}
        <section className="container grid grid-cols-12 gap-8 mt-12">
          {togglePerformance && (
              <aside className="col-span-3">
                <h2 className="text-lg ml-5">Performance</h2>
                <div className="widgets pt-4 flex">
                  <PageSpeedScore pagespeed={pagespeed[0]}/>
                </div>
              </aside>
          )}
          <article className={`${togglePerformance ? 'col-span-9' : 'col-span-12'}`}>
            <h2 className="text-lg ml-5 flex gap-2 font-medium items-center">
                        <span className='cursor-pointer' onClick={() => { setTogglePerformance(prev => !prev) }}>
                            {(togglePerformance) ? <ArrowLeftOnRectangleIcon className="h-4 w-4 text-gray-500" /> : <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-500" /> }
                        </span>
              Fix Performance issues</h2>
            <div className="tabs pt-4 flex">
              <Card padding='p-0 px-6' cls='flex cursor-pointer select-none'>
                {renderTabs()}
              </Card>
            </div>
            <div className="audits pt-4 flex">
              <Audits activeTab={activeTab} audits={audits}/>
            </div>
          </article>
        </section>

        <footer className='fixed bottom-10 right-10'>
          <ThemeSwitcher></ThemeSwitcher>
        </footer>
      </main>
  );
}
