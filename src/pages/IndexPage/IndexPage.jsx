import React, { useEffect, useState, NavLink } from 'react'
import Post from '../../components/DraggablePost/Post'
import CreatePost from '../../components/CreatePost/CreatePost'
import AddSection from '../../components/AddSectionPage/AddSection'
import ProfilePage from '../ProfilePage/ProfilePage'
import AddPost from '../../components/AddPost/AddPost'
const IndexPage = () => {

    return (
        <>
            <AddPost />
            <Post />
        </>
    )
}

export default IndexPage


