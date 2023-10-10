import { useEnsureRoom } from '@livekit/components-react';
import * as React from 'react';

function useRecordSession() {
  const [isRecording, setIsRecording] = React.useState<
    'not-stared' | 'requested' | 'recording' | 'failed'
  >('not-stared');
  const roomName = useEnsureRoom().name;

  const clickHandler = React.useCallback(async () => {
    const params = new URLSearchParams({ roomName });
    setIsRecording('requested');
    const res = await fetch(`/api/record?${params.toString()}`);
    setIsRecording('recording');

    //pause for 1s
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!res.ok) {
      console.error('failed to start recording', res);
      return;
    }
  }, [roomName]);

  return {
    isRecording,
    clickHandler,
  };
}

function getButtonStyle(isRecording: ReturnType<typeof useRecordSession>['isRecording']) {
  switch (isRecording) {
    case 'not-stared':
    case 'failed':
      return { background: 'var(--lk-control-bg)' };
    case 'requested':
      return { background: 'var(--lk-control-bg)', disabled: true };
    case 'recording':
      return { background: 'var(--lk-control-bg)', disabled: false };
  }
}

export function RecordButton() {
  const { isRecording, clickHandler } = useRecordSession();

  return (
    <button
      onClick={clickHandler}
      style={getButtonStyle(isRecording)}
      className="lk-button record-button"
    >
      <div
        className="circle"
        style={{ background: isRecording === 'recording' ? 'var(--lk-danger)' : 'var(--lk-bg2)' }}
      ></div>
    </button>
  );
}
