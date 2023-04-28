import React, { useState, useEffect } from "react";

const GooglePicker = ({
    clientId,
    apiKey,
    views,
    mimeTypes,
    folder,
    onSelect,
    onCancel,
    onApiLoad,
    buttonTitle,
    className,
    style,
    origin
}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    let pickerApiLoaded = false;

    useEffect(() => {
        window.gapi.load("auth", { callback: handleAuthApiLoad });
        window.gapi.load("picker", { callback: handlePickerApiLoad });
    }, []);

    useEffect(() => {
        if (isPickerOpen === false) {
            if (onCancel) {
                onCancel();
            }
        }
    }, [isPickerOpen]);

    function handleAuthApiLoad() {
        window.gapi.client.init({
            apiKey: apiKey,
            clientId: clientId,
            scope: "https://www.googleapis.com/auth/drive.readonly"
        }).then(() => {
            pickerApiLoaded = true;
            if (onApiLoad) {
                onApiLoad();
            }
        });
    }

    function handlePickerApiLoad() {
        pickerApiLoaded = true;
    }

    function handlePickerClose() {
        setIsPickerOpen(false);
    }

    function handlePickerChange(data) {
        if (data.action === window.google.picker.Action.PICKED) {
            const selectedFile = data.docs[0];
            setSelectedFile(selectedFile);
            if (onSelect) {
                onSelect(selectedFile);
            }
        }
        handlePickerClose();
    }

    function handlePickerError(error) {
        console.error("Failed to open picker:", error);
        handlePickerClose();
    }

    function openPicker() {
        if (!pickerApiLoaded) {
            return;
        }
        const view = new window.google.picker.DocsView(views)
            .setMimeTypes(mimeTypes)
            .setIncludeFolders(true)
            .setSelectFolderEnabled(folder || false);
        const picker = new window.google.picker.PickerBuilder()
            .enableFeature(window.google.picker.Feature.NAV_HIDDEN)
            .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
            .addView(view)
            .setOAuthToken(window.gapi.auth.getToken().access_token)
            .setCallback(handlePickerChange)
            .setErrorCallback(handlePickerError);
        if (origin) {
            picker.setOrigin(origin);
        }
        picker.build().setVisible(true);
        setIsPickerOpen(true);
    }

    return (
        <div className={className} style={style}>
            <button onClick={openPicker}>{buttonTitle}</button>
            {selectedFile && (
                <div>
                    <img src={selectedFile.iconUrl} alt="" />
                    <span>{selectedFile.name}</span>
                </div>
            )}
        </div>
    );
};

export default GooglePicker;
