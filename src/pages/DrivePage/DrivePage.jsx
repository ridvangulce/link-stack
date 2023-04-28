import React, { useState, useEffect } from 'react'
import useDrivePicker, { Picker } from 'react-google-drive-picker'
import GoogleDrivePicker from '../../GoogleDrivePicker';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from '../../firebase';
import { saveAs } from "file-saver";
import GooglePicker from '../GooglePicker';
import "./DrivePage.css"
const DrivePage = () => {
    const [fileUrl, setFileUrl] = useState(null); // Dosya indirme URL'sini saklayan state
    const [selectedFileUrl, setSelectedFileUrl] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [openPicker, data, authResponse] = useDrivePicker();

    const handleFileSelected = (file) => {
        setSelectedFile(file);
    };



    const handleOpenPicker = () => {
        openPicker({
            clientId: "199725687580-saejekme0na6ajpfcm3c6r4pq70e9r8j.apps.googleusercontent.com",
            developerKey: "AIzaSyCiRp791U707DblwSn1VM7O6njYiYhjc3k",
            token: "ya29.a0Ael9sCMwNHu5cPG9-sgosaDQf9iBeek1qRUm46jxG2vzFyozBa0jcRwl6sNkyqxRKOzkcunCXucRLEwNng1ZxkQwaZ9KhDd7V3miHjHQpVDSkPjx2dO4414Ok9wlNJa6XX_Wjn8HMVyXtRVaC1vdioCJZs5-aCgYKAaYSARISFQF4udJhep8wAzaS0FbJoW7i1kvZSQ0163",
            showUploadFolders: true,
            supportDrives: true,
            multiselect: false,
            scope: [
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/userinfo.profile",
            ],

            // Dosya türleri filtresi
            viewId: "DOCS",
            mimeTypes: ["image/png", "image/jpeg", "application/pdf"],
            callbackFunction: async (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button')
                } else if (data.docs && data.docs[0]) {
                    const selectedFile = data.docs[0];
                    const storageRef = ref(storage, selectedFile.name);
                    const downloadUrl = selectedFile.downloadUrl;
                    const fileId = selectedFile.id;
                    const shareableLink = `https://drive.google.com/uc?export=view&id=${fileId}`;
                    setSelectedFileUrl(shareableLink);

                    console.log(shareableLink);
                    //-------------> Download the file <--------------

                    const downloadFile = async (url) => {
                        try {
                            const response = await fetch(url);
                            const data = await response.blob();
                            console.log(data);

                            return data;
                        } catch (error) {
                            console.log("ERRORR!:", error);
                        }
                    };
                    //-------------> UPLOAD FILES <------------- 

                    // const blob = await downloadFile(downloadUrl);
                    // saveAs(blob, selectedFile.name);
                    try {
                        const metadata = {
                            contentType: selectedFile.mimeType,
                        };
                        await uploadBytes(storageRef, metadata).then((snapshot) => {
                            console.log("Dosya Başarıyla Yüklendi  " + snapshot.metadata.name);
                            getDownloadURL(storageRef).then((url) => {
                                console.log("Dosya URL:  ", url);
                                setFileUrl(url)
                            })
                        });
                        const downloadURL = await getDownloadURL(storageRef);
                        await addDoc(collection(db, "images"), { url: downloadURL });
                        // setSelectedFileUrl(downloadURL);
                        console.log(selectedFileUrl);
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
            {selectedFileUrl && (
                <div>
                    <p>You selected:{selectedFileUrl}</p>
                    <img src={selectedFileUrl} alt="Selected file" width="500" height="500" onLoad={() => console.log('Image loaded')} typeof="image/jpeg" />
                </div>
            )}



        </div>
    )
}

export default DrivePage
