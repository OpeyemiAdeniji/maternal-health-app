import { useCallback, useEffect, useRef, useState } from 'react';

const SpeechRecognitionAPI =
  typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

function joinText(base, spoken) {
  if (!spoken) return base;
  return base ? `${base} ${spoken}` : spoken;
}

function messageForError(code) {
  if (code === 'not-allowed' || code === 'service-not-allowed') return 'Microphone access was denied.';
  if (code === 'no-speech') return "Didn't catch that — try again.";
  return 'Something went wrong with voice input.';
}

export default function useSpeechRecognition() {
  const isSupported = Boolean(SpeechRecognitionAPI);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const langRef = useRef('en-IE');

  useEffect(() => {
    if (!isSupported) return undefined;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let spoken = '';
      for (let i = 0; i < event.results.length; i += 1) {
        spoken += event.results[i][0].transcript;
      }
      setTranscript(joinText(baseTextRef.current, spoken));
    };

    recognition.onerror = (event) => {
      // en-IE isn't available on every device — retry once with en-US before giving up
      if (event.error === 'language-not-supported' && langRef.current === 'en-IE') {
        langRef.current = 'en-US';
        try {
          recognition.lang = 'en-US';
          recognition.start();
          return;
        } catch {
          // fall through to error state below
        }
      }
      setError(messageForError(event.error));
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
    };
  }, [isSupported]);

  const startListening = useCallback(
    (existingText = '') => {
      if (!isSupported || !recognitionRef.current || isListening) return;

      setError('');
      baseTextRef.current = existingText;
      setTranscript(existingText);
      langRef.current = 'en-IE';
      recognitionRef.current.lang = 'en-IE';

      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setError('Could not start voice input.');
      }
    },
    [isSupported, isListening]
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, startListening, stopListening, isSupported, error };
}
