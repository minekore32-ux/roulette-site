import { signIn, signOutUser, onAuthChanged, isAdminUser, saveRoulette } from './firebase.js';

let editIndex = null;

function $(id){ return document.getElementById(id); }

function getCurrentRoulettes(){
    const getter = window.getRoulettes;
    if(typeof getter !== 'function') return [];
    const value = getter();
    if(Array.isArray(value)) return value;
    if(value && typeof value === 'object') return Object.values(value);
    return [];
}

function setCurrentRoulettes(value){
    const setter = window.setRoulettes;
    if(typeof setter === 'function'){
        setter(Array.isArray(value) ? value : Object.values(value || {}));
    } else {
        console.warn('window.setRoulettes is not ready');
    }
}

function getSafeName(roulette, index){
    if(roulette && typeof roulette.name === 'string' && roulette.name.trim()){
        return roulette.name;
    }
    return 'ルーレット' + (index + 1);
}

function openAdminPanel(){
    $('adminPanel').style.display = 'block';
    $('editPanel').style.display = 'none';
    renderAdminList();
}

function renderAdminList(){
    const adminList = $('adminList');
    adminList.innerHTML = '';
    const roulettes = getCurrentRoulettes();
    if(roulettes.length === 0){
        adminList.textContent = 'ルーレットがありません。追加してください。';
        return;
    }
    roulettes.forEach((r,i)=>{
        const d = document.createElement('div');
        d.innerHTML = `<hr><h3>${getSafeName(r,i)}</h3><button data-i="${i}">編集</button>`;
        d.querySelector('button').addEventListener('click', ()=> openEdit(i));
        adminList.appendChild(d);
    });
}

export function openEdit(index){
    index = Number(index);
    const roulettes = getCurrentRoulettes();
    if(!Array.isArray(roulettes) || index < 0 || index >= roulettes.length){
        return alert('選択したルーレットが見つかりません');
    }
    const roulette = roulettes[index];
    editIndex = index;
    $('adminPanel').style.display = 'none';
    $('editPanel').style.display = 'block';
    const safeName = getSafeName(roulette,index);
    $('editTitle').textContent = safeName + ' 編集';
    $('editName').value = roulette.name || safeName;
    renderItems();
}

function renderItems(){
    const list = $('itemList');
    list.innerHTML = '';
    const roulettes = getCurrentRoulettes();
    const roulette = roulettes[editIndex];
    if(!roulette || !Array.isArray(roulette.items)) return;
    roulette.items.forEach((it,i)=>{
        const div = document.createElement('div');
        div.innerHTML = `${it} <button data-i="${i}">削除</button>`;
        div.querySelector('button').addEventListener('click', ()=>{ deleteItem(i); });
        list.appendChild(div);
    });
}

function deleteItem(i){
    const roulettes = getCurrentRoulettes();
    if(!Array.isArray(roulettes) || !roulettes[editIndex]) return;
    if(!Array.isArray(roulettes[editIndex].items)) return;
    roulettes[editIndex].items.splice(i,1);
    setCurrentRoulettes(roulettes);
    renderItems();
}

function addItem(){
    const val = $('newItem').value.trim();
    if(!val) return;
    const roulettes = getCurrentRoulettes();
    if(!Array.isArray(roulettes) || !roulettes[editIndex]) return alert('編集対象が選択されていません');
    if(!Array.isArray(roulettes[editIndex].items)) roulettes[editIndex].items = [];
    roulettes[editIndex].items.push(val);
    setCurrentRoulettes(roulettes);
    $('newItem').value = '';
    renderItems();
}

async function saveAll(){
    const roulettes = getCurrentRoulettes();
    if(!Array.isArray(roulettes)) return alert('保存できません: ルーレットデータがありません');
    if(editIndex === null || !roulettes[editIndex]) return alert('保存できません: 編集対象が見つかりません');
    const newName = $('editName').value.trim();
    if(newName) roulettes[editIndex].name = newName;
    try{
        await saveRoulette(roulettes);
        alert('Firebaseに保存しました');
        setCurrentRoulettes(roulettes);
        renderAdminList();
        $('editTitle').textContent = roulettes[editIndex].name + ' 編集';
    }catch(e){
        console.error(e);
        alert('保存に失敗しました');
    }
}

// auth UI
function setupAuth(){
    console.log('setupAuth initialized');
    $('loginForm').addEventListener('submit', async (ev)=>{
        ev.preventDefault();
        const email = $('email').value.trim();
        const pw = $('password').value;
        if(!email || !pw){
            return alert('メールアドレスとパスワードを入力してください');
        }
        console.log('attempt signIn', email);
        try{
            await signIn(email,pw);
        }catch(e){
            console.error('login error', e.code, e.message, e);
            alert(`ログイン失敗: ${e.message}`);
        }
    });
    $('signout').addEventListener('click', async ()=>{ await signOutUser(); });

    onAuthChanged(user=>{
        const status = $('authStatus');
        console.log('Auth state changed', user);
        if(user && isAdminUser(user)){
            $('authArea').style.display='none';
            $('adminControls').style.display='block';
            $('adminArea').style.display='block';
            if(status) status.textContent = `ログイン中: ${user.email}`;
            renderAdminList();
            openAdminPanel();
        }else if(user){
            $('authArea').style.display='none';
            $('adminControls').style.display='none';
            $('adminArea').style.display='block';
            if(status) status.textContent = `ログインしましたが、管理者ではありません: ${user.email}`;
        }else{
            $('authArea').style.display='block';
            $('adminControls').style.display='none';
            $('adminArea').style.display='block';
            if(status) status.textContent = '管理者ログインしてください';
        }
    });
}

function wireButtons(){
    $('addItemButton').addEventListener('click', addItem);
    $('saveButton').addEventListener('click', saveAll);
    $('backAdmin').addEventListener('click', ()=>{ $('editPanel').style.display='none'; $('adminPanel').style.display='block'; renderAdminList(); });
    $('closeButton').addEventListener('click', ()=>{ $('editPanel').style.display='none'; });
    $('addRouletteAdmin').addEventListener('click', ()=>{ 
        const roulettes = getCurrentRoulettes();
        if(!Array.isArray(roulettes)) return alert('ルーレットデータがまだ読み込まれていません。ページを再読み込みしてください。');
        const newRoulette = { name: 'ルーレット' + (roulettes.length + 1), items:['項目1','項目2'], enabled:true };
        roulettes.push(newRoulette);
        setCurrentRoulettes(roulettes);
        renderAdminList();
        if(typeof window.createRoulettes==='function') window.createRoulettes();
    });
    $('adminButton').addEventListener('click', openAdminPanel);
    setupAuth();
}

wireButtons();

export default { openEdit };
