import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
import dotenv

dotenv.load_dotenv()


class LLMManager:
    # Manages the interaction with the LLM
    def __init__(self, model="gpt-4o"):
        api_key = os.getenv("OPENAI_API_KEY")
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0, api_key=api_key)

    def invoke(self, prompt: ChatPromptTemplate, **kwargs) -> str:
        # Invokes the LLM
        messages = prompt.format_messages(**kwargs)
        response = self.llm.invoke(messages)
        return response.content
