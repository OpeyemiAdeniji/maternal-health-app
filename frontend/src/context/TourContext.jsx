import { createContext, useState } from 'react';

// lets sibling components under Main (Header/Sidebar's Learn coach-mark) know when the
// guided tour is active, so they can avoid showing competing UI at the same time —
// mirrors EpdsPromptContext for the same reason (Header/Sidebar aren't a child of Dashboard)
export const TourContext = createContext({
  isTourActive: false,
  setIsTourActive: () => {},
});

export function TourProvider({ children }) {
  const [isTourActive, setIsTourActive] = useState(false);

  return (
    <TourContext.Provider value={{ isTourActive, setIsTourActive }}>
      {children}
    </TourContext.Provider>
  );
}
