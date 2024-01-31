import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import './index.css';
import Photo from './Photo';
import  Connect from './Connect'
import back_image from './assets/BackGround_Image.png'

//process.env.REACT_APP_ACCESS_KEY
const clientID = `?client_id=UnV5TD4AW3KbPv4PZGiJr8uLqVqPQN__dZKMZ9iC8to`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;


function App() {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const mounted = useRef(false);
  const [newImages, setNewImages] = useState(false);
  const [login,setLogin] = useState(false);
  const fetchImages = async () => {
    setLoading(true);
    let url;
    const urlPage = `&page=${page}`;
    const urlQuery = `&query=${query}`;
    if (query) {
      url = `${searchUrl}${clientID}${urlPage}${urlQuery}`;
    } else {
      url = `${mainUrl}${clientID}${urlPage}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setPhotos((oldPhotos) => {
        if (query && page === 1) {
          return data.results;
        } else if (query) {
          return [...oldPhotos, ...data.results];
        } else {
          return [...oldPhotos, ...data];
        }
      });
      setNewImages(false);
      setLoading(false);
    } catch (error) {
      setNewImages(false);

      setLoading(false);
    }
  };
  useEffect(() => {
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!newImages) return;
    if (loading) return;
    setPage((oldPage) => oldPage + 1);
  }, [newImages]);

  const event = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
      setNewImages(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', event);
    return () => window.removeEventListener('scroll', event);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query) return;
    if (page === 1) {
      fetchImages();
    }
    setPage(1);
  };
  return (
      <>

      {!login ? (
        <div className='w-full h-screen bg-black-500 rounded-lg'
        style = {{backgroundImage:back_image}}
        >
            <Connect loginCheck={login} setLogin={setLogin}/>
        </div>
      ):(
        <main>
        <section className='search'>
          <form className='search-form'>
            <input
              type='text'
              placeholder='search'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='form-input'
            />
            <button type='submit' className='submit-btn' onClick={handleSubmit}>
              <FaSearch />
            </button>
          </form>
        </section>
        <section className='photos'>
          <div className='photos-center'>
            {photos.map((image, index) => {
              return <Photo key={index} {...image} />;
            })}
          </div>
          {loading && <h2 className='loading'>Loading...</h2>}
        </section>
      </main>
      )}
      
      </>
  );
}

export default App;
