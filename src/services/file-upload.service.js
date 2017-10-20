// file-upload.service.js

import * as axios from 'axios';
import * as firebase from 'firebase'
import * as $q from 'q'

firebase.initializeApp({
  apiKey: 'AIzaSyCDeK9gkRBMYG2wXDNxwwh7woeDVevRYK4',
  authDomain: 'test-e6350.firebaseapp.com',
  databaseURL: 'https://test-e6350.firebaseio.com',
  storageBucket: 'gs://test-e6350.appspot.com/'
})

const storage = firebase.storage()
const BASE_URL = 'http://localhost:3001';

function upload(formData) {
    const url = `${BASE_URL}/images/upload`;
    return axios.post(url, formData)
        // get data
        .then(x => x.data)
        // add url field
        .then(x => x.map(img => Object.assign({},
            img, { url: `${BASE_URL}/images/${img.id}` })));
}

// TODO: Progress spinner
function uploadFirebase(formData) {

    const photos = formData.getAll('photos');

    return new Promise((resolve, reject) => {

        let promises = iterateAndUploadPhotos(photos);
        
        $q.all(promises)
            .then((uploadTasksSnapshots) => resolve(convertResultPhotos(uploadTasksSnapshots)))
            .catch((error) => reject(error));
    });

}

function iterateAndUploadPhotos(photos) {

    let promises = [];

    // Create a root reference
    let storageRef = firebase.storage().ref();

    for(let photo of photos) {
        // Create a reference to 'image.jpg'
        let imgRef = storageRef.child(photo.name);
        // Create a reference to 'images/image.jpg'
        let imageFullRef = storageRef.child('images/' + photo.name);

        // Insert image type
        let metadata = {
            contentType: photo.type
        };

        // Upload the file and metadata
        let uploadTask = imageFullRef.put(photo, metadata);
        promises.push(uploadTask.promise_);
    }

    return promises;
}

// TODO: Improve with filter and map
function convertResultPhotos(uploadTasksSnapshots) {
    let photos = [];
    uploadTasksSnapshots.forEach(function(uts) {
        photos.push(new Object({
            name: splitExtension(uts.metadata.name),
            url: uts.downloadURL
        }));
    }, this);

    return photos;
}

function splitExtension(fileName) {
    return fileName.slice(0, (fileName.lastIndexOf('.')));
}

export { upload, uploadFirebase }