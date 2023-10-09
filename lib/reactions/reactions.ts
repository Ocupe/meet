import { useDataChannel } from '@livekit/components-react';
import { LocalParticipant } from 'livekit-client';
import * as React from 'react';

export type ReactionMessage = {
  payload: string;
  type: 'normal' | 'bomb';
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

export function useSendReaction(
  send: ReturnType<typeof useDataChannel>['send'],
  localParticipant: LocalParticipant,
): (reaction: string) => void {
  const emojiBuffer = React.useRef<ReactionMessage[]>([]);

  return (emoji: string) => {
    const timestamp = Date.now();
    const msg: ReactionMessage = {
      payload: emoji,
      timestamp,
      type: 'normal',
      participantId: localParticipant.identity,
    };
    const length = emojiBuffer.current.push(msg);
    console.log('emojiBuffer', emojiBuffer);
    if (length > 10) {
      emojiBuffer.current = emojiBuffer.current.slice(-10);
    }

    if (emojiBuffer.current.length > 3) {
      const oldestMsg = emojiBuffer.current[0];
      console.log('lastMsg', oldestMsg);
      const lastThree = emojiBuffer.current.slice(-3);
      console.log('lastThree', lastThree);
      const isSameMassagesInTimeFrame = lastThree.every((msg) => {
        return oldestMsg.payload === msg.payload && oldestMsg.timestamp + 2000 > msg.timestamp;
      });
      console.log('isSameMassagesInTimeFrame', isSameMassagesInTimeFrame);

      if (isSameMassagesInTimeFrame) {
        console.log('bomb');
        msg.type = 'bomb';
        emojiBuffer.current = [];
      } else {
        console.log('normal');
      }
    }

    send(encode(msg), {});
  };
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
