const mongo = require('../db');


async function listOrderedTickets(customerName) {
    try {
      const db = await mongo.connect();

      const customerExists = await db.collection("tickets").findOne({ customerName });

      if (!customerExists) {

        throw new Error(`Customer with name '${customerName}' not found.`);
      }

      const result = await db.collection("tickets").find({ customerName, isPaid: true, inCart: false }).toArray();
 
      if (result.length === 0 || !result) {
        throw new Error(`Customer's ordered list is empty`)
    }
    
    return result

    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await mongo.disconnect();
      console.log('Finished.');
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

async function listCart(customerName) {
    try {
        const db = await mongo.connect();

        const customerExists = await db.collection("tickets").findOne({ customerName });

        if (!customerExists) {
         throw new Error(`Customer with name '${customerName}' not found.`);
        }

        const result = await db.collection("tickets").find({customerName, inCart: true}, { projection: {} }).toArray();
        
        if (result.length === 0 || !result) {
            throw new Error(`Customer's cart is empty`)
        }

        return result;
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
    }
}

// basically adding a new ticket(?)
async function orderTicket(newTicket) {
    try {
        const db = await mongo.connect();
        console.log("Inserting data...");

        await db.collection('tickets').insertMany(newTicket);        
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
    }
}

async function paidTicket(ticketId) {
    try {
        const db = await mongo.connect();
        console.log("Update data...");

        await db.collection("tickets").updateMany(
            { ticketId:{ $in: ticketId } },
            {
                $set: {
                    inCart: false,
                    isPaid: true
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

async function getInvoice(customerName) {
    try {
      const db = await mongo.connect();

      const customerExists = await db.collection("tickets").findOne({ customerName });

      if (!customerExists) {
        throw new Error(`Customer with name '${customerName}' not found.`);
      }

      return await db.collection("tickets").findOne({ customerName });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await mongo.disconnect();
      console.log('Finished.');
    }
}

async function searchEvent( searchField, search ) {
    try {
        const db = await mongo.connect();
        
        if (searchField && search) {
            return await db
            .collection("events")
            .find( { [searchField]:  new RegExp(search, 'i')}, { projection: {} })
            .toArray();
        } else {
            return await db
            .collection("events")
            .find({}, { projection: {} })
            .toArray();
        }
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}

async function searchTicket( searchField, search ) {
    try {
        const db = await mongo.connect();
        
        if (searchField && search) {
            return await db
            .collection("tickets")
            //penggunaan [] pada key di find, untuk mengekstrasi value dari variabel untuk dijadikan key
            .find( { [searchField]:  new RegExp(search, 'i')}, { projection: {} })
            .toArray();
        } else {
            return await db
            .collection("tickets")
            .find({}, { projection: {} })
            .toArray();
        }
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}

async function searchTicketbyIds(ids) {
    try {
        const db = await mongo.connect();
        
        return await db.collection("tickets").find( { ticketId:{ $in: ids } }).toArray();
    } catch (error) {
        console.log(error);
        throw error
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}


module.exports = { listOrderedTickets, listCart, listEvents, orderTicket, getInvoice, searchEvent, searchTicket, searchTicketbyIds, paidTicket }