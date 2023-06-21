"use client"
import { useState } from "react";

import Header from "@/components/Header";
import PageSpeedScore from "@/components/performance-widgets/PageSpeedScore";
import {ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon} from "@heroicons/react/24/outline";
import ThemeSwitcher from "@/components/parts/theme-switcher";
import Card from "@/components/parts/card";
import Audits from "@/components/Audits";

export default function Home() {
    const [activeTab, setActiveTab] = useState<AuditTypes>("attention_required");
    const [togglePerformance, setTogglePerformance] = useState(false);
    const [url, setUrl] = useState("https://rapidload.io/home");

    const tableData = [
        { id: 1, file_type: "CSS", urls: "https://rapidload.io/..../autoptimize.css", trasnsfer_size: '136.4 KiB', potential_savings: '134 KiB', actions: '' },
        { id: 2, file_type: "CSS", urls: "https://rapidload.io/", trasnsfer_size: '100 KiB', potential_savings: '136.4 KiB', actions: '' },
        { id: 3, file_type: "CSS", urls: "https://rapidload.io/..../autoptimize.css", trasnsfer_size: '200.6 KiB', potential_savings: '300.7 KiB', actions: '' },
    ];

    const audits: Audit[] = [
        {
            name: "Eliminate render-blocking resources",
            icon: "pass",
            files: [],
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
            files: [],
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
            const isActive = activeTab === tab.key ? "font-normal border-b border-b-[#9471c0]" : "font-light";
            return (
                <div
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-4 py-3 text-sm ${isActive}`}
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
                    <h2 className="text-lg ml-5 flex gap-2 items-center">
                        <span className='cursor-pointer' onClick={() => { setTogglePerformance(prev => !prev) }}>
                            {(togglePerformance) ? <ArrowLeftOnRectangleIcon className="h-4 w-4 text-gray-500" /> : <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-500" /> }
                        </span>
                        Fix Performance issues</h2>
                    <div className="tabs pt-4 flex">
                        <Card cls='flex py-0 px-6 cursor-pointer select-none'>
                            {renderTabs()}
                        </Card>
                    </div>
                    <div className="audits pt-4 flex">
                        <Audits activeTab={activeTab} audits={audits} tableData={tableData}/>
                    </div>
                </article>
            </section>

            <footer className='fixed bottom-10 right-10'>
                <ThemeSwitcher></ThemeSwitcher>
            </footer>
        </main>
    );
}
