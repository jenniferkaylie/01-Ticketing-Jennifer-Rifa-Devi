const express = require('express')
const app = express();
const port = 3000;

const events = require('./model/events')
const customer = require('./model/customer')

app.use(express.json())

// http://localhost:3000/
app.get("/", (req, res) => {
    res.send("Hello World!");
});


// Customer routes 

// List ordered tickets: http://localhost:3000/tickets/Agnes
app.get("/tickets/:customerName", async(req, res) => {
    const { customerName } = req.params;

    const result = await customer.listOrderedTickets(customerName);

    if (result === null) {
        res.status(404)
        res.json('Customer not found')
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
// SALAH
app.get("/events/search", async (req, res) => {
    const { searchField, search } = req.query

    const events = await customer.searchEvent(searchField, search);

    res.json(events);
})

// SearchTicket: http://localhost:3000/tickets/search
// SALAH
app.get("/tickets/search", async (req, res) => {
    const { searchField, search } = req.query

    const tickets = await customer.searchTicket(searchField, search);

    res.json(tickets);
})

// Function add to cart: 
// Jadi ini kayak order ticket, tapi kondisinya masih di cart dan belum dibayar
/* Contoh query di Postman:
[{"eventId": 2,
"customerName": "Agnes",
    "quantity": 1
}]    */

app.post("/customer/cart", async (req,res) => {
    try {
        const cart = req.body

        for (let i = 0; i < cart.length; i++) {
            const customerName = cart[i].customerName
            if (!customerName || customerName === "") {
                res.status(422).send("Customer name must be filled!")
                return
            }

            const quantity = cart[i].quantity
            if (quantity === 0) {
                res.status(422).send("Quantity must be filled!")
                return
            }

            const eventId = cart[i].eventId
            if (eventId === 0) {
                res.status(422).send("Event ID must be filled!")
                return
            }

            cart[i].inCart = true
            cart[i].isPaid = false
            cart[i].ticketId = Math.floor(Math.random() * 1000)
        }

        const _carts = await customer.orderTicket(cart)
        res.status(201)
        res.json(_carts);
        
    } catch (error) {
        res.status(422)
        res.json(`Ticket already exists`)    
    }
})

// Order tickets: http://localhost:3000/tickets/orders
// Ini checkout ticket yang udah ada di cart
app.post("/tickets/orders", async (req, res) => {
    try {
        const ticketIds = req.body

        const theTicket = await customer.searchTicketbyIds(ticketIds)

        if(theTicket.length === 0) {
            res.status(404)
            res.json('Ticket not found')
            return
        }

        const _orders = await customer.paidTicket(ticketIds)
        
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
            const eventName = newEvents[i].title
            if (!eventName || eventName === "") {
                res.status(422).send("Event name must be filled!")
                return
            }

            const venue = newEvents[i].venue
            if (!venue || venue === "") {
                res.status(422).send("Venue name must be filled!")
                return
            }

            const date = Date.parse(newEvents[i].date)
            if (!date || date === "") {
                res.status(422).send("Date must be filled!")
                return
            }

            const quantity = newEvents[i].quantity
            if (quantity === 0) {
                res.status(422).send("Quantity must be filled!")
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