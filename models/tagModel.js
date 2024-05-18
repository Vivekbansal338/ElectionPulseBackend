import mongoose from "mongoose";
const { Schema } = mongoose;

const tagSchema = new Schema({
  election: { type: Schema.Types.ObjectId, ref: "Election", required: true },
  name: { type: String, required: true, unique: true },
});

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;
