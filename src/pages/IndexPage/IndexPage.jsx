import React, { useEffect, useState, NavLink } from 'react'
import Post from '../../components/DraggablePost/Post'
import CreatePost from '../../components/CreatePost/CreatePost'
import AddSection from '../../components/AddSectionPage/AddSection'
import ProfilePage from '../ProfilePage/ProfilePage'
import AddPost from '../../components/AddPost/AddPost'
import PostList from '../../components/PostList/PostList'
import "./style.css"
const IndexPage = () => {

    return (
        <>
            <div className='index-page'>
                <Post />
            </div>
        </>
    )
}

export default IndexPage


