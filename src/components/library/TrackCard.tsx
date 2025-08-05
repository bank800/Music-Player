import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Track } from '@/types/music';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { Play, Pause, Music, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackCardProps {
  track: Track;
  className?: string;
  isInQueue?: boolean;
  queueIndex?: number;
}

export const TrackCard = ({ track, className, isInQueue, queueIndex }: TrackCardProps) => {
  const { currentTrack, isPlaying, actions } = useMusicPlayer();
  const isCurrentTrack = currentTrack?.id === track.id;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = () => {
    if (isInQueue && queueIndex !== undefined) {
      // If track is in queue, just play from that position
      actions.playTrack(track);
    } else {
      // Otherwise set as new queue with this track
      actions.setQueue([track], 0);
      actions.playTrack(track);
    }
  };

  return (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-300',
      'hover:bg-muted/50 hover:shadow-card hover:scale-[1.02]',
      isCurrentTrack && 'ring-2 ring-primary shadow-glow',
      className
    )}>
      <div className="flex items-center p-3 space-x-3">
        {/* Track Number or Play Button */}
        <div className="relative w-10 flex items-center justify-center">
          {queueIndex !== undefined && !isCurrentTrack && (
            <span className="text-sm text-muted-foreground group-hover:opacity-0 transition-opacity">
              {queueIndex + 1}
            </span>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={isCurrentTrack ? actions.togglePlayPause : handlePlayTrack}
            className={cn(
              'absolute h-8 w-8 p-0 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground',
              'transition-all duration-200 scale-0 group-hover:scale-100',
              isCurrentTrack && 'scale-100 bg-primary text-primary-foreground'
            )}
          >
            {isCurrentTrack && isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </Button>
        </div>

        {/* Album Art */}
        <div className="relative">
          {track.coverUrl ? (
            <img
              src={track.coverUrl}
              alt={track.title}
              className="w-12 h-12 rounded-md object-cover shadow-md"
            />
          ) : (
            <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
              <Music className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          
          {isCurrentTrack && (
            <div className="absolute inset-0 rounded-md bg-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'text-sm font-medium truncate transition-colors',
            isCurrentTrack ? 'text-primary' : 'text-foreground'
          )}>
            {track.title}
          </h4>
          <p className="text-xs text-muted-foreground truncate">
            {track.artist} • {track.album}
          </p>
        </div>

        {/* Duration */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            {formatDuration(track.duration)}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
