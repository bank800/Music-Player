// Music Player Type Definitions

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverUrl?: string;
  audioUrl: string;
  source: MusicSource;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  coverUrl?: string;
  description?: string;
}

export enum PlaybackState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  LOADING = 'loading'
}

export enum MusicSource {
  LOCAL = 'local',
  SPOTIFY = 'spotify',
  YOUTUBE = 'youtube' // Future extensibility
}

export interface PlaybackProgress {
  currentTime: number;
  duration: number;
  percentage: number;
}

export interface PlayerState {
  currentTrack: Track | null;
  playbackState: PlaybackState;
  progress: PlaybackProgress;
  queue: Track[];
  currentIndex: number;
  volume: number;
  isShuffling: boolean;
  isRepeating: boolean;
}

// Strategy pattern interface for different music sources
export interface MusicSourceProvider {
  readonly source: MusicSource;
  loadTracks(): Promise<Track[]>;
  searchTracks(query: string): Promise<Track[]>;
  getTrackUrl(trackId: string): Promise<string>;
}