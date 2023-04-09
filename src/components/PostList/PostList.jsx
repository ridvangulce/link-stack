import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import {
    collection,
    getDocs,
    query,
    orderBy,
    where
} from "firebase/firestore";

const PostList = ({handleDragEnd, handleToggle}) => {
    const [posts, setPosts] = useState([]);
    const [userNotFound, setUserNotFound] = useState(false);
    const [postNotFound, setPostNotFound] = useState(false);

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
        <div>
            {postNotFound && <p>Post not found</p>}
            {!postNotFound && (
                <>
                    <h2>Your Posts</h2>
                    {posts.map((post) => (
                        <div key={post.id}>
                            <p>{post.content}</p>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default PostList;
