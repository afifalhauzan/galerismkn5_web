"use client";

import { useRef } from "react";
import Slider from "react-slick";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useHeroCarousel } from "@/hooks/HeroCarouselHooks";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HeroCarousel() {
    const sliderRef = useRef<Slider>(null);
    const { slides, isLoading, isUsingFallback } = useHeroCarousel();

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

    // Show loading state or fallback message
    if (isLoading) {
        return (
            <div className="relative w-full h-120 md:h-96 mb-8 rounded-2xl overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-120 md:h-96 mb-8 rounded-2xl overflow-hidden shadow-lg">
            {/* Show fallback indicator if using mock data */}
            {isUsingFallback && (
                <div className="absolute top-2 left-2 z-30 bg-yellow-500/80 text-white text-xs px-2 py-1 rounded">
                    Using fallback data
                </div>
            )}
            
            <Slider ref={sliderRef} {...settings}>
                {slides.map((slide) => (
                    <div key={slide.id} className="relative w-full h-120 md:h-96">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={slide.fullImageUrl}
                                alt={slide.title || "SMKN 5 Malang Building"}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                    // Fallback to local image on error
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/fotosmkn5landing.png';
                                }}
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