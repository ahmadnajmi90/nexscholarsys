import{W as d,j as s,Y as l}from"./app-DobSmQqa.js";import{T as p,I as c}from"./TextInput-Byvw-iXP.js";import{I as u}from"./InputLabel-EaIX1TQM.js";import{P as f}from"./PrimaryButton-N0Z-QbpX.js";import{G as x}from"./GuestLayout-B30hFOkK.js";function g(){const{data:a,setData:e,post:o,processing:t,errors:i,reset:m}=d({password:""}),n=r=>{r.preventDefault(),o(route("password.confirm"),{onFinish:()=>m("password")})};return s.jsxs(x,{children:[s.jsx(l,{title:"Confirm Password"}),s.jsx("div",{className:"mb-4 text-sm text-gray-600",children:"This is a secure area of the application. Please confirm your password before continuing."}),s.jsxs("form",{onSubmit:n,children:[s.jsxs("div",{className:"mt-4",children:[s.jsx(u,{htmlFor:"password",value:"Password"}),s.jsx(p,{id:"password",type:"password",name:"password",value:a.password,className:"mt-1 block w-full",isFocused:!0,onChange:r=>e("password",r.target.value)}),s.jsx(c,{message:i.password,className:"mt-2"})]}),s.jsx("div",{className:"mt-4 flex items-center justify-end",children:s.jsx(f,{className:"ms-4",disabled:t,children:"Confirm"})})]})]})}export{g as default};