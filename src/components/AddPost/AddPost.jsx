import "./AddPost.css"
import React, { useState } from 'react';
import { getAuth } from "firebase/auth";
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { AiOutlineAppstoreAdd } from "react-icons/ai"


const AddPost = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const createNewPost = async () => {
    setIsLoading(true); // Veri eklenirken loading durumunu true olarak ayarlayın

    // Verileri sırayla alma


    // Yeni belge verilerinin hazırlanması
    const postData = {
      content: "Default Content",
      time: new Date(),
      uid: user.uid,
      order: -1,
      isActive: false
    };

    // Yeni belgenin Firestore'a eklenmesi
    await addDoc(collection(db, "posts"), postData);

    setIsLoading(false); // Veri ekleme tamamlandığında loading durumunu false olarak ayarlayın

    navigate("/"); // Anasayfaya yönlendir
  };

  const handleAddPostClick = () => {
    createNewPost()
      .catch((error) => {
        console.error("Hata oluştu: ", error);
      });
  };

  return (
    <div className='flex items-start  space-x-5 h-auto'>
      <div>
        <button className='bg-transparent border font-mono text-sm p-4 rounded-3xl' onClick={handleAddPostClick} disabled={isLoading}>
          {isLoading ? "Adding Header..." :
            <div className="flex whitespace-nowrap">
              <AiOutlineAppstoreAdd className="text-xl" />
              <span className="mr-2" />
              Add Header
            </div>}
        </button>
      </div>
    </div>
  );
};

export default AddPost;
