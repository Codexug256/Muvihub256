
import React from 'react';
import { Media } from '../types';
import MediaCard from './MediaCard';

interface Props {
  movies: Media[];
  onMediaClick: (m: Media) => void;
}

const MoviesScreen: React.FC<Props> = ({ movies, onMediaClick }) => {
  return (
    <div className="px-5 pt-20 pb-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black">Movies</h2>
        <div className="text-sm text-white/40 font-bold uppercase tracking-widest">{movies.length} titles</div>
      </div>
      
      {movies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/20">
          <i className="fas fa-film text-6xl mb-4"></i>
          <p className="text-xl font-bold">No movies found</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {movies.map(m => (
            <MediaCard key={m.id} media={m} onClick={() => onMediaClick(m)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesScreen;
