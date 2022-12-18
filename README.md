# Nutri
<p align="center">
  <img height='1200px' width='850px' src="static/images/bg_photo_en.png?raw=true" alt="Nutri"/>
</p>

> Nutri is an web app created for people who want to learn more about their nutrition and the exercises they do. <br>

Live demo <br>
• [English](https://nutri-django.herokuapp.com/en/) <br>
• [Polish](https://nutri-django.herokuapp.com/pl/)

## Table of Contents
* [General Info](#general-information)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Screenshots](#screenshots)
* [Setup](#setup)
* [Usage](#usage)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)
<!-- * [License](#license) -->


## General Information
Nutri is an app created for people who want to learn more about their nutrition and the exercises they do.<br>
It allows you to add the meals you have eaten and the exercises you have done during the day.
You can do this by searching for items manually, or create templates to do it more efficiently.

Nutri allows all users to enter exercises, ingredients or recipes that are not currently in the database.
This can be accomplished by filling out forms manually or by using a barcode (ingredient entry). <br>
The application tracks all changes in your body, that is, it allows you to enter measurements of your body, the changes of which can be visualized with dynamic graphs (daily, weekly, monthly and yearly) <br>

Visualization Examples <br>
1.
![name](static/images/dashboard_readme.png)
2.
![name](static/images/graph_nutri.png)



## Technologies Used
- <img src="https://github.com/devicons/devicon/blob/master/icons/python/python-original.svg" title="Python" alt="Python" width="20" height="20" align='center'/> Python 3.10.4 &nbsp;
- <img src="https://github.com/devicons/devicon/blob/master/icons/django/django-plain.svg" title="Django" alt="Django" width="20" height="20" align='center'/> Django 4.1.2 &nbsp;
- <img src="https://github.com/devicons/devicon/blob/master/icons/html5/html5-original-wordmark.svg" title="HTML5" alt="HTML5" width="20" height="20" align='center'/> HTML5&nbsp;
- <img src="https://github.com/devicons/devicon/blob/master/icons/sass/sass-original.svg" title="SASS" alt="SASS" width="20" height="20" align='center'/> SASS&nbsp;
- <img src="https://github.com/devicons/devicon/blob/master/icons/css3/css3-original-wordmark.svg" title="CSS" alt="CSS" width="20" height="20" align='center'/> CSS3&nbsp;
- <img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" title="JavaScript" alt="JavaScript" width="20" height="20" align='center'/> JavaScript ES6+&nbsp;
- <img src="https://github.com/devicons/devicon/blob/master/icons/javascript/javascript-original.svg" title="JavaScript" alt="JavaScript" width="20" height="20" align='center'/> JavaScript ES6+&nbsp;
- <img src="https://github.com/devicons/devicon/blob/master/icons/jquery/jquery-original-wordmark.svg" title="jQuery" alt="jQuery" width="20" height="20" align='center'/> jQuery (Ajax Included)&nbsp;
### :hammer_and_wrench: Tools & Deployment:
- <img src="https://github.com/devicons/devicon/blob/master/icons/pycharm/pycharm-original.svg" title="PyCharm" alt="Pycharm" width="20" height="20" align='center'/> PyCharm&nbsp;
- <img src="https://github.com/devicons/devicon/blob/master/icons/mysql/mysql-plain-wordmark.svg" title="MySql" alt="MySql" width="20" height="20" align='center'/> MySQL (development)&nbsp;
- <img src="https://github.com/devicons/devicon/blob/master/icons/postgresql/postgresql-original.svg" title="Postgresql" alt="Postgresql" width="20" height="20" align='center'/> Postgres (deployment)&nbsp;
- <img src="https://github.com/devicons/devicon/blob/master/icons/heroku/heroku-plain-wordmark.svg" title="Heroku" alt="Heroku" width="20" height="20" align='center'/> Heroku (deployment)&nbsp;
- <img src="https://symbols.getvecta.com/stencil_9/32_aws-elastic-beanstalk.3cbb564d52.svg" title="AWS" alt="AWS" width="20" height="20" align='center'/> AWS S3 (static files storage for deployment)&nbsp;
## Features
List the ready features here:
- Creating an account which is verified by mail activation link
- Adding meals manually or template based
- Adding workouts manually or template based
- Creating a meals/workouts templates
- Calculating user macro demands (kcal, carbs, fat, protein)
- Tracking daily income of macros
- Tracking measurements changes in time (monthly, yearly)
- Adding a ingredient/meal manually or using bar code search functionality which is not included in database
- Adding activities which are not included in database
- Searching for recipe by name and display its content
- Searching for recipe by ingredients ( 2 options of search)
- Adding your own recipe
- Visualization of the data
- Translating entered meals/ingredients/activities/recipes to both EN and PL language


## Screenshots
![name](static/images/main_page_readme.png)
![name](static/images/signup_readme.png)
![name](static/images/signup_readme1.png)
![name](static/images/login_readme.png)
![name](static/images/dashboard_readme.png)
![name](static/images/meals_menu_readme.png)
![name](static/images/adding_workout.png)
![name](static/images/recipes_readme.png)
![name](static/images/add_recipe_readme.png)
![name](static/images/profile_info_readme.png)
![name](static/images/graph_nutri.png)
![name](static/images/calendar_readme.png)
![name](static/images/calendar_readme1.png)
<!-- If you have screenshots you'd like to share, include them here. -->
... and many more!

## Setup
- Create New Folder
- Type 'git clone https://github.com/drutkoowski/Nutri-Django.git' into the console/git cli
- Then 'cd Nutri'
- Create Virtual Environment by typing 'python3 -m venv venv' (in some cases you might use python instead of python3)
- Install all required dependencies located in requirements.txt using 'pip install -r requirements.txt'
- Create '.env' file (variables required are located in env-sample)
- Run migrations by typing 'python manage.py makemigrations' and then 'python manage.py migrate'
- Finally run 'python manage.py runserver'

## Project Status
Project is: :fire: COMPLETED :fire:

## Improvements to be done
- Creating Meals/Workouts fitted suggestions
- Save for later functionality
- Mobile version of the application

## Contact
Created by Damian Rutkowski - feel free to contact me!
<div id="badges">
  <a href="https://www.facebook.com/drutkoowski/">
    <img src="https://img.shields.io/badge/Facebook-blue?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook Badge"/>
  </a>
  
   <a href="mailto:d.rutkowski2000@gmail.com" target="_blank">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail Badge"/>
  </a>
  
  <a href="https://www.linkedin.com/in/damian-rutkowski-810428237/">
    <img src="https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Badge"/>
  </a>
  
</div>
