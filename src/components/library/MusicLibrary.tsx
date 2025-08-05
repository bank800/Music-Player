import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrackCard } from './TrackCard';
import { useMusicSources } from '@/hooks/useMusicSources';
import { useMusicPlayer } from '@/hooks/useMusicPlayer';
import { Track, MusicSource } from '@/types/music';
import { Search, Play, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MusicLibrary = () => {
  const { tracks, loading, error, reload, searchTracks } = useMusicSources();
  const { actions } = useMusicPlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [selectedSource, setSelectedSource] = useState<MusicSource | 'all'>('all');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredTracks([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchTracks(query);
      setFilteredTracks(results);
    } finally {
      setIsSearching(false);
    }
  };

  const displayTracks = searchQuery ? filteredTracks : tracks;
  const sourceTracks = selectedSource === 'all' 
    ? displayTracks 
    : displayTracks.filter(track => track.source === selectedSource);

  const localTracks = tracks.filter(t => t.source === MusicSource.LOCAL);
  const spotifyTracks = tracks.filter(t => t.source === MusicSource.SPOTIFY);

  const playAllTracks = () => {
    if (sourceTracks.length > 0) {
      actions.setQueue(sourceTracks, 0);
      actions.playTrack(sourceTracks[0]);
    }
  };

  const getSourceIcon = (source: MusicSource) => {
    switch (source) {
      case MusicSource.LOCAL:
        return '📁';
      case MusicSource.SPOTIFY:
        return '🎵';
      default:
        return '🎶';
    }
  };

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive mb-4">Failed to load music library: {error}</p>
        <Button onClick={reload} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Music Library
          </h1>
          <p className="text-muted-foreground mt-1">
            {tracks.length} tracks from {localTracks.length > 0 && spotifyTracks.length > 0 ? 'multiple' : localTracks.length > 0 ? 'local' : 'streaming'} sources
          </p>
        </div>

        {sourceTracks.length > 0 && (
          <Button onClick={playAllTracks} className="bg-gradient-primary hover:opacity-90">
            <Play className="h-4 w-4 mr-2" />
            Play All
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tracks, artists, albums..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin" />
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedSource === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSource('all')}
            >
              All Sources
            </Button>
            {localTracks.length > 0 && (
              <Button
                variant={selectedSource === MusicSource.LOCAL ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSource(MusicSource.LOCAL)}
              >
                {getSourceIcon(MusicSource.LOCAL)} Local
              </Button>
            )}
            {spotifyTracks.length > 0 && (
              <Button
                variant={selectedSource === MusicSource.SPOTIFY ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSource(MusicSource.SPOTIFY)}
              >
                {getSourceIcon(MusicSource.SPOTIFY)} Spotify
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Track List */}
      {loading ? (
        <Card className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading your music library...</span>
          </div>
        </Card>
      ) : sourceTracks.length > 0 ? (
        <div className="space-y-2">
          {sourceTracks.map((track, index) => (
            <div key={track.id} className="relative">
              <TrackCard 
                track={track} 
                queueIndex={index}
                className="transition-all duration-200"
              />
              <Badge 
                variant="secondary" 
                className={cn(
                  'absolute top-2 right-2 text-xs opacity-60',
                  track.source === MusicSource.SPOTIFY && 'bg-green-500/20 text-green-400',
                  track.source === MusicSource.LOCAL && 'bg-blue-500/20 text-blue-400'
                )}
              >
                {getSourceIcon(track.source)} {track.source.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? 'No tracks found matching your search.' : 'No tracks available.'}
          </p>
        </Card>
      )}
    </div>
  );
};