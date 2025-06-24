import React from "react";
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FaSearch, FaUsers, FaProjectDiagram, FaChartLine, FaUniversity, FaComments } from 'react-icons/fa';
import WelcomePosts from '../Components/Welcome/WelcomePosts';
import WelcomeItems from "@/Components/Welcome/WelcomeItems";

// Animation variants for staggered container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    }
  }
};

// Animation variants for child elements
const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Animation variants for fade in from left
const fadeInLeft = {
  hidden: {
    opacity: 0,
    x: -50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Animation variants for fade in from right
const fadeInRight = {
  hidden: {
    opacity: 0,
    x: 50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Animation variants for service cards
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};

// Button hover animation
const buttonHoverVariants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.95
  }
};

const HeroSection = ({ auth, posts, events, projects, grants }) => {

    const currentYear = new Date().getFullYear(); // Get the current year dynamically
  return (
    <div>
      {/* Navbar */}
      <motion.header 
        className="w-full bg-white shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <motion.div 
            className="text-blue-600 text-lg font-bold"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Nexscholar
          </motion.div>

          {/* Authentication Links */}
          <div className="flex items-center space-x-4">
            {auth.user ? (
              <>
                <motion.div whileHover="hover" variants={buttonHoverVariants}>
                  <Link
                    href={route('dashboard')}
                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-500"
                  >
                    Dashboard
                  </Link>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover="hover" variants={buttonHoverVariants}>
                  <Link
                    href={route('login')}
                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-blue-500"
                  >
                    Log in
                  </Link>
                </motion.div>
                <motion.div whileHover="hover" whileTap="tap" variants={buttonHoverVariants}>
                  <Link
                    href={route('register')}
                    className="rounded-md px-3 py-2 bg-blue-600 text-white transition hover:bg-blue-700 focus:outline-none focus:ring focus-visible:ring-blue-500"
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero Content */}
      <section className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center text-center px-6"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/background.png')",
        }}>
        <motion.div 
          className="container mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-5xl font-bold text-white leading-tight"
            variants={itemVariants}
          >
            NexScholar: Empowering Research and Innovation
          </motion.h1>
          <motion.p 
            className="text-white mt-6 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            NexScholar helps academics and researchers thrive by simplifying their work and fostering collaboration. Build your academic solutions with ease and efficiency.
          </motion.p>
          <motion.div 
            className="mt-8 flex justify-center space-x-4"
            variants={itemVariants}
          >
            <motion.div whileHover="hover" whileTap="tap" variants={buttonHoverVariants}>
              <Link
                href={route('register')}
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none focus:ring focus-visible:ring-blue-500"
              >
                Get Started
              </Link>
            </motion.div>

            <motion.div whileHover="hover" whileTap="tap" variants={buttonHoverVariants}>
              <a 
                href="#" 
                className="inline-block px-8 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Collaborators and Supporters Section */}
      <motion.section 
        id="collaborators" 
        className="py-12 bg-gray-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 max-w-screen-xl text-center">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Example Logos */}
            <motion.img 
              src="/images/utm.png" 
              alt="Collaborator 1" 
              className="h-12" 
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
            />
            <motion.img 
              src="/images/md-pdti.png" 
              alt="Collaborator 2" 
              className="h-12" 
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
            />
            <motion.img 
              src="/images/mtdc.png" 
              alt="Collaborator 3" 
              className="h-12" 
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
            />
            <motion.img 
              src="/images/madict.png" 
              alt="Collaborator 4" 
              className="h-12" 
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* About NexScholar Section */}
      <section id="about-nexscholar" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-screen-lg flex flex-col md:flex-row items-center">
          {/* Image Section */}
          <motion.div 
            className="md:w-1/2 flex justify-center md:justify-end"
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.img
              src="/images/pic1.png"
              alt="NexScholar Collaboration"
              className="rounded-lg shadow-lg w-3/4 md:w-full"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </motion.div>

          {/* Text Section */}
          <motion.div 
            className="md:w-1/2 mt-8 md:mt-0 md:pl-8"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 
              className="text-3xl font-bold text-blue-600 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              About Us
            </motion.h2>
            <motion.h3 
              className="text-4xl font-bold text-gray-800 leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              NexScholar: Empowering Research & Innovation
            </motion.h3>
            <motion.p 
              className="text-gray-700 leading-relaxed text-justify"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              NexScholar is an innovative platform designed to bridge the gap between researchers, academics, industries, and institutions. Our mission is to empower research and innovation by providing seamless tools for collaboration, project management, AI-powered insights, and networking opportunities. NexScholar aims to create an ecosystem where knowledge and resources are easily accessible, fostering groundbreaking discoveries and impactful solutions.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Our Services Section */}
      <section id="services" className="py-16 bg-white text-center">
        <div className="container mx-auto px-6 max-w-screen-xl">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-blue-600">Nexscholar Features</h2>
            <p className="text-gray-700 mt-4 max-w-3xl mx-auto">
              NexScholar offers comprehensive tools to support researchers, academics, and institutions in achieving their goals effectively.
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div 
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Service 1 */}
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div 
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <FaSearch className="text-blue-600 text-4xl" />
              </motion.div>
              <h3 className="text-xl font-semibold text-blue-600">AI-Powered Search</h3>
              <p className="text-gray-700 mt-2">
                Find supervisors, grants, and collaboration opportunities efficiently with AI-based recommendations.
              </p>
            </motion.div>

            {/* Service 2 */}
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div 
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <FaUsers className="text-blue-600 text-4xl" />
              </motion.div>
              <h3 className="text-xl font-semibold text-blue-600">Networking Hub</h3>
              <p className="text-gray-700 mt-2">
                Connect with researchers, students, and industries to foster meaningful collaborations and partnerships.
              </p>
            </motion.div>

            {/* Service 3 */}
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div 
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <FaProjectDiagram className="text-blue-600 text-4xl" />
              </motion.div>
              <h3 className="text-xl font-semibold text-blue-600">Research Management</h3>
              <p className="text-gray-700 mt-2">
                Organize and manage your research projects with built-in tools for timelines, milestones, and collaboration.
              </p>
            </motion.div>

            {/* Service 4 */}
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div 
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <FaChartLine className="text-blue-600 text-4xl" />
              </motion.div>
              <h3 className="text-xl font-semibold text-blue-600">Data Analytics</h3>
              <p className="text-gray-700 mt-2">
                Access in-depth analytics to monitor research trends, publications, and institutional performance.
              </p>
            </motion.div>

            {/* Service 5 */}
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div 
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <FaUniversity className="text-blue-600 text-4xl" />
              </motion.div>
              <h3 className="text-xl font-semibold text-blue-600">University Integration</h3>
              <p className="text-gray-700 mt-2">
                Seamlessly integrate with universities for student progress tracking and academic resource management.
              </p>
            </motion.div>

            {/* Service 6 */}
            <motion.div 
              className="bg-white p-8 rounded-lg shadow-lg"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div 
                className="flex justify-center mb-6"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <FaComments className="text-blue-600 text-4xl" />
              </motion.div>
              <h3 className="text-xl font-semibold text-blue-600">Discussion Forums</h3>
              <p className="text-gray-700 mt-2">
                Engage in topic-specific forums to exchange ideas, get feedback, and discuss research developments.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        id="cta-video" 
        className="py-16 bg-blue-600 text-center text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="container mx-auto px-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 
            className="text-3xl font-bold"
            variants={itemVariants}
          >
            Join NexScholar Today!
          </motion.h2>
          <motion.p 
            className="mt-4 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Take your research to the next level with NexScholar. Connect with like-minded individuals, access valuable resources, and grow your network.
          </motion.p>
          <motion.div 
            className="mt-8"
            variants={itemVariants}
          >
            <motion.div whileHover="hover" whileTap="tap" variants={buttonHoverVariants}>
              <Link
                href={route('register')}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50"
              >
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Posts Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
      >
        <WelcomeItems items={posts} auth={auth} title="Posts" type="post" />
      </motion.div>

      {/* Events Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        <WelcomeItems items={events} auth={auth} title="Events" type="event" />
      </motion.div>

      {/* Projects Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <WelcomeItems items={projects} auth={auth} title="Projects" type="project" />
      </motion.div>

      {/* Grants Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <WelcomeItems items={grants} auth={auth} title="Grants" type="grant" />
      </motion.div>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-100 text-center py-4 mt-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.p 
          className="text-sm text-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          NexScholar © {currentYear}. All Rights Reserved.
        </motion.p>
      </motion.footer>
    </div>
  );
};

export default HeroSection;
