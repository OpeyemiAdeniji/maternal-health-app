import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import api from '../../services/api';

const QUESTIONS = [
  {
    text: 'I have been able to laugh and see the funny side of things',
    options: [
      { value: 0, label: 'As much as I always could' },
      { value: 1, label: 'Not quite so much now' },
      { value: 2, label: 'Definitely not so much now' },
      { value: 3, label: 'Not at all' },
    ],
  },
  {
    text: 'I have looked forward with enjoyment to things',
    options: [
      { value: 0, label: 'As much as I ever did' },
      { value: 1, label: 'Rather less than I used to' },
      { value: 2, label: 'Definitely less than I used to' },
      { value: 3, label: 'Hardly at all' },
    ],
  },
  {
    text: 'I have blamed myself unnecessarily when things went wrong',
    options: [
      { value: 0, label: 'No, never' },
      { value: 1, label: 'Not very often' },
      { value: 2, label: 'Yes, some of the time' },
      { value: 3, label: 'Yes, most of the time' },
    ],
  },
  {
    text: 'I have been anxious or worried for no good reason',
    options: [
      { value: 0, label: 'No, not at all' },
      { value: 1, label: 'Hardly ever' },
      { value: 2, label: 'Yes, sometimes' },
      { value: 3, label: 'Yes, very often' },
    ],
  },
  {
    text: 'I have felt scared or panicky for no very good reason',
    options: [
      { value: 0, label: 'No, not at all' },
      { value: 1, label: 'No, not much' },
      { value: 2, label: 'Yes, sometimes' },
      { value: 3, label: 'Yes, quite a lot' },
    ],
  },
  {
    text: 'Things have been getting on top of me',
    options: [
      { value: 0, label: 'No, I have been coping as well as ever' },
      { value: 1, label: 'No, most of the time I have coped quite well' },
      { value: 2, label: 'Yes, sometimes I have not been coping as well as usual' },
      { value: 3, label: 'Yes, most of the time I have not been able to cope at all' },
    ],
  },
  {
    text: 'I have been so unhappy that I have had difficulty sleeping',
    options: [
      { value: 0, label: 'No, not at all' },
      { value: 1, label: 'Not very often' },
      { value: 2, label: 'Yes, sometimes' },
      { value: 3, label: 'Yes, most of the time' },
    ],
  },
  {
    text: 'I have felt sad or miserable',
    options: [
      { value: 0, label: 'No, not at all' },
      { value: 1, label: 'Not very often' },
      { value: 2, label: 'Yes, quite often' },
      { value: 3, label: 'Yes, most of the time' },
    ],
  },
  {
    text: 'I have been so unhappy that I have been crying',
    options: [
      { value: 0, label: 'No, never' },
      { value: 1, label: 'Only occasionally' },
      { value: 2, label: 'Yes, quite often' },
      { value: 3, label: 'Yes, most of the time' },
    ],
  },
  {
    text: 'The thought of harming myself has occurred to me',
    options: [
      { value: 0, label: 'Never' },
      { value: 1, label: 'Hardly ever' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Yes, quite often' },
    ],
  },
];

function extractErrorMessage(err) {
  const data = err.response?.data;
  if (!data) return 'Something went wrong. Please try again.';
  if (typeof data === 'string') return data;
  if (data.non_field_errors?.[0]) return data.non_field_errors[0];
  if (data.detail) return data.detail;
  const firstValue = Object.values(data)[0];
  return Array.isArray(firstValue) ? firstValue[0] : 'Something went wrong. Please try again.';
}

export default function EPDS() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;
  const selectedValue = answers[currentQuestion];

  const handleSelect = (value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = value;
      return next;
    });
  };

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/api/epds/', { responses: answers });
      navigate('/epds/result', { state: { score: data.score } });
    } catch (err) {
      setError(extractErrorMessage(err));
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestion((q) => q + 1);
    }
  };

  const question = QUESTIONS[currentQuestion];

  return (
    <div className="flex flex-1 flex-col bg-white px-6 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="h-1.5 w-full rounded-full bg-primary-100">
          <div
            className="h-1.5 rounded-full bg-primary-600 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-muted">
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </p>

        <h1 className="mt-8 text-center text-xl font-semibold text-ink">{question.text}</h1>

        <div className="mt-8 space-y-3">
          {question.options.map((option) => {
            const selected = selectedValue === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full rounded-card border px-4 py-3.5 text-left text-sm font-medium transition-colors ${
                  selected
                    ? 'border-primary-600 bg-primary-100 text-primary-700'
                    : 'border-gray-200 bg-white text-ink hover:border-primary-300'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

        <Button className="mt-8" disabled={selectedValue === null || submitting} onClick={handleNext}>
          {submitting ? 'Submitting…' : isLastQuestion ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
