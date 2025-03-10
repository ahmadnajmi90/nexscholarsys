import{q as Q,W as X,r as c,j as e,d as I}from"./app-OyJITDQ0.js";import{T as u,I as n}from"./TextInput-QUSVoZfz.js";import{I as d}from"./InputLabel-GJWl7235.js";import{P as Z}from"./PrimaryButton-BouEWpx7.js";import{S as ee}from"./react-select.esm-DJemSLts.js";import se from"./CVPreviewModal-CDAsJ1v5.js";import{z as h}from"./transition-BVbjJUXl.js";function de({className:R="",researchOptions:_}){var D;const r=Q().props.academician,{data:a,setData:o,post:x,errors:i,processing:T,recentlySuccessful:L}=X({phone_number:(r==null?void 0:r.phone_number)||"",full_name:(r==null?void 0:r.full_name)||"",profile_picture:(r==null?void 0:r.profile_picture)||"",research_expertise:typeof(r==null?void 0:r.research_expertise)=="string"?JSON.parse(r==null?void 0:r.research_expertise):r==null?void 0:r.research_expertise,field_of_study:(r==null?void 0:r.field_of_study)||"",highest_degree:(r==null?void 0:r.highest_degree)||"",website:(r==null?void 0:r.website)||"",linkedin:(r==null?void 0:r.linkedin)||"",google_scholar:(r==null?void 0:r.google_scholar)||"",researchgate:(r==null?void 0:r.researchgate)||"",bio:(r==null?void 0:r.bio)||"",current_position:(r==null?void 0:r.current_position)||"",department:(r==null?void 0:r.department)||"",availability_as_supervisor:(r==null?void 0:r.availability_as_supervisor)||!1,background_image:(r==null?void 0:r.background_image)||""}),[$,f]=c.useState(!1),[g,B]=c.useState("auto"),[p,N]=c.useState([""]),[C,b]=c.useState(!1),[A,v]=c.useState(!1),[k,j]=c.useState(!1),[P,S]=c.useState(!1),U=(s,l)=>{const t=[...p];t[s]=l,N(t)},E=()=>{N([...p,""])},G=()=>{f(!1),b(!0),I.post(route("academician.generateProfile"),{mode:g,urls:g==="url"?p:[]}).then(s=>{const l=s.data;o(t=>({...t,full_name:a.full_name,bio:l.bio||t.bio,current_position:l.current_position||t.current_position,department:l.department||t.department,highest_degree:l.highest_degree||t.highest_degree,field_of_study:l.field_of_study||t.field_of_study,research_expertise:l.research_expertise||t.research_expertise,website:a.website,linkedin:a.linkedin,google_scholar:a.google_scholar,researchgate:a.researchgate})),b(!1)}).catch(s=>{console.error("Profile generation failed:",s),alert("Profile generation failed, please try again."),b(!1)})},q=s=>{if(s.preventDefault(),!a.profile_picture){alert("Please select a profile picture.");return}const l=new FormData;l.append("profile_picture",a.profile_picture),x(route("role.updateProfilePicture"),{data:l,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Profile picture updated successfully."),M(),window.location.reload()},onError:t=>{console.error("Error updating profile picture:",t),alert("Failed to update the profile picture. Please try again.")}})},z=s=>{if(s.preventDefault(),!a.background_image){alert("Please select a background image.");return}const l=new FormData;l.append("background_image",a.background_image),x(route("role.updateBackgroundImage"),{data:l,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Background image updated successfully."),w(!1),window.location.reload()},onError:t=>{console.error("Error updating background image:",t),alert("Failed to update the background image. Please try again.")}})},V=s=>{s.preventDefault();const l=new FormData;Object.keys(a).forEach(t=>{t!=="profile_picture"&&(t==="research_expertise"?l.append(t,JSON.stringify(a[t])):t==="availability_as_supervisor"?l.append(t,a[t]===!0?1:0):Array.isArray(a[t])?l.append(t,JSON.stringify(a[t])):l.append(t,a[t]))}),x(route("role.update"),{data:l,onSuccess:()=>{alert("Profile updated successfully.")},onError:t=>{console.error("Error updating profile:",t),alert("Failed to update the profile. Please try again.")}})},[O,F]=c.useState(!1),W=()=>F(!0),M=()=>F(!1),[J,w]=c.useState(!1),[y,H]=c.useState("profiles"),Y=s=>{j(!0),I.post(route("role.generateCV"),{customized_cv:s},{responseType:"blob"}).then(l=>{const t=window.URL.createObjectURL(new Blob([l.data])),m=document.createElement("a");m.href=t,m.setAttribute("download","cv.docx"),document.body.appendChild(m),m.click(),m.remove(),j(!1),v(!1)}).catch(l=>{console.error("CV generation failed:",l),alert("Failed to generate CV. Please try again."),j(!1)})},K=()=>{S(!1),v(!0)};return e.jsxs("div",{className:"pb-8",children:[e.jsxs("div",{className:"w-full bg-white pb-12 shadow-md relative mb-4",children:[e.jsxs("div",{className:"relative w-full h-48 overflow-hidden",children:[e.jsx("img",{src:`/storage/${a.background_image||"default-background.jpg"}`,alt:"Background",className:"w-full h-full object-cover"}),e.jsx("button",{onClick:()=>w(!0),className:"absolute top-4 right-4 bg-blue-500 p-2 rounded-full shadow-lg text-white hover:bg-blue-600","aria-label":"Edit Background Image",children:"✏️"})]}),e.jsxs("div",{className:"relative flex flex-col items-center -mt-16 z-10",children:[e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:`/storage/${a.profile_picture||"default-profile.jpg"}`,alt:"Profile",className:"w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"}),e.jsx("button",{onClick:W,className:"absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg text-white hover:bg-blue-600","aria-label":"Edit Profile Picture",children:"✏️"})]}),e.jsxs("div",{className:"text-center mt-4",children:[e.jsx("h1",{className:"text-2xl font-semibold text-gray-800",children:a.full_name}),e.jsxs("p",{className:"text-gray-500",children:[a.highest_degree," in ",a.field_of_study]}),e.jsx("p",{className:"text-gray-500",children:a.current_position})]})]})]}),J&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Update Background Image"}),e.jsxs("form",{onSubmit:z,children:[e.jsx("input",{type:"file",accept:"image/*",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",onChange:s=>o("background_image",s.target.files[0])}),e.jsxs("div",{className:"mt-4 flex justify-end",children:[e.jsx("button",{type:"submit",className:"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2",children:"Save"}),e.jsx("button",{type:"button",onClick:()=>w(!1),className:"px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400",children:"Cancel"})]})]})]})}),O&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Update Profile Picture"}),e.jsxs("form",{onSubmit:q,children:[e.jsx("input",{type:"file",accept:"image/*",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",onChange:s=>o("profile_picture",s.target.files[0])}),e.jsxs("div",{className:"mt-4 flex justify-end",children:[e.jsx("button",{type:"submit",className:"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2",children:"Save"}),e.jsx("button",{type:"button",onClick:M,className:"px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400",children:"Cancel"})]})]})]})}),e.jsx("div",{className:"bg-white border-b border-gray-200",children:e.jsx("div",{className:"max-w-6xl mx-auto flex space-x-8 px-4 sm:px-6",children:["Profiles"].map(s=>e.jsx("button",{className:`py-4 px-3 font-medium text-sm ${y.toLowerCase()===s.toLowerCase()?"border-b-2 border-blue-500 text-blue-600":"text-gray-500 hover:text-gray-700"}`,onClick:()=>H(s.toLowerCase()),children:s},s))})}),C&&e.jsx(h,{show:C,enter:"transition-opacity duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"transition-opacity duration-300",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-white p-6 rounded-lg shadow-lg",children:[e.jsx("p",{className:"text-lg font-medium",children:"Generating profile, please wait..."}),e.jsxs("svg",{className:"animate-spin h-8 w-8 mt-4 text-blue-500",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"})]})]})})}),e.jsx(h,{show:$,enter:"transition-opacity duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"transition-opacity duration-300",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",onClick:()=>f(!1),children:e.jsxs("div",{className:"bg-white p-6 rounded-lg shadow-lg max-w-md w-full",onClick:s=>s.stopPropagation(),children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Select Generation Method"}),e.jsxs("div",{className:"mb-4",children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"Choose method:"}),e.jsxs("select",{className:"block w-full border-gray-300 rounded-md shadow-sm",value:g,onChange:s=>B(s.target.value),children:[e.jsx("option",{value:"auto",children:"Auto search from Internet"}),e.jsx("option",{value:"url",children:"Use my provided URL(s)"})]})]}),g==="url"&&e.jsxs("div",{className:"mb-4",children:[e.jsx("p",{className:"text-xs text-gray-600 mb-2",children:"The system will use the Website, LinkedIn, Google Scholar, and ResearchGate fields from your profile. You can also add extra URL(s) below if you wish."}),p.map((s,l)=>e.jsx("input",{type:"text",className:"block w-full border-gray-300 rounded-md shadow-sm p-2 mb-2",value:s,onChange:t=>U(l,t.target.value),placeholder:"https://example.com/extra-info"},l)),e.jsx("button",{type:"button",onClick:E,className:"px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-800",children:"Add URL"})]}),e.jsx("div",{className:"flex justify-end",children:e.jsx("button",{type:"button",onClick:G,className:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-800",children:"Submit"})})]})})}),e.jsxs("div",{className:"w-full px-4 py-8",children:[y==="profiles"&&e.jsxs("section",{className:R,children:[e.jsxs("div",{className:"relative mb-6",children:[e.jsxs("header",{children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Personal Information"}),e.jsx("p",{className:"mt-1 text-sm text-gray-600",children:"Update your personal information."})]}),e.jsx("div",{className:"flex space-x-2 absolute top-0 right-0 mt-2 mr-2",children:e.jsx("button",{type:"button",onClick:()=>f(!0),className:"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800",children:"AI Generated Profile"})})]}),e.jsxs("form",{onSubmit:V,className:"mt-6 space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{className:"w-full",children:[e.jsx(d,{htmlFor:"full_name",value:"Full Name (Without Salutation)",required:!0}),e.jsx(u,{id:"full_name",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:a.full_name,onChange:s=>o("full_name",s.target.value),required:!0,isFocused:!0,autoComplete:"full_name"}),e.jsx(n,{className:"mt-2",message:i.full_name})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(d,{htmlFor:"phone_number",value:"Phone Number",required:!0}),e.jsx(u,{id:"phone_number",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:a.phone_number,onChange:s=>o("phone_number",s.target.value),autoComplete:"tel"}),e.jsx(n,{className:"mt-2",message:i.phone_number})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{className:"w-full",children:[e.jsx(d,{htmlFor:"highest_degree",value:"Highest Degree",required:!0}),e.jsxs("select",{id:"highest_degree",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:a.highest_degree||"",onChange:s=>o("highest_degree",s.target.value),children:[e.jsx("option",{value:"",hidden:!0,children:"Select your Highest Degree"}),e.jsx("option",{value:"Certificate",children:"Certificate"}),e.jsx("option",{value:"Diploma",children:"Diploma"}),e.jsx("option",{value:"Bachelor's Degree",children:"Bachelor's Degree"}),e.jsx("option",{value:"Master's Degree",children:"Master's Degree"}),e.jsx("option",{value:"Ph.D.",children:"Ph.D."}),e.jsx("option",{value:"Postdoctoral",children:"Postdoctoral"})]}),e.jsx(n,{className:"mt-2",message:i.highest_degree})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(d,{htmlFor:"field_of_study",value:"Field of Study",required:!0}),e.jsx(u,{id:"field_of_study",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:a.field_of_study,onChange:s=>o("field_of_study",s.target.value)}),e.jsx(n,{className:"mt-2",message:i.field_of_study})]})]}),e.jsx("div",{className:"grid grid-cols-1 gap-6 w-full",children:e.jsxs("div",{className:"w-full",children:[e.jsx(d,{htmlFor:"bio",value:"Short Bio"}),e.jsx("textarea",{id:"bio",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:a.bio,onChange:s=>o("bio",s.target.value),rows:4}),e.jsx(n,{className:"mt-2",message:i.bio})]})}),e.jsxs("div",{className:"w-full",children:[e.jsx("label",{htmlFor:"research_expertise",className:"block text-sm font-medium text-gray-700",children:"Field of Research (Multiple Selection) Structure : Field of Research - Research Area - Niche Domain"}),e.jsx(ee,{id:"research_expertise",isMulti:!0,options:_.map(s=>({value:`${s.field_of_research_id}-${s.research_area_id}-${s.niche_domain_id}`,label:`${s.field_of_research_name} - ${s.research_area_name} - ${s.niche_domain_name}`})),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",classNamePrefix:"select",value:(D=a.research_expertise)==null?void 0:D.map(s=>{const l=_.find(t=>`${t.field_of_research_id}-${t.research_area_id}-${t.niche_domain_id}`===s);return{value:s,label:l?`${l.field_of_research_name} - ${l.research_area_name} - ${l.niche_domain_name}`:s}}),onChange:s=>{const l=s.map(t=>t.value);o("research_expertise",l)},placeholder:"Select field of research..."})]}),r&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{className:"w-full",children:[e.jsx(d,{htmlFor:"current_position",value:"Current Position",required:!0}),e.jsxs("select",{id:"current_position",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:a.current_position,onChange:s=>o("current_position",s.target.value),children:[e.jsx("option",{value:"",hidden:!0,children:"Select Position"}),e.jsx("option",{value:"Lecturer",children:"Lecturer"}),e.jsx("option",{value:"Senior Lecturer",children:"Senior Lecturer"}),e.jsx("option",{value:"Assoc. Prof.",children:"Associate Professor"}),e.jsx("option",{value:"Professor",children:"Professor"}),e.jsx("option",{value:"Postdoctoral Researcher",children:"Postdoctoral Researcher"}),e.jsx("option",{value:"Researcher",children:"Researcher"})]}),e.jsx(n,{className:"mt-2",message:i.current_position})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(d,{htmlFor:"department",value:"Department",required:!0}),e.jsx(u,{id:"department",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:a.department,onChange:s=>o("department",s.target.value)}),e.jsx(n,{className:"mt-2",message:i.department})]})]}),e.jsxs("div",{children:[e.jsx(d,{htmlFor:"availability_as_supervisor",value:"Availability as Supervisor",required:!0}),e.jsxs("select",{id:"availability_as_supervisor",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:a.availability_as_supervisor,onChange:s=>o("availability_as_supervisor",s.target.value==="true"),children:[e.jsx("option",{value:"true",children:"Available"}),e.jsx("option",{value:"false",children:"Not Available"})]}),e.jsx(n,{className:"mt-2",message:i.availability_as_supervisor})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{children:[e.jsx(d,{htmlFor:"website",value:"Website (Personal or Work)"}),e.jsx(u,{id:"website",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:a.website,onChange:s=>o("website",s.target.value),autoComplete:"url"}),e.jsx(n,{className:"mt-2",message:i.website})]}),e.jsxs("div",{children:[e.jsx(d,{htmlFor:"linkedin",value:"LinkedIn"}),e.jsx(u,{id:"linkedin",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:a.linkedin,onChange:s=>o("linkedin",s.target.value),autoComplete:"url"}),e.jsx(n,{className:"mt-2",message:i.linkedin})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{children:[e.jsx(d,{htmlFor:"google_scholar",value:"Google Scholar"}),e.jsx(u,{id:"google_scholar",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:a.google_scholar,onChange:s=>o("google_scholar",s.target.value),autoComplete:"url"}),e.jsx(n,{className:"mt-2",message:i.google_scholar})]}),e.jsxs("div",{children:[e.jsx(d,{htmlFor:"researchgate",value:"ResearchGate"}),e.jsx(u,{id:"researchgate",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:a.researchgate,onChange:s=>o("researchgate",s.target.value),autoComplete:"url"}),e.jsx(n,{className:"mt-2",message:i.researchgate})]})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(Z,{disabled:T,children:"Save"}),e.jsx(h,{show:L,enter:"transition ease-in-out",enterFrom:"opacity-0",leave:"transition ease-in-out",leaveTo:"opacity-0",children:e.jsx("p",{className:"text-sm text-gray-600",children:"Saved."})})]})]})]}),y==="projects"&&e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"})]}),A&&e.jsx(se,{onClose:()=>v(!1),onDownload:Y}),k&&e.jsx(h,{show:k,enter:"transition-opacity duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"transition-opacity duration-300",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-white p-6 rounded-lg shadow-lg text-center",children:[e.jsx("p",{className:"text-lg font-medium",children:"Downloading CV, please wait..."}),e.jsxs("svg",{className:"animate-spin h-8 w-8 mt-4 text-blue-500 mx-auto",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"})]})]})})}),P&&e.jsx(h,{show:P,enter:"transition-opacity duration-300",enterFrom:"opacity-0",enterTo:"opacity-100",leave:"transition-opacity duration-300",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-white p-6 rounded-lg shadow-lg max-w-md w-full",children:[e.jsx("h3",{className:"text-lg font-semibold mb-4",children:"Reminder"}),e.jsx("p",{className:"text-sm text-gray-700 mb-4",children:'The "Generate CV" feature requires that your Website and Google Scholar fields are filled so that the system can extract data from those URLs.'}),e.jsxs("div",{className:"flex justify-end",children:[e.jsx("button",{onClick:()=>S(!1),className:"mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400",children:"Cancel"}),e.jsx("button",{onClick:K,className:"px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700",children:"Proceed"})]})]})})})]})}export{de as default};
