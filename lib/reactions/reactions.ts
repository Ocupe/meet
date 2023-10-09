import { useDataChannel } from '@livekit/components-react';
import { LocalParticipant } from 'livekit-client';

export type ReactionMessage = {
  payload: string;
  timestamp: number;
  participantId: string;
};

export const REACTION_TOPIC = 'reaction' as const;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function encode(message: ReactionMessage) {
  return encoder.encode(JSON.stringify(message));
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

export function useReactions(onReaction: (reaction: ReactionMessage) => void) {
  //   const [messages, setMessages] = React.useState<ReactionMessage[]>([]);
  const { message } = useDataChannel(REACTION_TOPIC, (msg) => {
    console.group(`Reaction from: ${msg.from?.identity}}`);
    console.log(msg);
    console.groupEnd();

    const reaction = decode(msg.payload);
    onReaction(reaction);
  });
}
