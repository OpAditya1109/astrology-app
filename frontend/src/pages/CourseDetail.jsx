// src/pages/CourseDetail.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import courses from "../data/courses";
import curriculum from "../data/curriculum";
import CertificateImg from "../assets/Bhavanaastro-certificate.png";
import CourseBanner from "../assets/course_banner.png"


export default function CourseDetail() {
  const { id } = useParams();
  const course = courses.find((c) => c.id === id);
  const courseCurriculum = curriculum[id];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
  });

  const [openFAQ, setOpenFAQ] = useState(null);
  const [openTopic, setOpenTopic] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("https://bhavanaastro.onrender.com/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, courseId: id }) // include course id
    });

    if (response.ok) {
      alert("✅ Thank you! Your enquiry has been stored. We’ll contact you soon.");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", city: "", country: "" });
    } else {
      alert("❌ Failed to submit enquiry. Please try again.");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("⚠️ Something went wrong. Please try later.");
  }
};



  if (!course) {
    return <div className="p-6 text-center text-red-600">Course not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-10">
        {/* Course Banner */}
       <img
  src={CourseBanner}
  alt={course.title}
  className="w-full h-[400px] md:h-[400px] object-contain rounded-xl mb-6"
/>

        <h1 className="text-4xl font-bold text-purple-800 text-center">
          Most Trusted Vedic Astrology Course
        </h1>
        <h2 className="text-xl text-center text-gray-600 mt-2">
          Become a Professional Astrologer with{" "}
          <span className="font-semibold text-purple-700">
            Bhavana Institute of Occult Science
          </span>
        </h2>

        {/* Intro Section */}
        <div className="mt-6 text-gray-700 leading-relaxed space-y-4">
          <p>
            Are you interested in knowing how the stars, planets, and other cosmic forces influence our lives? At{" "}
            <span className="font-semibold">Bhavana Institute of Occult Science</span>, we bring you the opportunity to dive deep into the ancient art of Astrology. This course equips you with the knowledge and tools to interpret cosmic elements like a professional.
          </p>
          <p>
            Our <span className="font-semibold">Vedic Astrology Course</span> helps you understand everything from basics to advanced concepts — including interpreting natal charts, planetary transits, predictions, and more.
          </p>
          <p>
            This online course connects celestial patterns with human experiences, offering a mystical yet practical journey. Begin your path to becoming a <span className="font-semibold">professional astrologer</span> today with Bhavana Institute of Occult Science.
          </p>
        </div>

        {/* Certification Section */}
        <div className="mt-10 grid md:grid-cols-2 gap-6 items-center">
          <img src={CertificateImg} alt="Certificate" className="rounded-lg shadow-md" />
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Globally recognized certification from Academy of Vedic Vidya.</li>
            <li>100% Live Online Training.</li>
            <li>Taught by 10+ years of experienced Industry Experts.</li>
            <li>No prior experience required to join this course.</li>
            <li>Industry Approved Certificate upon completion.</li>
            <li className="text-green-700 font-semibold">✅ 100% Placement Assistance after completion.</li>
          </ul>
        </div>

        {/* Admission Procedure */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-purple-800 mb-4">Admission Procedure</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Fill out the enquiry form below with your details.</li>
            <li>Our team will reach out to confirm your interest and guide you further.</li>
            <li>Complete the registration process & make the course fee payment.</li>
            <li>Receive your welcome kit and access details for online classes.</li>
          </ol>
        </div>

        {/* Curriculum Section */}
   {courseCurriculum && (
  <div className="mt-10 space-y-4">
    <h2 className="text-3xl font-bold text-purple-800 text-center bg-yellow-100 py-4 rounded-xl shadow-md">
      {course.title} Curriculum
    </h2>
    <p className="text-gray-600 text-center">{courseCurriculum.details}</p>
    <p className="text-center font-semibold text-green-700">
      Duration: {courseCurriculum.duration}
    </p>

    <div className="mt-4 border rounded-lg divide-y">
      {courseCurriculum.topics.map((topic, index) => (
        <div key={index} className="p-3">
          <button
            className="w-full text-left font-medium text-gray-800 flex justify-between items-center"
            onClick={() => setOpenTopic(openTopic === index ? null : index)}
          >
            {topic.title}
            <span>{openTopic === index ? "−" : "+"}</span>
          </button>
          {openTopic === index && (
            <div className="mt-2 text-gray-600 text-sm">
              {topic.description}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
)}


        {/* What You Will Learn */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-purple-800 mb-4">What You Will Learn</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Interpret natal and divisional charts with confidence.</li>
            <li>Understand planetary positions, transits, and their effects.</li>
            <li>Master prediction techniques for career, marriage, and health.</li>
            <li>Gain practical skills for professional astrology consultations.</li>
            <li>Develop spiritual insights and self-awareness through astrology.</li>
          </ul>
        </div>

        {/* FAQ Section */}
        <div className="mt-10">
          <h3 className="text-2xl font-bold text-purple-800 mb-4">Frequently Asked Questions</h3>
          {[
            { q: "Do I need prior knowledge of astrology?", a: "No. This course starts from the basics, so beginners are welcome." },
            { q: "Will I receive a certificate?", a: "Yes. Upon successful completion, Bhavana Institute of Occult Science provides a professional certificate." },
            { q: "Is this course online or offline?", a: "This course is conducted online with live interactive sessions." },
            { q: "Can I pursue this course alongside a full-time job?", a: "Yes. Our classes are flexible and recordings are available for later access." },
          ].map((faq, idx) => (
            <div key={idx} className="mb-3 border-b pb-2">
              <button
                className="w-full text-left font-semibold text-gray-800 flex justify-between items-center"
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              >
                {faq.q}
                <span>{openFAQ === idx ? "−" : "+"}</span>
              </button>
              {openFAQ === idx && <p className="mt-2 text-gray-600">{faq.a}</p>}
            </div>
          ))}
        </div>

        {/* Enquiry Form */}
        <div className="mt-10 bg-purple-50 p-6 rounded-xl shadow-inner">
          <h3 className="text-2xl font-bold text-purple-800 mb-4">Get the Course Details</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-400"
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Submit & Get Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
