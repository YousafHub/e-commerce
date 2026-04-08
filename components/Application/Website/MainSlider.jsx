'use client'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import slider2 from '@/public/assets/images/slider-2.png'
import slider3 from '@/public/assets/images/slider-3.png'
import slider4 from '@/public/assets/images/slider-4.png'
import Image from 'next/image'
import { LuChevronRight, LuChevronLeft } from 'react-icons/lu'

const MainSlider = () => {
    const [swiperInstance, setSwiperInstance] = useState(null)

    const handlePrev = () => {
        if (swiperInstance) swiperInstance.slidePrev()
    }

    const handleNext = () => {
        if (swiperInstance) swiperInstance.slideNext()
    }

    return (
        <div className="slider-container relative group">
            <Swiper
                modules={[Autoplay, Navigation, Pagination]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                breakpoints={{
                    480: {
                        pagination: { clickable: true, dynamicBullets: true },
                    },
                }}
                onSwiper={(swiper) => setSwiperInstance(swiper)}
                className="w-full"
            >
                <SwiperSlide>
                    <div className="relative outline-none">
                        <Image 
                            src={slider3.src} 
                            width={slider3.width} 
                            height={slider3.height} 
                            alt='slider3'
                            className="w-full h-auto"
                            loading="eager"
                            priority
                        />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative outline-none">
                        <Image 
                            src={slider2.src} 
                            width={slider2.width} 
                            height={slider2.height} 
                            alt='slider2'
                            className="w-full h-auto"
                        />
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="relative outline-none">
                        <Image 
                            src={slider4.src} 
                            width={slider4.width} 
                            height={slider4.height} 
                            alt='slider4'
                            className="w-full h-auto"
                        />
                    </div>
                </SwiperSlide>
            </Swiper>

            <button 
                onClick={handlePrev}
                className="absolute top-1/2 -translate-y-1/2 left-5 z-10 cursor-pointer w-14 h-14 flex justify-center items-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all hidden md:flex"
                aria-label="Previous slide"
            >
                <LuChevronLeft size={25} className='text-gray-600' />
            </button>
            <button 
                onClick={handleNext}
                className="absolute top-1/2 -translate-y-1/2 right-5 z-10 cursor-pointer w-14 h-14 flex justify-center items-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all hidden md:flex"
                aria-label="Next slide"
            >
                <LuChevronRight size={25} className='text-gray-600' />
            </button>
        </div>
    )
}

export default MainSlider