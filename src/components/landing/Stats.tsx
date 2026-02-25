"use client";

import React from 'react';
import { motion, easeOut } from "framer-motion";

interface Stat {
  number: string;
  label: string;
}

const Stats: React.FC = () => {
  const stats: Stat[] = [
    { number: "1,500+", label: "Inmobiliarias Activas" },
    { number: "25,000+", label: "Propiedades Publicadas" },
    { number: "98%", label: "Satisfacción del Cliente" },
    { number: "24/7", label: "Soporte Técnico" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut
      }
    }
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 relative bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              className="text-center group"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8 hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-xl hover:border-red-200"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-red-600 mb-2 sm:mb-3 font-gotham">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-light text-xs sm:text-sm lg:text-base font-poppins leading-relaxed">
                  {stat.label}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
