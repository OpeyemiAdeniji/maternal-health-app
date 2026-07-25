import { createContext, useState } from 'react';

// lets sibling components under Main (Header/Sidebar) know when Dashboard's EPDS
// prompt modal is open, so they can avoid showing competing UI (e.g. the Learn
// coach-mark) at the same time — Header/Sidebar and Dashboard aren't in a
// parent/child relationship, so this can't just be a prop
export const EpdsPromptContext = createContext({
  isEpdsPromptOpen: false,
  setIsEpdsPromptOpen: () => {},
});

export function EpdsPromptProvider({ children }) {
  const [isEpdsPromptOpen, setIsEpdsPromptOpen] = useState(false);

  return (
    <EpdsPromptContext.Provider value={{ isEpdsPromptOpen, setIsEpdsPromptOpen }}>
      {children}
    </EpdsPromptContext.Provider>
  );
}
