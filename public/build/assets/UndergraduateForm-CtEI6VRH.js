import{q as G,W as R,r as m,j as e,a as V}from"./app-CzpsuqeG.js";import{T as d,I as c}from"./TextInput-DKhH7DCu.js";import{I as o}from"./InputLabel-C0Ig5Io3.js";import{P as h}from"./PrimaryButton-CNQSMa7o.js";import z from"./NationalityForm-BnROzH_r.js";import{S as w}from"./react-select.esm-CTfWK8aB.js";import{z as O}from"./transition-CIxDcidC.js";function K({universities:N,faculties:C,className:k="",researchOptions:g}){var _,j;const a=G().props.undergraduate,{data:s,setData:i,post:S,errors:n,processing:P,recentlySuccessful:F}=R({phone_number:(a==null?void 0:a.phone_number)||"",full_name:(a==null?void 0:a.full_name)||"",bio:(a==null?void 0:a.bio)||"",bachelor:(a==null?void 0:a.bachelor)||"",CGPA_bachelor:(a==null?void 0:a.CGPA_bachelor)||"",nationality:(a==null?void 0:a.nationality)||"",english_proficiency_level:(a==null?void 0:a.english_proficiency_level)||"",current_undergraduate_status:(a==null?void 0:a.current_undergraduate_status)||"",university:(a==null?void 0:a.university)||"",faculty:(a==null?void 0:a.faculty)||"",matric_no:(a==null?void 0:a.matric_no)||"",skills:(a==null?void 0:a.skills)||[],interested_do_research:(a==null?void 0:a.interested_do_research)||!1,expected_graduate:(a==null?void 0:a.expected_graduate)||"",research_preference:typeof(a==null?void 0:a.research_preference)=="string"?JSON.parse(a==null?void 0:a.research_preference):a==null?void 0:a.research_preference,CV_file:(a==null?void 0:a.CV_file)||"",profile_picture:(a==null?void 0:a.profile_picture)||"",background_image:(a==null?void 0:a.background_image)||"",website:(a==null?void 0:a.website)||"",linkedin:(a==null?void 0:a.linkedin)||"",google_scholar:(a==null?void 0:a.google_scholar)||"",researchgate:(a==null?void 0:a.researchgate)||""}),I=l=>{const t=l.target.value;t!=="Registered"?(i(r=>({...r,current_undergraduate_status:t,matric_no:"",university:"",faculty:""})),x("")):i(r=>({...r,current_undergraduate_status:t}))},[v,x]=m.useState(s.university),$=C.filter(l=>l.university_id===parseInt(v)),f=[{value:"programming",label:"Programming Skills"},{value:"data_analysis",label:"Data Analysis"},{value:"machine_learning",label:"Machine Learning"},{value:"statistical_analysis",label:"Statistical Analysis"},{value:"research_methodology",label:"Research Methodology"},{value:"project_management",label:"Project Management"},{value:"experimental_design",label:"Experimental Design"},{value:"quantitative_analysis",label:"Quantitative Analysis"},{value:"qualitative_analysis",label:"Qualitative Analysis"},{value:"technical_writing",label:"Technical Writing"},{value:"public_speaking",label:"Public Speaking"},{value:"grant_writing",label:"Grant Writing"},{value:"software_development",label:"Software Development"},{value:"data_visualization",label:"Data Visualization"},{value:"web_development",label:"Web Development"},{value:"database_management",label:"Database Management"},{value:"simulation",label:"Simulation"},{value:"modeling",label:"Modeling"},{value:"critical_thinking",label:"Critical Thinking"},{value:"problem_solving",label:"Problem Solving"},{value:"literature_review",label:"Literature Review"},{value:"data_mining",label:"Data Mining"},{value:"cloud_computing",label:"Cloud Computing"},{value:"statistical_software",label:"Statistical Software Proficiency"},{value:"survey_design",label:"Survey Design"},{value:"data_cleaning",label:"Data Cleaning"},{value:"communication",label:"Communication Skills"},{value:"interdisciplinary_collaboration",label:"Interdisciplinary Collaboration"},{value:"innovation",label:"Innovation"},{value:"academic_writing",label:"Academic Writing"},{value:"research_ethics",label:"Research Ethics"},{value:"strategic_planning",label:"Strategic Planning"},{value:"networking",label:"Networking"}],A=l=>{const t=l.map(r=>r.value);i("research_preference",t)},M=l=>{l.preventDefault();const t=new FormData;Object.keys(s).forEach(r=>{r!=="profile_picture"&&(Array.isArray(s[r])?t.append(r,JSON.stringify(s[r])):r==="interested_do_research"?t.append(r,s[r]===!0?1:0):t.append(r,s[r]))});for(let[r,y]of t.entries())console.log(`${r}: ${y}`),console.log(`${r}: ${typeof y}`);S(route("role.update"),{data:t,headers:{"Content-Type":"multipart/form-data"},onSuccess:()=>{alert("Profile updated successfully.")},onError:r=>{console.error("Error updating profile:",r),alert("Failed to update the profile. Please try again.")}})},[D,p]=m.useState(!1),E=()=>p(!0),B=()=>p(!1),[U,b]=m.useState(!1),[u,q]=m.useState("profiles");return e.jsxs("div",{className:"pb-8",children:[e.jsxs("div",{className:"w-full bg-white pb-12 shadow-md relative mb-4",children:[e.jsxs("div",{className:"relative w-full h-48 overflow-hidden",children:[e.jsx("img",{src:`/storage/${s.background_image||"default-background.jpg"}`,alt:"Background",className:"w-full h-full object-cover"}),e.jsx("button",{onClick:()=>b(!0),className:"absolute top-4 right-4 bg-blue-500 p-2 rounded-full shadow-lg text-white hover:bg-blue-600","aria-label":"Edit Background Image",children:"✏️"})]}),e.jsxs("div",{className:"relative flex flex-col items-center -mt-16 z-10",children:[e.jsxs("div",{className:"relative",children:[e.jsx("img",{src:`/storage/${s.profile_picture||"default-profile.jpg"}`,alt:"Profile",className:"w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"}),e.jsx("button",{onClick:E,className:"absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full shadow-lg text-white hover:bg-blue-600","aria-label":"Edit Profile Picture",children:"✏️"})]}),e.jsx("div",{className:"text-center mt-4",children:e.jsx("h1",{className:"text-2xl font-semibold text-gray-800",children:s.full_name})})]})]}),U&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Update Background Image"}),e.jsxs("form",{onSubmit:l=>{l.preventDefault()},children:[e.jsx("input",{type:"file",accept:"image/*",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",onChange:l=>i("background_image",l.target.files[0])}),e.jsxs("div",{className:"mt-4 flex justify-end",children:[e.jsx(h,{children:"Save"}),e.jsx("button",{type:"button",onClick:()=>b(!1),className:"ml-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400",children:"Cancel"})]})]})]})}),D&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50",children:e.jsxs("div",{className:"bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg",children:[e.jsx("h2",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Update Profile Picture"}),e.jsxs("form",{onSubmit:l=>{l.preventDefault()},children:[e.jsx("input",{type:"file",accept:"image/*",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",onChange:l=>i("profile_picture",l.target.files[0])}),e.jsxs("div",{className:"mt-4 flex justify-end",children:[e.jsx(h,{children:"Save"}),e.jsx("button",{type:"button",onClick:B,className:"ml-2 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400",children:"Cancel"})]})]})]})}),e.jsx("div",{className:"bg-white border-b border-gray-200",children:e.jsx("div",{className:"max-w-6xl mx-auto flex space-x-8 px-4 sm:px-6",children:["profiles","projects","works","teams","network","activity","more"].map(l=>e.jsx("button",{className:`py-4 px-3 font-medium text-sm ${u===l?"border-b-2 border-blue-500 text-blue-600":"text-gray-500 hover:text-gray-700"}`,onClick:()=>q(l),children:l.charAt(0).toUpperCase()+l.slice(1)},l))})}),e.jsxs("div",{className:"w-full px-4 py-8",children:[u==="profiles"&&e.jsxs("section",{className:k,children:[e.jsxs("header",{children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Personal Information"}),e.jsx("p",{className:"mt-1 text-sm text-gray-600",children:"Update your personal information."})]}),e.jsxs("form",{onSubmit:M,className:"mt-6 space-y-6",children:[e.jsx("div",{className:"grid grid-cols-1 gap-6 w-full",children:e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"full_name",value:"Full Name",required:!0}),e.jsx(d,{id:"full_name",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.full_name,onChange:l=>i("full_name",l.target.value),required:!0,autoComplete:"full_name"}),e.jsx(c,{className:"mt-2",message:n.full_name})]})}),e.jsx("div",{className:"grid grid-cols-1 gap-6 w-full",children:e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"bio",value:"Short Bio"}),e.jsx("textarea",{id:"bio",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm p-4",value:s.bio,onChange:l=>i("bio",l.target.value),rows:4}),e.jsx(c,{className:"mt-2",message:n.bio})]})}),e.jsxs("div",{className:"grid grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{children:[e.jsx(o,{htmlFor:"bachelor",value:"Name of Bachelor Degree"}),e.jsx(d,{id:"bachelor",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.bachelor,onChange:l=>i("bachelor",l.target.value)}),e.jsx(c,{className:"mt-2",message:n.bachelor})]}),e.jsxs("div",{children:[e.jsx(o,{htmlFor:"CGPA_bachelor",value:"CGPA Bachelor"}),e.jsx(d,{id:"CGPA_bachelor",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.CGPA_bachelor,onChange:l=>i("CGPA_bachelor",l.target.value)}),e.jsx(c,{className:"mt-2",message:n.CGPA_bachelor})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{children:[e.jsx(o,{htmlFor:"phone_number",value:"Phone Number",required:!0}),e.jsx(d,{id:"phone_number",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.phone_number,onChange:l=>i("phone_number",l.target.value),autoComplete:"tel"}),e.jsx(c,{className:"mt-2",message:n.phone_number})]}),e.jsx("div",{children:e.jsx(z,{title:"Nationality",value:s.nationality,onChange:l=>i("nationality",l)})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{children:[e.jsx(o,{htmlFor:"english_proficiency_level",value:"English Proficiency Level"}),e.jsxs("select",{id:"english_proficiency_level",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.english_proficiency_level,onChange:l=>i("english_proficiency_level",l.target.value),children:[e.jsx("option",{value:"",hidden:!0,children:"Select English Proficiency Level"}),e.jsx("option",{value:"Beginner",children:"Beginner"}),e.jsx("option",{value:"Elementary",children:"Elementary"}),e.jsx("option",{value:"Intermediate",children:"Intermediate"}),e.jsx("option",{value:"Upper Intermediate",children:"Upper Intermediate"}),e.jsx("option",{value:"Advanced",children:"Advanced"})]}),e.jsx(c,{className:"mt-2",message:n.english_proficiency_level})]}),e.jsxs("div",{children:[e.jsx(o,{htmlFor:"current_undergraduate_status",value:"Current Undergraduate Status"}),e.jsxs("select",{id:"current_undergraduate_status",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.current_undergraduate_status,onChange:I,children:[e.jsx("option",{value:"",hidden:!0,children:"Select your status"}),e.jsx("option",{value:"Not registered yet",children:"Not registered yet"}),e.jsx("option",{value:"Registered",children:"Registered"})]})]})]}),s.current_undergraduate_status==="Registered"&&e.jsxs("div",{className:"grid grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{children:[e.jsx(o,{htmlFor:"university",value:"University",required:!0}),e.jsxs("select",{id:"university",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:v||"",onChange:l=>{const t=parseInt(l.target.value);x(t),i("university",t)},children:[e.jsx("option",{value:"",hidden:!0,children:"Select your University"}),N.map(l=>e.jsx("option",{value:l.id,children:l.full_name},l.id))]}),e.jsx(c,{className:"mt-2",message:n.university})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"faculty",value:"Faculty",required:!0}),e.jsxs("select",{id:"faculty",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.faculty,onChange:l=>i("faculty",l.target.value),children:[e.jsx("option",{value:"",hidden:!0,children:"Select your Faculty"}),$.map(l=>e.jsx("option",{value:l.id,children:l.name},l.id))]}),e.jsx(c,{className:"mt-2",message:n.faculty})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-6 w-full",children:[s.current_undergraduate_status==="Registered"&&e.jsxs("div",{children:[e.jsx(o,{htmlFor:"matric_no",value:"Matric No.",required:!0}),e.jsx(d,{id:"matric_no",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.matric_no,onChange:l=>i("matric_no",l.target.value),required:!0,autoComplete:"matric_no"}),e.jsx(c,{className:"mt-2",message:n.matric_no})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"skills",value:"Skills"}),e.jsx(w,{id:"skills",isMulti:!0,options:f,className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",classNamePrefix:"select",value:(_=s.skills)==null?void 0:_.map(l=>f.find(r=>r.value===l)||{value:l,label:l}),onChange:l=>{const t=l.map(r=>r.value);i("skills",t)},placeholder:"Select your skills..."})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-6 w-full",children:[e.jsxs("div",{children:[e.jsx(o,{htmlFor:"interested_do_research",value:"Interested to do research after bachelor degree?"}),e.jsxs("select",{id:"interested_do_research",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.interested_do_research?"true":"false",onChange:l=>i("interested_do_research",l.target.value==="true"),children:[e.jsx("option",{value:"false",children:"No"}),e.jsx("option",{value:"true",children:"Yes"})]})]}),e.jsxs("div",{children:[e.jsx(o,{htmlFor:"expected_graduate",value:"Expected Graduate (Month/Year)",required:!0}),e.jsx(d,{id:"expected_graduate",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.expected_graduate,onChange:l=>i("expected_graduate",l.target.value),required:!0,autoComplete:"expected_graduate"}),e.jsx(c,{className:"mt-2",message:n.expected_graduate})]})]}),s.interested_do_research===!0&&e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"research_preference",value:"Preferred Field of Research"}),e.jsx(w,{id:"research_preference",isMulti:!0,options:g.map(l=>({value:`${l.field_of_research_id}-${l.research_area_id}-${l.niche_domain_id}`,label:`${l.field_of_research_name} - ${l.research_area_name} - ${l.niche_domain_name}`})),className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",classNamePrefix:"select",value:(j=s.research_preference)==null?void 0:j.map(l=>{const t=g.find(r=>`${r.field_of_research_id}-${r.research_area_id}-${r.niche_domain_id}`===l);return{value:l,label:t?`${t.field_of_research_name} - ${t.research_area_name} - ${t.niche_domain_name}`:l}}),onChange:A,placeholder:"Select preferred field of research..."})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"CV_file",value:"Upload CV (Max 5MB)"}),e.jsx("input",{type:"file",id:"CV_file",accept:".pdf,.doc,.docx",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",onChange:l=>{const t=l.target.files[0];t&&(t.size<=5*1024*1024?i("CV_file",t):alert("File size exceeds 5MB. Please upload a smaller file."))}}),s.CV_file&&e.jsx("div",{className:"mt-2",children:typeof s.CV_file=="string"?e.jsxs("a",{href:`/storage/${s.CV_file}`,target:"_blank",rel:"noopener noreferrer",className:"text-sm text-blue-500 hover:underline",children:["View Current File: ",s.CV_file.split("/").pop()]}):e.jsxs("p",{className:"text-sm text-gray-500",children:["File Selected: ",s.CV_file.name]})}),e.jsx(c,{className:"mt-2",message:n.CV_file})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"website",value:"Website"}),e.jsx(d,{id:"website",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.website,onChange:l=>i("website",l.target.value),autoComplete:"url"}),e.jsx(c,{className:"mt-2",message:n.website})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"linkedin",value:"LinkedIn"}),e.jsx(d,{id:"linkedin",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.linkedin,onChange:l=>i("linkedin",l.target.value),autoComplete:"url"}),e.jsx(c,{className:"mt-2",message:n.linkedin})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"google_scholar",value:"Google Scholar"}),e.jsx(d,{id:"google_scholar",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.google_scholar,onChange:l=>i("google_scholar",l.target.value),autoComplete:"url"}),e.jsx(c,{className:"mt-2",message:n.google_scholar})]}),e.jsxs("div",{className:"w-full",children:[e.jsx(o,{htmlFor:"researchgate",value:"ResearchGate"}),e.jsx(d,{id:"researchgate",className:"mt-1 block w-full border-gray-300 rounded-md shadow-sm",value:s.researchgate,onChange:l=>i("researchgate",l.target.value),autoComplete:"url"}),e.jsx(c,{className:"mt-2",message:n.researchgate})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(h,{disabled:P,children:"Save"}),e.jsx(V,{href:route("create-posts.index"),className:"inline-block rounded-lg bg-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-400",children:"Cancel"}),e.jsx(O,{show:F,enter:"transition ease-in-out",enterFrom:"opacity-0",leave:"transition ease-in-out",leaveTo:"opacity-0",children:e.jsx("p",{className:"text-sm text-gray-600",children:"Saved."})})]})]})]}),u==="projects"&&e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"})]})]})}export{K as default};
