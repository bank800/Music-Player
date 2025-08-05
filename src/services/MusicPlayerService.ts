import { PlayerState, PlaybackState, Track, PlaybackProgress } from '@/types/music';

export type PlayerEventType = 'stateChange' | 'progressUpdate' | 'trackEnd';

export interface PlayerEvent {
  type: PlayerEventType;
  data: any;
}

// Singleton Music Player Service with Observer pattern
export class MusicPlayerService {
  private static instance: MusicPlayerService;
  private audio: HTMLAudioElement;
  private listeners: Map<PlayerEventType, Array<(data: any) => void>> = new Map();
  private state: PlayerState;

  private constructor() {
    this.audio = new Audio();
    this.state = {
      currentTrack: null,
      playbackState: PlaybackState.STOPPED,
      progress: { currentTime: 0, duration: 0, percentage: 0 },
      queue: [],
      currentIndex: -1,
      volume: 0.8,
      isShuffling: false,
      isRepeating: false
    };

    this.setupAudioEvents();
  }

  public static getInstance(): MusicPlayerService {
    if (!MusicPlayerService.instance) {
      MusicPlayerService.instance = new MusicPlayerService();
    }
    return MusicPlayerService.instance;
  }

  private setupAudioEvents() {
    this.audio.addEventListener('loadstart', () => {
      this.updateState({ playbackState: PlaybackState.LOADING });
    });

    this.audio.addEventListener('canplay', () => {
      this.updateState({ 
        playbackState: PlaybackState.PAUSED,
        progress: { 
          currentTime: 0, 
          duration: this.audio.duration || 0,
          percentage: 0
        }
      });
    });

    this.audio.addEventListener('timeupdate', () => {
      const progress: PlaybackProgress = {
        currentTime: this.audio.currentTime,
        duration: this.audio.duration || 0,
        percentage: this.audio.duration ? (this.audio.currentTime / this.audio.duration) * 100 : 0
      };
      this.updateState({ progress });
      this.emit('progressUpdate', progress);
    });

    this.audio.addEventListener('ended', () => {
      this.emit('trackEnd', this.state.currentTrack);
      this.next();
    });

    this.audio.addEventListener('pause', () => {
      if (this.state.playbackState !== PlaybackState.LOADING) {
        this.updateState({ playbackState: PlaybackState.PAUSED });
      }
    });

    this.audio.addEventListener('play', () => {
      this.updateState({ playbackState: PlaybackState.PLAYING });
    });

    this.audio.volume = this.state.volume;
  }

  public async loadTrack(track: Track): Promise<void> {
    this.updateState({ currentTrack: track, playbackState: PlaybackState.LOADING });
    this.audio.src = track.audioUrl;
    this.audio.load();
  }

  public async play(): Promise<void> {
    if (this.audio.src) {
      try {
        await this.audio.play();
      } catch (error) {
        console.error('Failed to play audio:', error);
        this.updateState({ playbackState: PlaybackState.PAUSED });
      }
    }
  }

  public pause(): void {
    this.audio.pause();
  }

  public async playTrack(track: Track): Promise<void> {
    await this.loadTrack(track);
    await this.play();
  }

  public setQueue(tracks: Track[], startIndex: number = 0): void {
    this.updateState({ 
      queue: tracks, 
      currentIndex: startIndex 
    });
    if (tracks[startIndex]) {
      this.loadTrack(tracks[startIndex]);
    }
  }

  public next(): void {
    const { queue, currentIndex, isShuffling, isRepeating } = this.state;
    
    if (queue.length === 0) return;

    let nextIndex: number;
    
    if (isShuffling) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (isRepeating && currentIndex === queue.length - 1) {
      nextIndex = 0;
    } else if (currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1;
    } else {
      return; // End of queue
    }

    this.updateState({ currentIndex: nextIndex });
    this.playTrack(queue[nextIndex]);
  }

  public previous(): void {
    const { queue, currentIndex } = this.state;
    
    if (queue.length === 0) return;

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    this.updateState({ currentIndex: prevIndex });
    this.playTrack(queue[prevIndex]);
  }

  public seekTo(percentage: number): void {
    if (this.audio.duration) {
      this.audio.currentTime = (percentage / 100) * this.audio.duration;
    }
  }

  public setVolume(volume: number): void {
    this.audio.volume = Math.max(0, Math.min(1, volume));
    this.updateState({ volume: this.audio.volume });
  }

  public toggleShuffle(): void {
    this.updateState({ isShuffling: !this.state.isShuffling });
  }

  public toggleRepeat(): void {
    this.updateState({ isRepeating: !this.state.isRepeating });
  }

  public getState(): PlayerState {
    return { ...this.state };
  }

  // Observer pattern implementation
  public subscribe(event: PlayerEventType, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private emit(event: PlayerEventType, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  private updateState(updates: Partial<PlayerState>): void {
    this.state = { ...this.state, ...updates };
    this.emit('stateChange', this.state);
  }
}