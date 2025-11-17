import express from "express";
const router = express.Router();
export default router;

import { getTracks, getTrackById } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";
import { getPlaylistByTrackAndUser } from "#db/queries/playlists_tracks";

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.get("/:id", async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});

router.get("/:id/playlists", requireUser, async (req, res, next) => {
  try {
    const trackId = Number(req.params.id);
    if (!Number.isInteger(trackId))
      return res.status(400).send("Invalid track id");

    const track = await getTrackById(trackId);
    if (!track) return res.status(404).send("Track not found.");

    const playlists = await getPlaylistByTrackAndUser(trackId, req.user.id);
    res.status(200).send(playlists);
  } catch (error) {
    console.error(`Error fetching playlists for track`, error);
    next(error);
  }
});
