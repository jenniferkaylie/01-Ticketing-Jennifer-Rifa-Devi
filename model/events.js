const mongo = require('../db');


async function listTickets(eventId) {
    try {
        const db = await mongo.connect();

        const eventExists = await db.collection("tickets").findOne({ eventId:eventId });

        if (!eventExists) {
            throw new Error(`Event with ID '${eventId}' not found.`);
        }

        const tickets = await db.collection("tickets").find({ eventId }).toArray();

        return tickets;
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        await mongo.disconnect()
        console.log('finished.')
    }
}


async function makeEvent(events) {
    try {
        const db = await mongo.connect();
        console.log("Inserting data...");

        await db.collection('events').insertMany(events);        
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}


async function listEvents() {
    try {
        const db = await mongo.connect();
        
        return await db.collection("events").find({}, { projection: {} }).toArray();
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}

async function updateEvent(event) {
    try {
        const db = await mongo.connect();
        console.log("Update data...");

        await db.collection("events").findOneAndUpdate(
            { id: event.id },
            {
                $set: {
                    title: event.title,
                    venue: event.venue,
                    date: event.date
                }
            }
        )
        return "data updated"
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}


async function fetchOneData( id ) {
    try {
        const db = await mongo.connect();

        return await db
            .collection("events")
            .findOne({id: id}, { projection: {} })
        
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}

async function deleteData(id) {
    try {
        const db = await mongo.connect();
        console.log("Delete data...");

        await db.collection("events").deleteOne(
            { id: id }
        )
        return "data deleted"
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}



module.exports = { listTickets, makeEvent, listEvents, updateEvent }
