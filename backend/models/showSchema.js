import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movie",
      required: true,
    },

    showPrice: {
      type: Number,
      required: true,
    },

    showDateTimes: [
      {
        date: {
          type: String,
          required: true,
        },
        times: [
          {
            type: String,
            required: true,
          },
        ],
      },
    ],

    occupiedSeats: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);


export default mongoose.model("Show", showSchema);