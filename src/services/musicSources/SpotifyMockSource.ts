import { MusicSourceProvider, Track, MusicSource } from '@/types/music';
import modernPopCover from '@/assets/modern-pop-cover.jpg';
import electronicCover from '@/assets/electronic-cover.jpg';
import classicRockCover from '@/assets/classic-rock-cover.jpg';

export class SpotifyMockSource implements MusicSourceProvider {
  readonly source = MusicSource.SPOTIFY;

  async loadTracks(): Promise<Track[]> {
    // Mock Spotify API data - simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 'spotify-1',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: 200,
        coverUrl: modernPopCover,
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
        source: MusicSource.SPOTIFY
      },
      {
        id: 'spotify-2',
        title: 'Good 4 U',
        artist: 'Olivia Rodrigo',
        album: 'SOUR',
        duration: 178,
        coverUrl: electronicCover,
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
        source: MusicSource.SPOTIFY
      },
      {
        id: 'spotify-3',
        title: 'Levitating',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        duration: 203,
        coverUrl: classicRockCover,
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
        source: MusicSource.SPOTIFY
      },
      {
        id: 'spotify-4',
        title: 'Stay',
        artist: 'The Kid LAROI & Justin Bieber',
        album: 'F*CK LOVE 3',
        duration: 141,
        coverUrl: modernPopCover,
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
        source: MusicSource.SPOTIFY
      }
    ];
  }

  async searchTracks(query: string): Promise<Track[]> {
    const allTracks = await this.loadTracks();
    return allTracks.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase()) ||
      track.album.toLowerCase().includes(query.toLowerCase())
    );
  }

  async getTrackUrl(trackId: string): Promise<string> {
    const tracks = await this.loadTracks();
    const track = tracks.find(t => t.id === trackId);
    return track?.audioUrl || '';
  }
}