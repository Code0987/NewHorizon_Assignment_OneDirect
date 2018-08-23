import { Request, Response } from "express";
import * as database from "../models/Database";

/**
 * GET /
 */
export let index = (req: Request, res: Response) => {
  database.run(db => {
    const airports = [];

    db.each("SELECT id, name FROM airports;", [], (err, result) => {
      if (err) {
        throw err;
      }
      airports.push({ id: result.id, name: result.name });
    }, (err, n) => {
      res.render("home", {
        title: "Search",
        airports: airports
      });
    });
  });
};

/**
 * GET /dummy_db
 */
export let getDummyDB = (req: Request, res: Response) => {
  database.run(db => {
    db.serialize(function () {
      db.run("INSERT INTO airports values ('DEL', 'Delhi');", (db, err) => { });
      db.run("INSERT INTO airports values ('CHN', 'Chennai');", (db, err) => { });
      db.run("INSERT INTO airports values ('KOL', 'Kolkata');", (db, err) => { });

      db.run("INSERT INTO flights values ('A101', 'Air India', 'DEL', 'CHN', '1535054400000', '10800000', '160', '0', '3500');", (db, err) => { });
      db.run("INSERT INTO flights values ('A102', 'Air India', 'CHN', 'DEL', '1535054400000', '10800000', '160', '0', '3500');", (db, err) => { });
      db.run("INSERT INTO flights values ('A201', 'Air India', 'DEL', 'KOL', '1535054400000', '7200000', '160', '0', '2500');", (db, err) => { });
      db.run("INSERT INTO flights values ('A202', 'Air India', 'KOL', 'DEL', '1535054400000', '7200000', '160', '0', '2500');", (db, err) => { });

      res.write("DB updated with dummy data!");
      res.end();
    });
  });
};

/**
 * POST /flights
 */
export let flights = (req: Request, res: Response) => {
  const src = req.body.from;
  const dest = req.body.to;
  const date = req.body.date;
  const count = req.body.count;

  let datems;

  database.run(db => {
    const flights = [];

    db.each("SELECT * FROM flights WHERE src=? AND dest=?;", [src, dest], (err, result) => {
      if (err) {
        throw err;
      }

      const departure = new Date(parseInt(result.datetime));
      const dateSelected = new Date(date);
      datems = dateSelected.getTime();

      if (dateSelected.getUTCFullYear() != departure.getUTCFullYear()
        || dateSelected.getUTCMonth() != departure.getUTCMonth()
        || dateSelected.getUTCDay() != departure.getUTCDay())
        return;

      const duration = parseInt(result.duration);
      const arrival = new Date(departure.getTime() + parseInt(result.duration));
      const price = parseFloat(result.price_base) * parseInt(count);

      const durationString = Math.floor(duration / (1000 * 60 * 60)) + " hr " + Math.floor(duration / (1000 * 60)) % 60 + " min";

      flights.push({
        id: result.id,
        name: result.name,
        departure: departure.toLocaleTimeString(),
        arrival: arrival.toLocaleTimeString(),
        duration: durationString,
        price: price,
        seats: result.seats,
        seats_booked: result.seats_booked,
        seats_left: parseInt(result.seats) - parseInt(result.seats_booked)
      });
    }, (err, n) => {
      res.render("flights", {
        title: "Flights",
        src: src,
        dest: dest,
        date: date,
        datems: datems,
        count: count,
        flights: flights
      });
    });
  });
};

/**
 * POST /book
 */
export let book = (req: Request, res: Response) => {
  const src = req.body.src;
  const dest = req.body.dest;
  const date = req.body.date;
  const count = parseInt(req.body.count);
  const flight_id = req.body.flight_id;
  const amount = req.body.amount;

  const datetime = "" + (new Date(parseInt(date))).getTime();
  const id = "" + (new Date()).getTime();
  const name = "Booking";
  const flights = "" + flight_id;

  database.run(db => {
    db.run("INSERT INTO bookings values (?,?,?,?,?,?,?);", [id, name, datetime, src, dest, flights, amount], (err, result) => {
      if (err) {
        throw err;
      }
    }, (err, n) => {
      db.run("UPDATE flights SET seats_booked=seats_booked+? WHERE id=?;", [count, flight_id], (err, result) => {
        if (err) {
          throw err;
        }  
      }, (err, count) => {
        res.redirect("/view?id=" + id);
      });
    });
  });
};

/**
 * GET /
 */
export let view = (req: Request, res: Response) => {
  const id = req.query.id;

  database.run(db => {
    let booking = {
      id: "",
      name: "",
      datetime: "",
      flights: "",
      departure: "",
      arrival: "",
      duration: "",
      amount: ""
    };

    db.each("SELECT * FROM bookings WHERE id=?;", [id], (err, result) => {
      if (err) {
        throw err;
      }

      booking.id = result.id;
      booking.name = result.name;
      booking.datetime = (new Date(parseInt(result.booking_datetime))).toLocaleString();
      booking.flights = result.flights;
      booking.departure = result.src;
      booking.arrival = result.dest;
      booking.amount = result.amount;

    }, (err, n) => {
      const flight_id = booking.flights;

      db.each("SELECT * FROM flights WHERE id=?;", [flight_id], (err, result) => {
        if (err) {
          throw err;
        }

        const departure = new Date(parseInt(result.datetime));
        const duration = parseInt(result.duration);
        const arrival = new Date(departure.getTime() + parseInt(result.duration));
        const durationString = Math.floor(duration / (1000 * 60 * 60)) + " hr " + Math.floor(duration / (1000 * 60)) % 60 + " min";

        booking.flights = result.name + " (" + result.id + ")";
        booking.departure = booking.departure + " (" + departure.toLocaleString() + ")";
        booking.arrival = booking.arrival + " (" + arrival.toLocaleString() + ")";
        booking.duration = durationString;
      }, (err, n) => {
        res.render("view", {
          title: "View Booking",
          booking: booking
        });
      });

    });

  });
};
