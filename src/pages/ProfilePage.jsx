import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, getDocs, where } from "firebase/firestore";
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
    const [posts, setPosts] = useState([]);
    const { username } = useParams();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Kullanıcı adına karşılık gelen uid'yi bulma
                const querySnapshot = await getDocs(collection(db, "users"), where("username", "==", username));
                let userId;
                querySnapshot.forEach((doc) => {
                    userId = doc.id;
                });

                // Kullanıcının postlarını çekme
                const snapshot = await getDocs(collection(db, "posts"), where("uid", "==", userId));
                let posts = [];
                snapshot.forEach((doc) => {
                    posts.push(doc.data());
                });
                setPosts(posts);
            } catch (error) {
                console.log("Error getting documents: ", error);
            }
        };

        fetchPosts();
    }, [username]);

    return (
        <div>
            <h1>Post List for {username}</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.uid}>
                        <p>{post.title}</p>
                        <p>{post.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfilePage;
