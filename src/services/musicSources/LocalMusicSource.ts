import { MusicSourceProvider, Track, MusicSource } from '@/types/music';
import classicRockCover from '@/assets/classic-rock-cover.jpg';
import modernPopCover from '@/assets/modern-pop-cover.jpg';
import electronicCover from '@/assets/electronic-cover.jpg';

export class LocalMusicSource implements MusicSourceProvider {
  readonly source = MusicSource.LOCAL;

  async loadTracks(): Promise<Track[]> {
    // Mock local music data - in real app would read from file system
    return [
      {
        id: 'local-1',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        duration: 355,
        coverUrl: classicRockCover,
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
        source: MusicSource.LOCAL
      },
      {
        id: 'local-2',
        title: 'Stairway to Heaven',
        artist: 'Led Zeppelin',
        album: 'Led Zeppelin IV',
        duration: 482,
        coverUrl: modernPopCover,
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
        source: MusicSource.LOCAL
      },
      {
        id: 'local-3',
        title: 'Hotel California',
        artist: 'Eagles',
        album: 'Hotel California',
        duration: 391,
        coverUrl: electronicCover,
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
        source: MusicSource.LOCAL
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