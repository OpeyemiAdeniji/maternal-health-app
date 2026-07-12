import { useEffect, useRef, useState } from 'react';
import { MicrophoneIcon, SendIcon, SparkleIcon } from '../../components/common/icons';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
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

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <ModaAvatar />}
      <div
        className={`max-w-[75%] whitespace-pre-wrap rounded-card px-4 py-2.5 text-sm shadow-soft ${
          isUser ? 'bg-primary-600 text-white' : 'border border-primary-200 bg-white text-ink'
        }`}
      >
        {message.content}
      </div>
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

  const handleSend = async (e) => {
    e.preventDefault();
    const content = input.trim();
    if (!content || sending) return;

    setError('');
    setInput('');
    setMessages((prev) => [...prev, { id: `local-${prev.length}`, role: 'user', content }]);
    setSending(true);

    try {
      const { data } = await api.post('/api/chat/', { content });
      setMessages((prev) => [...prev, data]);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col bg-primary-50">
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
          <MessageBubble key={message.id} message={message} />
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
              isListening ? 'animate-pulse bg-red-500 text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            <MicrophoneIcon className="h-4 w-4" />
          </button>
        )}
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:bg-primary-200"
          aria-label="Send message"
        >
          <SendIcon className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
