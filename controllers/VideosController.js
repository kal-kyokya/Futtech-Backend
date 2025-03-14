// This is a Script containing a class whose methods handle API routes
import Video from '../models/Video';

export default class VideosController {
  /**
   * Uploads a new video to the database
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   */
  static async createNewVideo(req, res) {
    // Extract the video's information
    const { isAdmin } = req.video_info;

    // Create the video
    const newVideo = new Video(req.body);

    // Proceed with upload of the video
    if (isAdmin) {
	try {
	    const savedVideo = await newVideo.save();
	    return res.status(201).send(savedVideo);
	} catch (err) {
	    return res.status(500).send({ error: err });
	}
    }

    return res.status(403).send({ error: 'Forbidden' });
  }

  /**
   * Retrieves the video through the request object's token
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   */
  static async getMe(req, res) {
    const { id } = req.video_info;

    try {
	const video = await Video.findById(id);
	const { password, ...details } = video;
	return res.status(201).send({ details });
    } catch (err) {
	return res.status(500).send({ error: err });
    }
  }

  /**
   * Retrieve all videos in the database
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   */
  static async getAll(req, res) {
    // Extract the video's information
    const { isAdmin } = req.video_info;
    const query = req.query.new;

    // Proceed with deletion of video
    if (isAdmin) {
	try {
	    const videos = query
		  ? await Video.find().sort({ _id: -1 }).limit(10)
		  : await Video.find();
	    return res.status(201).send(videos);
	} catch (err) {
	    return res.status(500).send({ error: err });
	}
    }

    return res.status(403).send({ error: 'Forbidden' });
  }

  /**
   * Compiles a report on videos in the database
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   */
  static async getStats(req, res) {
    // Extract the video's information
    const { isAdmin } = req.video_info;

    // Proceed with report compilation
    if (isAdmin) {
	try {
	    const stats = await Video.aggregate([
		{ $project: { month: { $month: '$createAt'} } },
		{ $group: { _id: '$month', total: { $sum: 1 } } }
	    ]);
	    return res.status(201).send(stats);
	} catch (err) {
	    return res.status(500).send({ error: err });
	}
    }

    return res.status(403).send({ error: 'Forbidden' });
  }

  /**
   * Updates the video based on the info in the request object
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   */
  static async updateVideo(req, res) {
    // Extract the video's information
    const { id, isAdmin } = req.video_info;

    // Proceed with updation of video details
    if (id === req.params.id || isAdmin) {
	// Ensure password gets changed if it was the target
	if (req.body.password) {
	    // Hash 'password' using 'AES'
	    const req.body.password = crypto-js.AES.encrypt(
		req.body.password, 
		process.env.SECRET_KEY
	    ).toString();
	}

	try {
	    const updateVideo = await Video.findByIdAndUpdate(
		id,
		{ $set: req.body },
		{ new: true }
	    );
	    return res.status(201).send(updateVideo);
	} catch (err) {
	    return res.status(500).send({ error: err });
	}
    }

    return res.status(403).send({ error: 'Forbidden' });
  }

  /**
   * Deletes a video, by Video himself or Admin
   * @param { Object } req - The request object
   * @param { Object } res - The response object
   */
  static async deleteVideo(req, res) {
    // Extract the video's information
    const { id, isAdmin } = req.video_info;

    // Proceed with deletion of video
    if (id === req.params.id || isAdmin) {
	try {
	    await Video.findByIdAndDelete(id);
	    return res.status(204);
	} catch (err) {
	    return res.status(500).send({ error: err });
	}
    }

    return res.status(403).send({ error: 'Forbidden' });
  }
}
