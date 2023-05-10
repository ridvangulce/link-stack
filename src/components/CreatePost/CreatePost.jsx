import React, { useState, useEffect, useRef } from 'react'
import { getAuth } from "firebase/auth";
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";



const CreatePost = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [content, setContent] = useState("");
  const [contentError, setContentError] = useState(null);

  useEffect(() => {
    inputRef.current.focus();
    // Firestore'dan verileri sıralı bir şekilde almak için "order" alanına göre sıralama yaparız
    const getOrderedPosts = async () => {
      const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("order")));
      console.log("Ordered posts", querySnapshot.docs.map(doc => doc.data()));
    };
    getOrderedPosts();
  }, []); // Sadece bir kez çalışması için boş bağımlılık listesi

  const createNewPost = async () => {
    // Verileri sırayla alma
    const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("order")));

    // Son belgenin order değerini alma
    const lastPost = querySnapshot.docs[querySnapshot.docs.length - 1];

    // Yeni belgenin order değerini hesaplama
    let newOrder;
    if (lastPost) {
      newOrder = lastPost.data().order + 1;
    } else {
      newOrder = 0;
    }

    // Belge verilerinin hazırlanması
    const postData = {
      content: content,
      time: new Date(),
      uid: user.uid,
      order: newOrder // Yeni belgenin order değeri
    };

    // Yeni belgenin Firestore'a eklenmesi
    await addDoc(collection(db, "posts"), postData);

    // Mevcut belgelerin order değerlerinin güncellenmesi
    const batch = db.batch();
    querySnapshot.docs.forEach((doc, index) => {
      const ref = doc(db, "posts", doc.id);
      const data = { order: index };
      batch.update(ref, data);
    });
    await batch.commit();
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
    setContentError(null); // Hata mesajını sıfırla
  };

  const handleSubmit = () => {
    // content input'unun dolu olup olmadığını kontrol edin
    if (!content) {
      setContentError("Content is required!");
      return;
    }

    createNewPost()
      .then(() => {
        navigate("/link-stack");
      })
      .catch((error) => {
        console.error("Hata oluştu: ", error);
      });

    setContent(""); // İçeriği sıfırla
  };

  const handleInputBlur = () => {
    handleSubmit();
  };

  return (
    <form>
      <div>
        <label htmlFor="content">Post Content:</label>
        <input
          type="text"
          id="content"
          name="content"
          value={content}
          onChange={handleContentChange}
          onBlur={handleInputBlur}
          ref={inputRef}
        />
        {contentError && (
          <div className="error">
            <p>{contentError}</p>
          </div>
        )}
      </div>
    </form>
  );
}
export default CreatePost;