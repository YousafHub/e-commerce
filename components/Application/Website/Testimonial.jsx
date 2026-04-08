'use client'
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from 'next/image';
import { IoStar } from 'react-icons/io5';
import { BsChatQuote } from 'react-icons/bs';


const testimonials = [
  {
    name: "Ali Khan",
    review: "This platform completely changed the way I manage my projects.\nThe interface is clean and everything works smoothly without bugs.\nHighly recommended for anyone serious about productivity.",
    rating: 5
  },
  {
    name: "Sara Ahmed",
    review: "I was struggling with managing my workflow before using this.\nNow everything feels organized and easy to track.\nThe experience has been amazing so far.",
    rating: 4
  },
  {
    name: "Usman Tariq",
    review: "The features are well thought out and actually useful.\nI especially love how fast and responsive the system is.\nDefinitely worth trying if you're into efficiency.",
    rating: 5
  },
  {
    name: "Hina Malik",
    review: "At first I was unsure, but it exceeded my expectations.\nThe design is modern and very easy to navigate.\nSupport team is also quick and helpful.",
    rating: 4
  },
  {
    name: "Zain Ali",
    review: "One of the best tools I’ve used in a long time.\nEverything just works without unnecessary complications.\nIt saved me a lot of time daily.",
    rating: 5
  },
  {
    name: "Ayesha Noor",
    review: "I love how intuitive everything feels from the start.\nNo need for long tutorials or guides.\nPerfect for beginners and professionals alike.",
    rating: 5
  },
  {
    name: "Bilal Hussain",
    review: "Good overall experience with a few minor improvements needed.\nPerformance is solid and reliable.\nI use it almost every day now.",
    rating: 4
  },
  {
    name: "Fatima Zahra",
    review: "The UI/UX is very impressive and user-friendly.\nI was able to get started within minutes.\nIt made my workflow much smoother.",
    rating: 5
  },
  {
    name: "Hamza Sheikh",
    review: "A very practical solution to everyday problems.\nIt simplifies tasks that used to take a lot of time.\nDefinitely a must-have tool.",
    rating: 5
  },
  {
    name: "Mariam Iqbal",
    review: "Clean design, great performance, and useful features.\nI appreciate the attention to detail in every part of the app.\nLooking forward to future updates.",
    rating: 4
  }
];

const Testimonial = () => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    dots: true,
                    infinite: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                }
            },
        ]
    }

    return (
        <div className='lg:px-32 px-4 sm:pt-20 pt-5 pb-10'>
            <h2 className='text-center sm:text-4xl text-2xl mb-5 font-semibold'>Customer Review</h2>
            <Slider {...settings}>
                {testimonials.map((item, index) => (
                    <div key={index} className='p-5'>
                        <div className='border rounded-lg p-5'>

                        <BsChatQuote size={30} className='mb-3' />

                        <p className='mb-5'>{item.review}</p>
                        <h4 className='font-semibold '>{item.name}</h4>
                        <div className='flex mt-1'>
                            {Array.from({ length: item.rating }).map((_, i) => (
                                <IoStar key={`star${i}`} className='text-yellow-400' size={20} />
                            ))}
                        </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}

export default Testimonial