interface MessageProps {
    question: string;
    answer: string;
}

const Message: React.FC<MessageProps> = ({ question, answer }) => {
    return (
        <div className="border-b border-gray-200 p-4">
            <p className="font-bold">Q: {question}</p>
            <p className="text-gray-700">A: {answer}</p>
        </div>
    );
};

export default Message;
