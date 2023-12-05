import { useState, useRef, useEffect } from "react";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import storage from "./firebaseConfig";
// Handle file upload event and update state


export const HandleUpload = async (selectedFiles,imageField,directory) => {
    // const [percent, setPercent] = useState(0); 
    console.log('selectedFiles from handleupload',selectedFiles);
    
    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please upload at least one image!");
      return;
    }
  
    const uploadPromises = selectedFiles.map(async (selectedFile) => {
      const storageRef = await ref(storage, `/files/${directory}/${selectedFile.name + v4()}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
  
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            // setPercent(percent);
          },
          (err) => {
            console.log(err);
            reject(err);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then((url) => resolve(url))
              .catch((err) => reject(err));
          }
        );
      });
    });
  
    try {
      const urls = await Promise.all(uploadPromises);
      // console.log('imageinteriorString',urls);
      // Convert the array of URLs to a string separated by commas
      const concatenatedUrls = urls.join(',');
//  console.log('concatenatedurl form handleupload',concatenatedUrls);
 

  
      return concatenatedUrls
    } catch (error) {
      console.error("Error uploading images:", error);
      // Handle error as needed
    }
  };