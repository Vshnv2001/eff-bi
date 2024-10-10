import openai

class LLMWrapper:
    def __init__(self, model_name, api_key):
        print("Initializing LLMWrapper")
        self.model_name = model_name
        self.api_key = api_key

    def generate_response(self, prompt, system_prompt):
        # Call the OpenAI API
        response = openai.ChatCompletion.create(
            model=self.model_name,
            messages=[{"role": "user", "content": prompt}, {"role": "system", "content": system_prompt}],
            api_key=self.api_key
        )
        
        # Extract and return the response text
        return response.choices[0].message['content']

