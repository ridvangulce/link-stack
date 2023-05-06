import React, { useState } from 'react'
import useDrivePicker from 'react-google-drive-picker'
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import { db, storage } from '../../firebase';
import { getAuth } from 'firebase/auth';
import "./DrivePage.css"
const DrivePage = () => {
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
            clientId: "199725687580-saejekme0na6ajpfcm3c6r4pq70e9r8j.apps.googleusercontent.com",
            developerKey: "AIzaSyCiRp791U707DblwSn1VM7O6njYiYhjc3k",
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
                    console.log('User clicked cancel/close button')
                } else if (data.docs && data.docs[0]) {
                    const selectedFile = data.docs[0];
                    const fileId = selectedFile.id;
                    console.log("MIME TYPE :", selectedFile.mimeType);
                    let shareableLink;
                    shareableLink = `https://drive.google.com/uc?export=view&id=${fileId}`;
                    setSelectedFileUrl(shareableLink);

                    console.log(shareableLink);

                    try {
                        const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("order")));
                        const lastPost = querySnapshot.docs[querySnapshot.docs.length - 1];
                        let newOrder;
                        if (lastPost) {
                            newOrder = lastPost.data().order + 1;
                        } else {
                            newOrder = 0;
                        }
                        const isPdf = selectedFile.mimeType === "application/pdf";
                        const postData = {
                            time: new Date(),
                            uid: user.uid,
                            url: shareableLink,
                            order: newOrder,
                            isPdf: isPdf ? true : false
                        };
                        await addDoc(collection(db, "posts"), postData);
                        setIsUploaded(true);
                        console.log(user.uid);
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
        <div>
            <button onClick={() => handleOpenPicker()}>Select File</button>
        </div>
    );
};

export default DrivePage;

