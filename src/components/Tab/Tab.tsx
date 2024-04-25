import React, { useState } from "react";

interface ITab {
    content: React.ReactNode;
    title: string;
}

interface TabComponentProps {
    tabs: ITab[];
    handleTabChangeCallback?: (index: number) => void;
}

const Tab = ({ tabs, handleTabChangeCallback }: TabComponentProps) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        handleTabChangeCallback && handleTabChangeCallback(index);
    };

    return (
        <div role="tablist" className="tabs tabs-lifted">
            {tabs.map((tab, index) => (
                <React.Fragment key={index}>
                    <input style={{width: "max-content"}} type="radio" role="tab" className="tab" aria-label={tab.title} checked={activeTab === index} onChange={() => handleTabChange(index)} />
                    <div role="tabpanel" className={`tab-content bg-base-100 border-base-300 rounded-box p-6 ${activeTab === index ? "" : "hidden"}`}>
                        {tab.content}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default Tab;
