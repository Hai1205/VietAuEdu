"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

interface IStudyProgram {
  id: string;
  title: string;
  image: string;
  icon: string;
  description?: string;
}

const studyPrograms: IStudyProgram[] = [
  {
    id: "representatives",
    title: "Các học viên tiêu biểu của Việt Âu",
    image: "/images/study-abroad/representatives.jpg",
    icon: "📋",
  },
  {
    id: "language",
    title: "Hệ Ngôn Ngữ",
    image: "/images/study-abroad/language.jpg",
    icon: "🗣️",
  },
  {
    id: "college",
    title: "Học Cao Đẳng",
    image: "/images/study-abroad/college.jpg",
    icon: "🎓",
  },
  {
    id: "university",
    title: "Học Đại Học",
    image: "/images/study-abroad/university.jpg",
    icon: "✏️",
  },
  {
    id: "masters",
    title: "Học Thạc Sĩ",
    image: "/images/study-abroad/masters.jpg",
    icon: "🎓",
  },
];

export default function StudyAbroadSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.3, // Trigger when at least 30% of the section is visible
    margin: "100px 0px", // Trigger animation slightly before section is fully visible
  });

  return (
    <section
      ref={ref}
      className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-6">
              <motion.div
                className="flex items-center mb-4"
                initial={{ opacity: 0, x: -20 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
                }
                transition={{ duration: 0.5 }}
              >
                <span className="text-primary text-lg mr-2">🏛️</span>
                <span className="text-primary font-semibold tracking-wider">
                  STUDY ABROAD
                </span>
              </motion.div>

              <motion.h2
                className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Du Học Việt Âu
                <br />
                Mở Ra <span className="text-primary">Chân Trời Mới.</span>
              </motion.h2>

              <motion.p
                className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                Việt Âu luôn là đơn vị hàng đầu trong việc đưa ra những chính
                sách hỗ trợ du học sinh khi lựa chọn du học tại các nước.
              </motion.p>
            </div>
          </div>

          {/* Right Grid */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Top Row */}
              <div className="space-y-4">
                {/* Representatives Card - Large */}
                <motion.div
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.6, delay: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-48 sm:h-40 rounded-2xl overflow-hidden">
                    <Image
                      src={studyPrograms[0].image}
                      alt={studyPrograms[0].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>

                    {/* Icon */}
                    <motion.div
                      className="absolute top-4 right-4"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={
                        isInView
                          ? { scale: 1, rotate: 0 }
                          : { scale: 0, rotate: -45 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                        delay: 0.6,
                      }}
                    >
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">
                          {studyPrograms[0].icon}
                        </span>
                      </div>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                      className="absolute bottom-4 left-4 right-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      <h3 className="text-white font-bold text-lg leading-tight">
                        {studyPrograms[0].title}
                      </h3>
                    </motion.div>
                  </div>
                </motion.div>

                {/* College Card */}
                <motion.div
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.6, delay: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-32 sm:h-28 rounded-2xl overflow-hidden">
                    <Image
                      src={studyPrograms[2].image}
                      alt={studyPrograms[2].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>

                    {/* Icon */}
                    <motion.div
                      className="absolute top-3 right-3"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={
                        isInView
                          ? { scale: 1, rotate: 0 }
                          : { scale: 0, rotate: -45 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                        delay: 0.7,
                      }}
                    >
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">
                          {studyPrograms[2].icon}
                        </span>
                      </div>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                      className="absolute bottom-3 left-3 right-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <h3 className="text-white font-bold text-base">
                        {studyPrograms[2].title}
                      </h3>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-4">
                {/* Language Card */}
                <motion.div
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.6, delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-32 sm:h-28 rounded-2xl overflow-hidden">
                    <Image
                      src={studyPrograms[1].image}
                      alt={studyPrograms[1].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>

                    {/* Icon */}
                    <motion.div
                      className="absolute top-3 right-3"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={
                        isInView
                          ? { scale: 1, rotate: 0 }
                          : { scale: 0, rotate: -45 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                        delay: 0.8,
                      }}
                    >
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">
                          {studyPrograms[1].icon}
                        </span>
                      </div>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                      className="absolute bottom-3 left-3 right-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      <h3 className="text-white font-bold text-base">
                        {studyPrograms[1].title}
                      </h3>
                    </motion.div>
                  </div>
                </motion.div>

                {/* CTA Card */}
                <motion.div
                  className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-5 sm:p-6 h-40 sm:h-48 flex flex-col justify-center text-white text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.6, delay: 0.7 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
                  }}
                >
                  <motion.div
                    className="mb-3 sm:mb-2"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <h3 className="font-bold text-base sm:text-xl leading-tight px-1">
                      Miễn phí 100% phí dịch vụ hỗ sơ & tư vấn du học.
                    </h3>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                      delay: 1.0,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/contact"
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full text-center transition-colors duration-300 w-fit text-sm sm:py-3 sm:px-6 sm:text-base mx-auto inline-block"
                    >
                      Đăng Ký Ngay
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              {/* Bottom Row */}
              <motion.div
                className="col-span-2 grid grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                {/* University Card */}
                <motion.div
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.6, delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-32 rounded-2xl overflow-hidden">
                    <Image
                      src={studyPrograms[3].image}
                      alt={studyPrograms[3].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>

                    {/* Icon */}
                    <motion.div
                      className="absolute top-3 right-3"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={
                        isInView
                          ? { scale: 1, rotate: 0 }
                          : { scale: 0, rotate: -45 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                        delay: 1.0,
                      }}
                    >
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">
                          {studyPrograms[3].icon}
                        </span>
                      </div>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                      className="absolute bottom-3 left-3 right-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.5, delay: 1.1 }}
                    >
                      <h3 className="text-white font-bold text-base">
                        {studyPrograms[3].title}
                      </h3>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Masters Card */}
                <motion.div
                  className="relative group cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                  }
                  transition={{ duration: 0.6, delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative h-32 rounded-2xl overflow-hidden">
                    <Image
                      src={studyPrograms[4].image}
                      alt={studyPrograms[4].title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>

                    {/* Icon */}
                    <motion.div
                      className="absolute top-3 right-3"
                      initial={{ scale: 0, rotate: -45 }}
                      animate={
                        isInView
                          ? { scale: 1, rotate: 0 }
                          : { scale: 0, rotate: -45 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                        delay: 1.1,
                      }}
                    >
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">
                          {studyPrograms[4].icon}
                        </span>
                      </div>
                    </motion.div>

                    {/* Title */}
                    <motion.div
                      className="absolute bottom-3 left-3 right-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.5, delay: 1.2 }}
                    >
                      <h3 className="text-white font-bold text-base">
                        {studyPrograms[4].title}
                      </h3>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
