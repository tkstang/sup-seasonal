# Sup Seasonal

Sup Seasonal is a web API that fetches information about seasonal foods and recipes. Full documentation can be found here: http://supseasonal.herokuapp.com/

Sup Seasonal is built on a SQL database containing ingredients and information on their month-to-month seasonality. Users have the ability to see what foods are in season in any given month and a view a list of recipes maximizing use of the foods in season in the selected month. Users can save recipes they like to a list of favorites. Recipes come from the Spoonacular API and include detailed ingredients, instructions, number of servings, and an image url for the recipe as well as image urls for most ingredients. Superusers can add, remove, and edit foods from the database, as well as manage the list of users.

Sup Seasonal is built on a Node Express server utilizing the Swagger API framework, Knex, and PostgreSQL. User authentication is handled using JSON Web Token and Bcrypt password encryption. Interactive documentation was created using Swagger UI. The project is currently deployed on Heroku.

Some upcoming features include the ability to filter unwanted ingredients from recipe searches, as well as adding specific non-seasonal foods to recipe searches, and to include nutritional information. Contributions to these features or other feature ideas are welcomed, please contact @tkstang or @coolguyzone.
