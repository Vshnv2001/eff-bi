import { useState } from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Typography,
} from "@material-tailwind/react";

function Icon({ id, open }: { id: number; open: number[] }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        open.includes(id) ? "rotate-180" : ""
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
      "As the Eff BI administrator for your organization, start by connecting your database to fully leverage the capabilities of Eff BI. " +
      "To do so, navigate to the 'Settings' tab, select 'Database Settings', and enter the database URI. " +
      "This initial setup is crucial, to allow your organization users access the core features of Eff BI. " +
      "If you are not the administrator of your organization for Eff BI, a database may already be connected. " +
      "Should you encounter any issues with database connectivity or if no database URI has been set up yet," +
      " please contact your organization's administrator to resolve these matters."
  },
  {
    topic: "View Data",
    answer:
      "After connecting your database, explore your tables by navigating to the 'View Data' tab. " +
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
    topic: "Creating Chart",
    answer:
      "Tiles are where the magic of Eff BI is showcased! " +
      "Create a new tile by navigating to the 'Dashboard' page and open a dashboard. You may create a dashboard if there are no current dashboards." +
        "Within the dashboard, select the 'Create Chart.' button." +
      "Enter your data query and our application would produce a dynamic visual representations of the results! ",
  },
  {
    topic: "Table Permissions Page",
    answer:
      "The Table Permissions page offers a detailed view of your current access rights. " +
      "As an administrator of a table, you have the authority to modify access levels, allowing you to manage who can view or edit the table."
  },
  {
    topic: "Managing User Permissions",
    answer:
      "To manage user permissions effectively, firstly navigate to the Settings tab and open the 'Table Permissions' page. " +
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
    question: "What does the refresh button in database settings do?",
    answer:
      "Whenever your original data has been updated e.g. a new table or column added, you can trigger a refresh on Eff BI side for us to have the most updated version for your database.",
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
  const [openTips, setOpenTips] = useState<number[]>([]);
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const handleOpenTips = (value: number) => {
    setOpenTips(openTips.includes(value) ? openTips.filter(id => id !== value) : [...openTips, value]);
  };

  const handleOpenFaqs = (value: number) => {
    setOpenFaqs(openFaqs.includes(value) ? openFaqs.filter(id => id !== value) : [...openFaqs, value]);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="flex flex-col items-center justify-between mb-8 relative">
        <div className="absolute inset-x-0 text-center">
          <Typography color="white" className="text-3xl font-bold text-black">
            Getting Started
          </Typography>
        </div>
        <div className="w-[55rem] m-20 text-center">
          <Typography color="white" className="text-xl text-black">
            Welcome to Eff BI 👋, Your all-in-one tool for data management and
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
                open={openTips.includes(idx)}
                icon={<Icon id={idx} open={openTips}/>}
              >
                <AccordionHeader
                  className="text-white hover:text-blue-400 text-black"
                  onClick={() => handleOpenTips(idx)}
                >
                  {tip.topic}
                </AccordionHeader>
                <AccordionBody className="text-white text-lg text-black">
                  {tip.answer}
                </AccordionBody>
              </Accordion>
            );
          })}
        </div>
        <div className="w-[55rem] mt-20 text-center">
          <Typography color="white" className="text-3xl font-bold text-black">
            Frequently Asked Questions
          </Typography>
        </div>
        <div className="w-[55rem] mt-20">
          {faqs.map((faq, idx) => {
            return (
              <Accordion
                key={`faq-${idx}`}
                open={openFaqs.includes(idx)}
                icon={<Icon id={idx} open={openFaqs}/>}
              >
                <AccordionHeader
                  className="text-white hover:text-blue-400 text-black"
                  onClick={() => handleOpenFaqs(idx)}
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
