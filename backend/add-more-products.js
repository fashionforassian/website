require('dotenv').config();
const { MongoClient } = require('mongodb');

async function addProducts() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI in environment variables.");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('products');
    
    // First let's check how many products we have
    const count = await collection.countDocuments();
    if (count > 50) {
        console.log("Already have plenty of products. Existing count:", count);
        return;
    }

    const photos = [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1434389678278-be43e4aa2198?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
    ];

    const cats = ["men", "kids", "accessories"];
    const adjectives = ["Premium", "Essential", "Minimalist", "Oversized", "Tailored", "Classic", "Modern", "Structured"];
    const types = ["T-Shirt", "Jacket", "Trousers", "Sweater", "Hoodie", "Beanie", "Bag", "Blazer"];

    const moreSamples = Array.from({length: 30}).map((_, i) => {
        const ad = adjectives[Math.floor(Math.random() * adjectives.length)];
        const ty = types[Math.floor(Math.random() * types.length)];
        const name = `${ad} ${ty}`;
        const photo = photos[Math.floor(Math.random() * photos.length)];

        return {
            id: `p-mock-extra-${Date.now()}-${i}`,
            slug: `mock-${name.toLowerCase().replace(/\s+/g, '-')}-${i}`,
            name: name,
            price: 29 + Math.floor(Math.random() * 150),
            category: cats[i % cats.length],
            colors: ["Black", "White", "Navy", "Olive"].slice(0, 1 + Math.floor(Math.random() * 3)),
            sizes: ["S", "M", "L", "XL"].slice(0, 2 + Math.floor(Math.random() * 3)),
            image: photo,
            images: [photo, photos[Math.floor(Math.random() * photos.length)]],
            colorVariants: [],
            description: `This ${name.toLowerCase()} is crafted from premium materials for a timeless look. Designed for everyday versatility.`,
            fabricCare: "Machine wash cold. Do not tumble dry.",
            popularity: 40 + Math.floor(Math.random() * 60),
            inventory: 10 + Math.floor(Math.random() * 100),
            status: "active",
            isNew: Math.random() > 0.5,
            isSale: Math.random() > 0.7
        };
    });

    await collection.insertMany(moreSamples);
    console.log(`Inserted ${moreSamples.length} new mock products successfully.`);
  } catch (err) {
    console.error("Error inserting products:", err);
  } finally {
    await client.close();
  }
}

addProducts();
