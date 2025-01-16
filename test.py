import json
import os
import base64

with open('output.json', 'r') as file:
    data = json.load(file)


if not os.path.exists("Output"):
    os.makedirs("Output")

i = 1
for image in data["frames"]:
    image_data = image.split(",")[1]

    # Decode the base64 string
    image_bytes = base64.b64decode(image_data)

    # Write the bytes to a file
    with open(os.path.join("Output",f"output_image{i}.jpg"), "wb") as file:
        file.write(image_bytes)

    
    print(f"Image{i} saved successfully!")
    i += 1