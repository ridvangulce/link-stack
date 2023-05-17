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
import Posts from "../../components/Posts/Posts";

const ProfilePage = () => {
    const [userNotFound, setUserNotFound] = useState(false);
    const [userId, setUserId] = useState("");
    const [posts, setPosts] = useState([]);
    const { username } = useParams();
    const formattedUsername =
        username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

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



    return (
        <div className="flex flex-col items-center justify-start px-3 p-3 rounded-3xl bg-gradient-to-r from-transparent to-blue-500 h-screen overflow-y-auto">
            {userNotFound ? (
                <p>User not found</p>
            ) : (
                <div className="container flex flex-col items-center justify-start gap-5 mb-5 drop-shadow-2xl">
                    <div className='menu-trigger'>
                        <span >{formattedUsername.charAt(0).toUpperCase()} </span>
                    </div>
                    <div>
                        <h1 className="font-bold text-2xl mb-6 drop-shadow-2xl">@{formattedUsername.toLowerCase()} </h1>
                    </div>
                    <Posts />
                </div>
            )}
        </div>
    );
};

export default ProfilePage;

