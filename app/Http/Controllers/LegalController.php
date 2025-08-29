<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LegalController extends Controller
{
    public function terms()
    {
        return Inertia::render('Legal/Show', [
            'title' => 'Terms of Use',
            'content' => $this->getTermsContent()
        ]);
    }

    public function privacy()
    {
        return Inertia::render('Legal/Show', [
            'title' => 'Privacy Policy',
            'content' => $this->getPrivacyContent()
        ]);
    }

    public function cookies()
    {
        return Inertia::render('Legal/Show', [
            'title' => 'Cookie Policy',
            'content' => $this->getCookiesContent()
        ]);
    }

    public function security()
    {
        return Inertia::render('Legal/Show', [
            'title' => 'Trust & Security',
            'content' => $this->getSecurityContent()
        ]);
    }

    private function getTermsContent()
    {
        return "
**Effective Date:** 28 August 2025

Thank you for using Nexscholar! These Terms of Use (\"Terms\") apply to your use of our research networking platform and associated AI tools, software, and websites (collectively, \"Services\").

These Terms form a legal agreement between you and Nexscholar. By creating an account or using our Services, you agree to these Terms. Our [Privacy Policy](/legal/privacy-policy) explains how we collect and use personal information and is an important document that you should read.

## 1. Registration and Access

- **Age Requirement:** You must be at least 16 years old to use the Services. If you are under the age of 18, you represent that you have your parent or legal guardian's permission to use the Services.
- **Registration:** You must provide accurate and complete information to register for an account. You are responsible for all activities that occur under your account and may not share your account credentials with anyone else.

## 2. Using Our Services

- **What You Can Do:** Subject to your compliance with these Terms, you may access and use our Services for networking, research, and seeking academic and professional opportunities.
- **What You Cannot Do:** You may not use our Services for any illegal, harmful, or abusive activity. You agree not to:
    - Use the platform for unauthorized commercial purposes, such as advertising or solicitation.
    - Scrape, mass-download, or programmatically extract other users' data or profile information from the Services.
    - Attempt to reverse engineer, decompile, or discover the source code or underlying components of our Services, including our AI models and algorithms.
    - Interfere with or disrupt the Services, including bypassing any security measures we put in place.
    - Misrepresent your identity, academic credentials, or professional affiliations.

## 3. Content

- **Your Content:** You may provide information to the Services, including your CV, academic history, research details, and other personal data (\"Content\"). You are responsible for your Content and must ensure it does not violate any applicable law or these Terms.
- **Ownership of Content:** You retain all ownership rights in the Content you provide to Nexscholar.
- **Our Use of Content:** By using our Services, you grant Nexscholar a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, publish, and display your Content for the purposes of providing, maintaining, developing, and improving our Services. This includes using your Content to power our AI matching algorithms and provide you with personalized insights.
- **Responsibility for Content:** You are primarily responsible for the accuracy and legality of the Content you post. Nexscholar acts as an auxiliary and may, but is not obligated to, monitor user-generated content. We reserve the right to remove any Content that we believe violates these Terms or is otherwise harmful or inappropriate.

## 4. Paid Subscriptions

- **Billing:** If you purchase a paid subscription, you agree to provide complete and accurate billing information. Subscriptions are billed on a recurring basis (e.g., monthly or annually) and will automatically renew until cancelled. We will automatically charge your payment method on each renewal date.
- **Cancellation:** You can cancel your paid subscription at any time through your account settings. Payments are non-refundable, except where required by law.
- **Price Changes:** We may change our subscription prices from time to time. We will give you at least 30 days' notice of any price increase, which will take effect on your next renewal, allowing you to cancel if you do not agree to the new price.

## 5. Termination and Suspension

You are free to stop using our Services and delete your account at any time. We reserve the right to suspend or terminate your access to our Services if we determine, in our sole discretion, that:
- You have breached these Terms.
- You have engaged in confirmed academic dishonesty.
- You are harassing other users or posting inappropriate or harmful content.
- We are required to do so to comply with the law.

## 6. Disclaimers and Limitation of Liability

- **AI Accuracy Disclaimer:** Our Services use artificial intelligence to provide matches and insights. Given the probabilistic nature of machine learning, the use of our Services may result in output that is incomplete or does not accurately reflect real opportunities or facts.
- You agree that any use of output from our Service is at your sole risk. You must evaluate all output for accuracy and appropriateness and independently verify any information, such as scholarship eligibility or supervisor suitability, before relying on it.
- **Disclaimer of Warranties:** OUR SERVICES ARE PROVIDED \"AS IS.\" EXCEPT TO THE EXTENT PROHIBITED BY LAW, WE MAKE NO WARRANTIES (EXPRESS, IMPLIED, OR STATUTORY) WITH RESPECT TO THE SERVICES, AND DISCLAIM ALL WARRANTIES, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
- **Limitation of Liability:** NEITHER WE NOR OUR AFFILIATES WILL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES. OUR AGGREGATE LIABILITY UNDER THESE TERMS WILL NOT EXCEED THE AMOUNT YOU PAID FOR THE SERVICE THAT GAVE RISE TO THE CLAIM DURING THE 12 MONTHS BEFORE THE LIABILITY AROSE.

## 7. Governing Law and Dispute Resolution

These Terms and any dispute arising out of or in connection with them will be governed by the laws of Malaysia. All claims arising out of or relating to these Terms will be brought exclusively in the courts of Malaysia.

## 8. General Terms

- **Changes to Terms:** We are continuously working to improve our Services and may update these Terms from time to time. We will provide you with notice of changes that materially impact you. If you do not agree to the changes, you must stop using our Services.
- **Entire Agreement:** These Terms constitute the entire agreement between you and Nexscholar regarding the use of the Services.
- **Contact Us:** If you have any questions about these Terms, please contact us at admin@nexscholar.com.
        ";
    }

    private function getPrivacyContent()
    {
        return "
**Effective Date:** 28 August 2025

## 1. Introduction

Welcome to NexScholar (\"we,\" \"us,\" or \"our\"). We operate the research networking platform [nexscholar.com](https://nexscholar.com), designed to connect researchers, academic staff, students, and industry professionals by providing seamless AI-powered tools for management and insights.

This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our services. By creating an account or using our platform, you agree to the collection and use of information in accordance with this policy.

## 2. Information We Collect

We collect several types of personal information to provide and improve our services to you.

### a. Information You Provide Directly

- **Account Information:** When you register, we collect your **Name**, **Email Address**, **Password**, and optional **Profile Picture**.
- **Profile Information:** To help you build your professional network and find opportunities, you may choose to provide additional information, including:
    - **Contact Details:** Address, Phone Number.
    - **Personal & Academic Details:** Nationality, University, Faculty, Matric Number, GPA, Field of Study, Field of Research, English Proficiency Level, Current Postgraduate Status, and Skills.
    - **Professional Details:** Your CV, professional website, and social media links (e.g., LinkedIn).
    - **Goals & Needs:** Information on whether you are seeking funding, a supervisor, or a grant.

### b. Information We Collect Automatically

- **Technical & Usage Data:** We use Google Analytics to collect information about how you interact with our platform. This may include your IP address, browser type, device information, pages visited, and the dates/times of your visits.
- **Cookies:** We use cookies and similar technologies to keep you logged in, remember your preferences, and ensure the security of your account.

## 3. How We Use Your Information

We use the information we collect for the following purposes:

- **To Provide and Personalise Our Services:** To operate the platform, authenticate you, and maintain your account.
- **To Facilitate Networking and Opportunities:** To match you with relevant scholarships, supervisors, grants, and other users based on your profile information.
- **To Power Our AI Features:** To utilise your data to power our AI tools, which provide you with personalised insights, recommendations, and research management functionalities.
- **To Improve Our Platform:** To analyse user behaviour to understand how our services are used, allowing us to improve our matching algorithms, develop new features, and enhance the user experience.
- **For Communication and Marketing:** To send you service-related announcements, newsletters, and promotional emails about new features or opportunities. All users can opt-out of marketing communications at any time.

## 4. How We Share and Disclose Your Information

Your privacy and control are important to us. We only share your information in the following circumstances:

- **With Other Users and Providers:** The platform is designed for networking. You have control over what profile information you share with other users, scholarship providers, or potential supervisors when you connect or apply for an opportunity.
- **With Third-Party Service Providers:** We engage trusted third-party companies to perform functions and provide services to us. They will only have access to your personal information to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose. These include:
    - **Hosting Services:** DBnetwork (Plesk)
    - **Email Communication Services:** Bravosmtp
    - **Analytics Services:** Google Analytics
- **For Legal Reasons:** We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).

## 5. Data Retention

We will retain your personal information for as long as your account is active or as needed to provide you with our services. If you choose to delete your account, your personal information will be permanently removed from our active systems in accordance with our data deletion processes.

## 6. Your Rights and Choices

You have full control over your personal information on NexScholar. You have the right to:

- **Access, Edit, and Update:** You can log into your account at any time to view and edit your profile information.
- **Delete:** You can permanently delete your account and all associated personal information directly from your account settings at any time. No request is needed.
- **Opt-Out of Marketing:** You can unsubscribe from our marketing emails by clicking the \"unsubscribe\" link at the bottom of any email you receive from us.

## 7. Data Security

We are committed to protecting your data. We implement appropriate technical and organisational security measures to protect your personal information from unauthorised access, use, or disclosure. However, no method of transmission over the Internet is 100% secure.

## 8. Children's Privacy

Our service is intended for individuals pursuing or involved in higher education and research. We do not knowingly collect personal information from individuals under the age of 16. If you are between 16 and 18 years old, you must have your parent's or guardian's permission to use our services. If we become aware that we have collected personal data from a child without verification of parental consent, we will take steps to remove that information.

## 9. Links to Other Websites

Our platform may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the privacy policy of every site you visit.

## 10. Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Effective Date\" at the top.

## 11. Contact Us

If you have any questions about this Privacy Policy, please contact us:

**Legal Name:** Nexscholar  
**Email:** admin@nexscholar.com
        ";
    }

    private function getCookiesContent()
    {
        return "
**Effective Date:** 28 August 2025

At NexScholar, we believe in being clear and open about how we collect and use data related to you. This Cookie Policy applies to the NexScholar platform and any service that links to this policy or incorporates it by reference.

We use cookies and similar technologies like local storage to collect and use data as part of our Services. By continuing to visit or use our Services, you are agreeing to the use of cookies and similar technologies for the purposes we describe in this policy.

## 1. What Technologies Are Used?

- **Cookies**  
  A cookie is a small file placed onto your device that enables NexScholar features and functionality. Any browser visiting our site may receive cookies from us or from third parties like our service providers. We use two types of cookies:  
  - **Persistent Cookies:** These cookies last beyond the current session and are used for purposes such as recognizing you as an existing user, making it easier to return to NexScholar and use our Services without signing in again. A persistent cookie stays in your browser and will be read by us when you return to our site.
  - **Session Cookies:** These cookies last only for as long as the session (usually the current visit to our website or a browser session).

- **Local Storage**  
  Local storage enables our website to store information locally on your device(s). We use local storage to improve the NexScholar experience by enabling features, remembering your preferences, and speeding up site functionality.

## 2. What Are These Technologies Used For?

- **Authentication**  
  We use cookies to recognize you when you visit our Services. If you're signed in, these technologies help us verify your account and keep you logged in as you navigate the site, making your experience seamless.

- **Preferences, Features, and Performance**  
  We use cookies and local storage to enable the functionality of our Services and improve performance. These technologies remember information about your browser and your preferences (e.g., your saved search filters) and are used to speed up site functionality.

- **Plugins on NexScholar**  
  We use cookies and similar technologies to enable third-party plugins on our site, such as the “Share to LinkedIn” button. When you interact with a plugin, it may use cookies to identify you on its own platform to complete your request.

- **Analytics and Research**  
  We use cookies to understand, improve, and research our products, features, and services. We use Google Analytics to determine and measure the performance of our platform and to learn how you have interacted with our website.

## 3. What Third Parties Use These Technologies?

Third parties such as our service providers may use cookies in connection with our Services. The third parties we work with for these purposes include:

- **Google Analytics:** For analytics and research purposes.
- **LinkedIn:** For the functionality of the \"Share\" button and other potential plugins.

## 4. Your Choices

You have choices on how NexScholar uses these technologies.

- **Browser Controls**  
  Most browsers allow you to control cookies through their settings. Most browsers also enable you to review and erase cookies. To learn more about these controls, please consult the documentation that your browser manufacturer provides.

Please note that if you limit the ability of NexScholar to set cookies, you may worsen your overall user experience, since it may no longer be personalized to you. It may also stop you from saving customized settings like your login information.
        ";
    }

    private function getSecurityContent()
    {
        return "
Your trust is the foundation of our platform. At NexScholar, we are deeply committed to protecting your data, respecting your privacy, and providing a secure environment for academic and professional growth. This page provides an overview of our security principles and practices.

## 1. Our Commitment to Data Security

We are committed to protecting the security of your personal information. We implement commercially reasonable technical, administrative, and organizational measures to protect your data from loss, misuse, and unauthorized access, disclosure, alteration, or destruction. We use industry-standard security protocols, including encryption for data in transit (HTTPS).

However, please be aware that no Internet or email transmission is ever fully secure or error-free. Therefore, you should take special care in deciding what information you send to us, and we cannot guarantee absolute security.

## 2. Our Commitment to Privacy

We believe that respecting your privacy is essential to earning your trust. Our approach to privacy is built on transparency and user control.

- **You Are in Control:** You own your data. Our platform is designed to give you full control to access, edit, and permanently delete your profile information at any time.
- **Purposeful Data Use:** We use your data to power the services you signed up for—like matching you with scholarships and supervisors—and to improve our platform's features and AI algorithms.
- **No Surprises:** We are transparent about how your information is handled. For a complete overview, please read our full [Privacy Policy](/privacy-policy).

## 3. Platform Integrity and Responsibility

Creating a safe and professional network is a shared responsibility. We have established clear rules in our Terms of Use to protect our community from misuse.

- **Our Role:** We act as an auxiliary to monitor the platform for inappropriate content or behavior that violates our policies, and we will take action when necessary.
- **Your Role:** You are responsible for the content you post, the accuracy of your information, and your interactions with other users.

By working together, we can maintain a high-quality and trustworthy environment. For more details, please see our [Terms of Use](/terms-of-use).

## 4. Working with the Security Community

We believe in the power of collaboration and welcome the help of the security community to keep our platform safe. We have a clear and safe process for security researchers to report potential vulnerabilities to us. We are committed to working with this community to verify and address any findings.

If you are a security researcher and believe you have found a vulnerability, please see our [Responsible Disclosure Policy](/responsible-disclosure).

---

**Have Questions?**

Your security and trust are our top priorities. If you have any questions or concerns, please do not hesitate to contact us at [admin@nexscholar.com](mailto:admin@nexscholar.com).
        ";
    }
}
