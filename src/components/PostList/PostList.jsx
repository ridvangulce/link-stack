import React, { useState, useEffect, useContext } from "react";
import "./PostList.css";
import { UserContext } from "../../UserContext";
import { db, auth } from "../../firebase";
import {
    collection,
    getDocs,
    query,
    orderBy,
    where
} from "firebase/firestore";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import '@react-pdf-viewer/core/lib/styles/index.css';
const PostList = ({ handleDragEnd, handleToggle }) => {
    const [posts, setPosts] = useState([]);
    const [userNotFound, setUserNotFound] = useState(false);
    const [postNotFound, setPostNotFound] = useState(false);
    const { userInfo = {}, setUserInfo } = useContext(UserContext)


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    return;
                }
                const userId = user.uid;

                const snapshot = await getDocs(
                    query(
                        collection(db, "posts"),
                        where("uid", "==", userId),
                        orderBy("order")
                    )
                );
                if (snapshot.empty) {
                    setPostNotFound(true);
                } else {
                    const filteredPosts = snapshot.docs.filter((doc) => doc.data().isActive === true);
                    const posts = filteredPosts.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setPosts(posts);
                }
            } catch (error) {
                console.log("Error getting documents: ", error);
            }
        };

        fetchPosts();
    }, [handleDragEnd, handleToggle]);

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
        <section className="container flex items-center justify-center">
            <div className=" flex flex-col items-center justify-start px-3 pt-4 border-black border-solid border-4 rounded-3xl bg-gradient-to-r from-transparent to-blue-500 h-96 w-60 overflow-hidden hover:overflow-y-auto">
                {postNotFound && (
                    <div>
                        <div className='menu-trigger'>
                            <span>{userInfo && userInfo.username ? userInfo.username.charAt(0).toUpperCase() : null} </span>
                        </div>
                        <h2>@{userInfo.username}</h2>
                    </div>
                )}
                {!postNotFound && (
                    <div className="flex flex-col items-center justify-center px-3 pb-3 ">
                        <div className='menu-trigger'>
                            <span>{userInfo && userInfo.username ? userInfo.username.charAt(0).toUpperCase() : null} </span>
                        </div>
                        <h1 className="font-bold text-lg mb-5">@{userInfo.username}</h1>
                        {posts.map((post) => (
                            <div key={post.id} className="">
                                {post.content && !post.url&& (
                                    <div>
                                        <h1 className="font-bold text-xs w-56 h-10 mb-3 text-white bg-gradient-to-r from-gray-400 to-gray-700 drop-shadow-2xl p-4  rounded-full flex items-center justify-center">
                                            {post.content}
                                        </h1>
                                    </div>
                                )}
                                {post.url && (
                                    <div className="flex flex-col items-center justify-center">
                                        <div>
                                            <h1
                                                className="font-bold text-xs w-56 h-10 mb-3 text-white bg-gradient-to-r from-gray-400 to-gray-700 drop-shadow-2xl p-4  rounded-full hover:cursor-pointer flex items-center justify-center bg-red-500"
                                                onClick={() => handlePostTitleClick(post.id)}
                                            >
                                                {post.content}
                                            </h1>
                                        </div>
                                        {post.isOpen && (
                                            <div className="flex items-center justify-center mb-3">
                                                {post.isPdf ? (
                                                    <iframe src={post.url} width="200" height="auto" style={{ overflow: "hidden" }} />
                                                ) : (
                                                    <img className="rounded-3xl" src={post.url} alt={post.title} height="auto" width="200" />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );

};

export default PostList;
