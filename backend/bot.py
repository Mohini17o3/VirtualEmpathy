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
        self.system_prompt = """You are a supportive AI assistant trained to provide emotional support while:
        1. Never providing medical advice or diagnosis
        2. Encouraging professional help when appropriate
        3. Immediately escalating crisis situations to emergency services
        4. Maintaining appropriate boundaries
        5. Using evidence-based supportive techniques like active listening and validation
        6. Being clear about being an AI assistant

        For crisis situations, immediately provide emergency resources and crisis hotline information.
        
        Keep responses concise, empathetic, and focused on the user's immediate concerns.
        """

        # Initialize Gemini chat
        self.chat = self.gemini_model.start_chat(history=[])

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


# Flask routes for API endpoints
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message")
        conversation_history = data.get("conversation_history", [])

        if not user_input:
            return jsonify({"error": "No message provided"}), 400

        bot = GeminiMentalHealthBot()
        response =  bot.generate_response(user_input, conversation_history)

        return jsonify(
            {
                "response": response,
                "timestamp": datetime.now().isoformat(),
            }
        )

    except Exception as e:
        logging.error(f"API error: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200


if __name__ == "__main__":
    app.run(debug=False, port=5001)
