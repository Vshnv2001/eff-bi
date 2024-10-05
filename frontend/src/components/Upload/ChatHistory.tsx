import Message from "./Message";

interface ChatHistoryProps {
  history: { id: number; question: string; answer: string }[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ history }) => {
  return (
    <div>
      {history.map((msg) => (
        <Message key={msg.id} question={msg.question} answer={msg.answer} />
      ))}
    </div>
  );
};

export default ChatHistory;
