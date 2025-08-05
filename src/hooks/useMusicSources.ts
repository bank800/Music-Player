import { useState, useEffect } from 'react';
import { Track, MusicSourceProvider, MusicSource } from '@/types/music';
import { LocalMusicSource } from '@/services/musicSources/LocalMusicSource';
import { SpotifyMockSource } from '@/services/musicSources/SpotifyMockSource';
import { APISearchSource } from '@/services/musicSources/APISearchSource';

// Factory pattern for music sources
class MusicSourceFactory {
  private static sources: Map<MusicSource, MusicSourceProvider> = new Map();

  static getSource(source: MusicSource): MusicSourceProvider {
    if (!this.sources.has(source)) {
      switch (source) {
        case MusicSource.LOCAL:
          this.sources.set(source, new LocalMusicSource());
          break;
        case MusicSource.SPOTIFY:
          this.sources.set(source, new SpotifyMockSource());
          break;
        default:
          throw new Error(`Unsupported music source: ${source}`);
      }
    }
    return this.sources.get(source)!;
  }

  static getAllSources(): MusicSourceProvider[] {
    return [
      this.getSource(MusicSource.LOCAL),
      this.getSource(MusicSource.SPOTIFY)
    ];
  }
}

export const useMusicSources = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAllTracks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const sources = MusicSourceFactory.getAllSources();
      const trackPromises = sources.map(source => source.loadTracks());
      const trackArrays = await Promise.all(trackPromises);
      const allTracks = trackArrays.flat();
      
      setTracks(allTracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tracks');
    } finally {
      setLoading(false);
    }
  };

  const searchTracks = async (query: string): Promise<Track[]> => {
    if (!query.trim()) return tracks;
    
    try {
      // Search both local sources and the API
      const sources = MusicSourceFactory.getAllSources();
      const apiSearchSource = new APISearchSource();
      
      const searchPromises = [
        ...sources.map(source => source.searchTracks(query)),
        apiSearchSource.searchTracks(query)
      ];
      const searchResults = await Promise.all(searchPromises);
      return searchResults.flat();
    } catch (err) {
      console.error('Search failed:', err);
      return [];
    }
  };

  useEffect(() => {
    loadAllTracks();
  }, []);

  return {
    tracks,
    loading,
    error,
    reload: loadAllTracks,
    searchTracks
  };
};