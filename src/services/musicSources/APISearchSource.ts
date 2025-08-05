import { MusicSourceProvider, Track, MusicSource } from '@/types/music';

interface APISearchResult {
  id: string;
  title: string;
  artist: string;
  url: string;
  image?: string;
  album?: string;
  duration?: number;
}

export class APISearchSource implements MusicSourceProvider {
  readonly source = MusicSource.SPOTIFY;
  private baseUrl = 'https://68912113447ff4f11fbbce37.mockapi.io/searchResults';
  private allTracks: Track[] = [];
  private lastFetch: number = 0;
  private cacheDuration = 5 * 60 * 1000; // 5 minutes

  async loadTracks(): Promise<Track[]> {
    // This source is only for search, not loading initial tracks
    return [];
  }

  private async fetchAllTracks(): Promise<APISearchResult[]> {
    try {
      // Try with q parameter first
      let response = await fetch(`${this.baseUrl}?q=`);
      
      if (!response.ok) {
        // If q parameter fails, try without it
        response = await fetch(this.baseUrl);
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const results: APISearchResult[] = await response.json();
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error('Failed to fetch all tracks:', error);
      return [];
    }
  }

  async searchTracks(query: string): Promise<Track[]> {
    if (!query.trim()) return [];

    try {
      // Cache management - refresh if data is stale
      const now = Date.now();
      if (this.allTracks.length === 0 || (now - this.lastFetch) > this.cacheDuration) {
        const apiResults = await this.fetchAllTracks();
        this.allTracks = apiResults.map((result, index) => ({
          id: `api-${result.id || index}`,
          title: result.title || 'Unknown Title',
          artist: result.artist || 'Unknown Artist',
          album: result.album || 'Unknown Album',
          duration: result.duration || 180, // Default 3 minutes
          coverUrl: result.image,
          audioUrl: result.url || 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
          source: MusicSource.SPOTIFY
        }));
        this.lastFetch = now;
      }

      // Filter tracks based on query
      const queryLower = query.toLowerCase();
      return this.allTracks.filter(track => 
        track.title.toLowerCase().includes(queryLower) ||
        track.artist.toLowerCase().includes(queryLower) ||
        track.album.toLowerCase().includes(queryLower)
      );
    } catch (error) {
      console.error('API search failed:', error);
      return [];
    }
  }

  async getTrackUrl(trackId: string): Promise<string> {
    // For API tracks, the URL is already set in the track object
    return '';
  }
}