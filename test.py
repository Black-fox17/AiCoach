import json
import os
import base64
import google.generativeai as genai
from io import BytesIO
from PIL import Image
import os
genai.configure(api_key= "AIzaSyC6FhO2BCsCoLp9aYjMnq59mzZ-hkKImi0")
    
model = genai.GenerativeModel(model_name="gemini-1.5-flash")
with open('output.json', 'r') as file:
    data = json.load(file)

content = []
for image in data["frames"]:
    image_data = image.split(",")[1]
    image_bytes = base64.b64decode(image_data)
    # image_bytes = BytesIO(image_bytes)
    # image = Image.open(image_bytes)
    content.append({"mime_type": "image/jpeg", "data": base64.b64encode(image_bytes).decode("utf-8")})
prompt = """
You are an AI Analyst trained to analyze the posture of individuals in workout videos. You have been given a sequence of images that together form a video of someone working out. Each frame contains a Mediapipe-generated posture drawing highlighting key joints and limbs.

For each frame in the sequence, perform the following tasks:

Posture Analysis: Analyze the posture of the person in the frame based on the Mediapipe drawing. Check if the alignment of their body is correct, particularly focusing on the back, shoulders, knees, arms, and head. Are the joints properly aligned, and does the posture support the movement being performed?

Movement Flow: Describe the progression of movements across the frames. Are the movements smooth and controlled, or are there any jerky or improper actions? Pay special attention to how the person transitions between poses and whether any part of their posture shifts too dramatically or too suddenly.

Areas for Improvement: Identify specific areas where the individual can improve their form. Using the Mediapipe drawing, highlight any misalignments, improper angles, or issues such as lack of joint engagement or muscle activation. Also, note any postures that could lead to potential injuries or inefficiencies.

Exercise-Specific Feedback: Considering the type of exercise being performed (e.g., squats, push-ups, deadlifts), analyze the posture and provide feedback based on the biomechanics involved. Comment on whether the individual is targeting the correct muscle groups and if the exercise is being performed effectively and safely.

Recommendations: Offer suggestions for improving posture, alignment, balance, and movement control. Focus on how the person can adjust their technique for better safety, performance, and results. Suggest corrective exercises or modifications to improve posture or muscle engagement.

Ensure that your analysis is clear, actionable, and easy to understand for someone seeking to refine their workout technique.

"""
content.append(prompt)

response = model.generate_content(content)
print(response.text)
# if not os.path.exists("Output"):
#     os.makedirs("Output")

# i = 1
# for image in data["frames"]:
#     image_data = image.split(",")[1]

#     # Decode the base64 string
#     image_bytes = base64.b64decode(image_data)

#     # Write the bytes to a file
#     with open(os.path.join("Output",f"output_image{i}.jpg"), "wb") as file:
#         file.write(image_bytes)

#     print(f"Image{i} saved successfully!")
#     i += 1