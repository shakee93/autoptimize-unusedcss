import { CpuIcon } from "lucide-react";
import { HermesAIBotIcon, NoteBookIcon, StarLockIcon, WorldIcon } from "../icons/icon-svg";

export const WelcomeScreen = () => (
  <div className="flex flex-col items-center justify-center p-6 bg-white text-gray-800">
    <div className="flex items-center justify-center mb-4">
      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-xl">
        <HermesAIBotIcon className="w-8 h-8" />
      </div>
    </div>

    <h2 className="text-2xl text-gray-900 mb-3 font-normal">
      <span className="font-bold">Hermes AI</span> by RapidLoad
    </h2>

    <p className="text-base font-normal select-none text-center text-gray-500 max-w-xl mb-6 leading-relaxed">
      A highly intelligent and responsive chatbot built to deliver real-time
      support, detailed troubleshooting, and personalized optimization tips.
      It ensures that websites achieve maximum performance and speed, helping
      users maintain smooth operations with minimal hassle.
    </p>

    <FeaturesList />
    <DeliveryTags />
  </div>
);

const FeaturesList = () => (
  <ul className="space-y-2 mb-6 text-gray-700">
    <li className="flex items-center gap-2">
      <WorldIcon className="w-6 h-5 text-purple-500"/> Natural Language conversations
    </li>
    <li className="flex items-center gap-2">
      <NoteBookIcon className="w-6 h-6 text-purple-500"/> Knowledge Base
    </li>
    <li className="flex items-center gap-2">
      <StarLockIcon className="w-6 h-6 text-purple-500"/> Personalized Recommendation
    </li>
    <li className="flex items-center gap-2">
      <CpuIcon className="w-6 h-6 text-purple-500"/> Seamless Integration
    </li>
  </ul>
);

const DeliveryTags = () => {
  const tags = ["CSS Delivery", "JS Delivery", "Image Delivery", "Font Delivery", "Page Cache", "CDN"];
  
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="px-3 py-1 text-sm rounded-full bg-gray-200 text-gray-700 cursor-pointer"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}; 