# Telebot : Telegram weather bot (Backend) 🔥
# Tech stack : Mongo DB, Nodejs, Nestjs, React js
1. Clone this repository
2. Install the node modules by command : `npm install`
3. create .env file and paste text from this file (https://textdoc.co/KTEU8OMor9IQvP3Y)
4. Then run the server : `npm run start:dev`
5. Go to this url (https://github.com/urvsh27/telegram_bot_frontend) and set up the admin panel.

# Working  
=> This project is created using mongo db, node, nest js framework, react and telegram bot api.

# Backend : 
1. User can get the india's weather (Weather can be change in future based on each user's location).
2. On `/start` command bot will return all commands related to it.
3. On `/subscribe`, bot will add the user to database and send the current weather and after that every 3 hour bot will send the weather updates.
4. On `/unsubscribe`, bot will remove the user from the database and it will not send other update from then.

# Frontend : 
=> https://github.com/urvsh27/telegram_bot_frontend
1. Admin can login to the bot via their Google account.
2. Admin can view all the users and manage them.
3. Weather api key can be updated via admin panel.

Note :
- The bot or admin panel might respond slow as I am using free deployment plan.


   
