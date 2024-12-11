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

  useEffect(() => {
    if (!user?.firstName || !user?.lastName) return;
    const name = `${user.firstName} ${user.lastName}`;
  (async () => {
    try {
      const resp = await fetch(`/api/token?room=${chatId}&username=${name}`);
      console.log("resp: ",resp)
      const data = await resp.json();
      setToken(data.token);
    } catch (e) {
      console.error("Error fetching token:", e);
    }
  })();
}, [chatId, user?.firstName, user?.lastName]);

  if (token === '') {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
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
      style={{ height: '100vh', width: '100%' }}
    >
  
      <MyVideoConference video={video} audio={audio} />
      {audio && !video && (
  <div style={{ height: '100vh', width: '100%' }}>
    <RoomAudioRenderer />
  </div>
)}
      {video && <ControlBar />}
    </LiveKitRoom>
  );
};

function MyVideoConference({ video, audio }: { video: boolean; audio: boolean }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: video },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );

  return (
    <div style={{ height: 'calc(100vh - var(--lk-control-bar-height))', display: 'flex', flexDirection: 'column' }}>
      {video && (
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
      )}
      {audio && !video && (
        <div className="flex-1 flex justify-center items-center bg-gray-800 text-white">
          <div className="max-w-sm p-4 bg-gray-900 rounded-lg shadow-lg flex flex-col items-center">
   
            <div className="text-xl font-semibold">Audio-Only Participant</div>
            <div className="text-sm text-gray-400 mt-1">Audio-Only Channel</div>
            <div className="mt-3">
       
              <AudioControl />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function AudioControl() {
  const [muted, setMuted] = useState(false); 
  const toggleMute = () => {
    setMuted(!muted);
  };
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={toggleMute}
        className="bg-red-600 text-white py-2 px-4 rounded-full hover:bg-red-700"
      >
        {muted ? "Unmute" : "Mute"}
      </button>
    </div>
  );
}
