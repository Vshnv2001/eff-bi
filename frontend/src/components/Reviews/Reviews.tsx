import { forwardRef } from "react";
import testimonials from "./Testimonials";

const Reviews = forwardRef<HTMLDivElement, {}>((_, ref) => {
  return (
    <section className="py-12">
      <div ref={ref} className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black uppercase text-slate-500 text-center mt-10">What Our Clients Say</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15.27L16.18 20 14.54 13.97 20 9.24l-6.91-.59L10 2 8.91 8.65 2 9.24l5.46 4.73L3.82 20z" />
                  </svg>
                ))}
              </div>
              <blockquote className="flex-1 mb-4">
                <p className="text-lg text-gray-900">{testimonial.review}</p>
              </blockquote>
              <div className="flex items-center">
                <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                <div className="ml-4">
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Reviews;