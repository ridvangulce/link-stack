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
                    console.log(`No posts found for user: ${user.email}`);
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

    return (
        <section>
            <div className="post-list">
                {postNotFound && (
                    <div>
                        <div className='menu-trigger'>
                            <span>{userInfo && userInfo.username ? userInfo.username.charAt(0).toUpperCase() : null} </span>
                        </div>
                        <h2>@{userInfo.username}</h2>
                    </div>
                )}
                {!postNotFound && (
                    <>
                        <div className='menu-trigger'>
                            <span>{userInfo && userInfo.username ? userInfo.username.charAt(0).toUpperCase() : null} </span>
                        </div>
                        <h2>@{userInfo.username}</h2>
                        {posts.map((post) => (
                            <div key={post.id}>
                                {post.url && ( // post.url mevcut ise
                                    post.isPdf ? (
                                        <iframe src={post.url} width="100%" height="500px" style={{ overflow: "hidden" }} />

                                    ) : (
                                        <img src={post.url} alt={post.title} height="500px" width="300px" />
                                    )
                                )}
                                <div>
                                    <h1 className="font-bold">
                                        {post.content}
                                    </h1>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </section>
    );

};

export default PostList;
