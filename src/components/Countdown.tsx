import { useEffect, useRef, useState } from "react";

interface CountdownProps {
  duration: number;
  onComplete?: () => void;
  isActive?: boolean;
}

export const CountdownCircle: React.FC<CountdownProps> = ({
  duration,
  onComplete,
  isActive = true,
}) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const [remaining, setRemaining] = useState(duration);
  const requestRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isActive) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      return;
    }

    // Reset when duration changes or component becomes active
    setRemaining(duration);
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;

    const update = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const timeLeft = Math.max(0, duration - elapsed);

      setRemaining(timeLeft);

      if (timeLeft > 0) {
        requestRef.current = requestAnimationFrame(update);
      } else {
        onComplete?.();
      }
    };

    requestRef.current = requestAnimationFrame(update);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [duration, onComplete, isActive]);

  const progress = remaining / duration;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className="w-20 h-20 relative">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#10b981"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.1s ease-out",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-base font-semibold text-gray-800 dark:text-white">
        {Math.ceil(remaining)}s
      </div>
    </div>
  );
};
