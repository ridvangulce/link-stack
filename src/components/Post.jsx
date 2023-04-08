import React, { useState, useEffect, useRef } from "react";
import LoginPage from "../pages/LoginPage";
import { db } from "../firebase";
import {
    collection,
    getDocs,
    addDoc,
    doc,
    getDoc,
    where,
    query,
    onSnapshot,
    updateDoc,
    orderBy,
    writeBatch
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Demo from "./Demo";
import { FaPencilAlt, FaGripLines } from "react-icons/fa";
import { BsPencil } from "react-icons/bs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Post = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState(null);

    const inputRef = useRef(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                setUser({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                });

                const postsQuery = query(collection(db, "posts"), where("uid", "==", user.uid), orderBy("order"));
                const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
                    const newPosts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                    setPosts(newPosts);
                });
            } else {
                setUser(null);
                setPosts([]);
            }
        });

        return () => {
            unsubscribe();
            // Aboneliklerinizi burada iptal edebilirsiniz
        };
    }, []);

    const handleEditClick = async (post) => {
        if (editingId === post.id) return;
        setContent(post.content);
        setEditingId(post.id);
    };

    const handleSubmit = async (post) => {
        if (!content || editingId !== post.id) return;

        const updatedPost = {
            ...post,
            content
        };

        await updateDoc(doc(db, "posts", post.id), updatedPost);

        setContent("");
        setEditingId(null);
    };

    const handleBlur = (post) => {
        handleSubmit(post);
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const items = Array.from(posts);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Sıralama bilgisini Firestore'a yaz
        const batch = writeBatch(db);
        items.forEach((item, index) => {
            const ref = doc(db, "posts", item.id);
            const data = { order: index };
            batch.set(ref, data, { merge: true });
        });

        await batch.commit();
    };

    if (!user || !user.uid) return <LoginPage />;

    return (
        <div>
                <Demo/>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="posts">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {posts.map((post, index) => (
                                <Draggable key={post.id} draggableId={post.id} index={index}>
                                    {(provided) => (
                                        <div
                                            className="post"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {editingId === post.id ? (
                                                <div onBlur={() => handleBlur(post)}>
                                                    <input
                                                        className="post-text-area"
                                                        ref={inputRef}
                                                        defaultValue={content}
                                                        onChange={(e) => setContent(e.target.value)}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="texts" onClick={() => handleEditClick(post)}>
                                                    <FaGripLines />
                                                    <p dangerouslySetInnerHTML={{ __html: post.content }} />
                                                    <BsPencil className="edit-pen" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Post;