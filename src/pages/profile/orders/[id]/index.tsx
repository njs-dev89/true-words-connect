import { useRouter } from "next/router";
import React, { useEffect } from "react";
import OrderDetails from "../../../../components/OrderDetails";
import { useFirebaseAuth } from "../../../../context/authContext";

function OrderDetailsPage() {
  const { loading, authUser } = useFirebaseAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading || !authUser) {
      router.push("/login");
    }
  }, [authUser, loading, router]);
  if (loading || !authUser) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="bg-blue-50 pb-16 pt-32 min-h-screen">
        <div className="container">
          <OrderDetails />
        </div>
      </div>
    );
  }
}

export default OrderDetailsPage;
