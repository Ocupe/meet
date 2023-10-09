import { useDataChannel, useEnsureParticipant, useEnsureRoom } from '@livekit/components-react';
import * as React from 'react';
import { REACTION_TOPIC, decode, sendReaction } from './reactions';
import { LocalParticipant } from 'livekit-client';

export function ReactionBar() {
  const participant = useEnsureRoom().localParticipant;
  const { send } = useDataChannel(REACTION_TOPIC, (data) => {
    if (data === undefined || data.from === undefined) return;
    console.groupCollapsed(`Reaction from: ${data.from.identity} `);
    console.log('Payload:', data);
    console.log('ReactionMsg', decode(data.payload));
    console.groupEnd();
  });

  return (
    <button onClick={() => sendReaction('❤️', send, participant as LocalParticipant)}>❤️</button>
  );
}
