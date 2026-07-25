import { useContext } from 'react';
import { EpdsPromptContext } from '../context/EpdsPromptContext';

export default function useEpdsPrompt() {
  return useContext(EpdsPromptContext);
}
