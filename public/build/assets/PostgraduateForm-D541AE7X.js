import{q as W,W as H,r as u,j as e}from"./app-_Pmd54av.js";import{T as d,I as n}from"./TextInput-BUyKKoFm.js";import{I as o}from"./InputLabel-DZbkdtTR.js";import{P as K}from"./PrimaryButton-BcnpVGB8.js";import Q from"./NationalityForm-1yZ4uwF3.js";import{S as X}from"./react-select.esm-B-50ATDc.js";import{z as Z}from"./transition-_eCUcQZ-.js";function ce({universities:I,faculties:$,className:M="",researchOptions:x}){var k,F,S,P;const l=W().props.postgraduate,{data:r,setData:i,post:_,errors:c,processing:R,recentlySuccessful:B}=H({phone_number:(l==null?void 0:l.phone_number)||"",full_name:(l==null?void 0:l.full_name)||"",previous_degree:typeof(l==null?void 0:l.previous_degree)=="string"?JSON.parse(l==null?void 0:l.previous_degree):l==null?void 0:l.previous_degree,bachelor:(l==null?void 0:l.bachelor)||"",CGPA_bachelor:(l==null?void 0:l.CGPA_bachelor)||"",master:(l==null?void 0:l.master)||"",master_type:(l==null?void 0:l.master_type)||"",nationality:(l==null?void 0:l.nationality)||"",english_proficiency_level:(l==null?void 0:l.english_proficiency_level)||"",funding_requirement:(l==null?void 0:l.funding_requirement)||"",current_postgraduate_status:(l==null?void 0:l.current_postgraduate_status)||"",matric_no:(l==null?void 0:l.matric_no)||"",suggested_research_title:(l==null?void 0:l.suggested_research_title)||"",suggested_research_description:(l==null?void 0:l.suggested_research_description)||"",CV_file:(l==null?void 0:l.CV_file)||"",profile_picture:(l==null?void 0:l.profile_picture)||"",field_of_research:typeof(l==null?void 0:l.field_of_research)=="string"?JSON.parse(l==null?void 0:l.field_of_research):l==null?void 0:l.field_of_research,website:(l==null?void 0:l.website)||"",linkedin:(l==null?void 0:l.linkedin)||"",google_scholar:(l==null?void 0:l.google_scholar)||"",researchgate:(l==null?void 0:l.researchgate)||"",bio:(l==null?void 0:l.bio)||"",faculty:(l==null?void 0:l.faculty)||"",university:(l==null?void 0:l.university)||"",background_image:(l==null?void 0:l.background_image)||""}),q=s=>{if(s.preventDefault(),!r.profile_picture){alert("Please select a profile picture.");return}const a=new FormData;a.append("profile_picture",r.profile_picture),_(route("role.updateProfilePicture"),{data:a,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Profile picture updated successfully."),w(),window.location.reload()},onError:t=>{console.error("Error updating profile picture:",t),alert("Failed to update the profile picture. Please try again.")}})},E=s=>{if(s.preventDefault(),!r.background_image){alert("Please select a background image.");return}const a=new FormData;a.append("background_image",r.background_image),_(route("role.updateBackgroundImage"),{data:a,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Background image updated successfully."),p(!1),window.location.reload()},onError:t=>{console.error("Error updating background image:",t),alert("Failed to update the background image. Please try again.")}})},D=s=>{const a=s.target.value;i(t=>({...t,current_postgraduate_status:a,matric_no:a==="Registered"?t.matric_no:"",university:a==="Registered"?t.university:"",faculty:a==="Registered"?t.faculty:""}))},A=s=>{s.preventDefault();const a=new FormData;Object.keys(r).forEach(t=>{t!=="profile_picture"&&(Array.isArray(r[t])?a.append(t,JSON.stringify(r[t])):a.append(t,r[t]))});for(let[t,g]of a.entries())console.log(`${t}: ${g}`),console.log(`${t}: ${typeof g}`);_(route("role.update"),{data:a,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Profile updated successfully.")},onError:t=>{console.error("Error updating profile:",t),alert("Failed to update the profile. Please try again.")}})},[T,N]=u.useState(!1),V=()=>N(!0),w=()=>N(!1),[U,p]=u.useState(!1),[v,G]=u.useState(r.university),O=$.filter(s=>s.university_id===parseInt(v)),[m,z]=u.useState(!1),[h,L]=u.useState(!1),[C,b]=u.useState(!1);u.useEffect(()=>{(r.suggested_research_title||r.suggested_research_description)&&b(!0)},[r.suggested_research_title,r.suggested_research_description]);const J=s=>{s.target.value==="yes"?b(!0):b(!1),s.target.value==="yes"||i(t=>({...t,suggested_research_title:"",suggested_research_description:""}))},[j,Y]=u.useState("profiles");return e.jsxs("div",{className:"pb-8",children:[e.jsxs("div",{className:"w-full bg-white pb-12 shadow-md relative mb-4",children:[e.jsxs("div",{className:"relative w-full h-48 overflow-hidden",children:[e.jsx("img",{src:`/storage/${r.background_image||"default-background.jpg"}`,alt:"Background",className:"w-full h-full object-cover"}),e.jsx("button",{onClick:()=>p(!0),className:"absolute top-4 right-4 bg-blue-500 p-2 rounded-full shadow-lg text-white hover:bg-blue-600","aria-label":"Edit Background Image",children:"✏️"})]}),e.jsxs("div",{className:"relative flex flex-col items-center -mt-16 z-10",children:[e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:`/storage/${r.profile_picture||"default-profile.jpg"}`,alt:"Profile",className:"w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"}),e.jsx("button",{onClick:V,className:"absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg text-white hover:bg-blue-600","aria-label":"Edit Profile Picture",children:"✏️"})]}),e.jsxs("div",{className:"text-center mt-4",children:[e.jsx("h1",{className:"text-2xl font-semibold text-gray-800",children:r.full_name}),e.jsxs("p",{className:"text-gray-500",children:[(k=r.previous_degree)!=null&&k.includes("Master")?"Master":"Bachelor Degree"," in"," ",((S=(F=r.field_of_research)==null?void 0:F.map(s=>{const[a,t,g]=s.split("-"),f=x.find(y=>y.field_of_research_id===parseInt(a)&&y.research_area_id===parseInt(t)&&y.niche_domain_id===parseInt(g));return f?`${f.field_of_research_name} - ${f.research_area_name} - ${f.niche_domain_name}`:"Unknown Field"}))==null?void 0:S.join(", "))||"No Field of Study"]}),e.jsx("p",{className:"text-gray-500",children:r.current_position})]})]})]}),U&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Update Background Image"}),e.jsxs("form",{onSubmit:E,children:[e.jsx("input",{type:"file",accept:"image/*",className:"block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100",onChange:s=>i("background_image",s.target.files[0])}),e.jsxs("div",{className:"mt-4 flex justify-end",children:[e.jsx("button",{type:"submit",className:"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2",children:"Save"}),e.jsx("button",{type:"button",onClick:()=>p(!1),className:"px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400",children:"Cancel"})]})]})]})}),T&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Update Profile Picture"}),e.jsxs("form",{onSubmit:q,children:[e.jsx("input",{type:"file",accept:"image/*",className:"block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100",onChange:s=>i("profile_picture",s.target.files[0])}),e.jsxs("div",{className:"mt-4 flex justify-end",children:[e.jsx("button",{type:"submit",className:"px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2",children:"Save"}),e.jsx("button",{type:"button",onClick:w,className:"px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400",children:"Cancel"})]})]})]})}),e.jsx("div",{className:"bg-white border-b border-gray-200",children:e.jsx("div",{className:"max-w-6xl mx-auto flex space-x-8 px-4 sm:px-6",children:["Profiles","Projects","Works","Teams","Network","Activity","More"].map(s=>e.jsx("button",{className:`py-4 px-3 font-medium text-sm ${j.toLowerCase()===s.toLowerCase()?"border-b-2 border-blue-500 text-blue-600":"text-gray-500 hover:text-gray-700"}`,onClick:()=>Y(s.toLowerCase()),children:s},s))})}),e.jsxs("div",{className:"w-full px-4 py-8",children:[j==="profiles"&&e.jsxs("section",{className:M,children:[e.jsxs("header",{children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Personal Information"}),e.jsx("p",{className:"mt-1 text-sm text-gray-600",children:"Update your personal information."})]}),e.jsxs("form",{onSubmit:A,className:"mt-6 space-y-6",children:[e.jsx("div",{className:"grid grid-cols-1 lg:grid-cols-1 gap-6 w-full",children:e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"full_name",value:"Full Name",required:!0}),e.jsx(d,{id:"full_name",className:"mt-1 block w-full",value:r.full_name,onChange:s=>i("full_name",s.target.value),required:!0,isFocused:!0,autoComplete:"full_name"}),e.jsx(n,{className:"mt-2",message:c.full_name})]})}),e.jsx("div",{className:"grid grid-cols-1 lg:grid-cols-1 gap-6 w-full",children:e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"bio",value:"Short Bio"}),e.jsx("textarea",{id:"bio",className:"mt-1 block w-full",value:r.bio,onChange:s=>i("bio",s.target.value),rows:4}),e.jsx(n,{className:"mt-2",message:c.bio})]})}),e.jsx("h3",{className:"font-medium text-gray-900",children:"Your Previous Degree"}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsxs("label",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",className:"form-checkbox",checked:m,onChange:()=>{const s=!m;z(s),i(a=>({...a,previous_degree:JSON.stringify([...s?["Bachelor Degree"]:[],...h?["Master"]:[]])}))}}),e.jsx("span",{children:"Bachelor Degree"})]}),e.jsxs("label",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"checkbox",className:"form-checkbox",checked:h,onChange:()=>{const s=!h;L(s),i(a=>({...a,previous_degree:JSON.stringify([...m?["Bachelor Degree"]:[],...s?["Master"]:[]])}))}}),e.jsx("span",{children:"Master"})]})]}),m&&e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{children:[e.jsx(o,{htmlFor:"bachelor",value:"Name of Bachelor Degree"}),e.jsx(d,{id:"bachelor",className:"mt-1 block w-full",value:r.bachelor||"",onChange:s=>i(a=>({...a,bachelor:s.target.value}))}),e.jsx(n,{className:"mt-2",message:c.bachelor})]}),e.jsxs("div",{children:[e.jsx(o,{htmlFor:"CGPA_bachelor",value:"CGPA Bachelor"}),e.jsx(d,{id:"CGPA_bachelor",className:"mt-1 block w-full",value:r.CGPA_bachelor||"",onChange:s=>i(a=>({...a,CGPA_bachelor:s.target.value}))}),e.jsx(n,{className:"mt-2",message:c.CGPA_bachelor})]})]}),h&&e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{children:[e.jsx(o,{htmlFor:"master",value:"Name of Master Degree"}),e.jsx(d,{id:"master",className:"mt-1 block w-full",value:r.master||"",onChange:s=>i(a=>({...a,master:s.target.value}))}),e.jsx(n,{className:"mt-2",message:c.master})]}),e.jsxs("div",{children:[e.jsx(o,{htmlFor:"master_type",value:"Master Type"}),e.jsxs("select",{id:"master_type",className:"mt-1 block w-full border rounded-md p-2",value:r.master_type||"",onChange:s=>i(a=>({...a,master_type:s.target.value})),children:[e.jsx("option",{value:"",hidden:!0,children:"Select Master Type"}),e.jsx("option",{value:"Full Research",children:"Full Research"}),e.jsx("option",{value:"Coursework",children:"Coursework"}),e.jsx("option",{value:"Research + Coursework",children:"Research + Coursework"})]}),e.jsx(n,{className:"mt-2",message:c.master_type})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"phone_number",value:"Phone Number",required:!0}),e.jsx(d,{id:"phone_number",className:"mt-1 block w-full",value:r.phone_number,onChange:s=>i("phone_number",s.target.value),autoComplete:"tel"}),e.jsx(n,{className:"mt-2",message:c.phone_number})]}),e.jsx("div",{children:e.jsx(Q,{title:"Nationality",value:r.nationality,onChange:s=>i("nationality",s)})})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{children:[e.jsx(o,{htmlFor:"english_proficiency_level",value:"English Proficiency Level"}),e.jsxs("select",{id:"english_proficiency_level",className:"mt-1 block w-full border rounded-md p-2",value:r.english_proficiency_level||"",onChange:s=>i("english_proficiency_level",s.target.value),children:[e.jsx("option",{value:"",hidden:!0,children:"Select English Proficiency Level"}),e.jsx("option",{value:"Beginner",children:"Beginner"}),e.jsx("option",{value:"Elementary",children:"Elementary"}),e.jsx("option",{value:"Intermediate",children:"Intermediate"}),e.jsx("option",{value:"Upper Intermediate",children:"Upper Intermediate"}),e.jsx("option",{value:"Advanced",children:"Advanced"})]}),e.jsx(n,{className:"mt-2",message:c.english_proficiency_level})]}),e.jsxs("div",{children:[e.jsx(o,{htmlFor:"funding_requirement",value:"Funding Requirement"}),e.jsxs("select",{id:"funding_requirement",className:"mt-1 block w-full border rounded-md p-2",value:r.funding_requirement||"",onChange:s=>i("funding_requirement",s.target.value),children:[e.jsx("option",{value:"",hidden:!0,children:"Select Funding Requirement"}),e.jsx("option",{value:"I need a scholarship",children:"I need a scholarship"}),e.jsx("option",{value:"I need a grant",children:"I need a grant"}),e.jsx("option",{value:"I am self-funded",children:"I am self-funded"})]}),e.jsx(n,{className:"mt-2",message:c.funding_requirement})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{className:"",children:[e.jsx("label",{htmlFor:"current_postgraduate_status",className:"mt-1 block text-sm font-medium text-gray-700",children:"Current Postgraduate Status"}),e.jsxs("select",{id:"current_postgraduate_status",className:"block w-full border-gray-300 rounded-md shadow-sm",value:r.current_postgraduate_status,onChange:D,children:[e.jsx("option",{value:"",hidden:!0,children:"Select your current postgraduate status"}),e.jsx("option",{value:"Not registered yet",children:"Not registered yet"}),e.jsx("option",{value:"Registered",children:"Registered"})]})]}),r.current_postgraduate_status==="Registered"&&e.jsxs("div",{children:[e.jsx(o,{htmlFor:"university",value:"University",required:!0}),e.jsxs("select",{id:"university",className:"mt-1 block w-full border rounded-md p-2",value:v||"",onChange:s=>{const a=s.target.value;G(a),i("university",a)},children:[e.jsx("option",{value:"",hidden:!0,children:"Select your University"}),I.map(s=>e.jsx("option",{value:s.id,children:s.full_name},s.id))]}),e.jsx(n,{className:"mt-2",message:c.university})]})]}),r.current_postgraduate_status==="Registered"&&e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 w-full",children:[v&&e.jsxs("div",{children:[e.jsx(o,{htmlFor:"faculty",value:"Faculty",required:!0}),e.jsxs("select",{id:"faculty",className:"mt-1 block w-full border rounded-md p-2",value:r.faculty||"",onChange:s=>i("faculty",s.target.value),children:[e.jsx("option",{value:"",hidden:!0,children:"Select your Faculty"}),O.map(s=>e.jsx("option",{value:s.id,children:s.name},s.id))]}),e.jsx(n,{className:"mt-2",message:c.faculty})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"matric_no",value:"Matric No.",required:!0}),e.jsx(d,{id:"matric_no",className:"mt-1 block w-full",value:r.matric_no,onChange:s=>i("matric_no",s.target.value),required:!0,isFocused:!0,autoComplete:"matric_no"}),e.jsx(n,{className:"mt-2",message:c.matric_no})]})]}),e.jsxs("div",{className:"",children:[e.jsx("label",{htmlFor:"has_suggested_research_title",className:"block text-sm font-medium text-gray-700",children:"Have own suggested research title?"}),e.jsxs("select",{id:"has_suggested_research_title",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:C?"yes":"no",onChange:J,children:[e.jsx("option",{value:"no",children:"No"}),e.jsx("option",{value:"yes",children:"Yes"})]})]}),C&&e.jsxs("div",{className:"",children:[e.jsxs("div",{children:[e.jsx(o,{htmlFor:"suggested_research_title",value:"Suggested Research Title",required:!0}),e.jsx(d,{id:"suggested_research_title",className:"mt-1 block w-full",value:r.suggested_research_title,onChange:s=>i("suggested_research_title",s.target.value),required:!0,isFocused:!0,autoComplete:"suggested_research_title"}),e.jsx(n,{className:"mt-2",message:c.suggested_research_title})]}),e.jsxs("div",{className:"mt-4",children:[e.jsx(o,{htmlFor:"suggested_research_description",value:"Suggested Research Description"}),e.jsx("textarea",{id:"suggested_research_description",className:"mt-1 block w-full",value:r.suggested_research_description,onChange:s=>i("suggested_research_description",s.target.value),rows:4}),e.jsx(n,{className:"mt-2",message:c.suggested_research_description})]})]}),e.jsxs("div",{className:"w-full",children:[e.jsx("label",{htmlFor:"field_of_research",className:"block text-sm font-medium text-gray-700",children:"Field of Research (Multiple Selection) Structure : Field of Research - Research Area - Niche Domain"}),e.jsx(X,{id:"field_of_research",isMulti:!0,options:x.map(s=>({value:`${s.field_of_research_id}-${s.research_area_id}-${s.niche_domain_id}`,label:`${s.field_of_research_name} - ${s.research_area_name} - ${s.niche_domain_name}`})),className:"mt-1",classNamePrefix:"select",value:(P=r.field_of_research)==null?void 0:P.map(s=>{const a=x.find(t=>`${t.field_of_research_id}-${t.research_area_id}-${t.niche_domain_id}`===s);return{value:s,label:a?`${a.field_of_research_name} - ${a.research_area_name} - ${a.niche_domain_name}`:s}}),onChange:s=>{const a=s.map(t=>t.value);i("field_of_research",a)},placeholder:"Select field of research..."})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("label",{htmlFor:"CV_file",className:"block text-sm font-medium text-gray-700",children:"Upload CV (Max 5MB)"}),e.jsx("input",{type:"file",id:"CV_file",name:"CV_file",className:"block w-full border-gray-300 rounded-md shadow-sm",accept:".pdf,.doc,.docx",onChange:s=>{const a=s.target.files[0];a&&(a.size<=5*1024*1024?i(t=>({...t,CV_file:a})):alert("File size exceeds 5MB. Please upload a smaller file."))}}),r.CV_file&&e.jsx("div",{className:"mt-2",children:typeof r.CV_file=="string"?e.jsxs("a",{href:`/storage/${r.CV_file}`,target:"_blank",rel:"noopener noreferrer",className:"text-sm text-blue-500 hover:underline",children:["View Current File: ",r.CV_file.split("/").pop()]}):e.jsxs("p",{className:"text-sm text-gray-500",children:["File Selected: ",r.CV_file.name]})})]}),e.jsxs("div",{children:[e.jsx(o,{htmlFor:"website",value:"Website"}),e.jsx(d,{id:"website",className:"mt-1 block w-full",value:r.website,onChange:s=>i("website",s.target.value),autoComplete:"url"}),e.jsx(n,{className:"mt-2",message:c.website})]}),e.jsxs("div",{children:[e.jsx(o,{htmlFor:"linkedin",value:"LinkedIn"}),e.jsx(d,{id:"linkedin",className:"mt-1 block w-full",value:r.linkedin,onChange:s=>i("linkedin",s.target.value),autoComplete:"url"}),e.jsx(n,{className:"mt-2",message:c.linkedin})]}),e.jsxs("div",{children:[e.jsx(o,{htmlFor:"google_scholar",value:"Google Scholar"}),e.jsx(d,{id:"google_scholar",className:"mt-1 block w-full",value:r.google_scholar,onChange:s=>i("google_scholar",s.target.value),autoComplete:"url"}),e.jsx(n,{className:"mt-2",message:c.google_scholar})]}),e.jsxs("div",{children:[e.jsx(o,{htmlFor:"researchgate",value:"ResearchGate"}),e.jsx(d,{id:"researchgate",className:"mt-1 block w-full",value:r.researchgate,onChange:s=>i("researchgate",s.target.value),autoComplete:"url"}),e.jsx(n,{className:"mt-2",message:c.researchgate})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(K,{disabled:R,children:"Save"}),e.jsx(Z,{show:B,enter:"transition ease-in-out",enterFrom:"opacity-0",leave:"transition ease-in-out",leaveTo:"opacity-0",children:e.jsx("p",{className:"text-sm text-gray-600",children:"Saved."})})]})]})]}),j==="projects"&&e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"})]})]})}export{ce as default};
