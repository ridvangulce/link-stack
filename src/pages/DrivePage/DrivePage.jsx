import React, { useEffect } from 'react'
import useDrivePicker from 'react-google-drive-picker'

const DrivePage = () => {
    const [openPicker, authResponse] = useDrivePicker();
    // const customViewsArray = [new google.picker.DocsView()]; // custom view
    const handleOpenPicker = () => {
        openPicker({
            clientId: "199725687580-saejekme0na6ajpfcm3c6r4pq70e9r8j.apps.googleusercontent.com",
            developerKey: "AIzaSyCiRp791U707DblwSn1VM7O6njYiYhjc3k",
            viewId: "DOCS",
            // token: token, // pass oauth token in case you already have one
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            // customViews: customViewsArray, // custom view
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button')
                }
                console.log(data)
            },
        })
    }
    return (
        <div>
            <button onClick={() => handleOpenPicker()}>Open Picker</button>
        </div>
    )
}

export default DrivePage
