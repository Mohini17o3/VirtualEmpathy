from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

import spacy
from datetime import datetime
import os
from dotenv import load_dotenv
import logging


app = Flask(__name__)
CORS(app)
load_dotenv(dotenv_path=".env")


class GeminiMentalHealthBot:
    def __init__(self):
        # Initialize API clients
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.gemini_model = genai.GenerativeModel("gemini-pro")
        self.nlp = spacy.load("en_core_web_sm")
        self.happiness_scores = []
        self.conversation_history = [] 
        


        # Configure logging
        logging.basicConfig(
            filename="mental_health_bot.log",
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
        )

        self.emergency_resources = {
            "Crisis Hotline": "9152987821",
            "Emergency": "112",
            
        }

        # System prompt for maintaining therapeutic context
        self.system_prompt = """
         You are a supportive AI assistant named as VirtualMate trained to provide emotional support in a compassionate, non-judgmental, and empathetic way.Your responses should always:
         1. Listen actively to the user's feelings and emotions first.
         2. Ask open-ended questions to understand why the user feels the way they do.
         3. Offer validation and empathy by reflecting on their feelings.
         4. When appropriate, gently suggest ways to cope or professional resources, but never push for immediate solutions.
         5. Only escalate to crisis interventions when the user clearly expresses a crisis or emergency situation.
         6. Maintain boundaries, but also be a friendly, understanding companion during difficult times.
         7. Avoid providing medical or psychological advice and encourage users to reach out to professionals when needed.
         """

        # Initialize Gemini chat
        self.chat = self.gemini_model.start_chat(history=[])
    def calculate_sentiment(self, text):
        """
        Analyze sentiment of the text to derive polarity score (-1 to 1).
        """
        from textblob import TextBlob
        blob = TextBlob(text)
        return blob.sentiment.polarity  
      

    def add_message(self, message):
        """
        Add user input to the conversation history and update happiness score.
        """
        sentiment_score = self.calculate_sentiment(message)
        self.happiness_scores.append(sentiment_score)
        self.conversation_history.append(message)
        return sentiment_score  

    def get_happiness_score(self):
        """
        Calculate average happiness score for the session as a percentage.
        """
        if not self.happiness_scores:
            return 50  # Default neutral score
        avg_sentiment = sum(self.happiness_scores) / len(self.happiness_scores)
        logging.info(f"Calculated average sentiment: {avg_sentiment}")
        return int((avg_sentiment + 1) * 50)  # Scale to 0-100


    def check_safety(self, text):
        """
        Multi-layered safety check for incoming messages
        Returns: (risk_level, crisis_detected)
        """
        try:

            # Crisis keywords check through spaCy
            doc = self.nlp(text.lower())
            crisis_keywords = ["suicide", "kill", "die", "hurt", "end it"]
            crisis_detected = any(keyword in doc.text for keyword in crisis_keywords)

            # Determine risk level
            risk_level = "high" if crisis_detected else "low"

            return {
                "risk_level": risk_level,
                "crisis_detected": crisis_detected,
            }

        except Exception as e:
            logging.error(f"Safety check error: {str(e)}")
            return {
                "risk_level": "high",
                "crisis_detected": True,
            }

    def generate_response(self, user_input, conversation_history):
        """Generate AI response using Gemini API with safety checks"""
        try:
            # Perform safety check
            safety_result = self.check_safety(user_input)

            if safety_result["crisis_detected"]:
                return self.get_crisis_response()

            # Update chat history
            if conversation_history:
                self.chat = self.gemini_model.start_chat(history=conversation_history)

            # Generate response using Gemini
            response = self.chat.send_message(
                f"{self.system_prompt}\n\nUser message: {user_input}",
                generation_config=genai.types.GenerationConfig(
                    temperature=0.7,
                    top_p=0.8,
                    top_k=40,
                    max_output_tokens=150,
                ),
            )

            # Post-process the response
            processed_response = self.post_process_response(
                response.text, safety_result["risk_level"]
            )
            logging.info(f"User input: {user_input}")
            logging.info(f"Conversation history: {conversation_history}")
            logging.info(f"Generated response: {response}")

            return processed_response
            # return response.text

        except Exception as e:
            logging.error(f"Response generation error: {str(e)}")
            return self.get_fallback_response()

    def post_process_response(self, response, risk_level):
        """Add appropriate disclaimers and resources based on risk level"""
        disclaimers = {
            "low": "\n\nPlease remember that I'm an AI assistant, not a mental health professional.",
            "high": f"\n\nIMPORTANT: If you're in crisis, please contact emergency services or call {self.emergency_resources['Crisis Hotline']}.",
        }
        if "Please remember that I'm an AI assistant, not a mental health professional" in response:
            if risk_level=="low":
                return response
        return f"{response}{disclaimers[risk_level]}"

    def get_crisis_response(self):
        """Generate response for crisis situations"""
        return "\n".join(
            [
                "I'm very concerned about what you're sharing and your safety is the top priority right now.",
                "\nIMMEDIATE SUPPORT IS AVAILABLE:",
                f"🆘 Crisis Hotline: {self.emergency_resources['Crisis Hotline']}",
                f"🚨 Emergency: {self.emergency_resources['Emergency']}",
                "\nPlease reach out to one of these services immediately - caring professionals are ready to help 24/7.",
            ]
        )

    def get_fallback_response(self):
        """Fallback response when errors occur"""
        return "I apologize, but I'm having trouble processing your message right now. If you're in crisis, please contact emergency services or call 988 for immediate support."

bot = GeminiMentalHealthBot()

# Flask routes for API endpoints
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message")
        conversation_history = data.get("conversation_history", [])

        if not user_input:
            return jsonify({"error": "No message provided"}), 400
        


        # Add user message to bot's history and update happiness score
        sentiment_score = bot.add_message(user_input)


        response =  bot.generate_response(user_input, conversation_history)

        return jsonify(
            {
                "response": response,
                "timestamp": datetime.now().isoformat(),
                "happiness_score": bot.get_happiness_score(),
            }
        )

    except Exception as e:
        logging.error(f"API error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200




@app.route("/happiness", methods=["GET"])
def happiness_score():
    """
    Return the happiness score for the current session.
    """
    try:
        logging.info("Fetching happiness score...")
        score = bot.get_happiness_score()
        logging.info(f"Happiness score fetched successfully: {score}")
        return jsonify({"happiness_score": score})
    except Exception as e:
        logging.error(f"Error fetching happiness score: {str(e)}")
        return jsonify({"error": "Could not fetch happiness score"}), 500


if __name__ == "__main__":
    app.run(debug=False, port=5001)
