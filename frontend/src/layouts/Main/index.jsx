import { Outlet } from 'react-router-dom';
import { EpdsPromptProvider } from '../../context/EpdsPromptContext';
import { TourProvider } from '../../context/TourContext';
import useAuth from '../../hooks/useAuth';
import Header from '../Header';
import Footer from '../Footer';
import Sidebar from '../Sidebar';

export default function Main() {
  const { user } = useAuth();

  return (
    <EpdsPromptProvider>
      <TourProvider>
        <div className="flex min-h-screen flex-col lg:bg-[#fafafa]">
          <Sidebar userName={user?.full_name} />

          <div className="flex min-h-screen flex-1 flex-col lg:ml-60">
            <Header />
            <main className="flex flex-1 flex-col pb-24 lg:items-center lg:px-8 lg:py-10 lg:pb-0">
              <div className="flex w-full flex-1 flex-col lg:max-w-[680px] lg:overflow-hidden lg:rounded-card lg:bg-white lg:shadow-soft">
                <Outlet />
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </TourProvider>
    </EpdsPromptProvider>
  );
}
