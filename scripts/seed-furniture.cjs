#!/usr/bin/env node
/**
 * Seeds Firestore `furniture` from `data/furniture-seed.json` using Firebase Admin SDK.
 *
 * Prerequisites:
 *   npm install firebase-admin
 *
 *   export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/serviceAccount.json"
 *   # must be a service account key for the same Firebase project as your app
 *
 * Run:
 *   node scripts/seed-furniture.cjs
 */
const fs = require("fs");
const path = require("path");

async function main() {
  const admin = require("firebase-admin");

  const jsonPath = path.join(__dirname, "..", "data", "furniture-seed.json");
  const items = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT),
      ),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  const db = admin.firestore();
  const batch = db.batch();

  for (const row of items) {
    const { id, name, type, imageUrl, modelUrl } = row;
    const ref = db.collection("furniture").doc(id);
    batch.set(ref, {
      name,
      type,
      imageUrl,
      modelUrl,
      seededAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
  console.log(`Seeded ${items.length} documents into collection "furniture".`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
