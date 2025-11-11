import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  //ORIGINAL CODE
  //   for (let i = 1; i <= 20; i++) {
  //     await createPlaylist("Playlist " + i, "lorem ipsum playlist description");
  //     await createTrack("Track " + i, i * 50000);
  //   }
  //   for (let i = 1; i <= 15; i++) {
  //     const playlistId = 1 + Math.floor(i / 2);
  //     await createPlaylistTrack(playlistId, i);
  //   }
  // }
  console.log("🌱 Seeding users...");

  // ---- Create 2 Users ----
  const user1 = await createUser("shannon", "password123");
  const user2 = await createUser("chris", "password456");

  console.log("👤 Users created:", user1.username, user2.username);
  
  // ---- Create Playlists linked to users ----
  const playlist1 = await createPlaylist("Shannon's Playlist", "Chill vibes only", user1.id);
  const playlist2 = await createPlaylist("Chris's Playlist", "Workout hype tracks", user2.id);
  
  console.log("🎵 Playlists created for both users");
  
  // ---- Create 10 Tracks ----
  let tracks = [];
  for (let i = 1; i <= 10; i++) {
    const track = await createTrack("Track " + i, i * 30000);
    tracks.push(track);
  }
  
  console.log("🎶 10 tracks created!");

  // ---- Add at least 5 tracks to each playlist ----
  for (let i = 0; i < 5; i++) {
    await createPlaylistTrack(playlist1.id, tracks[i].id); // first 5 tracks
  }

  for (let i = 5; i < 10; i++) {
    await createPlaylistTrack(playlist2.id, tracks[i].id); // next 5 tracks
  }

  console.log("✅ Tracks assigned to playlists!");
}










