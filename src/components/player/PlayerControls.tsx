import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Shuffle, 
  Repeat,
  Loader2
} from 'lucide-react';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { cn } from '@/lib/utils';

interface PlayerControlsProps {
  className?: string;
  size?: 'compact' | 'full';
}

export const PlayerControls = ({ className, size = 'full' }: PlayerControlsProps) => {
  const { playerState, actions, isPlaying, isLoading } = useMusicPlayer();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isCompact = size === 'compact';

  return (
    <div className={cn('flex flex-col items-center space-y-3', className)}>
      {/* Main Controls */}
      <div className="flex items-center space-x-4">
        {!isCompact && (
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.toggleShuffle}
            className={cn(
              'h-8 w-8 p-0 text-player-text-muted hover:text-player-text transition-colors',
              playerState.isShuffling && 'text-primary'
            )}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={actions.previous}
          disabled={!playerState.currentTrack}
          className="h-8 w-8 p-0 text-player-text-muted hover:text-player-text disabled:opacity-40 transition-colors"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          onClick={actions.togglePlayPause}
          disabled={!playerState.currentTrack || isLoading}
          className={cn(
            'h-12 w-12 rounded-full bg-primary hover:bg-primary-glow text-primary-foreground',
            'hover:scale-105 transition-all duration-200 shadow-glow',
            isCompact && 'h-10 w-10'
          )}
        >
          {isLoading ? (
            <Loader2 className={cn('h-5 w-5 animate-spin', isCompact && 'h-4 w-4')} />
          ) : isPlaying ? (
            <Pause className={cn('h-5 w-5', isCompact && 'h-4 w-4')} />
          ) : (
            <Play className={cn('h-5 w-5 ml-0.5', isCompact && 'h-4 w-4')} />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={actions.next}
          disabled={!playerState.currentTrack}
          className="h-8 w-8 p-0 text-player-text-muted hover:text-player-text disabled:opacity-40 transition-colors"
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        {!isCompact && (
          <Button
            variant="ghost"
            size="sm"
            onClick={actions.toggleRepeat}
            className={cn(
              'h-8 w-8 p-0 text-player-text-muted hover:text-player-text transition-colors',
              playerState.isRepeating && 'text-primary'
            )}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Progress Bar (only in full mode) */}
      {!isCompact && (
        <div className="flex items-center space-x-3 w-full max-w-md">
          <span className="text-xs text-player-text-muted min-w-[3rem] text-right">
            {formatTime(playerState.progress.currentTime)}
          </span>
          
          <Slider
            value={[playerState.progress.percentage]}
            onValueChange={([value]) => actions.seekTo(value)}
            max={100}
            step={0.1}
            className="flex-1 cursor-pointer"
            disabled={!playerState.currentTrack}
          />
          
          <span className="text-xs text-player-text-muted min-w-[3rem]">
            {formatTime(playerState.progress.duration)}
          </span>
        </div>
      )}

      {/* Volume Control (only in full mode) */}
      {!isCompact && (
        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-player-text-muted" />
          <Slider
            value={[playerState.volume * 100]}
            onValueChange={([value]) => actions.setVolume(value / 100)}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      )}
    </div>
  );
};