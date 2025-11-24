"use client";

const faqs = [
    {
        question: "How do I create an account?",
        answer: "Click on the 'Daftar' button in the navigation bar and fill out the registration form with your details."
    },
    {
        question: "How can I upload my artwork?",
        answer: "After logging in, go to your dashboard where you'll find an upload option for your creative works."
    },
    {
        question: "Who can view the gallery?",
        answer: "The gallery is accessible to all users, but some features require registration and login."
    },
    {
        question: "How do I reset my password?",
        answer: "On the login page, click 'Forgot Password' and follow the instructions sent to your email."
    },
    {
        question: "Can I edit my uploaded content?",
        answer: "Yes, you can edit and manage your uploaded content through your dashboard."
    }
];

export default function FAQ() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-start py-20 px-8">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-6">
                        Frequently Asked Questions (FAQ)
                    </h1>
                    <p className="text-xl text-gray-600">
                        Find answers to common questions about our digital gallery platform.
                    </p>
                </div>
                
                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                {faq.question}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 text-center">
                    <div className="bg-blue-50 rounded-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Still have questions?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Can't find the answer you're looking for? Please contact our support team.
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}