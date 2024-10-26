import React, { useState } from "react";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import {FaXTwitter} from 'react-icons/fa6'
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";

const Footer: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    emailjs
      .send(
        "service_wj0q7i1",
        "template_qqjabp9",
        templateParams,
        "Pk0uFk7AKHTesOhnN"
      )
      .then((response: EmailJSResponseStatus) => {
        console.log("Success!", response.status, response.text);
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch((err: any) => {
        console.error("Unsuccessful...", err);
      });
  };

  return (
    <footer
      className="bg-gray-800 text-white py-6 h-screen flex flex-col justify-center"
      id="contact"
    >
      <div className="container mx-auto flex flex-col items-center">
        {/* Contact Us Section */}
        <div className="w-full max-w-md mb-4 text-center">
          <h2 className="text-white text-4xl font-black text-slate-500 text-center mb-6">
            Contact Us
          </h2>
          <p className="mb-6 text-lg">We'd love to hear from you!</p>
          <form onSubmit={sendEmail}>
            <input
              type="text"
              placeholder="Your Name"
              className="text-black w-full p-4 mb-4 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              className="text-black w-full p-4 mb-4 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="Your Message"
              className="text-black w-full p-4 mb-4 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-dark-blue-custom bg-blue-600 hover:bg-blue-500 text-white py-3 rounded transition duration-300 text-lg"
            >
              Send Message
            </button>
          </form>
        </div>

        <ul className="flex space-x-8 mb-4">
          <li>
            <a
              className="flex flex-col items-center hover:text-blue-500 transition duration-300"
              aria-label="LinkedIn"
              href="https://www.linkedin.com/company/eff-bi"
              target="_blank"
            >
              <FaLinkedin size={30} />
              <span className="text-xs">LinkedIn</span>
            </a>
          </li>
          <li>
            <a
              className="flex flex-col items-center hover:text-blue-400 transition duration-300"
              aria-label="Twitter"
              href="https://x.com/effbi3216"
              target="_blank"
            >
              <FaXTwitter size={30} />
              <span className="text-xs">X</span>
            </a>
          </li>
          <li>
            <a
              onClick={() =>
                window.open(
                  "mailto:effortlessbi@gmail.com?subject=Your Subject Here&body=Your Message Here",
                  "_blank"
                )
              }
              className="flex flex-col items-center hover:text-red-600 transition duration-300 cursor-pointer"
              aria-label="Email"
            >
              <FaEnvelope size={30} />
              <span className="text-xs">Gmail</span>
            </a>
          </li>
        </ul>
        <div className="text-center text-xs mt-4">
          &copy; {new Date().getFullYear()} Eff BI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
