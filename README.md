<p align="center"> <img src="src/assets/bats_logo.png" width="350"> </p>

<h1 align="center" style="font-weight: bold;">BATS</h1>

<h1 align="center"> Binary Arithmetic Teaching System </h1>

<p align="center"> <img src="https://img.shields.io/badge/Universität Duisburg Essen-Advanced Web technologies-blue"/> </p>

<p align="center"> <a href="">Video Demo</a> - <a href="https://uni-project-bats-2d2ac9526513.herokuapp.com">Live Demo </a> </p>

# 🦇 Introduction

You don't know how to deal with binary numbers? No worries, BATS will help you! BATS provides theoretical information as well as automatically generated and evaluated exercises in order to help you learn binary conversion, decimal conversion, binary arithmetic and logical operators.

# 🧰 Features

BATS teaches binary conversion, decimal conversion, logical operations and binary arithmetic by providing features like

✅ theoretical explanations for each topic

✅ randomly generated exercises

✅ progressive feedback to incorrect answers with, for example, hints and calculation steps

✅ timed quizzes that allow you to compete with other users

✅ showcases your best quiz performance on a leaderboard alongside other users

# 🔨 Installation

This project was done with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.2 as well as express.js.

If you want to install a local version of BATS, make sure to first install Angular 18.0.2 and express.js.

Then you can install the frontend by running the command-line command `npm install` in the root folder of BATS.

After running the command in the root folder, change to the backend folder, and run `npm install` again.

Last step is to set up the database.

# Using a local MongoDB

1. Install MongoDB on  your machine.

https://www.mongodb.com/docs/manual/installation/

2. In the backend folder create .env file with 2 variables like in the example:
```
MONGO_URL=mongodb://localhost:27017/myLocalDatabase
SECRET_KEY = MySecretKey
```

3. Start MongoDB and pay attention to the port.

# Using a remote MongoDB

1. Create a Mongo Atlas account. 

https://www.mongodb.com/products/platform/atlas-database

2. Create a special user.
3. Copy the generated URL into the env file described in the previous section.

## 🚀 Start the app

Run `ng serve` in the root folder of BATS in order to start the frontend.

Now open another terminal, change into the backend folder and run `nodemon server.js`.

Afterward you can open `http://localhost:4200/` and use BATS locally.

## 🖼️ Screenshots 

![screenshotsGroup1](https://github.com/user-attachments/assets/08a7023e-aa24-4962-ba51-7462970dffc1)



![screenshotsGroup2](https://github.com/user-attachments/assets/116837a8-932e-4ea6-957b-710579decfd1)



![screenshotsGroup3](https://github.com/user-attachments/assets/ed0b04c8-92b3-4f5c-9bff-88047780b627)



![screenshotsGroup4](https://github.com/user-attachments/assets/30a5711d-2fea-49b2-a478-646f2495127a)



![screenshotsGroup5](https://github.com/user-attachments/assets/a6143465-24fc-47ce-a0f3-f51e8e1f8f63)



## 🧱 Technical architecture 

![meanstack](https://github.com/user-attachments/assets/135dced0-068d-4fad-b665-3bbae2d2740a)
[Image reference](https://www.practicallogix.com/building-web-applications-with-mean-stack/)


## 🔎 Technologies 

**Frontend:**

- [Angular 18](https://angular.dev/)

- [Tailwindcss](https://tailwindcss.com/)

- [daisyUI](https://daisyui.com/)

**Backend:**

- [Node.js](https://nodejs.org/en)

- [Express](https://expressjs.com/de/)

**Database:**

- [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database)

**Deployment:**

- [Heroku](https://dashboard.heroku.com/)

## 📈 Contributors
BATS was created by the group BEEF (Bringing Education Everywhere for Free) with the members
- 🧑‍💻 [@khoffschlag](https://github.com/khoffschlag)
- 👩‍💻 [@Ula-MK](https://github.com/Ula-MK)
- 👩‍💻 [@nikabogd](https://github.com/nikabogd)

![beef_with_white_background](https://github.com/user-attachments/assets/e46f6d5c-e493-4b54-ac08-f80daf1d4ce9)
