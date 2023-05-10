import React, { useState } from 'react';
import { getAuth } from "firebase/auth";
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import "./AddPost.css"
import { useNavigate } from 'react-router-dom';
import DrivePage from '../../pages/DrivePage/DrivePage';
const AddPost = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const createNewPost = async () => {
    setIsLoading(true); // Veri eklenirken loading durumunu true olarak ayarlayın

    // Verileri sırayla alma
    const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("order")));

    const lastPost = querySnapshot.docs[querySnapshot.docs.length - 1];

    let newOrder;

    if (lastPost) {
      newOrder = lastPost.data().order + 1;
    } else {
      newOrder = 0;
    }
    // Yeni belge verilerinin hazırlanması
    const postData = {
      content: "Default Content",
      time: new Date(),
      uid: user.uid,
      order: newOrder,
      isActive: false
    };

    // Yeni belgenin Firestore'a eklenmesi
    await addDoc(collection(db, "posts"), postData);

    setIsLoading(false); // Veri ekleme tamamlandığında loading durumunu false olarak ayarlayın

    navigate("/link-stack"); // Anasayfaya yönlendir
  };

  const handleAddPostClick = () => {
    createNewPost()
      .catch((error) => {
        console.error("Hata oluştu: ", error);
      });
  };

  return (
      <div className='flex items-center justify-around space-x-5 h-auto'>
        <div>
          <button className='bg-blue-300 p-4 items-center rounded-3xl' onClick={handleAddPostClick} disabled={isLoading}>
            {isLoading ? "Adding Header..." : "Header"}
          </button>
        </div>
        <div>
          <button className='bg-blue-300 p-4 items-center rounded-3xl' disabled={isLoading}>
            <DrivePage />
          </button>
        </div>
      </div>
  );
};

export default AddPost;
