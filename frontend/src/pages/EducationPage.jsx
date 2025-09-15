// src/pages/EducationPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import courses from "../data/courses";

export default function EducationPage() {
  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <h1 className="text-4xl font-bold text-center text-purple-800 mb-12">
        📚 Our Courses
      </h1>
      
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-2xl transition transform hover:-translate-y-2 flex flex-col"
          >
            <img
              src={course.image}
              alt={course.title}
              loading="lazy"
              className="w-full h-66 object-cover rounded-xl mb-4"
            />
            <h2 className="text-2xl font-semibold text-purple-700 mb-2">{course.title}</h2>
            <p className="text-gray-600 text-sm flex-grow">{course.description}</p>

            {course.duration && (
              <p className="mt-3 text-gray-800">
                <span className="font-semibold">Duration:</span> {course.duration}
              </p>
            )}

            <Link to={`/course/${course.id}`} className="mt-4">
              <button className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-semibold">
                Read More
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
