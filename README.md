# Club App Backend

This is the backend for the club event management application developed using Dart and Flutter. The backend is developed using Node.js and Express.js, and it uses MongoDB as the database.

## Features

1. **User Verification**: All users must verify with google token id before login. This is to ensure that the user is a real person and not a bot.
2. **Highly Secure**: The backend is secured with JWT tokens. The tokens are generated when the user logs in and are used to authenticate the user for further requests.
3. **User Roles**: The backend verifies the user role and rights before processing any request. So the user can only access the resources they are allowed to.

## Setup and Local Development

Follow these steps to setup and run the backend locally:

1. **Clone the Repository**: First, clone the repository to your local machine using the following command:

    ```bash
    git clone https://github.com/SKGEzhil/club-app-backend.git
    ```
   
2. **Install Node.js**: If you haven't already, install Node.js on your machine. You can download the installer from the official Node.js website.
3. **Install MongoDB**: Install MongoDB on your machine. You can download the installer from the official MongoDB website.
4. **Get Dependencies**: Navigate to the project directory in your terminal and run the following command to get the necessary dependencies:

    ```bash
    npm install
    ```
   
5. **Environment Variables**: Add the following environment variables:

    ```bash
   JWT_SECRET=your_secret_key
   ```
   
6. **Run the Server**: Run the following command to start the server:

    ```bash
    npm start
    ```
   

   