const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("./../models/tourModel.js");
const Booking = require("./../models/bookingModel.js");
const AppError = require("../utils/appError.js");
const catchAsync = require("./../utils/catchAsync.js");
const factory = require("./handlerFactory.js");
const User = require("../models/userModel.js");
exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  //   const stripe = Stripe;
  //1 find tour
  const tour = await Tour.findById(req.params.tourId);
  //2 create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // success_url: `${req.protocol}://${req.get("host")}/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get("host")}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: "payment",

    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get("host")}/img/tours/${
                tour.imageCover
              }`,
            ],
          },
        },
      },
    ],
  });
  //3 create session response
  res.status(200).json({
    status: "success",
    session,
  });
});
// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   const { tour, user, price } = req.query;
//   if (!tour && !user && !price) return next();
//   await Booking.create({ tour, user, price });

//   res.redirect(req.originalUrl.split("?")[0]);
// });
const createBookingCheckout = async (sessionData) => {
  const tour = sessionData.client_reference_id;
  const user = (await User.findOne({ email: sessionData.customer_email })).id;
  const price = sessionData.amount_total / 100;
  await Booking.create({ tour, user, price });
};
exports.webHookCheckout = async (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = await stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOKS_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createBookingCheckout(event.data.object);
    res.status(200).json({ recieved: true });
  }
};
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
