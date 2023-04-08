import React, { useState, useEffect, useRef } from "react";
import LoginPage from "../pages/LoginPage";
import { db } from "../firebase";
import {
    collection,
    getDocs,
    addDoc,
    doc,
    getDoc,
    where,
    query,
    onSnapshot,
    updateDoc,
    orderBy,
    writeBatch
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Demo = () => {
    const [posts, setPosts] = useState([]);


    const inputRef = useRef(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const postsQuery = query(collection(db, "posts"), where("uid", "==", user.uid), orderBy("order"));
                const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
                    const newPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    setPosts(newPosts);
                });
            } else {
                setPosts([]);
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);


    return (
        <div>


            <div>
                {posts.map((post, index) => (
                    <div key={post.id} className="texts">
                        <p dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>))}
            </div>
        </div>
    );
};

export default Demo;