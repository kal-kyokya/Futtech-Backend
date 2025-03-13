import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema(
    {
	title: { type: String, required: true, unique: true },
	category: { type: String },
	subCategory: { type: String },
	content: { type: Array },
    },
    { timestamps: true}
);

module.export = mongoose.model("List", ListSchema);
