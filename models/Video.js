import mongoose from 'mongoose';

const VideoSchema = new mongoose.Schema(
    {
	title: { type: String, required: true, unique: true },
	desc: { type: String },
	video: { type: String },
	trailer: { type: String },
	thumbnail: { type: String },
	thumbnailSmall: { type: String },
	date: { type: String },
	category: { type: String },
	isTraining: { type: Boolean, default: false },
    },
    { timestamps: true}
);

module.export = mongoose.model("Video", VideoSchema);
