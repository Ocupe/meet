import { useDataChannel, useEnsureParticipant, useEnsureRoom } from '@livekit/components-react';
import * as React from 'react';
import { REACTION_TOPIC, decode, sendReaction } from './reactions';
import { LocalParticipant } from 'livekit-client';

export function ReactionBar() {
  const participant = useEnsureRoom().localParticipant;
  const { send } = useDataChannel(REACTION_TOPIC);

  return (
    <button
      className="lk-button"
      onClick={() => sendReaction('❤️', send, participant as LocalParticipant)}
    >
      ❤️
    </button>
  );
}
