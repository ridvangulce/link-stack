import React from 'react';
import "./Appearance.css";
import PostList from '../../components/PostList/PostList';
const AppearancePage = () => {
    return (
        <div className='appearance-container'>
                <div className="appearance">
                    Appearance
                </div>
                <div className="post-list-container">
                    <PostList />
                </div>
        </div>
    )
}

export default AppearancePage