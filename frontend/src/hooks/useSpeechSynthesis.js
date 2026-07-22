import { useCallback, useEffect, useState } from 'react';

const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

const FEMALE_NAME_HINTS = ['female', 'karen', 'samantha', 'moira', 'fiona'];

function isFemaleVoice(voice) {
  const name = voice.name.toLowerCase();
  return FEMALE_NAME_HINTS.some((hint) => name.includes(hint));
}

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  const gb = voices.filter((v) => v.lang === 'en-GB');
  const us = voices.filter((v) => v.lang === 'en-US');

  return (
    voices.find((v) => v.lang === 'en-IE') ||
    gb.find(isFemaleVoice) ||
    gb[0] ||
    us.find(isFemaleVoice) ||
    us[0] ||
    voices[0] ||
    null
  );
}

export default function useSpeechSynthesis() {
  const [speakingId, setSpeakingId] = useState(null);

  useEffect(() => {
    if (!isSupported) return undefined;
    return () => window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback(
    (id, text) => {
      if (!isSupported) return;

      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice();
      if (voice) utterance.voice = voice;
      utterance.rate = 0.85;
      utterance.pitch = 1.05;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);

      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    },
    [speakingId]
  );

  return { speak, speakingId, isSupported };
}
