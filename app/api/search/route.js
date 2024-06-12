 import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";


export async function GET(request)
{
    const query = request.nextUrl.searchParams.get("query")
// Replace the uri string with your connection string.
const uri = "mongodb+srv://mongodb:4AC3PANjhrTvrRAS@management.7f4nsng.mongodb.net/";

const client = new MongoClient(uri);


  try {
    const database = client.db('Stock');
    const inventory = database.collection('inventory');
    // const query = {  };

    const products = await inventory.aggregate([
        // Match documents based on the text query
        {
          $match: {
            $or: [
              { slug: { $regex: query , $options: "i" } }, // Match name partially or fully
            //   { quantity: { $regex: "your_text_query", $options: "i" } }, // Match quantity partially or fully
            //   { price: { $regex: "your_text_query", $options: "i" } } // Match price partially or fully
            ]
          }
        }
      ]).toArray()

    // const products = await inventory.find(query).toArray();
    return NextResponse.json({success:true, products})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}


// export async function POST(request)
// {
// let body = await request.json()
// // Replace the uri string with your connection string.
// const uri = "mongodb+srv://mongodb:4AC3PANjhrTvrRAS@management.7f4nsng.mongodb.net/";

// const client = new MongoClient(uri);

//   try {
//     const database = client.db('Stock');
//     const inventory = database.collection('inventory');
//     const product = await inventory.insertOne(body);
//     return NextResponse.json({ product, ok: true})
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }


