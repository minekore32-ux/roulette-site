import { loadRoulette, saveRoulette } from './firebase.js';

let roulettes = [];

const container = document.getElementById('roulette-container');

function normalizeItems(items){
    if(Array.isArray(items)) return items;
    if(items && typeof items === 'object'){
        return Object.keys(items)
            .filter(key => String(Number(key)) === key)
            .sort((a,b)=>Number(a)-Number(b))
            .map(key => items[key]);
    }
    return [];
}

function normalizeRoulette(roulette){
    if(!roulette || typeof roulette !== 'object') return { name:'', items:[], enabled:true };
    return {
        ...roulette,
        items: normalizeItems(roulette.items),
        name: typeof roulette.name === 'string' ? roulette.name : '',
        enabled: typeof roulette.enabled === 'boolean' ? roulette.enabled : true,
    };
}

function normalizeRoulettes(data){
    if(Array.isArray(data)) return data.map(normalizeRoulette);
    if(data && typeof data === 'object') return Object.values(data).map(normalizeRoulette);
    return [];
}

export function createRoulettes(){
    container.innerHTML = '';
    roulettes.forEach((r,index)=>{
        const div = document.createElement('div');
        div.className = 'roulette';
        div.innerHTML = `
            <h2>${r.name}</h2>
            <div class="result" id="result${index}">?</div>
            <label><input type="checkbox" id="check${index}" checked> 回す</label>
        `;
        container.appendChild(div);
    });
}

export async function init(){
    // firebase.js must have been initialized in index.html
    const data = await loadRoulette();
    const normalized = normalizeRoulettes(data);
    if(normalized.length > 0){
        roulettes = normalized;
    } else {
        roulettes = [
            { name: 'ルーレット1', items: ['A','B','C','D'], enabled:true }
        ];
    }
    createRoulettes();

    document.getElementById('spinButton').addEventListener('click', ()=>{
        roulettes.forEach((r,index)=>{
            try{
                const checkbox = document.getElementById(`check${index}`);
                if(!checkbox || !checkbox.checked) return;
                if(!r || !Array.isArray(r.items) || r.items.length === 0) return;
                const random = r.items[Math.floor(Math.random()*r.items.length)];
                const el = document.getElementById(`result${index}`);
                if(el) el.textContent = random;
            }catch(e){ console.error('spin error', e); }
        });
    });

    document.getElementById('addRoulette').addEventListener('click', ()=>{
        const number = roulettes.length + 1;
        roulettes.push({ name:`ルーレット${number}`, items:['項目1','項目2'], enabled:true });
        createRoulettes();
    });

    // Expose for admin module
    window.getRoulettes = () => roulettes;
    window.setRoulettes = (v)=>{ roulettes = v; createRoulettes(); };
    window.saveAndSync = async ()=>{ await saveRoulette(roulettes); };
    window.createRoulettes = createRoulettes;

    // admin-module.js がログイン UI を制御するため、ここでは表示を変更しません。
}

export const appInit = init;
// auto-init fallback for window scope
window.appInit = init;
