import app from './index.js';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from '@firebase/storage';

const storage = getStorage(app);

const deleteFile = (url, success, cb) => {
  let storageRef = ref(storage, url);
  // Create a reference to the file to delete
  const desertRef = ref(storage, `images/${storageRef.name}`);

  // Delete the file
  deleteObject(desertRef)
    .then(() => {
      success();
    })
    .catch((error) => {
      cb(error);
    });
};

// const uploadFile = async (image, setProgress, setUrl) => {
//   const storageRef = ref(storage, `images/${Date.now()}-${image.name}`);

//   const metadata = {
//     contentType: image.type || 'image/png',
//   };

//   const uploadTask = uploadBytesResumable(storageRef, image, metadata);

//   uploadTask.on(
//     'state_changed',
//     (snapshot) => {
//       const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
//       setProgress(progress);
//     },
//     (error) => {
//       console.log(error);
//     },
//     () => {
//       getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//         setUrl(downloadURL);
//       });
//     }
//   );
// };

const uploadFile = async (image, setProgress, setUrl) => {
  const storageRef = ref(storage, `images/${Date.now()}-${image.name}`);

  const metadata = {
    contentType: image.type || 'image/png',
  };

  const uploadTask = uploadBytesResumable(storageRef, image, metadata);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setUrl(downloadURL);
            resolve(downloadURL);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      }
    );
  });
};

export { uploadFile, deleteFile };
