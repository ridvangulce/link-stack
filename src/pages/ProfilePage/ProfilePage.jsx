import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
    collection,
    getDocs,
    where,
    query,
    orderBy,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
    const [userNotFound, setUserNotFound] = useState(false);
    const [userId, setUserId] = useState("");
    const [posts, setPosts] = useState([]);

    const { username } = useParams(); // useParams hook'undan "username" değerini al
    const formattedUsername =
        username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Kullanıcı adına karşılık gelen uid'yi bulma
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

                console.log(`UID for ${username}: ${uid}`);
                setUserId(uid);

            } catch (error) {
                console.log("Error getting user information: ", error);
            }
        };

        fetchUserInfo();
    }, [username]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!userId) return; // userId henüz ayarlanmadıysa devam etme

            // Belirtilen kullanıcının postlarını alma
            const postRef = collection(db, "posts");
            const postQuery = query(postRef, where("uid", "==", userId), orderBy("order"));
            const postSnapshot = await getDocs(postQuery);
            const posts = postSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(posts);
        };

        fetchUserPosts();
    }, [userId]);


    return (
        <div>
            {userNotFound ? (
                <p>User not found</p>
            ) : (
                <>
                    <h1>Posts for {formattedUsername}</h1>
                    {posts.map((post) => (
                        <div key={post.id}>
                            {post.url && ( // post.url mevcut ise
                                post.isPdf ? (
                                    <iframe src={post.url} width="100%" height="500px" style={{ overflow: "hidden" }} />
                                ) : (
                                    <img src={post.url} alt={post.title} height="500" width="500" />
                                )
                            )}
                            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
    
};

export default ProfilePage;
