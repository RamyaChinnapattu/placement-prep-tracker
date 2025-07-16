
Built by https://www.blackbox.ai

---

# Placement Prep Tracker

## Project Overview
The **Placement Prep Tracker** is a web-based application designed to help users organize and prepare for job placements. It offers features such as authentication, topic tracking, daily goal management, scheduling mock interviews, and analytics to help users stay on top of their preparation activities. The intuitive dashboard provides a consolidated view of progress across different preparation topics, ensuring that users can manage their study time effectively.

## Installation
To run the Placement Prep Tracker locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/placement-prep-tracker.git
   cd placement-prep-tracker
   ```

2. **Open the project in a web browser**: 
   Simply open the `index.html` file with your preferred web browser.

3. (Optional) **Use a local server**:
   If you want to run a local server (recommended for certain features), you can use:
   - **Python**:
     ```bash
     python -m http.server 8000
     ```
   - **Node.js** (using `http-server`):
     ```bash
     npx http-server .
     ```

## Usage
1. Navigate to the **Login** page (`index.html`) to sign in or create a new account using the sign-up option.
2. After logging in, you'll be directed to the **Dashboard** (`dashboard.html`) where you can manage your study topics, daily goals, and the resources needed for your preparation.
3. Use the sidebar on the left to navigate between the sections of the application.

## Features
- **User Authentication**: Secure login and signup functionality.
- **Topic Tracker**: Track your progress in various topics like Data Structures & Algorithms (DSA), Quantitative Aptitude, and Computer Science fundamentals.
- **Daily Planner**: Set and manage daily and weekly preparation goals.
- **Mock Interview Scheduler**: Schedule mock interviews and receive feedback.
- **Resource Organizer**: Add and manage different resources (links, documents) for revision.
- **Analytics Dashboard**: Visual insights on topics completed, consistency streak, and overall progress.

## Dependencies
The project does not use any external libraries or frameworks as reflected in the provided files. All functionalities are implemented using vanilla JavaScript, HTML, and CSS.

## Project Structure
The project consists of the following main files:

```
.
├── index.html          # Login and Signup page
├── dashboard.html      # Main dashboard after user authentication
├── styles.css          # CSS styles for the application
├── auth.js             # JavaScript file for authentication logic
├── script.js           # Main JavaScript for application functionalities
```

Feel free to modify the platform according to your needs. Contributions and improvements to the project are welcome!