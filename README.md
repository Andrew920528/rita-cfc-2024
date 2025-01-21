# Rita - AI Teaching Assistant

## :star2: UPDATES

### 2025/1/26

Thank you for visiting this repository!

Our team is excited to announce that we are currently working on this project privately, with the vision of transforming it into a startup aimed at enhancing education accessibility. This will involve developing a more polished and impactful version of the concepts showcased here.

We believe in the potential of this project to make a meaningful difference in education, and we invite you to join us on this journey.

To stay updated on our progress and future announcements, follow me on [LinkedIn](https://www.linkedin.com/in/andrew-hsu-71b020/).

Thank you for your interest and support!

### 2025/1/20

English support is added.

### 2024/11/2

We have successfully deployed our app for beta testing! Please come to this link: [https://rita-beta.up.railway.app/](https://rita-beta.up.railway.app/).

We have provided an account for you to try it out:

username: `RITACFC2024`

pw: `RITACFC2024`

Or, feel free to create your own account by clicking "建立帳號" at the bottom of the log in page!

## :purple_heart: Table of Contents

- [Project summary](#project-summary)
  - [The issue we are hoping to solve](#the-issue-we-are-hoping-to-solve)
  - [How our technology solution can help](#how-our-technology-solution-can-help)
  - [Our idea](#our-idea)
- [Technology implementation](#technology-implementation)
  - [IBM watsonx product(s) used](#ibm-watsonx-products-used)
  - [Other IBM technology used](#other-ibm-technology-used)
  - [Solution architecture](#solution-architecture)
- [Presentation materials](#presentation-materials)
  - [Solution demo video](#solution-demo-video)
  - [Project development roadmap](#project-development-roadmap)
- [Additional details](#additional-details)
  - [How to run the project](#how-to-run-the-project)
  - [Live demo](#live-demo)

## :purple_heart: Project summary

### The issue we are hoping to solve

There is a disparity in available resources between different schools, which affects teachers' abilities to prepare effective lessons. Teachers in rural schools have fewer colleagues to consult while having to teach classes in various subjects. Despite the abundance of online resources, it is difficult for teachers to navigate and organize all the information needed for classes.

### How our technology solution can help

Watsonx.ai-powered assistant that provides interactive course planning experiences.

### Our idea

Our team is made up of five Taiwanese students currently pursuing our education in the United States. Having traveled across the Pacific to seek the best academic opportunities, we deeply understand the value of education. With this in mind, we are committed to bringing the knowledge and experiences we've gained here back to Taiwan, with the goal of helping to address education inequality in our home country.

**Problem Statement:**
Through our interviews with twelve elementary school teachers from Taiwan, we discovered significant discrepancies in resources when teachers prepare courses. For example, teachers in well-resourced schools can easily obtain relevant extra materials, worksheets, and notes from colleagues. In contrast, teachers in under-resourced schools, particularly those who are inexperienced, face several challenges:
The need to prepare for teaching subjects they were not trained to teach due to teacher shortages.
The low number of teachers reduces opportunities to discuss course content with peers.
The need to spend considerable amounts of time organizing vast online resources.

**Why Our Solution Can Help:**
As such, a more sophisticated course planning tool that provides discussion capabilities and materials can bridge the gap of class planning amongst schools with varying resource levels. We not only researched common course planning practices, but also revised our features from the feedback given during demos with teachers. Our end product, which we named Rita, is not just another language model wrapper, but a tool that redefines the course planning process with a new user experience.

**Features:**
Through our user interface, users can manually customize the dashboard with predefined tools called widgets for each class to plan classes. Users can also choose to converse with Rita to automatically accomplish these common course-planning tasks:

1. Generate a semester-long plan based on specific textbooks.
2. Recommend key learning objectives through conversation with the user.
3. Search verified videos that are relevant to the subject being taught.
4. Generate worksheets and questions to test student understanding.

For feature details and their current limitation, please refer to [this document](https://docs.google.com/document/d/1FSf4swprNvd4V2dWTQ28K49oih-5wg9wwJxI-5eTkJk/edit?tab=t.0)

**Technical Concepts and Benefits:**
Our team used Watsonx.ai and Langchain to orchestrate our AI system. Being a Taiwan-based project, we used a multilingual-based Large Language Model (LLM) to allow users to interact with our system in both English and Chinese. Using Retrieval Augmented Generation (RAG), we allowed Rita to interact with users based on information from the specified textbooks. Rita has access to chat history and context of lectures, allowing users to directly refer to content through phrases such as “chapter 2”, “this week”, instead of the lengthy “concepts in fraction multiplication for 5th graders”.

To see the detail implementation of our ai system, please refer to [this document](https://docs.google.com/document/d/1gaajXZ1rThH_nbuSNh4QiEwqpYV7OD_akKKs73_praM/edit?usp=sharing)

While our targeted community is new educators at under-resourced institutions, Rita can be used by tutors, online teachers, and any educators to design a well-planned course. Good education is built upon good planning, and we believe our ai agent Rita provides a revolutionary experience in making course planning more accessible and effective.

## :purple_heart: Technology implementation

### IBM watsonx product(s) used

**Featured watsonx products**

- [Watsonx.ai](https://www.ibm.com/products/watsonx-ai) (Llama 3 model): We utilized Watsonx.ai to generate suggestions, notes, and worksheets that assist teachers in course planning. Specifically, we employed Retrieval-Augmented Generation (RAG) to fine-tune the model, allowing it to retrieve and provide tailored information about specific textbooks and subjects.

### Other IBM technology used

**Additional IBM AI services**

- [Carbon design system](https://carbondesignsystem.com/) - Uses the carbon design guidelines and icons to build our react GUI

### Solution architecture

**Our system design**

![system architechture](https://drive.google.com/uc?id=1St1z9UefzqMw2v-Thacw2x1vpHBUm7I8)

**The AI workflow**

Our AI system design is upgraded multiple times throughout the iterations to address different issues. To learn more about our ai design and why certain changes are made, please see [this document](https://docs.google.com/document/d/1gaajXZ1rThH_nbuSNh4QiEwqpYV7OD_akKKs73_praM/edit?usp=sharing). Here is our current system:

![ai design](https://drive.google.com/uc?id=1aV1LpqEJ7zEysPh8ETP5eSh1OPPy9B8Y)

## :purple_heart: Presentation materials

### Solution demo video

[![Watch the video](https://img.youtube.com/vi/spGOiM32nGE/0.jpg)](https://www.youtube.com/watch?v=spGOiM32nGE)

### Project development roadmap

**AI**

To see a detail list of key ai features and their current limitations, please see [this document](https://docs.google.com/document/d/1FSf4swprNvd4V2dWTQ28K49oih-5wg9wwJxI-5eTkJk/edit?usp=drive_link).

- Generates worksheet of a given topic and formats them properly.
- Searches for relevant videos for teachers to teach.
- Generates a semester schedule with suggested activity based on textbook.
- Suggest key learning objective based on discussion with the user.

**APP**

- Users are able to customize their dashboard for different classes with interactive drag-and-drop.
- Users are able to create an account and store all their progress.
- Worksheets and semester plan can be outputted as `.docx`, `.pdf`, and `.xlsx` for the user to further edit them.
- Complete functionality (no dummy buttons) and full integration with database.

Past milestones:

![Roadmap](https://drive.google.com/uc?id=1_91VqXKG8fYhD_dyW_BYGmodPPT2yQQB)

In the coming future, our main focus will be on further improving our AI system to provide a more detailed and personalized experience. This includes:

1. Able to retrieve and summarize news and articles by searching on the internet.
2. Reflect the number of class per week accurately when creating semester/ weekly plan.
3. Improved model's Chinese comprehension ability (possibly by using a more advanced base model)

Our long term goal would be to expand our database to support more subjects and publishers.

## :purple_heart: Additional details

### How to run the project

Please come to this link: [https://rita-beta.up.railway.app/](https://rita-beta.up.railway.app/).

We have provided an account for you to try it out:

username: `RITACFC2024`

pw: `RITACFC2024`

If you want to test this locally, visit https://github.com/Andrew920528/rita-cfc-2024/blob/main/DEV_GUIDE.md for details

##### If you have any questions, please contact us at *andrewhsu.0528@gmail.com*
