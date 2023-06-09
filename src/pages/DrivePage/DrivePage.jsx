import React, { useState } from 'react'
import useDrivePicker from 'react-google-drive-picker'
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db, storage } from '../../firebase';
import { FaGoogleDrive } from "react-icons/fa";
import { getAuth } from 'firebase/auth';
import "./DrivePage.css"
const DrivePage = ({changePostState}) => {
    const [fileUrl, setFileUrl] = useState(null);
    const [selectedFileUrl, setSelectedFileUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [openPicker, data, authResponse] = useDrivePicker();
    const [isUploaded, setIsUploaded] = useState(false);

    const handleFileSelected = (file) => {
        setSelectedFile(file);
    };

    const auth = getAuth();
    const user = auth.currentUser;

    const handleOpenPicker = () => {
        openPicker({
            clientId: process.env.REACT_APP_CLIENT_ID,
            developerKey: process.env.REACT_APP_DEVELOPER_KEY,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: false,
            scope: [
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/userinfo.profile",
            ],
            viewId: "DOCS",
            mimeTypes: ["image/png", "image/jpeg", "application/pdf"],
            callbackFunction: async (data) => {
                if (data.action === 'cancel') {

                } else if (data.docs && data.docs[0]) {
                    const selectedFile = data.docs[0];
                    const fileId = selectedFile.id;
                    console.log("MIME TYPE :", selectedFile.mimeType);
                    let shareableLink;
                    shareableLink = `https://drive.google.com/uc?export=view&id=${fileId}`;
                    setSelectedFileUrl(shareableLink);


                    try {
                      
                        const isPdf = selectedFile.mimeType === "application/pdf";
                        const postData = {
                            time: new Date(),
                            uid: user.uid,
                            url: shareableLink,
                            order: -1,
                            isPdf: isPdf ? true : false,
                            content: "Header"
                        };
                        await addDoc(collection(db, "posts"), postData);
                        setIsUploaded(true);
                        changePostState()
                    } catch (error) {
                        console.log("ERRORRR!", error);
                    }
                } else if (data.error) {
                    console.log("ERRORRR!! ", data.error);
                }
            },
        });
    };

    return (
        <div >
            <button className='flex whitespace-nowrap bg-transparent border font-mono text-sm p-4 rounded-3xl' onClick={() => handleOpenPicker()}>
                <div>
                    <FaGoogleDrive />
                </div>
                <span className="mr-2" />

                <div>
                    Select File
                </div>
            </button>
        </div>
    );
};

export default DrivePage;

