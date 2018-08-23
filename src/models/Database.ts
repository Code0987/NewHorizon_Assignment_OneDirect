import sqlite3 from "sqlite3";

export let run = (onDB: ((db: sqlite3.Database) => any)) => {
    const db = new sqlite3.Database("./data/db.db", (err) => {
        if (err) {
            console.error("Failed to connect to the database.");
            console.error(err);
        }
    });
    onDB(db);
    db.close();
};

export let setupDB = (db: sqlite3.Database) => {
    db.serialize(function () {
        db.run("CREATE TABLE IF NOT EXISTS airports (id TEXT PRIMARY KEY, name TEXT);");
        db.run("CREATE TABLE IF NOT EXISTS flights (id TEXT PRIMARY KEY, name TEXT, src TEXT, dest TEXT, datetime TEXT, duration TEXT, seats INTEGER, seats_booked INTEGER, price_base REAL);");
        db.run("CREATE TABLE IF NOT EXISTS bookings (id TEXT PRIMARY KEY, name TEXT, booking_datetime TEXT, src TEXT, dest TEXT, flights TEXT, amount REAL);");
    });
};

