import { useDataChannel } from '@livekit/components-react';
import { LocalParticipant } from 'livekit-client';

type ReactionMessage = {
  payload: string;
  timestamp: number;
  participantId: string;
};

export const REACTION_TOPIC = 'reaction' as const;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function encode(message: ReactionMessage) {
  return encoder.encode(JSON.stringify({ message: message.payload, timestamp: message.timestamp }));
}

export function decode(message: Uint8Array): ReactionMessage {
  return JSON.parse(decoder.decode(message));
}

export function sendReaction(
  reaction: string,
  send: ReturnType<typeof useDataChannel>['send'],
  localParticipant: LocalParticipant,
) {
  const timestamp = Date.now();
  const msg: ReactionMessage = {
    payload: reaction,
    timestamp,
    participantId: localParticipant.identity,
  };
  send(encode(msg), {});
}
