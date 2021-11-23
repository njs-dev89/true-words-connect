import {
  collection,
  collectionGroup,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../config/firebaseConfig";
import { useFirebaseAuth } from "../../context/authContext";
import Image from "next/image";
import { RatingView } from "react-simple-star-rating";

function UserReviews() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState(null);
  const { authUser } = useFirebaseAuth();
  useEffect(() => {
    let reviewsCollection;

    if (authUser.role === "client") {
      reviewsCollection = collection(db, `/clients/${authUser.uid}/reviews`);
    } else {
      reviewsCollection = collection(db, `/providers/${authUser.uid}/reviews`);
    }
    const q = query(reviewsCollection);

    const unsubscribe = onSnapshot(q, {}, (querySnapshot) => {
      const reviews = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data["id"] = doc.id;
        reviews.push(data);
      });

      setReviews(reviews);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  return loading ? (
    <p>Loading...</p>
  ) : (
    <div className="mb-16 px-6 py-4 rounded-md">
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
    </div>
  );
}

export default UserReviews;
