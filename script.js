function saveData(){

    localStorage.setItem(
        "rouletteData",
        JSON.stringify(roulettes)
    );

}


async function loadData(){

   const firebaseData = await window.loadFromFirebase();

    if(firebaseData){

        // Firebase may store arrays as objects; normalize to array
        if(Array.isArray(firebaseData)){
            roulettes = firebaseData;
        } else if(typeof firebaseData === 'object' && firebaseData !== null){
            roulettes = Object.values(firebaseData);
        } else {
            roulettes = firebaseData;
        }

    }else{

        const data = localStorage.getItem("rouletteData");

        if(data){

            roulettes = JSON.parse(data);

        }

    }

}
let roulettes = [
{
name:"ルーレット1",
items:["A","B","C","D"],
enabled:true
},
{
name:"ルーレット2",
items:["赤","青","黄","緑"],
enabled:true
},
{
name:"ルーレット3",
items:["100","200","300","400"],
enabled:true
},
{
name:"ルーレット4",
items:["東京","大阪","仙台","福岡"],
enabled:true
}
];

const container = document.getElementById("roulette-container");

function createRoulettes(){

container.innerHTML="";

roulettes.forEach((r,index)=>{

const div=document.createElement("div");
div.className="roulette";

div.innerHTML=`
<h2>${r.name}</h2>

<div class="result" id="result${index}">?</div>

<label>
<input type="checkbox" id="check${index}" checked>
回す
</label>
`;

container.appendChild(div);

});

}

document.getElementById("addRoulette").onclick = () => {

    const number = roulettes.length + 1;

    roulettes.push({
        name: "ルーレット" + number,
        items: ["項目1", "項目2"],
        enabled: true
    });

    createRoulettes();

};

document.getElementById("spinButton").onclick=()=>{

roulettes.forEach((r,index)=>{
    try{
        const checkbox = document.getElementById(`check${index}`);
        if(!checkbox || !checkbox.checked) return;
        if(!r || !Array.isArray(r.items) || r.items.length === 0) return;

        const random = r.items[Math.floor(Math.random()*r.items.length)];
        const resultEl = document.getElementById(`result${index}`);
        if(resultEl) resultEl.textContent = random;
    }catch(e){
        console.error('spin error', e, r, index);
    }
});

};
const ADMIN_PASSWORD = "minekosi.＠10";

document.getElementById("adminButton").onclick = () => {

    const pass = prompt("管理者パスワードを入力してください");

    if(pass === ADMIN_PASSWORD){

        openAdmin();

    }else{

        alert("パスワードが違います");

    }

};
function renameRoulette(index){

    const newName = prompt("新しい名前");

    if(newName){

        roulettes[index].name = newName;

        createRoulettes();

        openAdmin();

    }

}

function deleteRoulette(index){

    if(confirm("削除しますか？")){

        roulettes.splice(index,1);

        createRoulettes();

        openAdmin();

    }

}

async function init(){
    await loadData();
    createRoulettes();
}

init();