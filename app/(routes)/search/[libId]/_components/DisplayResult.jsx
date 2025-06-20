import React, { useState } from 'react';
import {
    Sparkles as LucideSparkles,
    Image as LucideImage,
    Video as LucideVideo,
    List as LucideList,
} from 'lucide-react';

import AnswerDisplay from './AnswerDisplay';
import ImageDisplay from './ImageDisplay';
import VideoDisplay from './VideoDisplay';
import SourceDisplay from './SourceDisplay';

function DisplayResult({ searchInputRecord }) {
    const [activeTab, setActiveTab] = useState('Answer');

    const tabs = [
        { label: 'Answer', icon: LucideSparkles },
        { label: 'Images', icon: LucideImage },
        { label: 'Videos', icon: LucideVideo },
        { label: 'Sources', icon: LucideList, badge: 10 },
    ];

    return (
        <div>
            <h2 className="text-3xl font-medium line-clamp-2 max-w-[40%] mb-4">
                {searchInputRecord?.searchInput}
            </h2>

            {/* Tab navigation */}
            <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">
                {tabs.map(({ label, icon: Icon, badge }) => (
                    <button
                        key={label}
                        onClick={() => setActiveTab(label)}
                        className={`flex items-center gap-1 relative text-sm font-medium ${activeTab === label ? 'text-black' : 'text-gray-700'
                            } hover:text-black`}
                    >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                        {badge && (
                            <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                {badge}
                            </span>
                        )}
                        {activeTab === label && (
                            <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black rounded"></span>
                        )}
                    </button>
                ))}
                <div className="ml-auto text-sm text-gray-500">
                    1 task<span className="ml-1">↗</span>
                </div>
            </div>

            {/* Tab content */}
            <div className="mt-6">
                {activeTab === 'Answer' ? <AnswerDisplay /> : null}
                {activeTab === 'Images' ? <ImageDisplay /> : null}
                {activeTab === 'Videos' ? <VideoDisplay /> : null}
                {activeTab === 'Sources' ? <SourceDisplay /> : null}
            </div>
        </div>
    );
}

export default DisplayResult;
