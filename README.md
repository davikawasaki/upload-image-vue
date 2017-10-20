# file-upload-vue

> Upload image with VueJS to Firebase Storage and Image Servers (Independent)

## Details

This project configures multiple file upload to Firebase Storage. It uses Vue to display the upload results, and ES5/6 to manage the two-way connection with Storage without the need of a Backend server. Some relevant notes:

1\. [Create a new project](https://console.firebase.google.com/) to accept image uploads in Firebase - if you don't have yet;

2\. Firebase uses some config to access their API. E.g. for image storage you need to use buckets as mechanisms to receive and save all incoming photos, which will need a databaseURL and s storageBucket. To allow all storage API commands get the app apiKey, authDomain, databaseURL and storageBucket from Firebase console and update it inside file-upload.service.js, such as my test app configs:

```
firebase.initializeApp({
  apiKey: 'AIzaSyCDeK9gkRBMYG2wXDNxwwh7woeDVevRYK4',
  authDomain: 'test-e6350.firebaseapp.com',
  databaseURL: 'https://test-e6350.firebaseio.com',
  storageBucket: 'gs://test-e6350.appspot.com/'
})
```
3\. The default auth rules config for new configured buckets in Firebase Storage is private. To allow read and write for all incoming users you'll may need to change Storage Security Rules. Go to Firebase Console Storage and change to these lines:

```
// Anyone can read or write to the bucket, even non-users of your app.
// Because it is shared with Google App Engine, this will also make
// files uploaded via GAE public.
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write;
    }
  }
}
```

## Considerations

There are some other configs that can be done to improve this project. Feel free to issue or pull request me.

All auth configs for Storage can be seen in [their docs](https://firebase.google.com/docs/storage/security/start?authuser=0).

Any other doubts can be checked in [Firebase Storage docs](https://firebase.google.com/docs/storage/web/start).

Cheers to Jecelyn Yeen of Scotch.io, which wrote [the article](https://scotch.io/tutorials/how-to-handle-file-uploads-in-vue-2) that has this project's front-end pages and logic implementation.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```