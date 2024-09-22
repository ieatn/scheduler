import re
from datetime import datetime, timedelta
import spacy
spacy.load('en_core_web_sm')
from spacy.lang.en import English
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load the English language model for spaCy
nlp = spacy.load("en_core_web_sm")

class AISchedulerApp:
    def __init__(self):
        self.plans = {}
        self.vectorizer = TfidfVectorizer()

    def add_plan(self, user, activity, time):
        if user not in self.plans:
            self.plans[user] = []
        self.plans[user].append((activity, time))

    def extract_info(self, text):
        doc = nlp(text)
        activity = ""
        time = ""

        for ent in doc.ents:
            if ent.label_ == "TIME":
                time = ent.text

        for token in doc:
            if token.dep_ == "ROOT" and token.pos_ == "VERB":
                activity = token.text
                for child in token.children:
                    if child.dep_ in ["dobj", "pobj"]:
                        activity += " " + child.text

        if not time:
            time_pattern = r'\d{1,2}(?::\d{2})?(?:am|pm)'
            time_match = re.search(time_pattern, text, re.IGNORECASE)
            if time_match:
                time = time_match.group()

        return activity.strip(), time

    def find_similar_plans(self, activity, time, time_range=1):
        similar_plans = []
        target_time = datetime.strptime(time, "%I:%M%p")
        start_time = target_time - timedelta(hours=time_range)
        end_time = target_time + timedelta(hours=time_range)

        all_activities = [activity] + [plan[0] for plans in self.plans.values() for plan in plans]
        tfidf_matrix = self.vectorizer.fit_transform(all_activities)
        cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

        for i, (user, plans) in enumerate(self.plans.items()):
            for plan_activity, plan_time in plans:
                plan_datetime = datetime.strptime(plan_time, "%I:%M%p")
                similarity_score = cosine_similarities[i]

                if (similarity_score > 0.5 and start_time <= plan_datetime <= end_time):
                    similar_plans.append((user, plan_activity, plan_time, similarity_score))

        return sorted(similar_plans, key=lambda x: x[3], reverse=True)

    def process_input(self, user, input_text):
        activity, time = self.extract_info(input_text)

        if activity and time:
            self.add_plan(user, activity, time)
            similar_plans = self.find_similar_plans(activity, time)

            print(f"I understand that you plan to {activity} at {time}.")
            if similar_plans:
                print("Users with similar plans:")
                for similar_user, similar_activity, similar_time, similarity in similar_plans:
                    if similar_user != user:
                        print(f"- {similar_user} plans to {similar_activity} at {similar_time} (Similarity: {similarity:.2f})")
            else:
                print("No other users have similar plans at the moment.")
        else:
            print("I'm sorry, I couldn't understand your plan. Please try again with a clearer description of your activity and time.")

# Example usage
scheduler = AISchedulerApp()

# Simulate some users adding plans
scheduler.process_input("Alice", "I'm going to hit the gym around 7:30pm")
scheduler.process_input("Bob", "I plan on working out at the fitness center at 8:15pm")
scheduler.process_input("Charlie", "I'll be watching a movie at the cinema at 8:00pm")

# Test the app
while True:
    user = input("Enter your name: ")
    plan = input("What's your plan? ")
    scheduler.process_input(user, plan)
    print()