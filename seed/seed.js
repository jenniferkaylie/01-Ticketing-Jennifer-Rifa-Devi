const mongo = require('../db');

// untuk menambahkan data atau seeding
async function seedData() {
    try {
        const db = await mongo.connect();
        console.log("Inserting data...");

        //fill data
        await db
            .collection("events")
            .insertMany([
                {
                    id: 1,
                    title: "Coldplay: Music of the Spheres",
                    venue: "Gelora Bung Karno Jakarta",
                    date: new Date("2023-11-05")
                },
                {
                    id: 2,
                    title: "Taylor Swift: The Eras Tour",
                    venue: "National Stadium Singapore",
                    date: new Date("2024-03-05")                },
                {
                    id: 3,
                    title: "Java Jazz Festival",
                    venue: "Jakarta International Expo",
                    date: new Date("2024-05-24")                  },
                {
                    id: 4,
                    title: "We The Fest 2023",
                    venue: "Gelora Bung Karno Jakarta",
                    date: new Date("2023-07-21")                  },
            ]);
        await db
            .collection("tickets")
            .insertMany([{
                "ticketId": 1,
                "eventId": 1,
                "customerName": "Michael",
                "quantity": 2,
                "inCart": false,
                "isPaid": true
              },
              {
                "ticketId": 2,
                "eventId": 2,
                "customerName": "Agnes",
                "quantity": 1,
                "inCart": true,
                "isPaid": false
              },
              {
                "ticketId": 3,
                "eventId": 3,
                "customerName": "Matthew",
                "quantity": 1,
                "inCart": true,
                "isPaid": false
              }
            ]);

        //close koneksi db 
        await mongo.disconnect()
    } catch (error) {
        console.log(error);
    }
}

seedData()