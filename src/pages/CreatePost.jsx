import React, { useState, useEffect } from 'react'
import { getAuth } from "firebase/auth";
import { db } from '../firebase';
import { collection, addDoc,getDocs,query,orderBy } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";



const CreatePost = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();
  
    const [content, setContent] = useState("");
    const [contentError, setContentError] = useState(null);
  
    useEffect(() => {
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
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      // title, summary ve content inputlarının hepsi dolu mu kontrol ediyoruz
      if (!content) {
        setContentError(!content ? "Content is required!" : null);
        return;
      }
  
      createNewPost()
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Hata oluştu: ", error);
        });
  
      setContent("");
    };
  
    const handleContentChange = (value) => {
      setContent(value);
      setContentError(null); // Hata mesajını sıfırla
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <ReactQuill value={content} onChange={handleContentChange} />
          {contentError && (
            <div className="error">
              <p>{contentError}</p>
            </div>
          )}{" "}
          {/* Hata mesajı */}
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Create Post
        </button>
      </form>
    );
  };
  

export default CreatePost;






