import { useDataChannel, useEnsureParticipant, useEnsureRoom } from '@livekit/components-react';
import * as React from 'react';
import { REACTION_TOPIC, decode, sendReaction } from './reactions';
import { LocalParticipant } from 'livekit-client';
import { computeMenuPosition, wasClickOutside } from '@livekit/components-core';

export function ReactionBar() {
  const participant = useEnsureRoom().localParticipant;
  const { send } = useDataChannel(REACTION_TOPIC);

  const [isOpen, setIsOpen] = React.useState(false);
  const [emojis, setEmojis] = React.useState<string[]>(['❤️', '👍', '🎉', '😂']);
  const [updateRequired, setUpdateRequired] = React.useState<boolean>(true);

  const button = React.useRef<HTMLButtonElement>(null);
  const tooltip = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (button.current && tooltip.current && (emojis || updateRequired)) {
      computeMenuPosition(button.current, tooltip.current).then(({ x, y }) => {
        if (tooltip.current) {
          Object.assign(tooltip.current.style, { left: `${x}px`, top: `${y}px` });
        }
      });
    }
    setUpdateRequired(false);
  }, [button, tooltip, emojis, updateRequired]);

  const handleClickOutside = React.useCallback(
    (event: MouseEvent) => {
      if (!tooltip.current) {
        return;
      }
      if (event.target === button.current) {
        return;
      }
      if (isOpen && wasClickOutside(tooltip.current, event)) {
        setIsOpen(false);
      }
    },
    [isOpen, tooltip, button],
  );

  React.useEffect(() => {
    document.addEventListener<'click'>('click', handleClickOutside);
    window.addEventListener<'resize'>('resize', () => setUpdateRequired(true));
    return () => {
      document.removeEventListener<'click'>('click', handleClickOutside);
      window.removeEventListener<'resize'>('resize', () => setUpdateRequired(true));
    };
  }, [handleClickOutside, setUpdateRequired]);

  return (
    <>
      <button
        className="lk-button"
        onClick={() => setIsOpen(!isOpen)}
        ref={button}
        style={{ fontSize: '1.5rem', maxHeight: '100%' }}
      >
        🙂
      </button>
      {/** only render when enabled in order to make sure that the permissions are requested only if the menu is enabled */}
      {true && (
        <div
          className="lk-device-menu"
          ref={tooltip}
          style={{ visibility: isOpen ? 'visible' : 'hidden' }}
        >
          <ul
            style={{
              display: 'flex',
              flexDirection: 'row',
              padding: '0',
              margin: '0',
            }}
          >
            {emojis.map((emoji) => (
              <li key={emoji} style={{ listStyleType: 'none' }}>
                <button
                  className="lk-button"
                  onClick={() => sendReaction(emoji, send, participant as LocalParticipant)}
                  style={{ fontSize: '1.5rem', maxHeight: '100%' }}
                >
                  {emoji}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
