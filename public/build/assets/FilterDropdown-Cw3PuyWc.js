import{r as m,j as s}from"./app-BcXYOAOv.js";const x=({label:a,options:d,selectedValues:r,setSelectedValues:c})=>{const[n,i]=m.useState(!1),l=e=>{const o=r.includes(e)?r.filter(t=>t!==e):[...r,e];c(o)};return s.jsxs("div",{children:[s.jsx("label",{className:"block text-gray-700 font-medium",children:a}),s.jsx("div",{className:`relative mt-1 w-full rounded-lg border border-gray-200 p-4 text-sm cursor-pointer bg-white mb-4${n?"shadow-lg":""}`,onClick:()=>i(!n),children:r&&r.length>0?r.join(", "):`Select ${a}`}),n&&s.jsx("div",{className:"absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg",children:s.jsx("div",{className:"p-2 space-y-2",children:d.map((e,o)=>s.jsxs("label",{className:"flex items-center",children:[s.jsx("input",{type:"checkbox",value:e,checked:r.includes(e),onChange:t=>l(t.target.value),className:"mr-2"}),e]},o))})})]})};export{x as F};
