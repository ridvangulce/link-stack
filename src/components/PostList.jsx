import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
    collection,
    getDocs,
    where,
    query,
    orderBy,
} from "firebase/firestore";

const PostList = ({ username }) => {
    const [posts, setPosts] = useState([]);
    const [userNotFound, setUserNotFound] = useState(false);
    const [postNotFound, setPostNotFound] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Kullanıcı adına karşılık gelen uid'yi bulma
                const querySnapshot = await getDocs(
                    collection(db, "users"),
                    where("username", "==", username)
                );

                if (querySnapshot.empty) {
                    setUserNotFound(true);
                    return;
                }
                const userId = querySnapshot.docs[0].id;
                console.log(userId);

                if (!userId) {
                    setUserNotFound(true);
                    return;
                }

                // Kullanıcının postlarını çekme
                const snapshot = await getDocs(
                    query(
                        collection(db, "posts"),
                        where("uid", "==", userId),

                    )
                );
                if (snapshot.empty) {
                    console.log(`No posts found for user: ${username}`);
                    setPostNotFound(true);
                } else {
                    const posts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setPosts(posts);
                }
            } catch (error) {
                console.log("Error getting documents: ", error);
            }
        };

        fetchPosts();
    }, [username]);

    return (
        <div>
            {userNotFound && <p>User not found</p>}
            {postNotFound && <p>Post not found</p>}
            {!userNotFound && !postNotFound && (
                <>
                    <h2>Posts for {username}</h2>
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
