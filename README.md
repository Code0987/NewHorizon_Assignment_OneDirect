## NewHorizon Assignment OneDirect by @Code0987

This web app is for assignment given by OneDirect.

## Technology stack used

- nodejs
- typescript
- javascript
- expressjs
- pug html engine
- sqlite3 database
- bootstrap
- jquery


## Building and running

Install [Node.js](https://nodejs.org/en/)
```
cd <project_folder>
npm install
npm run build
npm run start
```


### Database

Database is located at `data/db.db`.
It's a sqlite3 file.

Sample data can be filled into DB by running app and navigating to `/dummy_db` in browser.


#### Schema

```
CREATE TABLE IF NOT EXISTS airports (id TEXT PRIMARY KEY, name TEXT);

CREATE TABLE IF NOT EXISTS flights (id TEXT PRIMARY KEY, name TEXT, src TEXT, dest TEXT, datetime TEXT, duration TEXT, seats INTEGER, seats_booked INTEGER, price_base REAL);

CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY, name TEXT, booking_datetime TEXT, src TEXT, dest TEXT, flights TEXT, amount REAL);
    
```


### Working

- `/` Opens the landing page, where you can enter details and search for flights.
- `/flights` Is opened by above Search button, which lists all the matched flights.
- `/book` Is opened by above Book button, which books the selected flight.
- `/view?id=` Shows the booking details.

The app uses expressjs to handle http requests,
pug html engine to render html,
nodejs to run backend server. 


## Screenshots

- ![Screenshot 1](screenshots/1.PNG)
- ![Screenshot 2](screenshots/2.PNG)
- ![Screenshot 3](screenshots/3.PNG)
- ![Screenshot 4](screenshots/4.PNG)