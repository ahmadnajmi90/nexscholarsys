import{j as o}from"./app-DHAf9Q6S.js";import n from"./AcademicianForm-CqnDkzRQ.js";import u from"./PostgraduateForm-C48qvv92.js";import f from"./UndergraduateForm-YAEIwA9-.js";import{u as x}from"./useRoles-hF9fHrU_.js";import"./TextInput-f8khy2K5.js";import"./InputLabel-tHzAJhPJ.js";import"./PrimaryButton-DpCRCm08.js";import"./react-select.esm-y_yIWHOg.js";import"./transition-DRgqJmZK.js";import"./NationalityForm-C-SH_r0H.js";function h({universities:m,faculties:t,postgraduate:a,academician:i,undergraduate:d,researchOptions:r}){const{isPostgraduate:s,isUndergraduate:e,isAcademician:p}=x();return o.jsxs("div",{className:"p-4 bg-white shadow sm:rounded-lg",children:[p&&o.jsx(n,{academician:i,researchOptions:r}),s&&o.jsx(u,{postgraduate:a,universities:m,faculties:t,researchOptions:r}),e&&o.jsx(f,{undergraduate:d,universities:m,faculties:t,researchOptions:r})]})}export{h as default};