import{r,j as e,a as d}from"./app-BR0IGn4V.js";import{z as x}from"./transition-Bw7UO5Rk.js";const l=r.createContext(),c=({children:t})=>{const[o,n]=r.useState(!1),s=()=>{n(i=>!i)};return e.jsx(l.Provider,{value:{open:o,setOpen:n,toggleOpen:s},children:e.jsx("div",{className:"relative",children:t})})},u=({children:t})=>{const{open:o,setOpen:n,toggleOpen:s}=r.useContext(l);return e.jsxs(e.Fragment,{children:[e.jsx("div",{onClick:s,children:t}),o&&e.jsx("div",{className:"fixed inset-0 z-40",onClick:()=>n(!1)})]})},m=({align:t="right",width:o="48",contentClasses:n="py-1 bg-white",children:s})=>{const{open:i,setOpen:p}=r.useContext(l);let a="origin-top";t==="left"?a="ltr:origin-top-left rtl:origin-top-right start-0":t==="right"&&(a="ltr:origin-top-right rtl:origin-top-left end-0");let g="";return o==="48"&&(g="w-48"),e.jsx(e.Fragment,{children:e.jsx(x,{show:i,enter:"transition ease-out duration-200",enterFrom:"opacity-0 scale-95",enterTo:"opacity-100 scale-100",leave:"transition ease-in duration-75",leaveFrom:"opacity-100 scale-100",leaveTo:"opacity-0 scale-95",children:e.jsx("div",{className:`absolute z-50 mt-2 rounded-md shadow-lg ${a} ${g}`,onClick:()=>p(!1),children:e.jsx("div",{className:"rounded-md ring-1 ring-black ring-opacity-5 "+n,children:s})})})})},f=({className:t="",children:o,...n})=>e.jsx(d,{...n,className:"block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none "+t,children:o});c.Trigger=u;c.Content=m;c.Link=f;export{c as D};
