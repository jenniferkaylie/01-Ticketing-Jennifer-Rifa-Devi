const express = require('express')
const app = express();
const port = 3000;

//import file book yang berisikan fungsi2 yang diexport
const events = require('./model/events')
const customer = require('./model/customer')

// membuat express dapat menerima request body berupa JSON
app.use(express.json())

// curl -X GET http://localhost:3000/
app.get("/", (req, res) => {
    res.send("Hello World!");
});


// Customer routes 

// List ordered tickets: http://localhost:3000/tickets/Agnes
app.get("/tickets/:customerName", async(req, res) => {
    const { customerName } = req.params;

    const result = await customer.listOrderedTickets(customerName);

    // gabisa??
    if (result === null) {
        // HTTP Status bisa baca di https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
        res.status(404)
        res.json('book not found')
        return
    }

    res.json(result);
})

// List events : http://localhost:3000/events
app.get("/events", async (req, res) => {
    const events = await customer.listEvents();
    res.json(events);
})

// List cart: http://localhost:3000/customer/cart/Agnes
app.get("/customer/cart/:customerName", async(req, res) => {
    const { customerName } = req.params;
    const result = await customer.listCart(customerName);
    res.json(result);
})

// Get Invoice: http://localhost:3000/customer/invoice/Agnes
app.get("/customer/invoice/:customerName", async(req, res) => {
    const { customerName } = req.params;
    const result = await customer.getInvoice(customerName);
    res.json(result);
})

// SearchEvent: http://localhost:3000/events/search
// Bakal show all events
// harusnya gimana 
app.get("/events/search", async (req, res) => {
    const { searchField, search } = req.query

    const events = await customer.searchEvent(searchField, search);

    res.json(events);
})

// SearchTicket: http://localhost:3000/tickets/search
// ini gabisa
app.get("/tickets/search", async (req, res) => {
    const { searchField, search } = req.query

    const tickets = await customer.searchTicket(searchField, search);

    res.json(tickets);
})

// Order tickets: http://localhost:3000/tickets/orders
app.post("/tickets/orders", async (req, res) => {
    try {
        const orders = req.body

        for (let i = 0; i < orders.length; i++) {
            const customerName = orders[i].customerName
            if (!customerName || customerName === "") {
                res.status(422).send("Customer name must be filled!")
                return
            }

            // kalo quantity int gmn ya? perlu di parseInt kah
            const quantity = orders[i].quantity
            if (quantity === 0) {
                res.status(422).send("Quantity must be filled!")
                return
            }

            // kalo order: inCart auto false dan isPaid auto true, how?
        }

        const _orders = await customer.orderTicket(orders)
        res.status(201)
        res.json(_orders);
    } catch (error) {
        res.status(422)
        res.json(`Ticket already exists`)
    }
})




// Admin routes

// List Tickets: http://localhost:3000/events/2
app.get("/events/:eventId", async(req, res) => {
    const eventId = parseInt(req.params.eventId)

    const result = await events.listTickets(eventId);

    res.json(result);
})


// List Events: http://localhost:3000/events --> udah di atas

// Make Events: http://localhost:3000/events
app.post("/events", async (req, res) => {
    try {
        const newEvents = req.body

        for (let i = 0; i < newEvents.length; i++) {
            const eventName = newEvents[i].eventName
            if (!eventName || eventName === "") {
                res.status(422).send("Event name must be filled!")
                return
            }

            const venue = newEvents[i].venue
            if (!venue || venue === "") {
                res.status(422).send("Venue name must be filled!")
                return
            }

            //kalo date gimana ya
            const date = newEvents[i].date
            if (!venue || venue === "") {
                res.status(422).send("Venue name must be filled!")
                return
            }

        }

        const _events = await events.makeEvent(newEvents)
        res.status(201)
        res.json(_events);
    } catch (error) {
        res.status(422)
        res.json(`Event already exists`)
    }
})

// Update event: http://localhost:3000/events/id
app.put("/events/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const { title, venue, date } = req.body
    try {

        if (title === "") {
            res.status(422)
            res.json("Title can't be empty!")
            return
        }

        if (venue === "") {
            res.status(422)
            res.json("Venue can't be empty!")
            return
        }

        //how
        if (date === "") {
            res.status(422)
            res.json("Date can't be empty!")
            return
        }

        // mencari event terlebih dahulu yang mau diupdate

        const theEvent = await events.fetchOneData(id)

        //cek jika event tidak ada, memakai array indeks pertama karena hasil fetch data berupa to array
        if (!theEvent) {
            res.status(404)
            res.json("Event not found!")
            return
        }

        // di validasi dulu apakah title diberikan di req.body, kalau tidak, tidak perlu di update biar tidak null hasilnya
        if (title) {
            theEvent.title = title
        }

        // title di validasi dulu apakah venue diberikan di req.body, kalau tidak, tidak perlu di update biar tidak null hasilnya
        if (venue) {
            theEvent.venue = venue
        }

        if (date) {
            theEvent.date = date
        }

        await events.updateEvent(theEvent)

        res.json(theEvent);
    } catch (error) {
        res.status(422)
        console.log('error', error)
        res.json('Update failed')
    }
})


















// Mandatory listen method
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});