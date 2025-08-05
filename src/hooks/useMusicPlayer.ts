import { useState, useEffect, useCallback } from 'react';
import { MusicPlayerService } from '@/services/MusicPlayerService';
import { PlayerState, Track, PlaybackState } from '@/types/music';

// Custom hook for music player state management (MVVM pattern)
export const useMusicPlayer = () => {
  const [playerState, setPlayerState] = useState<PlayerState>(() => 
    MusicPlayerService.getInstance().getState()
  );

  useEffect(() => {
    const playerService = MusicPlayerService.getInstance();
    
    const unsubscribe = playerService.subscribe('stateChange', (newState: PlayerState) => {
      setPlayerState(newState);
    });

    return unsubscribe;
  }, []);

  // Command pattern implementation for player actions
  const playerActions = {
    play: useCallback(async () => {
      await MusicPlayerService.getInstance().play();
    }, []),

    pause: useCallback(() => {
      MusicPlayerService.getInstance().pause();
    }, []),

    playTrack: useCallback(async (track: Track) => {
      await MusicPlayerService.getInstance().playTrack(track);
    }, []),

    next: useCallback(() => {
      MusicPlayerService.getInstance().next();
    }, []),

    previous: useCallback(() => {
      MusicPlayerService.getInstance().previous();
    }, []),

    seekTo: useCallback((percentage: number) => {
      MusicPlayerService.getInstance().seekTo(percentage);
    }, []),

    setVolume: useCallback((volume: number) => {
      MusicPlayerService.getInstance().setVolume(volume);
    }, []),

    setQueue: useCallback((tracks: Track[], startIndex: number = 0) => {
      MusicPlayerService.getInstance().setQueue(tracks, startIndex);
    }, []),

    toggleShuffle: useCallback(() => {
      MusicPlayerService.getInstance().toggleShuffle();
    }, []),

    toggleRepeat: useCallback(() => {
      MusicPlayerService.getInstance().toggleRepeat();
    }, []),

    togglePlayPause: useCallback(async () => {
      if (playerState.playbackState === PlaybackState.PLAYING) {
        MusicPlayerService.getInstance().pause();
      } else {
        await MusicPlayerService.getInstance().play();
      }
    }, [playerState.playbackState])
  };

  return {
    playerState,
    actions: playerActions,
    isPlaying: playerState.playbackState === PlaybackState.PLAYING,
    isLoading: playerState.playbackState === PlaybackState.LOADING,
    currentTrack: playerState.currentTrack,
    progress: playerState.progress,
    queue: playerState.queue
  };
};