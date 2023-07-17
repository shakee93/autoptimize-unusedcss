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
  const [opportunities, setOpportunities] = useState(null);
  const [metrics, setMetrics] = useState<Metrics[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);


  const fetchData = async () => {
    try {

      const fetchResponse = await fetch(`${window.uucss_global.ajax_url}?action=fetch_page_speed&url=${encodeURI(url)}`, {
        method: 'GET',
      });


      if (!fetchResponse.ok) {
        throw new Error('Error: ' + fetchResponse.status);
      }

      const responseData = await fetchResponse.json();
      setResponse(responseData);
      setOpportunities(responseData?.data?.opportunities)
      setMetrics(responseData?.data?.result?.Metrics)
    } catch (error) {
      console.error('Error:', error);
    }

  };

  useEffect(() => {
    setUrl('https://rapidload.io/');
    fetchData();

  },  []);

  useEffect(() => {
    console.log("Data: ", response);
    if (opportunities) {
      const updatedAudits = (opportunities as any[]).map((item: any) => {
        const audit: Audit = {
          id: item.id,
          title: item.title,
          icon: item?.icon,
          files: item.details.items.map((subItem: any) => {
            return {
              file_type : 'css',
                  totalBytes: subItem.totalBytes,
                url:subItem.url,
                wastedMs: subItem.wastedMs,
                options: [ { id: 1, label: 'None' },
              { id: 2, label: 'Defer' },
              { id: 3, label: 'User Interaction' }],

            }
          }),

          tags: ["attention_required", "opportunity", "diagnostics"],
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
          help: [
            {
              help: false,
              title: "How to fix properly size images ?",
              content:
                  "Page speed and properly sized images present a valuable opportunity for improving website performance and user experience. Loading time plays a crucial role in web performance, and optimizing page load speed can significantly enhance site responsiveness. Image optimization techniques such as compression, resizing, and format selection can effectively reduce file sizes, resulting in faster load times. By leveraging lazy loading and content delivery networks (CDNs), images can be loaded only when necessary, improving overall site speed.",
            },
          ],
        };

        return audit;
      });

      setAudits(updatedAudits);


    }

  },  [response, opportunities]);

  useEffect(()=>{
    if(audits.length > 0){
      console.log('Audits Data : ', audits);
    }
  }, [audits])

  const pagespeed: PageSpeed[] = [];

  useEffect(() => {

      if(metrics){

        pagespeed.push(
        {
          performance: 90,
          metrics: metrics,
        })
      console.log("PageSpeed: ", pagespeed);
      }
  },  [metrics]);

  // const audits: Audit[] = [];

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
              {audits.length > 0 &&
              <Audits activeTab={activeTab} audits={audits}/>}
            </div>
          </article>
        </section>

        <footer className='fixed bottom-10 right-10'>
          <ThemeSwitcher></ThemeSwitcher>
        </footer>
      </main>
  );
}
