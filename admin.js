// 邂｡逅・判髱｢逕ｨ

// 邂｡逅・判髱｢

function openAdmin(){

    document.getElementById("adminPanel").style.display = "block";
    document.getElementById("editPanel").style.display = "none";

    const adminList = document.getElementById("adminList");

    adminList.innerHTML = "";

    roulettes.forEach((roulette,index)=>{

        const div = document.createElement("div");

        div.innerHTML = `
            <hr>
            <h3>${roulette.name}</h3>

            <button onclick="openEdit(${index})">
                編集
            </button>
        `;

        adminList.appendChild(div);

    });

}

let editIndex = null;

function openEdit(index){

    editIndex = index;

    document.getElementById("adminPanel").style.display="none";
    document.getElementById("editPanel").style.display="block";

    document.getElementById("editTitle").textContent =
    roulettes[index].name + " 編集";

    showItems();

}


function showItems(){

    const list = document.getElementById("itemList");

    list.innerHTML="";

    roulettes[editIndex].items.forEach((item,index)=>{

        const div=document.createElement("div");

        div.innerHTML=`
        ${item}
        <button onclick="deleteItem(${index})">
        削除
        </button>
        `;

        list.appendChild(div);

    });

}
function deleteItem(index){

    roulettes[editIndex].items.splice(index,1);

    showItems();

}
document.getElementById("addItemButton").onclick = function(){

    const input = document.getElementById("newItem");

    const value = input.value.trim();

    if(value === ""){
        return;
    }

    roulettes[editIndex].items.push(value);

    input.value = "";

    showItems();

};

document.getElementById("addRouletteAdmin").onclick = function(){
    const number = roulettes.length + 1;
    roulettes.push({
        name: "ルーレット" + number,
        items: ["項目1", "項目2"],
        enabled: true
    });
    openAdmin();
};

document.getElementById("backAdmin").onclick = function(){
    document.getElementById("editPanel").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    openAdmin();
};

document.getElementById("closeButton").onclick = function(){
    document.getElementById("editPanel").style.display = "none";
};

document.getElementById("saveButton").onclick = async function(){
    saveData();

    try {
        await window.saveToFirebase(roulettes);
        alert("Firebaseに保存しました！");
    } catch (error) {
        console.error("Firebase保存エラー", error);
        alert("Firebaseへの保存に失敗しました。コンソールを確認してください。");
    }

};
