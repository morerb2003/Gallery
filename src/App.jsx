import React, { useEffect, useState } from 'react'
import axios from 'axios';
import LoadingOverlay from './components/LoadingOverlay';
import ErrorMessage from './components/ErrorMessage';
import GalleryGrid from './components/GalleryGrid';
import PaginationFooter from './components/PaginationFooter';
import ImageModal from './components/ImageModal';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchImages() {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`https://picsum.photos/v2/list?page=${page}&limit=6`);
        setData(response.data);
        setSelectedImage(null);
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [page]);
  
  return (
    <div className="bg-black min-h-screen text-white p-6">
        <LoadingOverlay loading={loading} />

        <div className="mb-4 text-sm text-zinc-300">
          {loading ? 'Loading images...' : `Page ${page}`}
        </div>

        <ErrorMessage error={error} />

        <GalleryGrid data={data} onSelectImage={setSelectedImage} />

        <PaginationFooter
          loading={loading}
          page={page}
          onPrevious={() => setPage((prev) => Math.max(1, prev - 1))}
          onNext={() => setPage((prev) => prev + 1)}
        />

        <ImageModal
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
    </div>
  )
}

export default App
