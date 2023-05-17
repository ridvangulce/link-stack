import React, { useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { db, auth } from "../../firebase";
import { UserContext } from "../../UserContext";
import {
    collection,
    getDocs,
    query,
    orderBy,
    where
} from "firebase/firestore";
import { BsPencil, BsFillTrash3Fill } from "react-icons/bs";

const Posts = () => {
    const [userNotFound, setUserNotFound] = useState(false);
    const [userId, setUserId] = useState("");
    const [posts, setPosts] = useState([]);
    const { username } = useParams();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const q = query(
                    collection(db, "users"),
                    where("username", "==", username)
                );
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    setUserNotFound(true);
                    return;
                }

                const userDoc = querySnapshot.docs[0];
                const { uid } = userDoc.data();

                setUserId(uid);
            } catch (error) {
                console.log("Error getting user information: ", error);
            }
        };

        fetchUserInfo();
    }, [username]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!userId) return;

            const postRef = collection(db, "posts");
            const postQuery = query(postRef, where("uid", "==", userId), orderBy("order"));
            const postSnapshot = await getDocs(postQuery);
            const posts = postSnapshot.docs.filter(doc => doc.data().isActive).map((doc) => ({
                id: doc.id,
                ...doc.data(),
                isOpen: false, // Yeni durumu ekle
            }));
            setPosts(posts);
        };

        fetchUserPosts();
    }, [userId]);

    const handlePostTitleClick = (postId) => {
        setPosts(prevPosts => prevPosts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    isOpen: !post.isOpen, // Durumu tersine çevir
                };
            }
            return post;
        }));
    };
    return (
        <>
            {posts.map((post) => (
                <div key={post.id} className="">
                    {post.content && !post.url && (
                        <div>
                            <h1 className=" font-extrabold text-lg bg-opacity-10 bg-white text-black p-2 px-12 md:p-4 md:px-48 justify-items-center items-center drop-shadow-2xl  rounded-xl whitespace-nowrap">
                                {post.content}
                            </h1>
                        </div>
                    )}
                    {post.url && (
                        <div>
                            <div>
                                <h1
                                    className="font-bold text-sm p-2 px-12 md:p-4 md:px-48 justify-items-center justify-center text-white bg-gradient-to-r from-red-400 to-black  drop-shadow-2xl  rounded-full hover:cursor-pointer flex items-center justify-cente"
                                    onClick={() => handlePostTitleClick(post.id)}
                                >
                                    {post.content}
                                </h1>
                            </div>
                            {post.isOpen && (
                                <div>
                                    {post.isPdf ? (
                                        <iframe src={post.url} width="100%" height="500px" style={{ overflow: "hidden" }} />
                                    ) : (
                                        <img className="rounded-3xl" src={post.url} alt={post.title} height="400" width="400" />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </>

    )
}

export default Posts