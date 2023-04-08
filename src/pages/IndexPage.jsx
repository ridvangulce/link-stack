import React, { useEffect, useState, NavLink } from 'react'
import Post from '../components/Post'
import CreatePost from './CreatePost'
import AddSection from './AddSection'
import ProfilePage from './ProfilePage'
const IndexPage = () => {

    return (
        <>
            <AddSection />
            <Post />
        </>
    )
}

export default IndexPage


