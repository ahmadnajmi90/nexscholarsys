import{W as h,r as p,j as e,a as g}from"./app-bAKhYWrJ.js";import{T as t,I as o}from"./TextInput-BpseHdvX.js";import{I as n}from"./InputLabel--FTRd2wL.js";import{P as j}from"./PrimaryButton-D7dGNv6J.js";import{F as f}from"./index-Cu_Vc-Oe.js";function C(){const{data:a,setData:r,post:i,processing:c,errors:l,reset:d}=h({name:"",email:"",password:"",password_confirmation:""}),[m,x]=p.useState(!1),u=s=>{s.preventDefault(),i(route("register"),{onFinish:()=>d("password","password_confirmation")})};return e.jsx("section",{className:"bg-white",children:e.jsxs("div",{className:"lg:grid lg:min-h-screen lg:grid-cols-12",children:[e.jsxs("section",{className:"relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6",children:[e.jsx("img",{alt:"Background",src:"https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",className:"absolute inset-0 h-full w-full object-cover opacity-80"}),e.jsxs("div",{className:"hidden lg:relative lg:block lg:p-12",children:[e.jsx("h2",{className:"mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl",children:"Welcome to NexScholar"}),e.jsx("p",{className:"mt-4 leading-relaxed text-white/90",children:"Empower your learning journey and achieve more with us."})]})]}),e.jsx("main",{className:"flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6",children:e.jsxs("div",{className:"max-w-xl lg:max-w-3xl",children:[e.jsx("h1",{className:"text-2xl font-bold sm:text-3xl",children:"Create an Account"}),e.jsx("p",{className:"mt-4 text-gray-500",children:"Start your journey with NexScholar by creating your account below."}),e.jsxs("form",{onSubmit:u,className:"mt-8 grid grid-cols-6 gap-6",children:[e.jsxs("div",{className:"col-span-6",children:[e.jsx(n,{htmlFor:"name",value:"Username"}),e.jsx(t,{id:"name",name:"name",value:a.name,className:"mt-1 w-full rounded-md border-gray-200 shadow-sm",onChange:s=>r("name",s.target.value),required:!0}),e.jsx(o,{message:l.name,className:"mt-2"})]}),e.jsxs("div",{className:"col-span-6",children:[e.jsx(n,{htmlFor:"email",value:"Email"}),e.jsx(t,{id:"email",type:"email",name:"email",value:a.email,className:"mt-1 w-full rounded-md border-gray-200 shadow-sm",onChange:s=>r("email",s.target.value),required:!0}),e.jsx(o,{message:l.email,className:"mt-2"})]}),e.jsxs("div",{className:"col-span-6 sm:col-span-3",children:[e.jsx(n,{htmlFor:"password",value:"Password"}),e.jsx(t,{id:"password",type:"password",name:"password",value:a.password,className:"mt-1 w-full rounded-md border-gray-200 shadow-sm",onChange:s=>r("password",s.target.value),required:!0}),e.jsx(o,{message:l.password,className:"mt-2"})]}),e.jsxs("div",{className:"col-span-6 sm:col-span-3",children:[e.jsx(n,{htmlFor:"password_confirmation",value:"Confirm Password"}),e.jsx(t,{id:"password_confirmation",type:"password",name:"password_confirmation",value:a.password_confirmation,className:"mt-1 w-full rounded-md border-gray-200 shadow-sm",onChange:s=>r("password_confirmation",s.target.value),required:!0}),e.jsx(o,{message:l.password_confirmation,className:"mt-2"})]}),e.jsx("div",{className:"col-span-6",children:e.jsxs("label",{className:"inline-flex items-center",children:[e.jsx("input",{type:"checkbox",className:"h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500",checked:m,onChange:s=>x(s.target.checked)}),e.jsxs("span",{className:"ml-2 text-sm text-gray-600",children:["I agree to the"," ",e.jsx("a",{href:"#",className:"text-blue-600 underline hover:text-blue-500",children:"data privacy"})," ","and"," ",e.jsx("a",{href:"#",className:"text-blue-600 underline hover:text-blue-500",children:"terms and conditions"})]})]})}),e.jsxs("div",{className:"col-span-6 sm:flex sm:items-center sm:gap-4",children:[e.jsx(j,{className:"w-full sm:w-auto",disabled:c||!m,children:"Create an Account"}),e.jsxs("p",{className:"mt-4 text-sm text-gray-500 sm:mt-0",children:["Already have an account?"," ",e.jsx(g,{href:route("login"),className:"text-blue-600 underline hover:text-blue-500",children:"Log in"})]})]}),e.jsxs("div",{className:"col-span-6",children:[e.jsxs("div",{className:"flex items-center my-4",children:[e.jsx("div",{className:"flex-grow border-t border-gray-300"}),e.jsx("span",{className:"mx-2 text-gray-400 text-sm",children:"OR"}),e.jsx("div",{className:"flex-grow border-t border-gray-300"})]}),e.jsx("div",{className:"w-full",children:e.jsxs("a",{href:route("auth.google"),className:"flex items-center justify-center w-full py-2 bg-[#4285F4] text-white font-medium rounded-lg shadow-md hover:bg-[#357ae8] transition",children:[e.jsx(f,{className:"mr-2"}),e.jsx("span",{children:"Sign in with Google"})]})})]})]})]})})]})})}export{C as default};
