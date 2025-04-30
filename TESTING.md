# TESTING.md

This document describes the testing approach for the Chrome Extension project, focusing on two areas: Interface Testing and Prompt Testing.

---

## 1. Interface Testing

**Approach:**  
We use a combination of automated and manual testing.

- **Automated:**  
  - React components are tested using Jest and React Testing Library.
  - Example: `App.test.tsx` verifies that the main heading and the Hello component render as expected.
  - Chrome APIs are mocked using [sinon-chrome](https://github.com/acvetkov/sinon-chrome) and [jest-sinon](https://github.com/djkf/jest-sinon) as described in the [README.md](README.md#mocking-chrome-apis).

- **Manual:**  
  - Manual walkthroughs are performed to verify UI flows, such as adding/removing skills, generating cover letters, and summarizing job descriptions.
  - Steps include:
    1. Launch the extension.
    2. Enter a job description.
    3. Click "Generate Cover Letter" and verify output.
    4. Click "Summarize Job Description" and verify summary.
    5. Add/remove skills and check updates in the UI.

---

## 2. Prompt Testing

**Model Used:**  
- Google Gemini API (`gemini-2.0-flash`)

### Test Case 1: Cover Letter Generation

- **Input:**  
        Our Company

        Changing the world through digital experiences is what Adobe’s all about. We give everyone—from emerging artists to global brands—everything they need to design and deliver exceptional digital experiences! We’re passionate about empowering people to create beautiful and powerful images, videos, and apps, and transform how companies interact with customers across every screen. 

        We’re on a mission to hire the very best and are committed to creating exceptional employee experiences where everyone is respected and has access to equal opportunity. We realize that new ideas can come from everywhere in the organization, and we know the next big idea could be yours!


        

        Adobe Journey Optimizer is a single application for managing scheduled cross-channel campaigns and trigger-based one-to-one engagement for millions of customers —and the entire journey is optimized with intelligent decisioning and insights.

        We are seeking an experienced engineer to lead in the development and apply AI in Journey Optimizer.

        What you’ll do:

        You’ll design, develop, debug, provide effort estimation and risk analysis of a project/feature/service.
        You’ll perform due diligence and implement comprehensive unit tests for confirming the use cases.
        You’ll develop automated tests and help the team achieve and maintain full CI/CD for fast and efficient releases.
        You’ll be part of a multi-functional development team with exposure to deep platform architecture across the stack, and you’ll collaborate across teams on large projects.
        You’ll work in an agile, DevOps-oriented culture with a focus on maintaining operational excellence while delivering with high velocity.
        What you need to succeed:

        Strong understanding of large language models (LLMs), Retrieval-Augmented Generation (RAG), AI agents, and familiarity with widely used AI/ML frameworks.
        Strong skills in managing and processing large datasets, ensuring data quality and integrity for training and fine-tuning models, as well as for generating embeddings.
        Expertise in fine-tuning pre-trained models to suit specific business needs, ensuring optimal performance and relevance.
        Build and refine methods for capturing semantic information about business entities using large language models (LLMs).
        Generate embeddings from semantic information to enhance understanding of commerce activities, customer behaviors and journeys.
        Hands-on experience in deploying AI/ML solutions in production environments, including integrating LLM-based systems with existing software and infrastructure.
        Expertise in monitoring model performance post-deployment and implementing optimizations to maintain or improve accuracy, speed, and resource efficiency.
        Proficiency in React, JavaScript, GraphQL, HTML, CSS and at least one other language like Java and Kotlin.
        Expert knowledge of web and browser technologies: HTTP/s, cookies, security, cross-site scripting, CDNs, serverless computing, DOM, rendering engines, browser storage.
        Strong knowledge of networking principles, HTTP, REST and other client/server technologies.
        Experience building or working with microservice-based distributed systems in the cloud.
        Excellent problem solving and debugging skills, and direct experience with DevOps in a SaaS environment.
        Customer focused and have real passion for quality and engineering excellence at scale.
        Excellent communication and collaboration skills.
        Undergraduate/Graduate degree in quantitative sciences/engineering disciplines.
        5+ years of experience in design and development of software systems.
        Our compensation reflects the cost of labor across several  U.S. geographic markets, and we pay differently based on those defined markets. The U.S. pay range for this position is $153,600 -- $286,600 annually. Pay within this range varies by work location and may also depend on job-related knowledge, skills, and experience. Your recruiter can share more about the specific salary range for the job location during the hiring process.
        At Adobe, for sales roles starting salaries are expressed as total target compensation (TTC = base + commission), and short-term incentives are in the form of sales commission plans.  Non-sales roles starting salaries are expressed as base salary and short-term incentives are in the form of the Annual Incentive Plan (AIP).
- **Prompt Sent:**  
  ```
  You are a helpful assistant that writes cover letters.

  Write a professional cover letter based on this job description: {Input job description}
  ```
- **Expected Output:**  
  A professional cover letter referencing React, TypeScript, cloud APIs, communication, and teamwork.
- **Current Behavior:**  
        [Your Name]
        [Your Address]
        [Your Phone Number]
        [Your Email Address]

        [Date]

        [Hiring Manager Name (If you know it)]
        [Hiring Manager Title]
        Adobe
        [Company Address]

        Dear [Hiring Manager Name],

        I am writing to express my enthusiastic interest in the AI Engineer position within Adobe Journey Optimizer, as advertised on [Platform where you saw the job posting].  Adobe's commitment to empowering creators and transforming digital experiences deeply resonates with my own passion for leveraging cutting-edge technology, particularly AI, to solve complex problems and drive innovation.

        With over 5 years of experience in software design and development, and a strong foundation in artificial intelligence and machine learning, I am confident I possess the skills and experience necessary to excel in this role and contribute significantly to the Journey Optimizer team. My expertise includes:

        *   **Deep understanding of LLMs, RAG, and AI Agents:** I have hands-on experience building and deploying solutions utilizing these technologies, including fine-tuning pre-trained models for specific business needs.
        *   **Large Dataset Management:** I am proficient in managing and processing large datasets, ensuring data quality and integrity for model training and embedding generation.  I have a proven track record of developing methods to capture semantic information and generate embeddings to enhance understanding of customer behaviors and journeys.
        *   **Production Deployment of AI/ML Solutions:**  I have extensive experience deploying AI/ML solutions in production environments, integrating LLM-based systems with existing software infrastructure and monitoring model performance to ensure optimal accuracy and efficiency.
        *   **Proficiency in relevant technologies:** My expertise in React, JavaScript, GraphQL, HTML, CSS, Java, and Kotlin, coupled with my strong knowledge of web and browser technologies, and experience with microservice-based distributed systems in the cloud, allows me to seamlessly integrate AI solutions within the existing Adobe ecosystem.

        In my previous role at [Previous Company Name], I [ Briefly describe a relevant accomplishment demonstrating your AI/ML expertise and impact.  Quantify the impact if possible.  For example: "led the development of an AI-powered recommendation engine that increased user engagement by 15%."].  This experience, along with my strong problem-solving skills, debugging abilities, and experience with DevOps in a SaaS environment, makes me well-prepared to contribute to the fast-paced, agile environment at Adobe.

        I am particularly drawn to the opportunity to work within a team focused on optimizing customer journeys with intelligent decisioning and insights. The prospect of applying my AI/ML skills to enhance the Journey Optimizer platform and contribute to Adobe's mission of transforming digital experiences is incredibly exciting.

        Thank you for considering my application. I have attached my resume for your review and welcome the opportunity to discuss my qualifications further in an interview.

        Sincerely,
        [Your Name]


---

### Test Case 2: Job Description Summarization

- **Input job description:**  

        Senior Director, Category Management & Promotions

        Job Description

        Bring your expertise and passion for retail to the LEGO® Retail Marketing team to help us reach more fans and bring them the best product range, value proposition and shopping experience!

        This highly analytical and strategic role will be at the heart of ensuring we have an ever stronger shopper-value proposition across all our product categories within LEGO® Retail globally (stores and online). This is a leadership position that will be responsible for leading an outstanding team to deliver the ultimate experience in LEGO branded channels.

        We're pleased to share that we offer a hybrid working week arrangement called Best of Both, requiring 3 days in the office location in London and 2 days from home.

        Core Responsibilities 

        Accountable for the retail category strategy across owned channels to deliver enhanced performance, spend efficiency and to support our retail growth journey.

        Lead the development of business and category plans, drive market penetration plans, and product positioning to drive competitive advantage, revenue and profit.

        Own and Define Promotion Strategy: Shape the mid to long-term vision, goals, and tactical strategies for LEGO® Retail, with a focus on driving Omni and store-based initiatives. Tailor and optimize the approach by region, understanding channel mechanics to maximize impact.

        Supported refinement and delivery of Integrated commercial plan across consumer group and themes

        Drive market research and competitor analysis activity, in order to identify and better serve shoppers’ needs (parents, adults, children).

        Drive critical Product insights and recommendations to the Global Product Marketing teams, ensuring an optimal LEGO® Retail product proposition is created through relevant decision gates

        Do you have what it takes?

        Extensive experience in category and promotion management senior leadership.

        Consistent track record in leading and building teams to ensure organisational efficiency through effective motivation, training and development.

        Experience working in a global business with strong multi-geographical teams.

        Advanced analytical skills, data-driven way of working, solution driven and result oriented, strong business orientation.

        Extensive experience in product information management, category management and business development.

        Strong project and portfolio management experience.

        Excellent influencer and natural collaborator/team leader.

        Holistic thinker – establish and drive end-to-end strategies and initiatives encompassing multiple functions.

        Proficiency in English, written and verbal, is required.
- **Prompt Sent:**  
  ```
  You are a helpful assistant that summarizes job descriptions for job seekers.

  Summarize the following job description in 3-4 sentences: {Input job description}
  ```
- **Expected Output:**  
    A concise summary (3-4 sentences) highlighting the marketing focus, digital campaigns, data analysis, collaboration, and required tools.
- **Current Behavior:**  
    This leadership role as Senior Director of Category Management & Promotions at LEGO Retail is responsible for developing and executing retail category and promotion strategies across all LEGO-owned channels globally to enhance performance and drive growth. The role involves leading a team, conducting market research, providing product insights, and collaborating with global teams to optimize the LEGO Retail product proposition. The ideal candidate will have extensive experience in category and promotion management, strong analytical skills, and a proven track record of leading and developing teams within a global business context.


---

**Note:**  
Both prompt features are tested by entering sample job descriptions in the UI and verifying that the outputs are relevant, well-structured, and error-free. Edge cases (empty input, very long descriptions) are also tested manually.

---