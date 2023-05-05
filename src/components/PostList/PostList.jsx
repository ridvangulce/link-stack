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
                // Kullanıcının postlarını çekme
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
                {postNotFound && <p>Post not found</p>}
                {!postNotFound && (
                    <>
                        <div className='menu-trigger'>
                            <span>{userInfo && userInfo.username ? userInfo.username.charAt(0).toUpperCase() : null} </span>
                        </div>
                        <h2>@{userInfo.username}</h2>
                        {posts.map((post) => (
                            <div key={post.id}>
                                {post.url ? (
                                    <img
                                        src={post.url}
                                        alt="Selected file"
                                        width="200"
                                        height="200"
                                        onLoad={() => console.log('Image loaded')}
                                        typeof="image/jpeg"
                                    />
                                ) : (
                                    <p>{post.content}</p>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </section>
    );

};

export default PostList;
