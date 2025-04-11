import{j as e,a as n}from"./app-D8rD0SG2.js";import{k as _,A as g,y as v,F as y,z as p,p as f,B as w}from"./index-D0UMKqBr.js";const A=({profile:s,university:i,faculty:x,user:c,researchOptions:m,skillsOptions:h,type:l})=>{const o=()=>l==="academician"&&Array.isArray(s.research_expertise)&&s.research_expertise.length>0?s.research_expertise.map((d,t)=>{const a=m.find(r=>`${r.field_of_research_id}-${r.research_area_id}-${r.niche_domain_id}`===d);return a?`${t+1}. ${a.field_of_research_name} - ${a.research_area_name} - ${a.niche_domain_name}`:`${t+1}. Unknown`}):l==="postgraduate"&&Array.isArray(s.research_preference)&&s.research_preference.length>0?s.research_preference.map((d,t)=>{const a=m.find(r=>`${r.field_of_research_id}-${r.research_area_id}-${r.niche_domain_id}`===d);return a?`${t+1}. ${a.field_of_research_name} - ${a.research_area_name} - ${a.niche_domain_name}`:`${t+1}. Unknown`}):null,j=()=>e.jsx(e.Fragment,{children:s.department&&e.jsxs("div",{className:"bg-white shadow sm:rounded-lg p-4 sm:p-6 mb-4",children:[e.jsx("h2",{className:"text-lg sm:text-xl font-semibold mb-4",children:"Department & Supervision"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Department"}),e.jsx("p",{className:"mt-1",children:s.department})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Availability as Supervisor"}),e.jsx("p",{className:"mt-1",children:s.availability_as_supervisor===1?"Available":"Not Available"})]}),s.availability_as_supervisor===1&&s.supervision_areas&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Supervision Areas"}),e.jsx("p",{className:"mt-1",children:s.supervision_areas})]})]})]})}),u=()=>(s.previous_degree&&JSON.parse(s.previous_degree),e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"bg-white shadow sm:rounded-lg p-6 mb-6",children:[e.jsx("h2",{className:"text-xl font-semibold mb-4",children:"Academic Background"}),s.current_postgraduate_status&&e.jsxs("div",{className:"mb-6 border rounded-lg p-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Current Postgraduate Status"}),e.jsx("p",{className:"text-gray-700",children:s.current_postgraduate_status})]}),s.english_proficiency_level&&e.jsxs("div",{className:"mb-6 border rounded-lg p-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"English Proficiency"}),e.jsx("p",{className:"text-gray-700",children:s.english_proficiency_level})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6",children:[s.bachelor&&e.jsxs("div",{className:"border rounded-lg p-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-3",children:"Bachelor's Degree"}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"University"}),e.jsx("p",{className:"mt-1",children:s.bachelor})]}),s.CGPA_bachelor&&e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"CGPA"}),e.jsx("p",{className:"mt-1",children:s.CGPA_bachelor})]})]})]}),s.master&&e.jsxs("div",{className:"border rounded-lg p-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-3",children:"Master's Degree"}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"University"}),e.jsx("p",{className:"mt-1",children:s.master})]}),s.master_type&&e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"Type"}),e.jsx("p",{className:"mt-1",children:s.master_type})]})]})]})]}),s.field_of_research&&Array.isArray(s.field_of_research)&&s.field_of_research.length>0&&e.jsxs("div",{className:"border rounded-lg p-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-3",children:"Field of Research"}),e.jsx("div",{className:"space-y-2",children:s.field_of_research.map((d,t)=>{const a=m.find(r=>`${r.field_of_research_id}-${r.research_area_id}-${r.niche_domain_id}`===d);return e.jsxs("p",{className:"text-gray-700",children:[t+1,". ",a?`${a.field_of_research_name} - ${a.research_area_name} - ${a.niche_domain_name}`:d]},t)})})]}),s.skills&&Array.isArray(s.skills)&&s.skills.length>0&&e.jsxs("div",{className:"border rounded-lg p-4 mt-6",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-3",children:"Skills"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:s.skills.map((d,t)=>{const a=h.find(r=>r.id===d);return a?e.jsx("span",{className:"inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800",children:a.name},t):null})})]})]}),e.jsxs("div",{className:"bg-white shadow sm:rounded-lg p-6 mb-6",children:[e.jsx("h2",{className:"text-xl font-semibold mb-4",children:"Research Proposal & Funding"}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6",children:[(s.suggested_research_title||s.suggested_research_description)&&e.jsxs("div",{className:"border rounded-lg p-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-3",children:"Research Proposal"}),s.suggested_research_title&&e.jsxs("div",{className:"mb-3",children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"Suggested Title"}),e.jsx("p",{className:"mt-1 font-medium",children:s.suggested_research_title})]}),s.suggested_research_description&&e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"Description"}),e.jsx("p",{className:"mt-1",children:s.suggested_research_description})]})]}),e.jsxs("div",{className:"border rounded-lg p-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-3",children:"Funding & Supervision"}),e.jsxs("div",{className:"space-y-3",children:[s.funding_requirement&&e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"Funding Requirement"}),e.jsx("p",{className:"mt-1",children:s.funding_requirement})]}),s.supervisorAvailability&&e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"Looking for a Supervisor?"}),e.jsx("p",{className:"mt-1",children:s.supervisorAvailability?"Yes":"No"})]}),s.grantAvailability&&e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"Looking for a Grant?"}),e.jsx("p",{className:"mt-1",children:s.grantAvailability?"Yes":"No"})]})]})]})]}),s.CV_file&&e.jsx("div",{className:"mt-4 flex justify-center",children:e.jsxs("a",{href:`/storage/${s.CV_file}`,className:"inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",target:"_blank",rel:"noopener noreferrer",children:[e.jsx(g,{className:"mr-2"}),"View CV"]})})]})]})),b=()=>e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"bg-white shadow sm:rounded-lg p-6 mb-6",children:[e.jsx("h2",{className:"text-xl font-semibold mb-4",children:"Academic Background"}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6",children:[s.current_undergraduate_status&&e.jsxs("div",{className:"border rounded-lg p-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Current Undergraduate Status"}),e.jsx("p",{className:"text-gray-700",children:s.current_undergraduate_status})]}),s.expected_graduate&&e.jsxs("div",{className:"border rounded-lg p-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Expected Graduation"}),e.jsx("p",{className:"text-gray-700",children:s.expected_graduate})]})]}),e.jsxs("div",{className:"border rounded-lg p-4 mb-6",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-3",children:"Bachelor's Degree"}),e.jsxs("div",{className:"space-y-3",children:[s.bachelor&&e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"Major"}),e.jsx("p",{className:"mt-1",children:s.bachelor})]}),s.CGPA_bachelor&&e.jsxs("div",{children:[e.jsx("h4",{className:"text-sm font-medium text-gray-500",children:"CGPA"}),e.jsx("p",{className:"mt-1",children:s.CGPA_bachelor})]})]})]}),s.english_proficiency_level&&e.jsxs("div",{className:"border rounded-lg p-4 mb-6",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"English Proficiency"}),e.jsx("p",{className:"text-gray-700",children:s.english_proficiency_level})]}),s.skills&&Array.isArray(s.skills)&&s.skills.length>0&&e.jsxs("div",{className:"border rounded-lg p-4 mb-6",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-3",children:"Skills"}),e.jsx("div",{className:"flex flex-wrap gap-2",children:s.skills.map((d,t)=>{const a=h.find(r=>r.id===d);return a?e.jsx("span",{className:"inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800",children:a.name},t):null})})]}),s.CV_file&&e.jsx("div",{className:"mt-4 flex justify-center",children:e.jsxs("a",{href:`/storage/${s.CV_file}`,className:"inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors",target:"_blank",rel:"noopener noreferrer",children:[e.jsx(g,{className:"mr-2"}),"View CV"]})})]}),s.interested_do_research&&e.jsxs("div",{className:"bg-white shadow sm:rounded-lg p-6 mb-6",children:[e.jsx("h2",{className:"text-xl font-semibold mb-4",children:"Research Interest"}),s.research_preference&&Array.isArray(s.research_preference)&&s.research_preference.length>0&&e.jsxs("div",{className:"border rounded-lg p-4",children:[e.jsx("h3",{className:"text-lg font-medium text-gray-900 mb-3",children:"Field of Research"}),e.jsx("div",{className:"space-y-2",children:s.research_preference.map((d,t)=>{const a=m.find(r=>`${r.field_of_research_id}-${r.research_area_id}-${r.niche_domain_id}`===d);return e.jsxs("p",{className:"text-gray-700",children:[t+1,". ",a?`${a.field_of_research_name} - ${a.research_area_name} - ${a.niche_domain_name}`:d]},t)})})]})]})]}),N=()=>!s.google_scholar&&!s.website&&!s.linkedin&&!s.researchgate&&!(c!=null&&c.email)?null:e.jsxs("div",{className:"bg-white shadow sm:rounded-lg p-4 sm:p-6 mt-4",children:[e.jsx("h2",{className:"text-lg sm:text-xl font-semibold mb-4",children:"Connect"}),e.jsxs("div",{className:"flex flex-col space-y-3",children:[(c==null?void 0:c.email)&&e.jsxs(n,{href:route("email.compose",{to:c==null?void 0:c.email}),className:"flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md transition-colors",title:"Send Email",children:[e.jsx(v,{className:"text-gray-600 hover:text-blue-600",size:20}),e.jsx("span",{className:"text-sm font-medium text-gray-700",children:"Email"})]}),s.google_scholar&&e.jsxs("a",{href:s.google_scholar,target:"_blank",rel:"noopener noreferrer",className:"flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md transition-colors",title:"Google Scholar",children:[e.jsx(y,{className:"text-gray-600 hover:text-blue-600",size:20}),e.jsx("span",{className:"text-sm font-medium text-gray-700",children:"Google Scholar"})]}),s.website&&e.jsxs("a",{href:s.website,target:"_blank",rel:"noopener noreferrer",className:"flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md transition-colors",title:"Website",children:[e.jsx(p,{className:"text-gray-600 hover:text-green-600",size:20}),e.jsx("span",{className:"text-sm font-medium text-gray-700",children:"Personal Website"})]}),s.linkedin&&e.jsxs("a",{href:s.linkedin,target:"_blank",rel:"noopener noreferrer",className:"flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md transition-colors",title:"LinkedIn",children:[e.jsx(f,{className:"text-gray-600 hover:text-blue-600",size:20}),e.jsx("span",{className:"text-sm font-medium text-gray-700",children:"LinkedIn"})]}),s.researchgate&&e.jsxs("a",{href:s.researchgate,target:"_blank",rel:"noopener noreferrer",className:"flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-md transition-colors",title:"ResearchGate",children:[e.jsx(w,{className:"text-gray-600 hover:text-blue-600",size:20}),e.jsx("span",{className:"text-sm font-medium text-gray-700",children:"ResearchGate"})]})]})]});return e.jsxs("div",{className:"max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8",children:[e.jsx("div",{className:"absolute top-[2rem] left-6 md:top-[3rem] md:left-[20.2rem] z-10",children:e.jsx(n,{onClick:()=>window.history.back(),className:"flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors",children:e.jsx(_,{className:"text-xl"})})}),e.jsxs("div",{className:"bg-white shadow overflow-hidden sm:rounded-lg mb-4 sm:mb-6",children:[e.jsxs("div",{className:"relative h-48 sm:h-64",children:[e.jsx("img",{src:s.background_image?`/storage/${s.background_image}`:"/storage/profile_background_images/default.jpg",alt:"Background",className:"w-full h-full object-cover"}),e.jsx("div",{className:"absolute -bottom-16 left-4 sm:left-8",children:e.jsx("img",{src:s.profile_picture?`/storage/${s.profile_picture}`:"/images/default-avatar.jpg",alt:s.full_name,className:"w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"})})]}),e.jsxs("div",{className:"px-4 sm:px-8 pt-20 pb-4 sm:pb-6",children:[e.jsx("h1",{className:"text-2xl sm:text-3xl font-bold text-gray-900",children:s.full_name}),l==="academician"&&s.current_position&&e.jsx("p",{className:"text-base sm:text-lg text-gray-600 mt-1",children:s.current_position}),e.jsx("div",{className:"mt-2 flex flex-wrap items-center text-gray-500",children:e.jsxs("p",{className:"text-sm sm:text-base",children:[i==null?void 0:i.full_name," - ",x==null?void 0:x.name]})})]})]}),e.jsx("div",{className:"border-b border-gray-300 mb-6",children:e.jsxs("div",{className:"flex md:space-x-12 space-x-4 px-4 sm:px-8",children:[e.jsx(n,{href:l==="academician"?route("academicians.show",s.url):"#",className:"md:text-lg text-base font-semibold text-blue-600 hover:text-blue-800 border-b-2 border-blue-600 pb-2",children:"Profile"}),e.jsx(n,{href:l==="academician"?route("academicians.publications",s.url):"#",className:"md:text-lg text-base font-semibold text-gray-600 hover:text-blue-600 pb-2",children:"Publications"}),e.jsx(n,{href:l==="academician"?route("academicians.projects",s.url):"#",className:"md:text-lg text-base font-semibold text-gray-600 hover:text-blue-600 pb-2",children:"Projects"}),e.jsx(n,{href:"#",className:"md:text-lg text-base font-semibold text-gray-600 hover:text-blue-600 pb-2",children:"Supervisors"})]})}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6",children:[e.jsxs("div",{className:"col-span-1 space-y-4",children:[e.jsxs("div",{className:"bg-white shadow sm:rounded-lg p-4 sm:p-6",children:[e.jsx("h2",{className:"text-lg sm:text-xl font-semibold mb-4",children:"Basic Information"}),e.jsxs("div",{className:"space-y-4",children:[(c==null?void 0:c.email)&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Email"}),e.jsx("p",{className:"mt-1 break-words",children:c.email})]}),s.phone_number&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Phone"}),e.jsx("p",{className:"mt-1",children:s.phone_number})]}),l==="academician"&&e.jsxs(e.Fragment,{children:[s.highest_degree&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Highest Degree"}),e.jsx("p",{className:"mt-1",children:s.highest_degree})]}),s.field_of_study&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Field of Study"}),e.jsx("p",{className:"mt-1",children:s.field_of_study})]})]}),(l==="postgraduate"||l==="undergraduate")&&s.matric_no&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Matric No"}),e.jsx("p",{className:"mt-1",children:s.matric_no})]}),(l==="postgraduate"||l==="undergraduate")&&s.nationality&&e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium text-gray-500",children:"Nationality"}),e.jsx("p",{className:"mt-1",children:s.nationality})]})]})]}),N()]}),e.jsxs("div",{className:"col-span-1 lg:col-span-2",children:[o()&&e.jsxs("div",{className:"bg-white shadow sm:rounded-lg p-4 sm:p-6 mb-4 sm:mb-6",children:[e.jsx("h2",{className:"text-lg sm:text-xl font-semibold mb-4",children:"Research Expertise"}),e.jsx("div",{className:"space-y-2",children:o().map((d,t)=>e.jsx("p",{className:"text-gray-700 text-sm sm:text-base",children:d},t))})]}),l==="academician"&&j(),l==="postgraduate"&&u(),l==="undergraduate"&&b(),s.bio&&e.jsxs("div",{className:"bg-white shadow sm:rounded-lg p-4 sm:p-6",children:[e.jsx("h2",{className:"text-lg sm:text-xl font-semibold mb-4",children:"Biography"}),e.jsx("div",{className:"prose max-w-none text-sm sm:text-base",dangerouslySetInnerHTML:{__html:s.bio}})]})]})]})]})};export{A as default};
