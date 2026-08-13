// Firebase helper module (ES module)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getDatabase, ref, set, get, child } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

// ここに Firebase コンソールから取得した値をコピーします。
const firebaseConfig = {
    apiKey: "AIzaSyBeRauCQGRoWmktZfLHq-wVCIbD6cl2fnA",
    authDomain: "roulette-master-9acf1.firebaseapp.com",
    databaseURL: "https://roulette-master-9acf1-default-rtdb.firebaseio.com",
    projectId: "roulette-master-9acf1",
    storageBucket: "roulette-master-9acf1.firebasestorage.app",
    messagingSenderId: "582812821409",
    appId: "1:582812821409:web:7f5ceecf94ac035214cde0"
};

// 管理者アカウントに使うメールをここに入れます。
const ADMIN_EMAILS = [ 'mineko.re32@gmail.com' ];

let app, auth, db;

export async function initFirebase(){
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);

    // Firebase の認証状態をブラウザに永続化し、ログイン期限を「アプリ側」で切れにくくする
    await setPersistence(auth, browserLocalPersistence);
}

export async function signIn(email,password){
    return await signInWithEmailAndPassword(getAuth(), email, password);
}

export async function signOutUser(){
    return await signOut(getAuth());
}

export function onAuthChanged(cb){
    return onAuthStateChanged(getAuth(), cb);
}

export function isAdminUser(user){
    if(!user) return false;
    return ADMIN_EMAILS.includes(user.email);
}

export async function saveRoulette(data){
    if(!db) db = getDatabase();
    await set(ref(db, 'roulette'), data);
}

export async function loadRoulette(){
    if(!db) db = getDatabase();
    const snapshot = await get(child(ref(db), 'roulette'));
    if(snapshot.exists()) return snapshot.val();
    return null;
}

export default { initFirebase, signIn, signOutUser, onAuthChanged, saveRoulette, loadRoulette, isAdminUser };
