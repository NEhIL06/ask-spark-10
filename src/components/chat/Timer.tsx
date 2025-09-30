import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Clock, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  isActive: boolean;
  onTimeUp: () => void;
  onTick: (time: number) => void;
}

export function Timer({ timeRemaining, totalTime, isActive, onTimeUp, onTick }: TimerProps) {
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      const newTime = timeRemaining - 1;
      onTick(newTime);
      
      if (newTime <= 0) {
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemaining, isActive, onTimeUp, onTick]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const percentage = (timeRemaining / totalTime) * 100;
  const isUrgent = percentage < 20;

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isUrgent ? (
            <AlertCircle className="h-4 w-4 text-destructive animate-pulse" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
          <span
            className={cn(
              'text-sm font-medium tabular-nums',
              isUrgent ? 'text-destructive' : 'text-foreground'
            )}
          >
            {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {Math.round(percentage)}% remaining
        </span>
      </div>
      
      <Progress
        value={percentage}
        className={cn(
          'h-2 transition-all duration-300',
          isUrgent && 'animate-pulse'
        )}
        indicatorClassName={cn(
          isUrgent
            ? 'bg-destructive'
            : percentage < 50
            ? 'bg-warning'
            : 'bg-success'
        )}
      />
    </div>
  );
}
