import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import CreatePost from './CreatePost'
import AddSection from './AddSection'
const IndexPage = () => {

    return (
        <>
            <AddSection />
            <Post />
        </>
    )
}

export default IndexPage


