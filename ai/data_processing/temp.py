import os
import json

# a messy space for quick and random data processing


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
        number_to_chinese = {
            1: '一',
            2: '二',
            3: '三',
            4: '四',
            5: '五',
            6: '六',
            7: '七',
            8: '八',
            9: '九',
            10: '十'
        }
        number_to_english = {
            1: "one",
            2: "two",
            3: "three",
            4: "four",
            5: "five",
            6: "six",
            7: "seven",
            8: "eight",
            9: "nine",
            10: "ten"
        }

        data[0]["tags"].extend(
            [f"第{number_to_chinese[i]}單元", f"chapter {number_to_english[i]}"])
        with open(path, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=4)


modifyJson()


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
