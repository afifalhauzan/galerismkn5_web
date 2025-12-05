"use client";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import KaryaCard from "@/components/ui/KaryaCard";

// Mock data for karya (artworks)
const karyaData = [
    {
        id: 1,
        title: "Karya 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam vitae...",
        imageUrl: "/logosmkn5.png",
        author: "Siswa A",
        jurusan: "RPL"
    },
    {
        id: 2,
        title: "Karya 2", 
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam vitae...",
        imageUrl: "/logosmkn5.png",
        author: "Siswa B",
        jurusan: "DKV"
    },
    {
        id: 3,
        title: "Karya 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam vitae...",
        imageUrl: "/logosmkn5.png",
        author: "Siswa C",
        jurusan: "Animasi"
    },
    {
        id: 4,
        title: "Karya 4",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam vitae...",
        imageUrl: "/logosmkn5.png",
        author: "Siswa D",
        jurusan: "TKJ"
    },
    {
        id: 5,
        title: "Karya 5",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam vitae...",
        imageUrl: "/logosmkn5.png",
        author: "Siswa E",
        jurusan: "Kriya Kayu"
    },
    {
        id: 6,
        title: "Karya 6",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam vitae...",
        imageUrl: "/logosmkn5.png",
        author: "Siswa F",
        jurusan: "Tata Busana"
    }
];

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1
    }
};

const customStyles = `
    .react-multi-carousel-list {
        padding: 0 40px;
    }
    
    .react-multi-carousel-dot-list {
        display: none;
    }
    
    .react-multiple-carousel__arrow {
        background: #4F6C9C;
        color: white;
        border: none;
        border-radius: 4px;
        width: 40px;
        height: 40px;
        font-size: 18px;
        font-weight: bold;
        z-index: 10;
    }
    
    .react-multiple-carousel__arrow:hover {
        background: #3A5998;
    }
    
    .react-multiple-carousel__arrow--left {
        left: 0;
    }   
    
    .react-multiple-carousel__arrow--right {
        right: 0;
    }
`;

interface KaryaCarouselProps {
    className?: string;
}

export default function KaryaCarousel({ className = "" }: KaryaCarouselProps) {
    return (
        <div className={`py-8 ${className}`}>
            <style>{customStyles}</style>
            
            <div className="mb-6">
                <h2 className="inline-block w-full text-center bg-sky-700 text-white px-6 py-3 rounded-full text-lg font-semibold">
                    Karya Unggulan
                </h2>
            </div>
            
            <div className="relative">
                <Carousel
                    responsive={responsive}
                    infinite={true}
                    autoPlay={false}
                    keyBoardControl={true}
                    customTransition="transform 300ms ease-in-out"
                    transitionDuration={300}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={[]}
                    itemClass="px-2"
                    showDots={false}
                    arrows={true}
                >
                    {karyaData.map((karya) => (
                        <KaryaCard key={karya.id} karya={karya} />
                    ))}
                </Carousel>
            </div>
        </div>
    );
}