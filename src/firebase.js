// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getAnalytics } from "firebase/analytics";

import { getFirestore, collection, doc, getDocs, getDoc } from "firebase/firestore/lite"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCUtjO-PwyRHJd0KzyV-w9qn-ysXiMqxVY",
    authDomain: "anon-s-shelf.firebaseapp.com",
    projectId: "anon-s-shelf",
    storageBucket: "anon-s-shelf.appspot.com",
    messagingSenderId: "952272592532",
    appId: "1:952272592532:web:8601e7c885f169bf409e81",
    measurementId: "G-B42DVW3SGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app)


export const db = getFirestore(app)
export const userCollectionRef = collection(db, 'users')

export async function getUsersData() {
    const querySnapshot = await getDocs(userCollectionRef)
    const dataArr = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
    }))
    return dataArr
}

export async function getUserData(id) {
    const docRef = doc(db, "users", id)
    const dataSnapshot = await getDoc(docRef)
    return {
        ...dataSnapshot.data(),
        id: dataSnapshot.id
    }
}