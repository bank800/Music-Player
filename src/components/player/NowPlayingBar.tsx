import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayerControls } from './PlayerControls';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { ChevronUp, Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NowPlayingBarProps {
  className?: string;
  onExpand?: () => void;
}

export const NowPlayingBar = ({ className, onExpand }: NowPlayingBarProps) => {
  const { currentTrack } = useMusicPlayer();

  if (!currentTrack) return null;

  return (
    <Card className={cn(
      'fixed bottom-0 left-0 right-0 z-50',
      'bg-player-surface/95 backdrop-blur-md border-t border-border',
      'shadow-player animate-slide-up',
      className
    )}>
      <div className="flex items-center justify-between p-4">
        {/* Track Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative">
            {currentTrack.coverUrl ? (
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                <Music className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 rounded-lg bg-black/20" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-player-text truncate">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-player-text-muted truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex justify-center max-w-md">
          <PlayerControls size="compact" />
        </div>

        {/* Expand Button */}
        <div className="flex-1 flex justify-end">
          {onExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
              className="h-8 w-8 p-0 text-player-text-muted hover:text-player-text"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};