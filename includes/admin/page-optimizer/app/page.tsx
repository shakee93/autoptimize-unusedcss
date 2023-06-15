"use client"
import { useState } from "react";

import Header from "@/components/Header";
import PageSpeedScore from "@/components/performance-widgets/PageSpeedScore";

export default function Home() {
    const [activeTab, setActiveTab] = useState("attention_required");
    const [url, setUrl] = useState("");

    const audits = [
        {
            name: "Eliminate render-blocking resources",
            icon: "",
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

    const changeTab = (tab: Tab) => {
        setActiveTab(tab.key);
    };

    const renderTabs = () => {
        return tabs.map((tab) => {
            const isActive = activeTab === tab.key ? "font-normal border-b border-b-[#9471c0]" : "font-light";
            return (
                <div
                    onClick={() => changeTab(tab)}
                    className={`px-4 py-4 text-sm  ${isActive}`}
                    key={tab.key}
                >
                    {tab.name}
                </div>
            );
        });
    };

    return (
        <main className="flex min-h-screen flex-col text-base items-center dark:text-white text-[#212427] dark:bg-[#202123] bg-[#F7F9FA]">
            <Header url="https://rapidload.io/home" />

            <section className="container grid grid-cols-12 gap-8 mt-12">
                <aside className="col-span-4">
                    <h2 className="text-lg ml-5">Performance</h2>
                    <div className="widgets pt-4 flex">
                        <PageSpeedScore />
                    </div>
                </aside>
                <article className="col-span-8">
                    <h2 className="text-lg ml-5">Fix Performance issues</h2>
                    <div className="tabs pt-4 flex">
                        <div className="bg-white border w-full rounded-2xl px-6 flex gap-4 cursor-pointer">
                            {renderTabs()}
                        </div>
                    </div>
                    <div className="audits pt-4 flex">
                        <div className="bg-white border w-full rounded-2xl p-4">all audits comes here</div>
                    </div>
                </article>
            </section>

            <footer></footer>
        </main>
    );
}
