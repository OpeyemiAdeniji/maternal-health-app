import { createContext, useState } from 'react';

// lets Header/Sidebar know the guided tour is active so they don't show competing UI, since they aren't children of Dashboard and can't take this as a prop
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
