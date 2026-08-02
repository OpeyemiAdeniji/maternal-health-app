import { Microphone2, Send2, VolumeHigh } from 'iconsax-react';
import { useEffect, useRef, useState } from 'react';
import { SparkleIcon, SpeakerFilledIcon } from '../../components/common/icons';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import useSpeechSynthesis from '../../hooks/useSpeechSynthesis';
import api from '../../services/api';

function extractErrorMessage(err) {
  const data = err.response?.data;
  if (!data) return 'Something went wrong. Please try again.';
  if (typeof data === 'string') return data;
  if (data.non_field_errors?.[0]) return data.non_field_errors[0];
  if (data.detail) return data.detail;
  const firstValue = Object.values(data)[0];
  return Array.isArray(firstValue) ? firstValue[0] : 'Something went wrong. Please try again.';
}

function ModaAvatar() {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white">
      <SparkleIcon className="h-4 w-4" />
    </span>
  );
}

function MessageBubble({ message, isSpeaking, onSpeak, speechSupported, onRetry }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && <ModaAvatar />}
        <div
          className={`flex max-w-[75%] items-start gap-2 rounded-card px-4 py-2.5 text-sm shadow-soft ${
            isUser
              ? `bg-primary-600 text-white ${message.failed ? 'opacity-60' : ''}`
              : 'border border-primary-200 bg-white text-ink'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          {!isUser && speechSupported && (
            <button
              type="button"
              onClick={() => onSpeak(message.id, message.content)}
              aria-label={isSpeaking ? 'Stop reading aloud' : 'Read message aloud'}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center transition-colors ${
                isSpeaking ? 'text-primary-600' : 'text-gray-400 hover:text-primary-500'
              }`}
            >
              {isSpeaking ? (
                <SpeakerFilledIcon className="h-4 w-4" />
              ) : (
                <VolumeHigh variant="Linear" color="currentColor" className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
      {message.failed && (
        <button
          type="button"
          onClick={() => onRetry(message)}
          className="flex items-center gap-1 text-xs font-medium text-red-500"
        >
          Couldn't send — tap to retry
        </button>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end justify-start gap-2">
      <ModaAvatar />
      <div className="flex items-center gap-1 rounded-card border border-primary-200 bg-white px-4 py-3 shadow-soft">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 animate-bounce rounded-full bg-primary-300"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();
  const { speak, speakingId, isSupported: speechSupported } = useSpeechSynthesis();

  useEffect(() => {
    if (isListening) setInput(transcript);
  }, [transcript, isListening]);

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening(input);
    }
  };

  useEffect(() => {
    api
      .get('/api/chat/history/')
      .then(({ data }) => setMessages(data))
      .catch(() => setError("We couldn't load your chat history."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  // shared by the initial send and a retry, keyed by localId so a retry updates the same bubble instead of adding a duplicate
  const sendMessage = async (content, localId) => {
    setError('');
    setSending(true);
    try {
      const { data } = await api.post('/api/chat/', { content });
      setMessages((prev) => [...prev.map((m) => (m.id === localId ? { ...m, failed: false } : m)), data]);
    } catch (err) {
      setError(extractErrorMessage(err));
      setMessages((prev) => prev.map((m) => (m.id === localId ? { ...m, failed: true } : m)));
    } finally {
      setSending(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || sending) return;

    const localId = `local-${Date.now()}`;
    setInput('');
    setMessages((prev) => [...prev, { id: localId, role: 'user', content, failed: false }]);
    sendMessage(content, localId);
  };

  const handleRetry = (message) => {
    if (sending) return;
    setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, failed: false } : m)));
    sendMessage(message.content, message.id);
  };

  return (
    <div className="flex flex-1 flex-col bg-white">
      <div className="border-b border-gray-100 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-ink">Chat with Moda</h1>
        <p className="text-xs text-muted">Your supportive companion, here anytime you need to talk.</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
        {loading && <p className="text-center text-sm text-muted">Loading…</p>}

        {!loading && messages.length === 0 && (
          <p className="text-center text-sm text-muted">
            Say hello to Moda — this is a safe space to share how you're feeling.
          </p>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isSpeaking={speakingId === message.id}
            onSpeak={speak}
            speechSupported={speechSupported}
            onRetry={handleRetry}
          />
        ))}

        {sending && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {error && <p className="px-6 pb-2 text-sm text-red-500">{error}</p>}

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t border-gray-100 bg-white px-4 py-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 rounded-pill border border-gray-200 px-4 py-2.5 text-sm text-ink placeholder-gray-400 outline-none transition-colors focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
        />
        {isSupported && (
          <button
            type="button"
            onClick={toggleMic}
            aria-label={isListening ? 'Stop recording' : 'Start voice input'}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
              isListening ? 'animate-pulse bg-brand text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <Microphone2 variant="Linear" color="currentColor" className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:bg-primary-200"
          aria-label="Send message"
        >
          <Send2 variant="Linear" color="currentColor" className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
