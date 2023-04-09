import React, { useState } from 'react';
import CreatePost from '../pages/CreatePost';

const AddSection = () => {
  const [showPost, setShowPost] = useState(false);

  return (
    <div className='add-section-container'>
      {showPost ? (
        <div>
          <button className='close-tab' onClick={() => setShowPost(false)}>X</button>
          <CreatePost />
        </div>
      ) : (
        <div className={showPost ? 'hidden' : ''}>
          <button onClick={() => setShowPost(true)}>Yazı Ekle</button>
        </div>
      )}
    </div>
  );
}

export default AddSection;
