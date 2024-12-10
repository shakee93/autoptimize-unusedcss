import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import ChatContainer from '../../../../components/Chat/ChatContainer';

const PageSpeedCoach: React.FC = () => {
    return (
        <div className="flex flex-col h-full">
            <h4 className="text-md font-semibold ml-4 flex gap-2 items-center mb-2">
                PageSpeed Coach <ChatBubbleLeftRightIcon className="w-5 h-5" />
            </h4>
            <div className="flex-grow overflow-hidden">
                <ChatContainer />
            </div>
        </div>
    );
};

export default React.memo(PageSpeedCoach);