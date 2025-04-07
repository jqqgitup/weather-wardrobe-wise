
import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  weatherBackground?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, weatherBackground = 'bg-gradient-to-b from-blue-400 to-blue-600' }) => {
  return (
    <div className={`min-h-screen ${weatherBackground} text-white`}>
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/10 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="mr-2">🧥</span>
            <span>Weather Wardrobe</span>
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
