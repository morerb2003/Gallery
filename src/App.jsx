import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Lightbox from './components/Lightbox';
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import { photosData } from './data/photos';

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Sync with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.startsWith('gallery')) {
        setActivePage('gallery');
        const params = new URLSearchParams(hash.split('?')[1] || '');
        const cat = params.get('category');
        if (cat) setSelectedCategory(cat);
      } else {
        setActivePage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page, category = null) => {
    setActivePage(page);
    if (category) {
      setSelectedCategory(category);
      window.location.hash = `gallery?category=${category}`;
    } else {
      window.location.hash = page;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Glass Navbar */}
      <Navbar activePage={activePage} onNavigate={handleNavigate} />

      {/* Main Page Area */}
      <main className="flex-1">
        {activePage === 'home' ? (
          <HomePage
            photos={photosData}
            onNavigate={handleNavigate}
            onSelectPhoto={setSelectedPhoto}
          />
        ) : (
          <GalleryPage
            photos={photosData}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectPhoto={setSelectedPhoto}
          />
        )}
      </main>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          photosList={photosData}
          onClose={() => setSelectedPhoto(null)}
          onNavigate={setSelectedPhoto}
        />
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
