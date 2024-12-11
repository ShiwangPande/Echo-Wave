'use client';

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Track } from 'livekit-client';
import { useUser } from '@clerk/nextjs';

interface MediaRoomProps {
  chatId: string; // Provided as a prop
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();
  const [token, setToken] = useState<string>('');

  const name = `${user?.firstName}${user?.lastName}`;

  const getToken = async () => {
    if (!name) return; // Ensure name exists
    try {
      const resp = await fetch(`/api/token?room=${chatId}&username=${name}`);
      const data = await resp.json();
      setToken(data.token);
    } catch (e) {
      console.error('Error fetching token:', e);
    }
  };

  useEffect(() => {
    if (chatId && name) {
      getToken();
    }
  }, [chatId, name]);

  if (token === '') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg mb-4">Connecting to the room...</p>
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin text-gray-500" size={48} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      onDisconnected={() => setToken('')}
      style={{ height: '100vh', width: '100%' }}
    >
      <MyVideoConference video={video} />
      {audio && <RoomAudioRenderer />}
      <ControlBar />
    </LiveKitRoom>
  );
};

function MyVideoConference({ video }: { video: boolean }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: video },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div
      style={{
        height: 'calc(100vh - var(--lk-control-bar-height))',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <GridLayout
        tracks={tracks}
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
        }}
      >
        <ParticipantTile />
      </GridLayout>
    </div>
  );
}
