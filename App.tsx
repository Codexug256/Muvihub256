import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { auth, db, storage } from './services/firebase';
import { Media, UserProfile, Download, ToastState } from './types';
import { extractTagsFromDescription, extractYearFromTitle } from './utils';
import { fetchMovieDetails, fetchTVDetails, fetchSeasonDetails } from './services/tmdb';

// Component imports
import AuthScreen from './components/AuthScreen';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import MoviesScreen from './components/MoviesScreen';
import SeriesScreen from './components/SeriesScreen';
import DownloadsScreen from './components/DownloadsScreen';
import AccountScreen from './components/AccountScreen';
import BottomNav from './components/BottomNav';
import MediaPlayPage from './components/MediaPlayPage';
import MyListScreen from './components/MyListScreen';
import ToastNotification from './components/ToastNotification';
import PremiumVideoPlayer from './components/PremiumVideoPlayer';
import LoadingSkeleton from './components/LoadingSkeleton';
import SubscriptionPage from './components/SubscriptionPage';
import AccessGate from './components/AccessGate';
import CategoriesModal from './components/CategoriesModal';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [movies, setMovies] = useState<Media[]>([]);
  const [series, setSeries] = useState<Media[]>([]);
  const [episodes, setEpisodes] = useState<Record<string, Media[]>>({});
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [myList, setMyList] = useState<Media[]>([]);
  const [continueWatching, setContinueWatching] = useState<Media[]>([]);
  
  const [activeScreen, setActiveScreen] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchGenre, setSearchGenre] = useState('');
  const [selectedGenreSeeAll, setSelectedGenreSeeAll] = useState('');
  const [showAllMovies, setShowAllMovies] = useState(false);
  const [showNewUploads, setShowNewUploads] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  
  const [playPageMedia, setPlayPageMedia] = useState<Media | null>(null);
  const [playerData, setPlayerData] = useState<{url: string, title: string, poster: string} | null>(null);
  const [showMyList, setShowMyList] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [subscriptionMedia, setSubscriptionMedia] = useState<Media | null>(null);
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Gating Logic
  const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem('muvihub_unlocked') === 'true');
  const [showAccessGate, setShowAccessGate] = useState(false);
  const [pendingMedia, setPendingMedia] = useState<Media | null>(null);
  const [pendingAction, setPendingAction] = useState<'play' | 'download' | null>(null);

  // Use refs to prevent infinite loop during enrichment
  const enrichedIds = useRef<Set<string>>(new Set());
  const enrichedSeasonIds = useRef<Set<string>>(new Set());

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  // Splash timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Sync Data
  useEffect(() => {
    if (!user) return;
    setIsLoading(true);

    const moviesRef = db.ref('movies');
    const seriesRef = db.ref('series');
    const userRef = db.ref(`users/${user.uid}`);
    const downloadsRef = db.ref(`downloads/${user.uid}`);

    moviesRef.on('value', async snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(k => ({ ...data[k], id: k, type: 'movie' as const }));
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        
        setMovies(list);

        // Enrichment
        const itemsToEnrich = list.filter(m => !m.tmdbData && !m.poster && !enrichedIds.current.has(m.id));
        if (itemsToEnrich.length > 0) {
          itemsToEnrich.forEach(async (m) => {
            enrichedIds.current.add(m.id);
            const year = extractYearFromTitle(m.title);
            const tmdb = await fetchMovieDetails(m.title, year);
            if (tmdb) {
              setMovies(prev => prev.map(item => item.id === m.id ? { ...item, tmdbData: tmdb } : item));
            }
          });
        }
      }
      setIsLoading(false);
    });

    seriesRef.on('value', async snapshot => {
      const data = snapshot.val();
      if (data) {
        const list = Object.keys(data).map(k => ({ ...data[k], id: k, type: 'series' as const }));
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        
        setSeries(list);
        list.forEach(s => fetchEpisodes(s.id));

        // Enrichment
        const itemsToEnrich = list.filter(s => !s.tmdbData && !s.poster && !enrichedIds.current.has(s.id));
        if (itemsToEnrich.length > 0) {
          itemsToEnrich.forEach(async (s) => {
            enrichedIds.current.add(s.id);
            const tmdb = await fetchTVDetails(s.title);
            if (tmdb) {
              setSeries(prev => prev.map(item => item.id === s.id ? { ...item, tmdbData: tmdb } : item));
            }
          });
        }
      }
    });

    userRef.on('value', snapshot => {
      if (snapshot.val()) setUserProfile(snapshot.val());
    });

    downloadsRef.on('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        setDownloads(Object.keys(data).map(k => ({ ...data[k], id: k })).sort((a, b) => b.downloadedAt - a.downloadedAt));
      }
    });

    // Load Local Lists
    const savedList = localStorage.getItem('myList');
    if (savedList) setMyList(JSON.parse(savedList));

    const savedContinue = localStorage.getItem('continueWatching');
    if (savedContinue) setContinueWatching(JSON.parse(savedContinue));

    return () => {
      moviesRef.off();
      seriesRef.off();
      userRef.off();
      downloadsRef.off();
    };
  }, [user]);

  const fetchEpisodes = (seriesId: string) => {
    db.ref(`episodes/${seriesId}`).on('value', async snapshot => {
      const data = snapshot.val();
      if (data) {
        const episodeList = Object.keys(data).map(k => ({ ...data[k], id: k, seriesId, type: 'episode' as const })).sort((a,b) => (a.episodeNumber||0)-(b.episodeNumber||0));
        
        setEpisodes(prev => ({
          ...prev,
          [seriesId]: episodeList
        }));

        // Enrich episodes with images/synopsis from TMDB
        const parentSeries = series.find(s => s.id === seriesId);
        if (parentSeries?.tmdbData?.id && !enrichedSeasonIds.current.has(seriesId)) {
          enrichedSeasonIds.current.add(seriesId);
          const seasonData = await fetchSeasonDetails(parentSeries.tmdbData.id, 1);
          if (seasonData?.episodes) {
            setEpisodes(prev => {
              const current = prev[seriesId] || [];
              const enriched = current.map(ep => {
                const tmdbEp = seasonData.episodes.find((tep: any) => tep.episode_number === ep.episodeNumber);
                if (tmdbEp) {
                  return {
                    ...ep,
                    tmdbData: tmdbEp,
                    image: tmdbEp.still_path ? `https://image.tmdb.org/t/p/w300${tmdbEp.still_path}` : ep.image,
                    description: tmdbEp.overview || ep.description
                  };
                }
                return ep;
              });
              return { ...prev, [seriesId]: enriched };
            });
          }
        }
      }
    });
  };

  // State Persistence
  useEffect(() => {
    localStorage.setItem('myList', JSON.stringify(myList));
  }, [myList]);

  useEffect(() => {
    localStorage.setItem('continueWatching', JSON.stringify(continueWatching));
  }, [continueWatching]);

  // Derived Media
  const allMedia = useMemo(() => {
    return [...movies, ...series].map(m => ({
      ...m,
      extractedTags: extractTagsFromDescription(m.description)
    }));
  }, [movies, series]);

  const filteredMedia = useMemo(() => {
    let list = allMedia;
    const dayAgo = Date.now() - 86400000;

    if (showNewUploads) {
      list = list.filter(m => (m.createdAt || 0) > dayAgo);
    }
    if (selectedGenreSeeAll) {
      list = list.filter(m => m.genre === selectedGenreSeeAll);
    }
    if (searchQuery || searchGenre) {
      list = list.filter(m => 
        (m.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!searchGenre || m.genre === searchGenre)
      );
    }
    return list;
  }, [allMedia, searchQuery, searchGenre, showNewUploads, selectedGenreSeeAll]);

  const mediaByGenre = useMemo(() => {
    const groups: Record<string, Media[]> = {};
    allMedia.forEach(m => {
      const g = m.genre || 'General';
      if (!groups[g]) groups[g] = [];
      groups[g].push(m);
    });
    return groups;
  }, [allMedia]);

  // Handlers
  const handleMediaClick = (m: Media) => {
    setPlayPageMedia(m);
  };

  const handlePlayRequest = (m: Media) => {
    if (isUnlocked) {
      setPlayerData({ url: m.video || '', title: m.title, poster: m.poster || m.image || '' });
      
      // Update Continue Watching
      setContinueWatching(prev => {
        const filtered = prev.filter(item => item.id !== m.id);
        const newList = [m, ...filtered].slice(0, 10);
        return newList;
      });
    } else {
      setPendingMedia(m);
      setPendingAction('play');
      setShowAccessGate(true);
    }
  };

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('muvihub_unlocked', 'true');
    setShowAccessGate(false);
    if (pendingMedia) {
      if (pendingAction === 'play') {
        handlePlayRequest(pendingMedia);
      } else if (pendingAction === 'download') {
        showToast(`Starting download for "${pendingMedia.title}"...`, "success");
      }
      setPendingMedia(null);
      setPendingAction(null);
    }
  };

  const toggleMyList = (m: Media, e: React.MouseEvent) => {
    e.stopPropagation();
    const exists = myList.some(i => i.id === m.id);
    if (exists) {
      setMyList(prev => prev.filter(i => i.id !== m.id));
      showToast(`Removed "${m.title}" from My List`);
    } else {
      setMyList(prev => [...prev, m]);
      showToast(`Added "${m.title}" to My List`);
    }
  };

  const handleDownload = (m: Media) => {
    if (isUnlocked) {
      showToast(`Starting download for "${m.title}"...`, "success");
    } else {
      setPendingMedia(m);
      setPendingAction('download');
      setShowAccessGate(true);
    }
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast("Uploading profile picture...");
      const ref = storage.ref(`profiles/${user.uid}_${Date.now()}`);
      await ref.put(file);
      const url = await ref.getDownloadURL();
      await db.ref(`users/${user.uid}`).update({ photoURL: url, photoUpdatedAt: Date.now() });
      showToast("Profile updated!");
    } catch {
      showToast("Upload failed", "error");
    }
  };

  const isSearching = !!(searchQuery || searchGenre || selectedGenreSeeAll || showAllMovies || showNewUploads);

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[10000] bg-[#0a0a0a] flex flex-col items-center justify-center">
        <div className="w-48 h-48 mb-8 splash-logo">
          <img src="https://iili.io/f6WKiPV.png" alt="MuviHub UG Logo" className="w-full h-full object-contain" />
        </div>
        <p className="mt-8 text-white/80 font-black uppercase tracking-[0.5em] text-[10px]">Muvihub Ug Company</p>
      </div>
    );
  }

  if (!user) return <AuthScreen showAuth={true} setShowAuth={() => {}} />;

  return (
    <div className="relative min-h-screen pb-20">
      <MyListScreen 
        isOpen={showMyList} 
        onClose={() => setShowMyList(false)} 
        list={myList}
        onMediaClick={handleMediaClick}
        onRemove={(id) => setMyList(prev => prev.filter(i => i.id !== id))}
      />

      <CategoriesModal 
        isOpen={showCategories}
        onClose={() => setShowCategories(false)}
        onSelect={(g) => { setSearchGenre(g); setActiveScreen('home'); }}
        allMedia={allMedia}
      />

      {showSubscription && (
        <SubscriptionPage 
          media={subscriptionMedia} 
          onClose={() => setShowSubscription(false)} 
          onContinue={() => {
            setShowSubscription(false);
            showToast("Payment portal opening...", "success");
          }} 
        />
      )}

      {showAccessGate && (
        <AccessGate 
          onUnlock={handleUnlock}
          onGoToPremium={() => { setShowAccessGate(false); setShowSubscription(true); }}
          onClose={() => setShowAccessGate(false)}
        />
      )}

      {playPageMedia ? (
        <MediaPlayPage 
          media={playPageMedia} 
          onClose={() => setPlayPageMedia(null)}
          onPlay={handlePlayRequest}
          onDownload={handleDownload}
          episodes={episodes[playPageMedia.id] || []}
          recommended={allMedia.filter(m => m.genre === playPageMedia.genre && m.id !== playPageMedia.id).slice(0, 8)}
          onMediaClick={handleMediaClick}
          isInList={myList.some(i => i.id === playPageMedia.id)}
          onToggleList={(e) => toggleMyList(playPageMedia, e)}
        />
      ) : (
        <>
          {activeScreen !== 'account' && (
            <Header 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchGenre={searchGenre}
              setSearchGenre={(g) => { setSearchGenre(g); setActiveScreen('home'); }}
              allMedia={allMedia}
              onNotifications={() => { setShowNewUploads(true); setActiveScreen('home'); }}
              newCount={movies.filter(m => (m.createdAt || 0) > (Date.now() - 86400000)).length}
              onOpenCategories={() => setShowCategories(true)}
            />
          )}
          
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {isSearching && activeScreen !== 'account' ? (
                <HomeScreen 
                  allMedia={filteredMedia}
                  continueWatching={[]}
                  mediaByGenre={{}}
                  onMediaClick={handleMediaClick}
                  isSearching={true}
                  onSeeAll={() => {}}
                  onGenreSeeAll={() => {}}
                  clearFilters={() => { setSearchQuery(''); setSearchGenre(''); setShowAllMovies(false); setShowNewUploads(false); setSelectedGenreSeeAll(''); }}
                />
              ) : (
                <>
                  {activeScreen === 'home' && (
                    <HomeScreen 
                      allMedia={filteredMedia}
                      continueWatching={continueWatching}
                      mediaByGenre={mediaByGenre}
                      onMediaClick={handleMediaClick}
                      isSearching={false}
                      onSeeAll={() => setShowAllMovies(true)}
                      onGenreSeeAll={setSelectedGenreSeeAll}
                      clearFilters={() => { setSearchQuery(''); setSearchGenre(''); setShowAllMovies(false); setShowNewUploads(false); setSelectedGenreSeeAll(''); }}
                    />
                  )}
                  {activeScreen === 'movies' && <MoviesScreen movies={movies} onMediaClick={handleMediaClick} />}
                  {activeScreen === 'series' && <SeriesScreen series={series} onMediaClick={handleMediaClick} />}
                  {activeScreen === 'downloads' && <DownloadsScreen downloads={downloads} onDelete={(id) => db.ref(`downloads/${user.uid}/${id}`).remove()} />}
                  {activeScreen === 'account' && (
                    <AccountScreen 
                      profile={userProfile} 
                      onUpload={handleProfileUpload} 
                      onLogout={() => auth.signOut()} 
                      onBack={() => setActiveScreen('home')}
                      onManagePlan={() => { setSubscriptionMedia(null); setShowSubscription(true); }}
                      onMyList={() => setShowMyList(true)}
                    />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {!playPageMedia && <BottomNav active={activeScreen} onNavigate={setActiveScreen} />}
      
      {playerData && (
        <PremiumVideoPlayer 
          url={playerData.url} 
          title={playerData.title} 
          poster={playerData.poster} 
          onClose={() => setPlayerData(null)}
          onDownload={() => playPageMedia && handleDownload(playPageMedia)}
        />
      )}

      {toast.show && <ToastNotification message={toast.message} type={toast.type} onHide={() => setToast(t => ({ ...t, show: false }))} />}
    </div>
  );
};

export default App;