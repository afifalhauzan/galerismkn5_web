"use client";

import { useState } from "react";
import SearchCard from "./components/SearchCard";
import FAQCard from "./components/FAQCard";
import KaryaCarousel from "@/components/ui/KaryaCarousel";

const faqData = [
    {
        id: 1,
        question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        answer: "Lorem ipsum dolor sit amet consectetur adipiscing elit fames, porttitor posuere nec ridiculus nisl pretium sollicitudin, nostra iaculis pulvinar ut ultrices vestibulum nascetur. Parturient viverra tristique nunc accumsan nibh vivamus malesuada elementum venenatis mi, blandit rutrum litora montes turpis imperdiet platea at fringilla eu facilisis, orci purus nisl vehicula nam phasellus penatibus facilisi ultrices."
    },
    {
        id: 2,
        question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        answer: "Lorem ipsum dolor sit amet consectetur adipiscing elit fames, porttitor posuere nec ridiculus nisl pretium sollicitudin, nostra iaculis pulvinar ut ultrices vestibulum nascetur. Parturient viverra tristique nunc accumsan nibh vivamus malesuada elementum venenatis mi, blandit rutrum litora montes turpis imperdiet platea at fringilla eu facilisis, orci purus nisl vehicula nam phasellus penatibus facilisi ultrices."
    },
    {
        id: 3,
        question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        answer: "Lorem ipsum dolor sit amet consectetur adipiscing elit fames, porttitor posuere nec ridiculus nisl pretium sollicitudin, nostra iaculis pulvinar ut ultrices vestibulum nascetur. Parturient viverra tristique nunc accumsan nibh vivamus malesuada elementum venenatis mi, blandit rutrum litora montes turpis imperdiet platea at fringilla eu facilisis, orci purus nisl vehicula nam phasellus penatibus facilisi ultrices."
    },
    {
        id: 4,
        question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        answer: "Lorem ipsum dolor sit amet consectetur adipiscing elit fames, porttitor posuere nec ridiculus nisl pretium sollicitudin, nostra iaculis pulvinar ut ultrices vestibulum nascetur. Parturient viverra tristique nunc accumsan nibh vivamus malesuada elementum venenatis mi, blandit rutrum litora montes turpis imperdiet platea at fringilla eu facilisis, orci purus nisl vehicula nam phasellus penatibus facilisi ultrices."
    },
    {
        id: 5,
        question: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        answer: "Lorem ipsum dolor sit amet consectetur adipiscing elit fames, porttitor posuere nec ridiculus nisl pretium sollicitudin, nostra iaculis pulvinar ut ultrices vestibulum nascetur. Parturient viverra tristique nunc accumsan nibh vivamus malesuada elementum venenatis mi, blandit rutrum litora montes turpis imperdiet platea at fringilla eu facilisis, orci purus nisl vehicula nam phasellus penatibus facilisi ultrices."
    }
];

export default function FAQPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua");

    const filteredFAQ = faqData.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl md:pt-30">
            <h1 className="text-3xl text-sky-700 font-bold text-center mb-8">Tanya Jawab</h1>
            <SearchCard 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
            
            <div className="space-y-4">
                {filteredFAQ.map((faq) => (
                    <FAQCard 
                        key={faq.id}
                        question={faq.question}
                        answer={faq.answer}
                    />
                ))}
            </div>
        </div>
    );
}