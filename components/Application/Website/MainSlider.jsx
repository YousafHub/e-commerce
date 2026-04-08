'use client'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import slider2 from '@/public/assets/images/slider-2.png'
import slider3 from '@/public/assets/images/slider-3.png'
import slider4 from '@/public/assets/images/slider-4.png'
import Image from 'next/image';
import { LuChevronRight , LuChevronLeft } from 'react-icons/lu';

const ArrowNext = (props) => {
    const { onClick, currentSlide, slideCount, ...rest } = props
    return (
        <button 
            {...rest} 
            onClick={onClick} 
            type='button' 
            style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                right: '20px',
                zIndex: 10
            }}
            className='cursor-pointer w-14 h-14 flex justify-center items-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all'
        >
            <LuChevronRight size={25} className='text-gray-600' />
        </button>
    )
}

const ArrowPrev = (props) => {
    const { onClick, currentSlide, slideCount, ...rest } = props
    return (
        <button 
            {...rest} 
            onClick={onClick} 
            type='button' 
            style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                left: '20px',
                zIndex: 10
            }}
            className='cursor-pointer w-14 h-14 flex justify-center items-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all'
        >
            <LuChevronLeft size={20} className=' text-gray-600' />
        </button>
    )
}

const MainSlider = () => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        nextArrow: <ArrowNext />,
        prevArrow: <ArrowPrev />,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    dots: false,
                    arrows: false,
                }
            }
        ]
    }

    return (
        <div className="slider-container relative group">
            <Slider {...settings}>
                <div className="relative outline-none">
                    <Image 
                        src={slider3.src} 
                        width={slider3.width} 
                        height={slider3.height} 
                        alt='slider3'
                        className="w-full h-auto"
                        loading="eager"
                        preload={true}
                    />
                </div>
                <div className="relative outline-none">
                    <Image 
                        src={slider2.src} 
                        width={slider2.width} 
                        height={slider2.height} 
                        alt='slider2'
                        className="w-full h-auto"
                    />
                </div>
                <div className="relative outline-none">
                    <Image 
                        src={slider4.src} 
                        width={slider4.width} 
                        height={slider4.height} 
                        alt='slider4'
                        className="w-full h-auto"
                    />
                </div>
            </Slider>
        </div>
    )
}

export default MainSlider