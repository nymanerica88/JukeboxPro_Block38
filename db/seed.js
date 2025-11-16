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
  // 1. Create 2 users

  //stores the objects for users created in the loop
  const users = [];
  //loops two times to create two users
  for (let i = 1; i <= 2; i++) {
    //awaits the creation of two user objects, each containing username and password
    const user = await createUser(`user${i}`, `password${i}`);
    //adds the new users to the user array
    users.push(user);
  }

  // 2. Create 10 tracks

  //stores the objects for tracks created in the loop
  const trackIds = [];
  //loops ten times to create ten tracks
  for (let i = 1; i <= 10; i++) {
    //awaits the creation of ten track objects, including the track id
    const track = await createTrack(`Track ${i}`, i * 50000);
    //adds the created tracks to the trackId array
    trackIds.push(track.id);
  }

  // 3. Create a playlist for each user and add 5 tracks to it

  //loops through the users array, and stops after the last user
  for (let i = 0; i < users.length; i++) {
    //retrieves the user object at index[i]
    const user = users[i];

    // awaits the creation of the playlist objects
    const playlist = await createPlaylist(
      //names the playlist based on the username
      `${user.username}'s Playlist`,
      //sample description for all playlists
      "lorem ipsum playlist description",
      //links the playlist to the specific user
      user.id
    );

    // Assign 5 tracks to this playlist
    for (let j = i * 5; j < i * 5 + 5; j++) {
      //awaits the creation of the playlist tracks; j is the index variable because i was used was used for the users array
      await createPlaylistTrack(playlist.id, trackIds[j]);
    }
  }
}
