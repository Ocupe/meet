import { NextApiRequest, NextApiResponse } from 'next';

export default async function startRecording(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { roomName } = req.query;

    if (typeof roomName !== 'string') {
      res.status(403).end();
      return;
    }

    const resp = await fetch(
      `https://meets-helper-demo-o7zx.zeet-livekit-do-lon1-staging.zeet.app/startEgress?room_name=${roomName}`,
      {
        headers: {
          auth: `deadbeatx0a1a`,
        },
      },
    );
    if (!resp.ok) {
      console.error('Error requesting start recording', resp.status, resp.statusText);
      res.status(500).end();
    }

    console.log('start recording', resp.status, resp.statusText);

    res.status(200).end();
  } catch (e) {
    res.statusMessage = (e as Error).message;
    res.status(500).end();
  }
}
