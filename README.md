# Rita - AI Teaching Assistant

- [Project summary](#project-summary)
  - [The issue we are hoping to solve](#the-issue-we-are-hoping-to-solve)
  - [How our technology solution can help](#how-our-technology-solution-can-help)
  - [Our idea](#our-idea)
- [Technology implementation](#technology-implementation)
  - [IBM watsonx product(s) used](#ibm-ai-services-used)
  - [Other IBM technology used](#other-ibm-technology-used)
  - [Solution architecture](#solution-architecture)
- [Presentation materials](#presentation-materials)
  - [Solution demo video](#solution-demo-video)
  - [Project development roadmap](#project-development-roadmap)
- [Additional details](#additional-details)
  - [How to run the project](#how-to-run-the-project)
  - [Live demo](#live-demo)
- [About this template](#about-this-template)
  - [Contributing](#contributing)
  - [Versioning](#versioning)
  - [Authors](#authors)
  - [License](#license)
  - [Acknowledgments](#acknowledgments)

## Project summary

### The issue we are hoping to solve

There is a disparity in available resources between different schools, which affects teachers' abilities to prepare effective lessons. Teachers in rural schools have fewer colleagues to consult while having to teach classes in various subjects. Despite the abundance of online resources, it is difficult for teachers to navigate and organize all the information needed for classes.

### How our technology solution can help

Watsonx.ai-powered assistant that provides interactive course planning experiences.

### Our idea

Our team consists of five computer science students who are passionate about addressing the education inequality issues in Taiwan through technology.

**Problem Statement**
Through our interviews with twelve elementary school teachers from Taiwan, we discovered significant discrepancies in resources when teachers prepare courses. For example, teachers in well-resourced schools can easily obtain relevant extra materials, worksheets, and notes from colleagues. In contrast, teachers in under-resourced schools, particularly those who are inexperienced, face several challenges:
The need to prepare for teaching subjects they were not trained to teach due to teacher shortages.
The low number of teachers reduces opportunities to discuss course content with peers.
The need to spend considerable amounts of time organizing vast online resources.

**Why Our Solution Can Help**
As such, a more sophisticated course planning tool that provides discussion capabilities and materials can bridge the gap of class planning amongst schools with varying resource levels. We not only researched common course planning practices, but also revised our features from the feedback given during demos with teachers. Our end product, which we named Rita, is not just another language model wrapper, but a tool that redefines the course planning process with a new user experience.

**Features**
Through our user interface, users can manually customize the dashboard with predefined tools called widgets for each class to plan classes. Users can also choose to converse with Rita to automatically accomplish these common course-planning tasks:

1. Generate a semester-long plan based on specific textbooks.
2. Recommend key learning objectives through conversation with the user.
3. Search verified videos that are relevant to the subject being taught.
4. Generate worksheets and questions to test student understanding.
   For feature details and their current limitation, please refer to [this document](https://docs.google.com/document/d/1FSf4swprNvd4V2dWTQ28K49oih-5wg9wwJxI-5eTkJk/edit?tab=t.0)

**Technical Concepts and Benefits**
Our team used Watsonx.ai and Langchain to orchestrate our AI system. Being a Taiwan-based project, we used a multilingual-based Large Language Model (LLM) to allow users to interact with our system in both English and Chinese. Using Retrieval Augmented Generation (RAG), we allowed Rita to interact with users based on information from the specified textbooks. Rita has access to chat history and context of lectures, allowing users to directly refer to content through phrases such as “chapter 2”, “this week”, instead of the lengthy “concepts in fraction multiplication for 5th graders”.

While our targeted community is new educators at under-resourced institutions, Rita can be used by tutors, online teachers, and any educators to design a well-planned course. Good education is built upon good planning, and we believe our ai agent Rita provides a revolutionary experience in making course planning more accessible and effective.

## Technology implementation

### IBM watsonx product(s) used

**Featured watsonx products**

- [Watsonx.ai](https://www.ibm.com/products/watsonx-ai) (Llama 3 model): We utilized Watsonx.ai to generate suggestions, notes, and worksheets that assist teachers in course planning. Specifically, we employed Retrieval-Augmented Generation (RAG) to fine-tune the model, allowing it to retrieve and provide tailored information about specific textbooks and subjects.

### Other IBM technology used

**Additional IBM AI services**

- [Carbon design system](https://carbondesignsystem.com/) - Uses the carbon design guidelines and icons to build our react GUI

### Solution architecture

REPLACE THIS EXAMPLE WITH YOUR OWN, OR REMOVE THIS EXAMPLE

Diagram and step-by-step description of the flow of our solution:

![Video transcription/translaftion app](https://drive.google.com/uc?id=1St1z9UefzqMw2v-Thacw2x1vpHBUm7I8)

1. The user navigates to the site and uploads a video file.
2. Watson Speech to Text processes the audio and extracts the text.
3. Watson Translation (optionally) can translate the text to the desired language.
4. The app stores the translated text as a document within Object Storage.

## Presentation materials

### Solution demo video

[![Watch the video](https://raw.githubusercontent.com/Liquid-Prep/Liquid-Prep/main/images/readme/IBM-interview-video-image.png)](https://youtu.be/vOgCOoy_Bx0)

### Project development roadmap

The project currently does the following things.

- Feature 1
- Feature 2
- Feature 3

In the future we plan to...

See below for our proposed schedule on next steps after Call for Code 2024 submission.

![Roadmap](./images/roadmap.jpg)

## Additional details

### How to run the project

INSTRUCTIONS: In this section you add the instructions to run your project on your local machine for development and testing purposes. You can also add instructions on how to deploy the project in production.

### Live demo

You can find a running system to test at...

See our [description document](./docs/DESCRIPTION.md) for log in credentials.

## If you have any questions, please contact us at *andrewhsu.0528@gmail.com*
