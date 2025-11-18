import { Testimonial } from '@/types';
import { Quote } from 'lucide-react';
import { Card } from './ui/card';

interface TestimonialCardProps {
    testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
    return (
        <Card className="flex h-full flex-col border-t-4 border-blue-600 bg-white p-6 shadow-md">
            <Quote className="mb-4 h-8 w-8 text-blue-400" />
            <p className="flex-grow text-gray-700 italic">"{testimonial.message}"</p>
            <div className="mt-4 border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
            </div>
        </Card>
    );
}
