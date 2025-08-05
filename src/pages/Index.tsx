import { useState } from 'react';
import { MusicLibrary } from '@/components/library/MusicLibrary';
import { NowPlayingBar } from '@/components/player/NowPlayingBar';
import { FullscreenPlayer } from '@/components/player/FullscreenPlayer';

const Index = () => {
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 pb-24">
        <MusicLibrary />
      </div>

      {/* Bottom Player Bar */}
      <NowPlayingBar onExpand={() => setIsFullscreenOpen(true)} />

      {/* Fullscreen Player */}
      <FullscreenPlayer 
        isOpen={isFullscreenOpen}
        onClose={() => setIsFullscreenOpen(false)}
      />
    </div>
  );
};

export default Index;
