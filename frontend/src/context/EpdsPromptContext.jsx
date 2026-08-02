import { createContext, useState } from 'react';

// lets Header/Sidebar know Dashboard's EPDS prompt is open so they don't show competing UI, since they aren't children of Dashboard and can't take this as a prop
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
