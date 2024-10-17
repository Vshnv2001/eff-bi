import { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";

function Icon({ id, open }: { id: number; open: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

const faqs = [
  {
    question: "What does Admin permission mean?",
    answer:
      "Permissions are applied on the table level, where each user can have no access, view access or admin access to a table. If a user has admin permissions, they would be able to view the data in the table and grant other users view or admin permissions. View permission simply means that the user can only view the data.",
  },
  {
    question: "Why am I getting no permissions error when creating a tile?",
    answer:
      "This means that in your query to create a tile, the query requires information from a table that you do not have access to. Reach out to an admin in your organization to grant you permissions to that table to overcome this issue.",
  },
  {
    question: "Why am I unable to update my database URI?",
    answer:
      "Our system only supports 1 database URI per organization at the moment. Do bear with us as we continue to develop Eff BI!",
  },
  {
    question: "What is the difference between dashboards and dashboard?",
    answer:
      "Dashboard (without s) contains multiple tiles. Dashboards (with s) is a collection of all your dashboard.",
  },
  {
    question: "None of the above answers my question, what should I do?",
    answer:
      "We are here for you! Reach out to us via email at effortlessbi@gmail.com",
  },
];

const FaqPage = () => {
  const [open, setOpen] = useState(-1);
  const handleOpen = (value: number) => setOpen(open === value ? -1 : value);

  return (
    <div className="min-h-screen bg-gray-800 p-8">
      <div className="flex flex-col items-center justify-between mb-8 relative">
        <div className="absolute inset-x-0 text-center">
          <Typography color="white" className="text-3xl font-bold">
            Frequently Asked Questions
          </Typography>
        </div>
        <div className="w-[55rem] mt-20">
          {faqs.map((faq, idx) => {
            return (
              <Accordion
                open={open === idx}
                icon={<Icon id={idx} open={open} />}
              >
                <AccordionHeader
                  className="text-white hover:text-blue-400"
                  onClick={() => handleOpen(idx)}
                >
                  {faq.question}
                </AccordionHeader>
                <AccordionBody className="text-white text-lg">
                  {faq.answer}
                </AccordionBody>
              </Accordion>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
