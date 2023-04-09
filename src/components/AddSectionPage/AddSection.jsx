import React, { useState } from 'react';
import './AddSection.css';
import CreatePost from '../CreatePost/CreatePost';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, orderBy, writeBatch } from "firebase/firestore";

const AddSection = () => {
  const [showPost, setShowPost] = useState(false);
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const createNewPost = async (postData) => {
    // Belge verilerinin hazırlanması
    const newPostData = {
      content: postData.content,
      time: new Date(),
      uid: postData.uid,
      order: postData.order // Yeni belgenin order değeri
    };

    // Yeni belgenin Firestore'a eklenmesi
    await addDoc(collection(db, "posts"), newPostData);

    // Mevcut belgelerin order değerlerinin güncellenmesi
    const batch = writeBatch(db);
    const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("order")));
    querySnapshot.docs.forEach((doc, index) => {
      const ref = doc(db, "posts", doc.id);
      const data = { order: index };
      batch.update(ref, data);
    });
    await batch.commit();
  };

  const handleAddPost = () => {
    setShowPost(true);

    const postData = { // Yeni post verileri
      content: "Buraya yazı eklenecek", // İstediğiniz metni burada belirtebilirsiniz.
      uid: user.uid, // Kullanıcının uid'si
      order: posts.length // Mevcut post sayısı kadar olacak şekilde yeni belgenin order değeri
    };
    createNewPost(postData)
        .then(() => {
          console.log("Yeni post başarıyla oluşturuldu!");
        })
        .catch((error) => {
          console.error("Hata oluştu: ", error);
        });
  };

  return (
    <div className='add-section-container'>
      {showPost ? (
        <div>
          <button className='close-tab' onClick={() => setShowPost(false)}>X</button>
          <CreatePost />
        </div>
      ) : (
        <div className={showPost ? 'hidden' : ''}>
          <button className='button' onClick={handleAddPost}>Yazı Ekle</button>
        </div>
      )}
    </div>
  );
}

export default AddSection;
