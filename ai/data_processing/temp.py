import os
import json

# a space for quick data processing, very unsanitized


def clean():
    inPath = "/Users/yenshuohsu/ibm_cfc_2024/rita-cfc-2024/ai/data_processing/processed_data/combined_chapters.json"
    path = "/Users/yenshuohsu/ibm_cfc_2024/rita-cfc-2024/ai/data_processing/processed_data/course_plan/combined_chapters_simplified.json"
    with open(inPath, 'r', encoding='utf-8') as file:
        data = json.load(file)

    for classObj in data:
        courseGoals = []
        for goalDetail in classObj['指導計畫']:
            courseGoals.extend(goalDetail['活動目標'])
        classObj['指導計畫'] = courseGoals

    with open(path, 'w') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)


def doUtf8():
    path = "/Users/yenshuohsu/ibm_cfc_2024/rita-cfc-2024/ai/data_processing/processed_data/course_plan/combined_chapters_simplified.json"
    with open(path, 'r', encoding='utf-8') as file:
        data = json.load(file)
    with open(path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)


def modifyJson():
    for i in range(1, 11):
        path = f"/Users/yenshuohsu/ibm_cfc_2024/rita-cfc-2024/ai/data_processing/processed_data/course_plan/chapter{i}.json"
        with open(path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        data[0]["tags"] = [f"第{i}單元", f"chapter{i}"]
        with open(path, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=4)


def combineJson():
    import json


# Define the file path pattern
file_pattern = "data_processing/processed_data/course_plan/chapter{}.json"

# Initialize an empty list to store the combined data
combined_data = []

# Loop through the range 1 to 10 to load each JSON file
for i in range(1, 11):
    file_path = file_pattern.format(i)
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            # Assuming each file is a list containing one dictionary, we extend the combined list
            combined_data.extend(data)
    else:
        print(f"File {file_path} does not exist.")

    # Define the path for the combined JSON file
    combined_file_path = "data_processing/processed_data/course_plan/combined_chapters.json"

    # Write the combined data to the new JSON file
    with open(combined_file_path, 'w', encoding='utf-8') as combined_file:
        json.dump(combined_data, combined_file, ensure_ascii=False, indent=4)

    print(f"Combined JSON file has been saved to {combined_file_path}")
