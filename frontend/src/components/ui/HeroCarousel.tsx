"use client";

import { useRef } from "react";
import Image from "next/image";
import Slider from "react-slick";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HeroCarousel() {
    const sliderRef = useRef<Slider>(null);

    const settings = {
        dots: true,
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        cssEase: "ease-in-out",
        arrows: false, // We'll use custom arrows
    };

    const slides = [
        {
            id: 1,
            image: "/fotosmkn5landing.png",
            title: "Selamat Datang!",
            subtitle: "Selamat datang di situs web galeri karya Akhir SMK Negeri 5 Malang. Selamat berkunjung!"
        },
        {
            id: 2,
            image: "/fotosmkn5landing.png",
            title: "Selamat Datang!",
            subtitle: "Selamat datang di situs web galeri karya Akhir SMK Negeri 5 Malang. Selamat berkunjung!"
        },
        {
            id: 3,
            image: "/fotosmkn5landing.png",
            title: "Selamat Datang!",
            subtitle: "Selamat datang di situs web galeri karya Akhir SMK Negeri 5 Malang. Selamat berkunjung!"
        },
        {
            id: 4,
            image: "/fotosmkn5landing.png",
            title: "Selamat Datang!",
            subtitle: "Selamat datang di situs web galeri karya Akhir SMK Negeri 5 Malang. Selamat berkunjung!"
        }
    ];

    return (
        <div className="relative w-full h-120 md:h-96 mb-8 rounded-2xl overflow-hidden shadow-lg">
            <Slider ref={sliderRef} {...settings}>
                {slides.map((slide) => (
                    <div key={slide.id} className="relative w-full h-120 md:h-96">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <Image
                                src={slide.image}
                                alt="SMKN 5 Malang Building"
                                fill
                                className="object-cover"
                                priority={slide.id === 1}
                            />
                            <div className="absolute inset-0 bg-bluealt-200/30"></div>
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>

                        <div className="relative z-10 flex flex-col justify-center items-center h-full text-white text-center px-4">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                {slide.title}
                            </h1>
                            <p className="text-lg md:text-xl max-w-4xl leading-relaxed">
                                {slide.subtitle}
                            </p>
                        </div>
                    </div>
                ))}
            </Slider>

            {/* Custom Navigation Buttons */}
            <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-sky-700/80 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
                aria-label="Previous slide"
            >
                <HiChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={() => sliderRef.current?.slickNext()}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-sky-700/80 hover:bg-white/30 text-white p-2 rounded-full transition-colors duration-200"
                aria-label="Next slide"
            >
                <HiChevronRight className="w-6 h-6" />
            </button>
        </div>
    );
}