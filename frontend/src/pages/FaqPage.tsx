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
const tips = [
  {
    topic: "Connecting Your Database",
    answer:
      "Begin by connecting your database to unlock the full capabilities of EffBI. " +
      "Navigate to the Settings tab, select 'Database Settings,' and enter your database URI. " +
      "This setup is essential for accessing the key features of EffBI.",
  },
  {
    topic: "View Data",
    answer:
      "After connecting your database, explore your tables by navigating to the 'Tables' tab. " +
      "Here, you can preview sample data from your accessible tables, providing a quick snapshot of the information.",
  },
  {
    topic: "Creating Dashboards",
    answer:
      "Dashboards are essential for visualizing data interactions and trends! " +
      "Start creating your own by visiting the 'Dashboard' page and clicking the 'Create Dashboard' button. " +
      "This allows you to assemble a collection of tiles showcase data insights.",
  },
  {
    topic: "Creating Tiles",
    answer:
      "Tiles are where the magic of EffBI is showcased!" +
      "Create a new tile by navigating to the 'Dashboard' page and selecting 'Create Tile.' " +
      "Enter your data query and our application would produce a dynamic visual representations of the results. ",
  },
  {
    topic: "User Permissions Page",
    answer:
      "The User Permissions page provides a comprehensive overview of your current access rights." +
      " If you hold administrator rights for a table, you can modify access levels. ",
  },
  {
    topic: "Managing User Permissions",
    answer:
      "To manage user permissions effectively, first go to the 'User Permissions' page. " +
      "As a table administrator, you have the authority to adjust user access." +
      " You can revoke existing permissions with the 'Remove' button " +
      "or extend access by selecting 'Add Users' and entering your colleagues' email with the respective permission type.",
  },
];

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
      "Our system only supports 1 database URI per organization at the moment. As such, if your organization has previously added a database URI, the SAVE button will be disabled. If you urgently need to update your database URI, do reach out to us at effortlessbi@gmail.com. Thank you for bearing with us as we continue to develop Eff BI!",
  },
  {
    question: "What is the difference between dashboards and dashboard?",
    answer:
      "Dashboard (without s) contains multiple tiles. Dashboards (with s) is a collection of all your dashboard.",
  },
  {
    question: "What happens if I rename a table in the database?",
    answer:
      "Upon renaming a table in your database and refreshing, the renamed table is treated as a new table and the original table is deleted. " +
      "Consequently all user-specific permissions linked to the original table will be deleted.\n" +
      "The new table will be added as a fresh entry with admin permissions set only for your organization's Super Admins.",
  },
  {
    question: "Who is a Super Admin?",
    answer:
      "Super Admins are the Effortless BI coordinators of your organization. " +
      "They have the highest level of permissions in the application and have admin permissions to all tables by default. " +
      "They can grant admin/view permissions to other users in your company.",
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
            Getting Started
          </Typography>
        </div>
        <div className="w-[55rem] m-20 text-center">
          <Typography color="white" className="text-xl">
            Welcome to EffBI 👋, Your all-in-one tool for data management and
            visualization! <br />
            Let's guide you through the initial setup and key features to
            kickstart your journey.
          </Typography>
        </div>
        <div className="w-[55rem]">
          {tips.map((tip, idx) => {
            return (
              <Accordion
                key={`tip-${idx}`}
                open={open === idx}
                icon={<Icon id={idx} open={open} />}
              >
                <AccordionHeader
                  className="text-white hover:text-blue-400"
                  onClick={() => handleOpen(idx)}
                >
                  {tip.topic}
                </AccordionHeader>
                <AccordionBody className="text-white text-lg">
                  {tip.answer}
                </AccordionBody>
              </Accordion>
            );
          })}
        </div>
        <div className="w-[55rem] mt-20 text-center">
          <Typography color="white" className="text-3xl font-bold">
            Frequently Asked Questions
          </Typography>
        </div>
        <div className="w-[55rem] mt-20">
          {faqs.map((faq, idx) => {
            return (
              <Accordion
                key={`faq-${idx}`}
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
