import express from "express";
import requireUser from "#middleware/requireUser";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";

router.get("/", requireUser, async (req, res) => {
  const playlists = await getPlaylists();
  res.send(playlists);
});

router.post("/", requireUser, async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");

  const { name, description } = req.body;
  if (!name || !description)
    return res.status(400).send("Request body requires: name, description");

  const playlist = await createPlaylist(name, description, req.user.id);
  res.status(201).send(playlist);
});

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

router.get("/:id", requireUser, async (req, res) => {
  try {
    const playlistId = Number(req.params.id);
    const playlist = await getTracksByPlaylistId(playlistId);
    if (!playlist) {
      return res.status(404).send("Playlist not found");
    }

    if (playlist.user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }
    res.status(200).send(req.playlist);
  } catch (error) {
    console.error(`Error retrieving playlist by id`, error);
    next(error);
  }
});

router.get("/:id/tracks", requireUser, async (req, res) => {
  const playlist = req.playlist;
  if (!playlist.user_id !== req.user.id) {
    return res.status(403).send({ error: "You do not own this playlist." });
  }

  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.send(tracks);
});

router.post("/:id/tracks", requireUser, async (req, res) => {
  const { trackId } = req.body;
  if (!trackId) return res.status(400).send("Request body requires: trackId");

  if (req.playlist.user_id !== req.user.id) {
    return res.status(403).send("Forbidden");
  }

  const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
  res.status(201).send(playlistTrack);
});
