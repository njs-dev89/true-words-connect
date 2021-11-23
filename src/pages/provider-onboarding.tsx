import React, { useEffect } from "react";
import ProviderOnboarding from "../components/AuthForms/ProviderOnboarding";
import { useFirebaseAuth } from "../context/authContext";
import { useRouter } from "next/router";

function providerOnboardingPage() {
  const { authUser, loading } = useFirebaseAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !authUser) router.push("/providers");
  }, [authUser, loading, router]);
  return <ProviderOnboarding />;
}

export default providerOnboardingPage;
