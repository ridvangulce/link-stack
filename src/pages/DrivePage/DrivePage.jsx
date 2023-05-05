import React, { useState } from 'react'
import useDrivePicker from 'react-google-drive-picker'
import { collection, addDoc, getDocs, query, orderBy  } from "firebase/firestore";
import { db, storage } from '../../firebase';
import { getAuth } from 'firebase/auth';
import "./DrivePage.css"
const DrivePage = () => {
    const [fileUrl, setFileUrl] = useState(null); // Dosya indirme URL'sini saklayan state
    const [selectedFileUrl, setSelectedFileUrl] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [openPicker, data, authResponse] = useDrivePicker();

    const handleFileSelected = (file) => {
        setSelectedFile(file);
    };
    const auth = getAuth();
    const user = auth.currentUser;

    const handleOpenPicker = () => {
        openPicker({
            clientId: "199725687580-saejekme0na6ajpfcm3c6r4pq70e9r8j.apps.googleusercontent.com",
            developerKey: "AIzaSyCiRp791U707DblwSn1VM7O6njYiYhjc3k",
            token: "ya29.a0AWY7Ckl0HCn5vCnUC3FWIHQqRc1dLB0i5escZJV41POiQjnI4lHIu4EYk9zJUDVTZl6bTY7o4-NJsm5tonOS5oKdXWN4ngUZZB5Afn9lJm7fqQv26LUllwylDowA7W8GqtErmifTmDCIXfS_9n_IovUyn9LIaCgYKASMSARISFQG1tDrpYawsN-ZDolV4wnW4GaTs4A0163",
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
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
                    const fileId = selectedFile.id;
                    let shareableLink;
                    shareableLink = `https://drive.google.com/uc?export=view&id=${fileId}`;
                    setSelectedFileUrl(shareableLink);

                    console.log(shareableLink);

                    try {
                        // Verileri sırayla alma
                        const querySnapshot = await getDocs(query(collection(db, "posts"), orderBy("order")));

                        // Son belgenin order değerini alma
                        const lastPost = querySnapshot.docs[querySnapshot.docs.length - 1];

                        // Yeni belgenin order değerini hesaplama
                        let newOrder;
                        if (lastPost) {
                            newOrder = lastPost.data().order + 1;
                        } else {
                            newOrder = 0;
                        }

                        const postData = {
                            time: new Date(),
                            uid: user.uid,
                            url: shareableLink,
                            order: newOrder // Yeni belgenin order değeri
                        };
                        await addDoc(collection(db, "posts"), postData);
                        console.log("Shareable link added to Firestore!");
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
            {selectedFileUrl && (
                <div>
                    {selectedFileUrl.endsWith(".pdf") ? (
                        <iframe src={selectedFileUrl} title="Selected file" width="500" height="500" onLoad={() => console.log('Image loaded')} typeof="application/pdf" />
                    ) : (
                        <img src={selectedFileUrl} alt="Selected file" width="500" height="500" onLoad={() => console.log('Image loaded')} typeof="image/jpeg" />
                    )}
                </div>
            )}
        </div>
    );

}

export default DrivePage
