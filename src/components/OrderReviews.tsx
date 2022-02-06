import {
  addDoc,
  collection,
  collectionGroup,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import * as React from "react";
import { db } from "../config/firebaseConfig";
import { useFirebaseAuth } from "../context/authContext";
import { Rating, RatingView } from "react-simple-star-rating";
import Image from "next/image";

function OrderReviews({ order }) {
  const { authUser } = useFirebaseAuth();
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");

  const handleRating = (rate) => {
    setRating(rate);
    // Some logic
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let reviewsCollection;
    if (authUser.role === "client") {
      reviewsCollection = collection(
        db,
        `/providers/${order.provider.id}/reviews`
      );
    } else {
      reviewsCollection = collection(db, `/clients/${order.client.id}/reviews`);
    }
    const newReview = await addDoc(reviewsCollection, {
      orderId: order.id,
      user: {
        id: authUser.uid,
        username: authUser.profile.username,
        profile_pic: authUser.profile.profile_pic,
      },
      reviewedTo:
        order.client.id === authUser.uid ? order.provider.id : order.client.id,
      comment,
      rating,
    });
  };
  React.useEffect(() => {
    // const reviewsCollection = collection(db, `/orders/${order.id}/reviews`);
    const q = query(
      collectionGroup(db, "reviews"),
      where("orderId", "==", order.id)
    );
    const unsubscribe = onSnapshot(q, {}, (querySnapshot) => {
      if (querySnapshot.empty) {
        setLoading(false);
        setReviews([]);
      } else {
        const reviews = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          data["id"] = doc.id;
          reviews.push(data);
        });
        console.log(reviews);
        setReviews(reviews);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="bg-white shadow-md mb-16 px-6 py-4 rounded-md">
      <h3 className="text-blue font-bold text-xl mb-8 mt-4">Reviews</h3>
      {reviews.length >> 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="mb-8">
            <div className="flex gap-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                {" "}
                <Image src={review.user.profile_pic} layout="fill" alt="" />
              </div>
              <div className="">
                <p className="font-medium">{review.user.username}</p>
                <RatingView ratingValue={review.rating} size={15} />
                <p className="text-sm">{review.comment}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No Reviews Yet</p>
      )}

      {reviews.filter((review) => review.user.id === authUser.uid).length ===
        0 && (
        <div className="mt-8">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <Rating
              onClick={handleRating}
              ratingValue={rating} /* Rating Props */
            />
            <textarea
              value={comment}
              className="rounded-lg"
              placeholder="Enter Your Comment"
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="text-right">
              <button className="btn btn-yellow mt-4">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default OrderReviews;
