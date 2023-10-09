import * as React from 'react';
import { useReactions } from './reactions';
import type { ReactionMessage } from './reactions';
import { useEnsureParticipant } from '@livekit/components-react';

type Emoji = {
  bottom: number;
  left: number;
  emoji: string;
  id: number;
  type: 'normal' | 'bomb';
};

export function ReactionsCanvas() {
  const [emojis, setEmojis] = React.useState<Emoji[]>([]);

  const participantId = useEnsureParticipant().identity;

  useReactions((reaction) => {
    console.group('ParticipantTile');
    console.log('reaction:', reaction);
    console.groupEnd();
    if (reaction.participantId === participantId) {
      addEmoji(reaction);
    }
  });

  function addEmoji(reaction: ReactionMessage) {
    const emoji: Emoji = {
      bottom: 0,
      left: Math.random() * 40,
      emoji: reaction.payload,
      id: reaction.timestamp,
      type: reaction.type,
    };
    setEmojis((prev) => [...prev, emoji]);
  }

  React.useEffect(() => {
    const timerIds: NodeJS.Timeout[] = [];
    emojis.forEach((emoji) => {
      const timeout = emoji.id + 2000 - Date.now();
      if (timeout < 0) {
        return;
      }
      const timerId = setTimeout(() => {
        setEmojis((prev) => prev.filter((e) => e.id !== emoji.id));
      }, timeout);
      timerIds.push(timerId);
    });
    return () => {
      timerIds.forEach((id) => clearTimeout(id));
    };
  }, [emojis]);

  return (
    <div style={{ width: '100%', height: '100%', color: 'red', position: 'absolute' }}>
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          style={{
            position: 'absolute',
            fontSize: emoji.type === 'bomb' ? '10rem' : '3rem',
            animation: 'rise-wave 2s linear',
            bottom: `${emoji.bottom}%`,
            left: `${emoji.left}%`,
          }}
        >
          <span>{emoji.emoji}</span>
        </div>
      ))}
    </div>
  );
}
