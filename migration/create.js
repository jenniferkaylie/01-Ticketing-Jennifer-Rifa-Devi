const mongo = require('../db');

//buat collection/table baru 
async function createCollection() {
    try {
        const db = await mongo.connect();
        console.log("Create Collection...");
        
        //create table 
        await db.createCollection("tickets")
        await db.createCollection("events")
        
        // tambahkan createindex untuk membuat index unik agar tidak dapat menginput id yang sama
        await db.collection("tickets").createIndex({ id: 1 }, { unique: true });
        await db.collection("events").createIndex({ id: 1 }, { unique: true });

    } catch (error) {
        console.log(error);
    } finally {
        await mongo.disconnect()
        console.log('finished.')
      }
}

createCollection()