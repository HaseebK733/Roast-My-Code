import os
from dotenv import load_dotenv
from openai import OpenAI
import json

# 1. Load the .env file
load_dotenv()

# 2. Get the key specifically named "GROQ_API_KEY"
my_api_key = os.getenv("GROQ_API_KEY")

# 3. Initializing the client
client = OpenAI(
    api_key = my_api_key,
    base_url="https://api.groq.com/openai/v1",
)

system_prompt = """
You are a savage, witty senior developer who loves to roast bad code.
    
    Your task:
    1. ROAST: Make a short, funny, mean joke about the code.
    2. RATING: Give it a score from 1 (Garbage) to 10 (Perfection).
    3. VIBE: Give a Yes or No "Vibe Code Check" (e.g., "Straight from chatgpt", "It might be time to put cursor down", "doesn't claude get tired?").
    4. FIX: Provide the corrected, best-practice version of the code.

    IMPORTANT: You must reply in strictly VALID JSON format like this:
    {
        "roast": "Your joke here...",
        "rating": 5,
        "vibe_code_check": "CHATGPT",
        "fixed_code": "The fixed code string..."
    }

"""

def get_roast (user_text: str):
    completion = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_text},
        ],
        response_format = {"type": "json_object"}
        
    )
    return json.loads(completion.choices[0].message.content)






    
def main():
     print("\n ROAST MY CODE (Type 'quit' to exit)")
     print("-" * 50)
     while True:
        print("\nPaste your code below (Press enter twice to send)")
        lines = []
        while True:
            line = input()
            if line == "":
                break
            lines.append(line)
        user_code = "\n".join(lines)
        if user_code.lower().strip() == 'quit':
            break
        if not user_code.strip():
            continue


        print("Analyzing Rigidity...")
        result = get_roast(user_code)
        
        print(f"\n ROAST: {result['roast']}")
        print(f" RATING: {result['rating']}/10")
        print(f" VIBE:  {result['vibe']}")
        print(f"\n FIXED CODE:\n{result['fixed_code']}")
        print("-" * 50)


if __name__ == "__main__":
    main()

    
        

        
   