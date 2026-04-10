const Review = require('../Models/Review');
const Doctor = require('../Models/Doctor');

exports.createReview = async (req, res) => {
    try {
        const review = new Review({ ...req.body, patientId: req.user.id });
        await review.save();

        // Update doctor rating
        await Doctor.findByIdAndUpdate(review.doctorId, {
            $inc: { reviewsCount: 1 },
            $set: { rating: /* avg calc */ 4.5 }
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getReviewsByDoctor = async (req, res) => {
    try {
        const reviews = await Review.find({ doctorId: req.params.doctorId }).populate('patientId');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

