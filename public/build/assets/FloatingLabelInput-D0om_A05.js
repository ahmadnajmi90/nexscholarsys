import{r as i,j as e}from"./app-6KcAPae7.js";import{E as y}from"./eye-BtQ8twi4.js";import{E as j}from"./eye-off-yyl5FfLy.js";function E({id:n,type:t="text",label:d,value:o="",onChange:c,error:s,disabled:u=!1,autoComplete:x,isFocused:p=!1,className:g="",...m}){const[a,l]=i.useState(!1),[r,f]=i.useState(!1),b=o&&o.length>0,h=a||b,w=t==="password"&&r?"text":t;return e.jsxs("div",{className:`relative ${g}`,children:[e.jsx("input",{id:n,type:w,value:o,onChange:c,disabled:u,autoComplete:x,autoFocus:p,onFocus:()=>l(!0),onBlur:()=>l(!1),className:`
                    peer w-full px-4 pt-6 pb-2 
                    bg-white border-2 rounded-lg
                    transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-indigo-200
                    disabled:bg-gray-50 disabled:text-gray-500
                    ${s?"border-red-500 focus:border-red-500 focus:ring-red-200":a?"border-indigo-500":"border-gray-300 hover:border-gray-400"}
                    ${t==="password"?"pr-12":""}
                `,placeholder:" ",...m}),e.jsx("label",{htmlFor:n,className:`
                    absolute left-4 transition-all duration-200 pointer-events-none
                    ${h?"top-2 text-xs":"top-1/2 -translate-y-1/2 text-base"}
                    ${s?"text-red-600":a?"text-indigo-600 font-medium":"text-gray-500"}
                `,children:d}),t==="password"&&e.jsx("button",{type:"button",onClick:()=>f(!r),className:"absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100",tabIndex:-1,children:r?e.jsx(y,{className:"w-5 h-5"}):e.jsx(j,{className:"w-5 h-5"})}),s&&e.jsxs("p",{className:"mt-2 text-sm text-red-600 flex items-center gap-1",children:[e.jsx("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:e.jsx("path",{fillRule:"evenodd",d:"M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",clipRule:"evenodd"})}),s]})]})}export{E as F};
