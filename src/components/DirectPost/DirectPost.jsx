import React, { useState } from 'react';
import { getAuth } from "firebase/auth";
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const DirectPost = ({ changePostState }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [url, setUrl] = useState('');
    const [isUrlValid, setIsUrlValid] = useState(false);

    const createNewLink = async () => {
        setIsLoading(true);

        const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("order")));
        const lastPost = querySnapshot.docs[querySnapshot.docs.length - 1];

        let newOrder;

        if (lastPost) {
            newOrder = lastPost.data().order + 1;
        } else {
            newOrder = 0;
        }

        const postData = {
            content: "Default Content",
            time: new Date(),
            uid: user.uid,
            order: newOrder,
            isActive: false,
            directUrl: url
        };

        await addDoc(collection(db, "posts"), postData);

        setIsLoading(false);
        navigate("/");
    };

    const handleDirectClick = () => {
        if (!isUrlValid) {
            console.error("URL is required");
            return;
        }

        createNewLink().catch((error) => {
            console.error("An error occurred: ", error);
        });
    };

    const handleUrlChange = (e) => {
        const inputValue = e.target.value;
        setUrl(inputValue);

        // URL geçerli mi kontrolü
        const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
        const isValid = urlRegex.test(inputValue);
        setIsUrlValid(isValid);
    };

    return (
        <div className='flex'>
            <input className='border my-3 w-full text-center font-semibold rounded-full' type="text" placeholder='Enter URL' value={url} onChange={handleUrlChange} />
            <button className={`${isUrlValid ? " bg-violet-800 text-white " : "bg-red-200 text-red-400"}  font-bold rounded-3xl p-5 ml-4`}
                onClick={() => {
                    handleDirectClick()
                    changePostState()                    
                }}
                disabled={!isUrlValid}>
                Add Link
            </button>
        </div>
    );
};

export default DirectPost;
