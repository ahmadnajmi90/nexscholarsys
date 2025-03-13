import React from "react";
import { Head, Link } from '@inertiajs/react';
import { FaSearch, FaUsers, FaProjectDiagram, FaChartLine, FaUniversity, FaComments } from 'react-icons/fa';
import WelcomePosts from '../Components/Welcome/WelcomePosts';
import WelcomeItems from "@/Components/Welcome/WelcomeItems";


const HeroSection = ({ auth, posts, events, projects, grants }) => {

    const currentYear = new Date().getFullYear(); // Get the current year dynamically
  return (
    <div>
      {/* Navbar */}
      <header className="w-full bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <div className="text-blue-600 text-lg font-bold">Nexscholar</div>

          {/* Authentication Links */}
          <div className="flex items-center space-x-4">
            {auth.user ? (
              <>
                <Link
                  href={route('dashboard')}
                  className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-500"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-500"
                >
                  Log in
                </Link>
                <Link
                  href={route('register')}
                  className="rounded-md px-3 py-2 bg-blue-600 text-white transition hover:bg-blue-700 focus:outline-none focus:ring focus-visible:ring-blue-500"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <section className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/background.png')",
        }}>
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-white leading-tight">
            NexScholar: Empowering Research and Innovation
          </h1>
          <p className="text-white mt-6 max-w-2xl mx-auto">
            NexScholar helps academics and researchers thrive by simplifying their work and fostering collaboration. Build your academic solutions with ease and efficiency.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
          <Link
            href={route('register')}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring focus-visible:ring-blue-500"
            >
            Get Started
            </Link>

            <a href="#" className="px-8 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600">
              Learn More
            </a>
          </div>
        </div>
      </section>



      {/* Collaborators and Supporters Section */}
{/* Collaborators and Supporters Section */}
<section id="collaborators" className="py-12 bg-gray-100">
  <div className="container mx-auto px-6 max-w-screen-xl text-center">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center items-center">
      {/* Example Logos */}
      <img src="/images/utm.png" alt="Collaborator 1" className="h-12" />
      <img src="/images/md-pdti.png" alt="Collaborator 2" className="h-12" />
      <img src="/images/mtdc.png" alt="Collaborator 3" className="h-12" />
      <img src="/images/madict.png" alt="Collaborator 4" className="h-12" />
    </div>
  </div>
</section>



{/* About NexScholar Section */}
{/* About NexScholar Section */}
<section id="about-nexscholar" className="py-16 bg-gray-50">
  <div className="container mx-auto px-6 max-w-screen-lg flex flex-col md:flex-row items-center">
    {/* Image Section */}
    <div className="md:w-1/2 flex justify-center md:justify-end">
      <img
        src="/images/pic1.png"
        alt="NexScholar Collaboration"
        className="rounded-lg shadow-lg w-3/4 md:w-full"
      />
    </div>

    {/* Text Section */}
    <div className="md:w-1/2 mt-8 md:mt-0 md:pl-8">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">About Us</h2>
      <h3 className="text-4xl font-bold text-gray-800 leading-tight mb-6">
        NexScholar: Empowering Research & Innovation
      </h3>
      <p className="text-gray-700 leading-relaxed text-justify">
        NexScholar is an innovative platform designed to bridge the gap between researchers, academics, industries, and institutions. Our mission is to empower research and innovation by providing seamless tools for collaboration, project management, AI-powered insights, and networking opportunities. NexScholar aims to create an ecosystem where knowledge and resources are easily accessible, fostering groundbreaking discoveries and impactful solutions.
      </p>
    </div>
  </div>
</section>





{/* Our Services Section */}
<section id="services" className="py-16 bg-white text-center">
<div className="container mx-auto px-6 max-w-screen-xl">
    {/* Section Title */}
    <h2 className="text-3xl font-bold text-blue-600">Nexscholar Features</h2>
    <p className="text-gray-700 mt-4 max-w-3xl mx-auto">
      NexScholar offers comprehensive tools to support researchers, academics, and institutions in achieving their goals effectively.
    </p>

    {/* Services Grid */}
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Service 1 */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <FaSearch className="text-blue-600 text-4xl" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600">AI-Powered Search</h3>
        <p className="text-gray-700 mt-2">
          Find supervisors, grants, and collaboration opportunities efficiently with AI-based recommendations.
        </p>
      </div>

      {/* Service 2 */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <FaUsers className="text-blue-600 text-4xl" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600">Networking Hub</h3>
        <p className="text-gray-700 mt-2">
          Connect with researchers, students, and industries to foster meaningful collaborations and partnerships.
        </p>
      </div>

      {/* Service 3 */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <FaProjectDiagram className="text-blue-600 text-4xl" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600">Research Management</h3>
        <p className="text-gray-700 mt-2">
          Organize and manage your research projects with built-in tools for timelines, milestones, and collaboration.
        </p>
      </div>

      {/* Service 4 */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <FaChartLine className="text-blue-600 text-4xl" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600">Data Analytics</h3>
        <p className="text-gray-700 mt-2">
          Access in-depth analytics to monitor research trends, publications, and institutional performance.
        </p>
      </div>

      {/* Service 5 */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <FaUniversity className="text-blue-600 text-4xl" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600">University Integration</h3>
        <p className="text-gray-700 mt-2">
          Seamlessly integrate with universities for student progress tracking and academic resource management.
        </p>
      </div>

      {/* Service 6 */}
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <FaComments className="text-blue-600 text-4xl" />
        </div>
        <h3 className="text-xl font-semibold text-blue-600">Discussion Forums</h3>
        <p className="text-gray-700 mt-2">
          Engage in topic-specific forums to exchange ideas, get feedback, and discuss research developments.
        </p>
      </div>
    </div>
  </div>
</section>



      {/* CTA Section */}
      <section id="cta-video" className="py-16 bg-blue-600 text-center text-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold">Join NexScholar Today!</h2>
          <p className="mt-4 max-w-2xl mx-auto">
            Take your research to the next level with NexScholar. Connect with like-minded individuals, access valuable resources, and grow your network.
          </p>
          <div className="mt-8">

            <Link
            href={route('register')}
            className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50"
            >
            Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Posts Preview Section */}
      <WelcomeItems items={posts} auth={auth} title="Posts" type="post" />

      {/* Events Preview Section */}
      <WelcomeItems items={events} auth={auth} title="Events" type="event" />

      {/* Projects Preview Section */}
      <WelcomeItems items={projects} auth={auth} title="Projects" type="project" />

      {/* Grants Preview Section */}
      <WelcomeItems items={grants} auth={auth} title="Grants" type="grant" />


         {/* Footer */}
         <footer className="bg-gray-100 text-center py-4 mt-6">
        <p className="text-sm text-gray-700">
          NexScholar © {currentYear}. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default HeroSection;
