import React, { useState } from "react";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import FadeIn from "../Animations/FadeIn";
import { Typography, Button } from "@material-tailwind/react";

const Footer: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    try {
      const response: EmailJSResponseStatus = await emailjs.send(
        "service_wj0q7i1",
        "template_qqjabp9",
        templateParams,
        "Pk0uFk7AKHTesOhnN"
      );
      console.log("Success!", response.status, response.text);

      // Reset form fields on success
      setName("");
      setEmail("");
      setMessage("");
      setStatusMessage("We will get back to you shortly.");
    } catch (error) {
      console.error("Error sending email:", error);
      setStatusMessage("Message did not deliver. Please try again.");
    }
  };

  return (
    <footer
      className="text-black h-screen flex flex-col justify-center bg-gradient-to-r from-red-100 to-blue-400"
      id="contact"
    >
      <FadeIn>
        <div className="container mx-auto flex flex-col items-center">
          {/* Contact Us Section */}
          <div className="w-full max-w-md mb-4 text-center">
            <Typography variant="h1" className="text-center mb-4">
              Contact Us
            </Typography>
            <p className="mb-6 text-lg font-normal">
              We'd love to hear from you!
            </p>
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

              {/* Submit Button */}
              <Button
                type="submit"
                color="blue"
                className="normal-case w-full text-white py-3 bg-opacity-80 rounded transition duration-300 text-lg"
              >
                Send Message
              </Button>
            </form>

            {/* Display success or error message */}
            {statusMessage && (
              <p className="mt-4 text-center text-black-600">{statusMessage}</p>
            )}
          </div>

          {/* Social Media Links */}
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
      </FadeIn>
    </footer>
  );
};

export default Footer;
