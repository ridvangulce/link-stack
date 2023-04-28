import React from "react";
import GooglePicker from "react-google-picker";

const GoogleDrivePicker = (props) => {
  const { clientId, developerKey, onChange } = props;

  // Picker ayarları
  const pickerConfig = {
    apiKey: developerKey,
    clientId: clientId,

    // Drive üzerinde gezinme için izinleri belirtiyoruz
    scope: [
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],

    // Dosya türleri filtresi
    viewId: "DOCS",
    mimeTypes: ["image/png", "image/jpeg", "application/pdf"],
    
    // Seçilen dosya bilgilerini almak için onChange fonksiyonunu tetikliyoruz
    onChange: onChange,
  };

  return (
    <GooglePicker
      clientId={clientId}
      developerKey={developerKey}
      scope={['https://www.googleapis.com/auth/drive']}
      multiselect={false}
      navHidden={true}
      authImmediate={false}
      viewId={'DOCS'}
      createPicker={(google, oauthToken) => {
        const googleViewId = google.picker.ViewId.DOCS;
        const docsView = new google.picker.DocsView(googleViewId)
          .setIncludeFolders(true)
          .setSelectFolderEnabled(false);

        const picker = new window.google.picker.PickerBuilder()
          .enableFeature(google.picker.Feature.NAV_HIDDEN)
          .enableFeature(google.picker.Feature.MULTISELECT_ENABLED)
          .setAppId(clientId)
          .setOAuthToken(oauthToken)
          .addView(docsView)
          .setDeveloperKey(developerKey)
          .setCallback(onChange)
          .build();
        picker.setVisible(true);
      }}
    />
  );
};

export default GoogleDrivePicker;
