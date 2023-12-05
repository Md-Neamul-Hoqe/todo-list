# [To-Do](https://tourist-guides-mnh.web.app) 
---
[Github Link](https://github.com/Md-Neamul-Hoqe/todo-list)

Effortlessly manage your tasks with our intuitive Todo List site. Stay organized, prioritize your activities, and track your progress efficiently. Create, edit, and complete tasks with ease while staying focused on what matters most. Whether it's personal chores, work-related assignments, or project management, our user-friendly interface helps you stay on top of your tasks, boosting productivity and bringing peace of mind to your daily routine.

## Project Structure

- `src/`: Contains the source code for the project.
- `public/`: Some assets [like Logo].

## Key Features

### Users
- **Due Dates & Reminders**: Add due dates and receive reminders for approaching deadlines.
- **Search & Filtering**: Search for specific tasks by title.
- **Task Management**: Create, Edit, Delete and manage tasks effortlessly.
- **Notes & Descriptions**: Add additional details and descriptions to tasks for better clarity.
- **User Authentication**: Secure user accounts with authentication mechanisms.
- **Responsive Design**: Ensure compatibility and usability across multiple devices.

### General Features
- **Warning Prompts**: Users receive warnings about the potential impact of their actions before confirming.

### Package Usage Breakdown:

1. **`@tanstack/react-query`**: Used for managing server state in React components, especially for API data fetching and state management.

2. **`animate.css`**: Utilized for adding CSS-based animations and transitions to enhance user experience.

3. **`axios`**: Used for making HTTP requests from the client-side to interact with the backend server or external APIs.

4. **`firebase`**: Employed for integrating Firebase services like authentication, real-time database, storage, etc., offering a backend-as-a-service (BaaS) solution.

5. **`localforage`**: Utilized for offline storage and caching data in the user's browser, providing persistent storage capabilities.

6. **`match-sorter`**: Used for client-side filtering and sorting of arrays or lists, especially helpful in searching and organizing data in UI components.

7. **`moment` & `moment-timezone`**: Utilized for parsing, manipulating, and formatting dates and times, providing functionalities for time zone handling and date formatting.

8. **`react-moment`**: React wrapper for `moment`, used for displaying and formatting dates and times within React components.

9. **`react-helmet-async`**: Employed for managing document head metadata in React applications dynamically.

10. **`react-hook-form`**: Used for handling forms in React components, providing form validation, state management, and form submission functionalities through hooks.

11. **`react-icons`**: Utilized for integrating and displaying icons within React components from popular icon libraries.

12. **`react-loader-spinner`**: Used for displaying loading spinners or indicators in React components to indicate ongoing background processes or data fetching.

13. **`react-router-dom`**: Employed for client-side routing and navigation in React applications.

14. **`react-select`**: Used for creating customizable, dropdown-select components in React applications.

15. **`sort-by`**: Utilized for sorting arrays or collections based on specific criteria or keys.

16. **`sweetalert2`**: Used for displaying customizable, user-friendly alerts, prompts, and dialogs in the application.

These packages encompass various functionalities such as state management, HTTP requests, UI enhancements, date manipulation, form handling, routing, and more, contributing to different aspects and features of the web application.

## Installation

1. Clone the repository:

for front end:

```bash
git clone https://github.com/Md-Neamul-Hoqe/todo-list.git
```

for backend:

```bash
git clone https://github.com/Md-Neamul-Hoqe/todo-list-server.git
```

2. Install dependencies: [before installation please check the folder name like "todo-list-server" (may suffix with main)]

For frontend:

```bash
cd todo-list
npm install
```

For backend:

```bash
cd todo-list-server
npm install
```

For security keys I used dotenv file. you need add yours own to backend as named `URI`, `DB_NAME`, `ACCESS_TOKEN_SECRET`, `Payment_SECRET` and for front end as named `VITE_apiKey`, `VITE_authDomain`, `VITE_projectId`, `VITE_storageBucket`, `VITE_messagingSenderId`, `VITE_appId` in env file.

## Usage

To start the development server locally:

For front end:

```bash
npm run dev
```

This will run the application in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

For backend:

```bash
npm start
```

## Build

To create a production build:

```bash
npm run build
```

This will generate optimized production-ready files in the `dist/` directory.

## Deployment

You can deploy this project to your hosting platform of choice. Ensure to configure your deployment settings based on the chosen hosting service. Here I deployed my front end to firebase and backend to vercel.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
