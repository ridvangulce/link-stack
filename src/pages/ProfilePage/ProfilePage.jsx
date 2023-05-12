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
import PostList from "../../components/PostList/PostList";
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


            const postRef = collection(db, "posts");
            const postQuery = query(postRef, where("uid", "==", userId), orderBy("order"));
            const postSnapshot = await getDocs(postQuery);
            const posts = postSnapshot.docs.filter(doc => doc.data().isActive).map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(posts);
        };


        fetchUserPosts();
    }, [userId, posts]);


    return (
        <div className="flex items-center justify-center mt-20 ">
            {userNotFound ? (
                <p>User not found</p>
            ) : (
                <div className="container flex  flex-col items-center justify-start gap-5 mt-3 mb-20 ">
                    <div className='menu-trigger'>
                        <span >{formattedUsername.charAt(0).toUpperCase()} </span>
                    </div>
                    {posts.map((post) => (
                        <div key={post.id} className="">
                            {post.content && (
                                <div>
                                    <h1 className="font-bold text-2xl bg-red-200 p-4 px-48 rounded-full">
                                        {post.content}
                                    </h1>
                                </div>
                            )}
                            {post.url && (
                                <div>
                                    {post.isPdf ? (
                                        <iframe src={post.url} width="100%" height="500px" style={{ overflow: "hidden" }} />
                                    ) : (
                                        <img className="rounded-3xl" src={post.url} alt={post.title} height="400" width="400" />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

};

export default ProfilePage;
