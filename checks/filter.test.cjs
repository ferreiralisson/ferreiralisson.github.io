const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const expected = {all:['mini-spring','ingresso','chatia','toca-desk'],java:['mini-spring','ingresso','chatia'],spring:['ingresso','chatia'],angular:['ingresso'],flutter:['chatia'],swift:['toca-desk']};
function node(data) {
  return {dataset:data, attrs:{}, events:{}, hidden:false,
    setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},
    addEventListener(k,v){this.events[k]=v},
    getBoundingClientRect(){return {left:10,width:100,top:30}},
    style:{setProperty(){}},scrollIntoView(){},querySelectorAll(){return this.tags || []}};
}
for (const motion of [false,true]) {
 for (const engineAvailable of [false,true]) {
  const buttons = [...html.matchAll(/data-filter="([^"]+)" aria-pressed="([^"]+)"/g)].map(m=>{const n=node({filter:m[1]});n.textContent=m[1];n.attrs['aria-pressed']=m[2];return n});
  const projects = [...html.matchAll(/data-tech="([^"]+)" id="([^"]+)"/g)].map(m=>{const n=node({tech:m[1]});n.id=m[2];n.tags=m[1].split(' ').map(stack=>({dataset:{stack},active:false,classList:{toggle(name,on){this.owner.active=on}}}));n.tags.forEach(t=>t.classList.owner=t);return n});
  const count={textContent:''};const context={textContent:''};const generic=node({});const details=projects.map(()=>node({}));let mounted=false;let layouts=0;
  const events={};
  const window={ScrollCraft:engineAvailable?{mount(){mounted=true;return {layout(){layouts++}}}}:undefined,matchMedia(){return {matches:motion,addEventListener(){}}},addEventListener(k,v){events[k]=v},dispatchEvent(e){events[e.type]?.()}};
  const document={body:{},querySelectorAll(q){return q==='[data-filter]'?buttons:q==='[data-tech]'?projects:details},querySelector(q){return q==='#project-count'?count:q==='#filter-context'?context:generic}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'assets/site.js'),'utf8'),{window,document,getComputedStyle:()=>({getPropertyValue:()=>'.5'}),requestAnimationFrame:fn=>fn(),Event:class {constructor(type){this.type=type}}});
  assert.equal(mounted,engineAvailable);
  for (const selected of [...buttons,buttons[0]]) {
    const before=layouts;
    selected.events.click();
    assert.equal(layouts,before+(engineAvailable?1:0),'Filtering must directly refresh engine geometry');
    for (const project of projects) for (const tag of project.tags) {
      assert.equal(tag.active,!project.hidden && selected.dataset.filter!=='all' && tag.dataset.stack===selected.dataset.filter);
    }
    assert.deepEqual(projects.filter(p=>!p.hidden).map(p=>p.id),expected[selected.dataset.filter]);
    assert.equal(buttons.filter(b=>b.attrs['aria-pressed']==='true').length,1);
    const total=expected[selected.dataset.filter].length;
    assert.equal(count.textContent,`${total} ${total===1?'projeto':'projetos'}`);
    assert(context.textContent.includes(selected.dataset.filter==='all'?'Da tecnologia à decisão':`${total} ${total===1?'projeto':'projetos'}`));
  }
  for (const detail of details) {
    const before=layouts; detail.events.toggle();
    assert.equal(layouts,before+(engineAvailable?1:0),'Opening or closing details must refresh geometry');
  }
 }
}
console.log('PASS: all six filters, reset, count, pressed states, technology highlights and layout refresh on filtering/details; with and without engine, normal and reduced motion. DOM simulated, not a browser test.');
