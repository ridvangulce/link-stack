import React from 'react'
import DrivePage from '../../pages/DrivePage/DrivePage'
import DirectPost from '../../components/DirectPost/DirectPost'

const Links = ({ changePostState }) => {
    return (
        <div className='container mx-auto'>
            <div className='flex flex-col bg-white border rounded-3xl mx-3 h-80 w- md:h-40'>
                <div>
                    <DirectPost changePostState={changePostState} />
                </div>
                <div>
                    <DrivePage changePostState={changePostState} />
                </div>
            </div>
        </div>
    )
}
export default Links