"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDb"
import User from "@/models/User"


export const initiate = async (amount, to_username, paymentform) => {
    await connectDb()
    // fetch the secret of the user who is getting the payment 
    const user = await User.findOne({ username: to_username });
    const secret = user?.razorpaysecret;
    const id = user?.razorpayid;

    var instance = new Razorpay({ key_id: id, key_secret: secret });



    const options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    };

    let x = await instance.orders.create(options);

    // create a payment object which shows a pending payment in the database
    await Payment.create({ oid: x.id, amount: amount / 100, to_user: to_username, name: paymentform.name, message: paymentform.message });

    return x;

};


export const fetchuser = async (username) => {
    await connectDb();
    let u = await User.findOne({ username: username });
    if (u) {
        let user = u.toObject({ flatternObjectIds: true });
        return user;
    }
    return { error: "User not found" };
};

export const fetchpayments = async (username) => {
    await connectDb()
    // find all payments sorted by decreasing order of amount and flatten object ids
    let p = await Payment.find({ to_user: username, done: true }).sort({ amount: -1 }).limit(10).lean(true)
    return p;
}

export const updateProfile = async (data, oldusername) => {
    await connectDb()
    const oldEmail = await User.findOne({ username: oldusername });

    let newData;

    if (data instanceof FormData) {
        newData = Object.fromEntries(data);
    } else {
        newData = data;
    }

    // If the username is being updated, check if username is available
    if (oldusername !== newData.username) {
        let u = await User.findOne({ username: newData.username })
        if (u) {
            return { message: "Username already exists" };
        }

        // **************************************************************
        /* This block of code is updating a user's profile information in the database. Here's a breakdown
        of what it does: */
        let updatedProfile = await User.findOneAndUpdate(
            { email: oldEmail.email },
            { ...newData, email: oldEmail.email },
            { new: true }
        );

        if (updatedProfile) {
            await Payment.updateMany(
                { to_user: oldusername },
                { to_user: newData.username },
                { new: true }
            );
        }
        return {
            message: "Profile Updated Successfully",
            data: updatedProfile,
        };
    }

    // *********************************************************************
    /* This block of code is updating a user's profile information in the database. Here's a breakdown of
    what it does: */
    let updatedProfile = await User.findOneAndUpdate(
        { email: oldEmail.email },
        { ...newData, email: oldEmail.email },
        { new: true }
    );
    return {
        message: "Profile Updated Successfully",
        data: updatedProfile,
    };
};
