import React, { useState, useEffect, useRef } from "react";
import LoginPage from "../../pages/LoginPage/LoginPage";
import PostList from "../PostList/PostList";
import AddPost from "../AddPost/AddPost";
import "./Post.css";
import { db } from "../../firebase";
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
    writeBatch,
    deleteDoc // Firestore'dan veri silmek için gerekli fonksiyon
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FaGripLines } from "react-icons/fa";
import { BsPencil, BsFillTrash3Fill } from "react-icons/bs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Post = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [postOpen, setPostOpen] = useState(false);

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

                const postsQuery = query(
                    collection(db, "posts"),
                    where("uid", "==", user.uid),
                    orderBy("order")
                );
                const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
                    const newPosts = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id
                    }));
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

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, "posts", id));
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const newPosts = Array.from(posts);
        const [reorderedItem] = newPosts.splice(result.source.index, 1);
        newPosts.splice(result.destination.index, 0, reorderedItem);

        // Yeniden hesaplanmış sıralama değerlerini oluştur
        const updatedPosts = newPosts.map((post, index) => ({
            ...post,
            order: index,
        }));

        // Sıralama bilgisini Firestore'a yaz
        const batch = writeBatch(db);
        updatedPosts.forEach((post) => {
            const ref = doc(db, "posts", post.id);
            batch.update(ref, post);
        });
        await batch.commit();

        // PostList componentinin yeniden render edilmesi için setPosts fonksiyonunu çağıralım
        setPosts(updatedPosts);
    };



    const handleBlur = (post) => {
        handleSubmit(post);
    };

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            handleSubmit(posts.find((post) => post.id === editingId));
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleToggle = async (post) => {
        const updatedPost = {
            ...post,
            isActive: !post.isActive
        };

        await updateDoc(doc(db, "posts", post.id), updatedPost);
    };
    const changePostState = () => {
        setPostOpen(!postOpen);
        console.log(postOpen);
    }

    if (!user || !user.uid) return <LoginPage />;

    return (
        <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-3/4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-1/3 " onClick={changePostState}>Add Post</button>
                {postOpen && <AddPost />}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="posts">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="mt-4 md:mt-0">
                                {posts.map((post, index) => (
                                    <Draggable key={post.id} draggableId={post.id} index={index}>
                                        {(provided) => (
                                            <div
                                                className="rounded-xl shadow-md mb-4 ml-4 md:ml-36 p-4 grid grid-cols-3 items-center md:items-stretch w-full md:w-2/4 h-3/4 bg-white"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div className="drag-icon text-gray-400 ">
                                                    <FaGripLines />
                                                </div>
                                                <div className="col-span-2">
                                                    {editingId === post.id ? (
                                                        <div className="post-text-container" onBlur={() => handleBlur(post)}>
                                                            {post.url && post.isPdf ? (
                                                                <iframe src={post.url} width="100%" height="500px" style={{ overflow: "hidden" }} />
                                                            ) : (
                                                                <img src={post.url} alt={post.title} height="500" width="500" />
                                                            )}
                                                            <div className="content-container content">
                                                                <input className="post-text-area content w-full font-bold focus:outline-none" ref={inputRef} defaultValue={content} onChange={(e) => setContent(e.target.value)} autoFocus />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="texts">
                                                            {post.url && post.isPdf ? (
                                                                <iframe src={post.url} width="100%" height="500px" style={{ overflow: "hidden" }} />
                                                            ) : (
                                                                <img src={post.url} alt={post.title} height="500" width="500" />
                                                            )}
                                                            <div className="content-container content ">
                                                                <p
                                                                    className="texts-content cursor-pointer"
                                                                    onClick={() => handleEditClick(post)}
                                                                >
                                                                    <h2 className="font-bold flex-nowrap">{post.content}</h2>
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-start-4 md:flex md:flex-row md:justify-end md:items-center">
                                                    <div className="md:m-4">
                                                        <div
                                                            className={post.isActive ? 'toggle-button active' : 'toggle-button'}
                                                            onClick={() => handleToggle(post)}
                                                        >
                                                            <div className="toggle-knob"></div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="delete-btn ml-4"
                                                        onClick={() => handleDelete(post.id)}
                                                    >
                                                        <BsFillTrash3Fill className="delete-btn-icon" />
                                                    </button>
                                                </div>
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
            <div className="w-full md:w-1/3">
                <div className="mt-4 hidden md:block">
                    <PostList handleDragEnd={handleDragEnd} handleToggle={handleToggle} />
                </div>
            </div>
        </div>
    );




};

export default Post;