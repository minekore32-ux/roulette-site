console.log("firebase読み込み確認");
// firebase.js
// Use CDN ES modules for Firebase and provide simple save/load helpers.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBeRauCQGRoWmktZfLHq-wVCIbD6cl2fnA",
    authDomain: "roulette-master-9acf1.firebaseapp.com",
    databaseURL: "https://roulette-master-9acf1-default-rtdb.firebaseio.com",
    projectId: "roulette-master-9acf1",
    storageBucket: "roulette-master-9acf1.firebasestorage.app",
    messagingSenderId: "582812821409",
    appId: "1:582812821409:web:7f5ceecf94ac035214cde0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function saveToFirebase(data){
    await set(ref(db, "roulette"), data);
}

export async function loadFirebaseData(){
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "roulette"));
    if(snapshot.exists()) return snapshot.val();
    return null;
}

// Expose for legacy usage from non-module scripts
window.saveToFirebase = saveToFirebase;
async function loadFromFirebase(){

    const snapshot = await get(ref(db, "roulette"));

    if(snapshot.exists()){

        return snapshot.val();

    }else{

        return null;

    }

}

window.loadFromFirebase = loadFromFirebase;