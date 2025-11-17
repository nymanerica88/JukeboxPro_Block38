import db from "#db/client";

export async function createPlaylistTrack(playlistId, trackId) {
  const sql = `
  INSERT INTO playlists_tracks
    (playlist_id, track_id)
  VALUES
    ($1, $2)
  RETURNING *
  `;
  const {
    rows: [playlistTrack],
  } = await db.query(sql, [playlistId, trackId]);
  return playlistTrack;
}

export async function getPlaylistByTrackAndUser(trackId, userId) {
  try {
    const sql = `
    SELECT playlists.id, playlists.name, playlists.description, playlists.user_id
    FROM playlists
    INNER JOIN playlists_tracks ON playlists.id = playlists_tracks.playlist_id
    WHERE playlists_tracks.track_id = $1
      AND playlists.user_id = $2
  `;
    const values = [trackId, userId];

    const { rows } = await db.query(sql, values);
    return rows;
  } catch (error) {
    console.error("Error in getPlaylistByTrackAndUser:", error);
    throw error;
  }
}
