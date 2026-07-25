import { useContext } from 'react';
import { TourContext } from '../context/TourContext';

export default function useTour() {
  return useContext(TourContext);
}
