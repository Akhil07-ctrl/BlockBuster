import React from 'react';
import { motion as Motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left hover:text-brand-600 transition-colors"
            >
                <span className="text-lg font-bold text-gray-900">{question}</span>
                <Motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-gray-400"
                >
                    <ChevronDown size={20} />
                </Motion.div>
            </button>
            <Motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                className="overflow-hidden"
            >
                <p className="pb-6 text-gray-600 leading-relaxed">
                    {answer}
                </p>
            </Motion.div>
        </div>
    );
};

const FAQ = () => {
    const faqs = [
        {
            question: "How do I book a movie ticket?",
            answer: "Simply browse through the Movies section, select your preferred movie, choose a city and theatre, select your seats, and proceed to payment. You'll receive a confirmation email and SMS instantly."
        },
        {
            question: "Can I cancel my booking?",
            answer: "Cancellation policies vary by venue. Generally, cinema tickets can be cancelled up to 2 hours before the showtime for a partial refund. Please check the specific terms during the booking process."
        },
        {
            question: "Is my payment secure?",
            answer: "Yes, we use industry-standard encryption and secure payment gateways. We do not store your credit/debit card details on our servers."
        },
        {
            question: "How do I use my loyalty points?",
            answer: "Loyalty points can be redeemed during the checkout process. Select the 'Redeem Points' option on the payment page to apply your available balance to your booking."
        },
        {
            question: "Do you offer group discounts?",
            answer: "Yes, for bookings exceeding 10 tickets, we offer special group rates. Please contact our corporate sales team through the Contact Us page for more information."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <Motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <div className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 mx-auto mb-6">
                        <HelpCircle size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
                        Frequently Asked <span className="text-brand-600">Questions</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Find quick answers to common questions about BlockBuster.
                    </p>
                </Motion.div>

                <Motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="bg-white px-10 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100"
                >
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} {...faq} />
                    ))}
                </Motion.div>
            </div>
        </div>
    );
};

export default FAQ;
