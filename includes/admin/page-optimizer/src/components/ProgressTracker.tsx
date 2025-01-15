import { LoaderIcon, CheckIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ProgressStep {
  duration: string;
  label: string;
  progress: number;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep?: number;
  onTimeUpdate?: (time: number) => void;
}

const durationToSeconds = (duration: string): number => {
  const match = duration.match(/(\d+)s/);
  return match ? parseInt(match[1], 10) : 0;
};

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ steps, currentStep = 0, onTimeUpdate }) => {
  const [totalRemainingTime, setTotalRemainingTime] = useState(
    steps.reduce((sum, step) => sum + durationToSeconds(step.duration), 0)
  );

  // Add this effect to update total time when any countdown changes
  useEffect(() => {
    const updateTotalTime = () => {
      const allCountdowns = document.querySelectorAll('[data-countdown]');
      const currentTotal = Array.from(allCountdowns)
        .reduce((sum, el) => sum + Number(el.textContent?.replace('s', '') || 0), 0);
      setTotalRemainingTime(currentTotal);
      onTimeUpdate?.(currentTotal);
    };

    document.addEventListener('countdownupdate', updateTotalTime);
    updateTotalTime();

    return () => {
      document.removeEventListener('countdownupdate', updateTotalTime);
    };
  }, [steps, onTimeUpdate]);

  const mainStep = steps[0];
  const remainingSteps = steps.slice(1);

  //console.log("Total time across all steps:", totalRemainingTime, "seconds");

  return (
    <div className="grid grid-cols-5 gap-4 w-full">
      
      {/* Main step */}
      <div className="col-span-1">
        <h3 className="text-sm font-medium text-gray-700 mb-2">1. Preparing</h3>
        <div className="border rounded-[10px] p-4">
          <ProgressItem
            duration={mainStep.duration}
            label={mainStep.label}
            progress={mainStep.progress}
            isActive={currentStep === 0}
          />
        </div>
      </div>

      {/* Secondary steps */}
      <div className="col-span-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">2. Collecting required data to diagnose</h3>
        <div className="border rounded-[10px]">
          <div className="grid grid-cols-4 divide-x divide-gray-200">
            {remainingSteps.map((step, index) => (
              <div key={index} className="p-4">
                <ProgressItem
                  duration={step.duration}
                  label={step.label}
                  progress={step.progress}
                  isActive={step.progress > 0}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProgressItemProps extends ProgressStep {
  isActive?: boolean;
}

const ProgressItem: React.FC<ProgressItemProps> = ({ duration, label, progress, isActive }) => {
  const [countdown, setCountdown] = useState(durationToSeconds(duration));
  const [showHangTight, setShowHangTight] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowHangTight(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Force an immediate DOM update after countdown changes
      const forceUpdate = setTimeout(() => {
        const event = new Event('countdownupdate');
        document.dispatchEvent(event);
      }, 0);

      return () => {
        if (timer) clearInterval(timer);
        clearTimeout(forceUpdate);
      };
    }
  }, [isActive, countdown]);

  return (
    <div className="flex flex-col">
      <div className="w-full bg-gray-200 rounded-full h-2 relative">
        <div
          className={`absolute left-0 top-0 h-2 rounded-full transition-all duration-300 ${
            progress === 100 || isActive ? 'bg-black' : 'bg-gray-300'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-xs text-gray-600 mt-2 flex gap-1 items-center">
        {progress === 100 ? (
          <>Completed <CheckIcon className="h-4 w-4 text-brand-950" /></>
        ) : showHangTight ? (
          <>Hang tight... {isActive && <LoaderIcon className="h-4 w-4 animate-spin" />}</>
        ) : (
          <span data-countdown>{countdown}s {isActive && <LoaderIcon className="h-4 w-4 animate-spin" />}</span>
        )}
      </span>
      <span className="text-xs text-gray-600 border-b border-gray-200 my-2 -mx-4"/>
      <span className="text-sm font-semibold text-gray-800">{label}</span>
    </div>
  );
};

export default ProgressTracker;
