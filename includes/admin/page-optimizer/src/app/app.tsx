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
      console.log("Data: " + responseData); // Handle the response data here
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    setUrl('https://rapidload.io/');

    fetchData();
  }, []);

  const audits: Audit[] = [
    {
      name: "Eliminate render-blocking resources",
      icon: "pass",
      files: [
        {
          id: 1,
          file_type: "CSS",
          urls: "https://rapidload.io/..../autoptimize.css",
          trasnsfer_size: '136.4 KiB',
          potential_savings: '134 KiB',
          actions: '',
        },
        {
          id: 2,
          file_type: "CSS",
          urls: "https://rapidload.io/",
          trasnsfer_size: '100 KiB',
          potential_savings: '136.4 KiB',
          actions: '',
        },
        {
          id: 3,
          file_type: "CSS",
          urls: "https://rapidload.io/..../autoptimize.css",
          trasnsfer_size: '200.6 KiB',
          potential_savings: '300.7 KiB',
          actions: '',
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
      ],
      tags: ["attention_required", "opportunity", "diagnostics"],
    },
    {
      name: "Reduce unused CSS",
      icon: "pass",
      files: [
        {
          id: 1,
          file_type: "JS",
          urls: "https://rapidload.io/..../autoptimize.css",
          trasnsfer_size: '136.4 KiB',
          potential_savings: '134 KiB',
          actions: '',
        },
        {
          id: 2,
          file_type: "JS",
          urls: "https://rapidload.io/",
          trasnsfer_size: '100 KiB',
          potential_savings: '136.4 KiB',
          actions: '',
        },
        {
          id: 3,
          file_type: "JS",
          urls: "https://rapidload.io/..../autoptimize.css",
          trasnsfer_size: '200.6 KiB',
          potential_savings: '300.7 KiB',
          actions: '',
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
        },
        {
          id: 2,
          file_type: "JS",
          urls: "https://rapidload.io/",
          trasnsfer_size: '100 KiB',
          potential_savings: '136.4 KiB',
          actions: '',
        },
        {
          id: 3,
          file_type: "JS",
          urls: "https://rapidload.io/..../autoptimize.css",
          trasnsfer_size: '200.6 KiB',
          potential_savings: '300.7 KiB',
          actions: '',
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
      const isActive = activeTab === tab.key ? "font-medium border-b border-b-[#9471c0] gray-tab text-black" : "text-gray-tab";
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
        <div>
          <button onClick={fetchData}>Call</button>
        </div>
        <section className="container grid grid-cols-12 gap-8 mt-12">
          {togglePerformance && (
              <aside className="col-span-3">
                <h2 className="text-lg ml-5">Performance</h2>
                <div className="widgets pt-4 flex">
                  <PageSpeedScore />
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
