import React from 'react';
import { motion } from 'framer-motion';
import Header from '../Components/Welcome/Header';
import HeroSection from '../Components/Welcome/HeroSection';
import ResearchJourneySection from '../Components/Welcome/ResearchJourneySection';
import LatestInfoSection from '../Components/Welcome/LatestInfoSection';
import TestimonialsSection from '../Components/Welcome/TestimonialsSection';
import FinanceSection from '../Components/Welcome/FinanceSection';
import UnbankSection from '../Components/Welcome/UnbankSection';
import NewsEventsSection from '../Components/Welcome/NewsEventsSection';
import SubscribeSection from '../Components/Welcome/SubscribeSection';
import Footer from '../Components/Welcome/Footer';

const Welcome = ({ posts, events, grants, auth }) => {
    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header auth={auth} />
            <HeroSection />
            
            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <ResearchJourneySection />
            </motion.div>

            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <LatestInfoSection events={events} grants={grants} />
            </motion.div>

            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <TestimonialsSection />
            </motion.div>

            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <FinanceSection />
            </motion.div>

            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <UnbankSection />
            </motion.div>

            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <NewsEventsSection posts={posts} />
            </motion.div>

            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <SubscribeSection />
            </motion.div>

            <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <Footer />
            </motion.div>
        </div>
    );
};

export default Welcome; 