import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayerControls } from './PlayerControls';
import { TrackCard } from '../library/TrackCard';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { 
  ChevronDown, 
  Music, 
  ListMusic,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FullscreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullscreenPlayer = ({ isOpen, onClose }: FullscreenPlayerProps) => {
  const { currentTrack, queue } = useMusicPlayer();
  const [activeTab, setActiveTab] = useState<'player' | 'queue'>('player');

  if (!isOpen || !currentTrack) return null;

  return (
    <div className={cn(
      'fixed inset-0 z-50 bg-gradient-hero backdrop-blur-md',
      'transition-all duration-500 ease-out',
      isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
    )}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/10"
          >
            <ChevronDown className="h-5 w-5 mr-2" />
            Back
          </Button>

          <div className="flex space-x-1">
            <Button
              variant={activeTab === 'player' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('player')}
              className="text-white"
            >
              Now Playing
            </Button>
            <Button
              variant={activeTab === 'queue' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('queue')}
              className="text-white"
            >
              <ListMusic className="h-4 w-4 mr-2" />
              Queue ({queue.length})
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/10"
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'player' ? (
            <div className="h-full flex flex-col justify-center items-center p-8 space-y-8">
              {/* Album Art */}
              <div className="relative">
                {currentTrack.coverUrl ? (
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className={cn(
                      'w-80 h-80 rounded-2xl shadow-2xl object-cover',
                      'transform transition-transform duration-700',
                      'animate-vinyl-spin'
                    )}
                  />
                ) : (
                  <div className="w-80 h-80 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <Music className="h-32 w-32 text-white/50" />
                  </div>
                )}
                
                {/* Vinyl Record Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/5 to-transparent" />
              </div>

              {/* Track Info */}
              <div className="text-center space-y-2 max-w-md">
                <h1 className="text-3xl font-bold text-white truncate">
                  {currentTrack.title}
                </h1>
                <p className="text-xl text-white/70 truncate">
                  {currentTrack.artist}
                </p>
                <p className="text-sm text-white/50 truncate">
                  {currentTrack.album}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 hover:scale-110 transition-all"
                >
                  <Heart className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 hover:scale-110 transition-all"
                >
                  <MoreHorizontal className="h-6 w-6" />
                </Button>
              </div>

              {/* Player Controls */}
              <div className="w-full max-w-lg">
                <PlayerControls className="text-white" />
              </div>
            </div>
          ) : (
            <div className="h-full overflow-auto p-6">
              <div className="max-w-2xl mx-auto space-y-4">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Up Next
                </h2>
                
                {queue.length > 0 ? (
                  <div className="space-y-2">
                    {queue.map((track, index) => (
                      <TrackCard
                        key={`${track.id}-${index}`}
                        track={track}
                        isInQueue
                        queueIndex={index}
                        className="bg-white/5 border-white/10 hover:bg-white/10"
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center bg-white/5 border-white/10">
                    <ListMusic className="h-12 w-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/70">Your queue is empty</p>
                    <p className="text-sm text-white/50 mt-2">
                      Add tracks to see them here
                    </p>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};