import {Dispatch, SetStateAction, useState} from "react";

import Header from "components/Header";
import PageSpeedScore from "components/performance-widgets/PageSpeedScore";
import {ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon} from "@heroicons/react/24/outline";
import ThemeSwitcher from "components/parts/theme-switcher";
import Card from "components/parts/card";
import Audits from "components/Audits";
import { useEffect } from 'react';
import SpeedPopover from "app/speed-popover";
import {useSelector} from "react-redux";
import {RootState} from "../../store/reducers";
import {useOptimizerContext} from "../../context/root";

export default function PageOptimizer() {
    const [activeTab, setActiveTab] = useState<AuditTypes>("opportunities");
    const [togglePerformance, setTogglePerformance] = useState(false);
    const {data, error, loading} = useSelector((state: RootState) => state.app);
    const {options} = useOptimizerContext()

    const tabs: Tab[] = [
        {
            key: "opportunities",
            name: "Opportunities",
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
                    className={`px-4 py-3 text-sm font-medium ${isActive}`}
                    key={tab.key}
                >
                    {tab.name}
                </div>
            );
        });
    };


    return (
        <div className="overflow-auto fixed z-[100000] w-screen h-screen top-0 left-0 flex min-h-screen flex-col text-base items-center dark:text-white text-[#212427] dark:bg-zinc-900 bg-[#F7F9FA]">
            <Header url={options.optimizer_url} />
            <section className="container grid grid-cols-12 gap-8 mt-12">
                {togglePerformance && (
                    <aside className="col-span-3">
                        <h2 className="text-lg ml-5">Performance</h2>
                        <div className="widgets pt-4 flex">
                            {/*<PageSpeedScore pagespeed={pagespeed[0]}/>*/}
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
                        {(data?.data && data?.data.audits.length > 0) &&
                            <Audits activeTab={activeTab} audits={data?.data.grouped[`${activeTab}`] }/>}
                    </div>
                </article>
            </section>

            <footer className='fixed bottom-10 right-10'>
                <ThemeSwitcher></ThemeSwitcher>
            </footer>
        </div>
    );
}
