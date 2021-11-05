import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function useSearchAndFilter() {
  const router = useRouter();

  console.log(router.query);
  const [location, setLocation] = useState({
    lat: Number(router.query.lat),
    lng: Number(router.query.lng),
  });
  const [hourlyPrice, setHourlyPrice] = useState({
    minPrice: Number(router.query.min_price),
    maxPrice: Number(router.query.max_price),
  });
  const [language, setLanguage] = useState([]);
  const [distance, setDistance] = useState(Number(router.query.distance));
  const [avgRating, setAvgRating] = useState(
    Number(router.query["avg_rating>"])
  );

  useEffect(() => {
    if (language.length === 0) {
      delete router.query.language;
      router.push({
        pathname: "/[translators]",
        query: { ...router.query },
      });
    }
  }, [language]);

  // useEffect(() => {
  //   setLocation({
  //     lat: Number(router.query.lat),
  //     lng: Number(router.query.lng),
  //   });
  //   setHourlyPrice({
  //     minPrice: Number(router.query.min_price),
  //     maxPrice: Number(router.query.max_price),
  //   });
  //   setLanguage(router.query.language);
  //   setDistance(Number(router.query.distance));
  //   setAvgRating(Number(router.query.avg_rating));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   if (router.query.lng) {
  //     console.log(location);
  //     setLocation({
  //       lat: Number(router.query.lat),
  //       lng: Number(router.query.lng),
  //     });
  //   } else {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         console.log("I ran");
  //         setLocation({
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         });
  //       },
  //       (error) => {}
  //     );
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    const qs = [];
    if (location && location.lng && location.lat) {
      qs.push(`lat=${location.lat}&lng=${location.lng}`);
    }

    if (distance) {
      if (!location || !location.lng) {
        console.log(distance);
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      }
      qs.push(`distance=${distance}`);
    }
    if (avgRating) {
      qs.push(`avg_rating>=${avgRating}`);
    }
    if (hourlyPrice && hourlyPrice.minPrice | hourlyPrice.maxPrice) {
      qs.push(
        `min_price=${hourlyPrice.minPrice}&max_price=${hourlyPrice.maxPrice}`
      );
    }
    if (language) {
      if (language.length > 0) {
        const langQs = language.map((lang) => lang.name);
        qs.push(`language=${langQs.join(",")}`);
      }
    }

    if (!!qs.length) {
      console.log("effect ran again");
      console.log({ location, distance, language, hourlyPrice, avgRating });
      const queryString = qs.join("&");
      console.log(qs);
      router.push(`/translators?${queryString}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, location, hourlyPrice, distance, avgRating]);
  return {
    language,
    location,
    distance,
    hourlyPrice,
    avgRating,
    setLocation,
    setHourlyPrice,
    setLanguage,
    setDistance,
    setAvgRating,
  };
}
