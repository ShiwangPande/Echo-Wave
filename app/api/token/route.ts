import { NextRequest, NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';

export async function GET(req: NextRequest) {
  try {
    const room = req.nextUrl.searchParams.get('room');
    const username = req.nextUrl.searchParams.get('username');
    
    if (!room) {
      return NextResponse.json({ error: 'Missing "room" query parameter' }, { status: 400 });
    } else if (!username) {
      return NextResponse.json({ error: 'Missing "username" query parameter' }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SCECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    // Log environment variables for debugging
    console.log('LIVEKIT_API_KEY:', apiKey);
    console.log('LIVEKIT_API_SCECRET:', apiSecret);
    console.log('NEXT_PUBLIC_LIVEKIT_URL:', wsUrl);

    if (!apiKey || !apiSecret || !wsUrl) {
      console.error('Missing LiveKit configuration:', { apiKey, apiSecret, wsUrl });
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, { identity: username });
    at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });

    return NextResponse.json({ token: await at.toJwt() });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
