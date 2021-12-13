import FilterSidebar from "../../components/ProvidersSearch/FilterSidebar";
import SearchBar from "../../components/ProvidersSearch/SearchBar";
import SearchResult from "../../components/ProvidersSearch/SearchResult";
import algoliasearch from "algoliasearch/lite";
import { SearchProvider } from "../../context/searchAndFilterContext";
import Head from "next/head";
import { useEffect, useState } from "react";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);
const index = client.initIndex("providers");

function ProvidersPage({ query, hits }) {
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    if (!!query.lng) {
      setCurrentPosition({
        lat: Number(query.lat),
        lng: Number(query.lng),
      });
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {}
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SearchProvider>
      <div className="bg-light-blue pb-16">
        <Head>
          <title>Providers | TWC</title>
          <meta
            name="description"
            content="List of providers on true words connect"
          />
          <link rel="icon" href="/logo.svg" />
        </Head>
        <div className="container">
          <SearchBar
            query={query}
            currentPosition={currentPosition}
            setCurrentPosition={setCurrentPosition}
          />
          <div className="grid grid-cols-4 gap-4  mt-16">
            <FilterSidebar query={query} />
            <SearchResult
              providers={hits.hits}
              currentPosition={currentPosition}
            />
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

export default ProvidersPage;

export const getServerSideProps = async (context) => {
  let filtArray = ["isProfileComplete=1", "isStripeOnboardingComplete=1"];
  let filters, aroundLatLng, aroundRadius;
  // console.log(context);
  if (context.query.lat) {
    aroundLatLng = `${Number(context.query.lat)}, ${Number(context.query.lng)}`;
  }
  if (context.query.distance) {
    aroundRadius = `${Number(context.query.distance * 1000)}`;
  }
  if (context.query.language) {
    context.query.language
      .split(",")
      .forEach((lang) => filtArray.push(`languages.language:${lang}`));
  }
  if (context.query["avg_rating>"]) {
    filtArray.push(`avg_rating >= ${Number(context.query["avg_rating>"])}`);
  }
  if (context.query.min_price) {
    filtArray.push(
      `hourly_rate >= ${Number(
        context.query.min_price
      )} AND hourly_rate <= ${Number(context.query.max_price)}`
    );
  }

  if (filtArray.length) {
    filters = filtArray.join(" AND ");
  }
  console.log(filters);
  const hits = await index.search("", {
    aroundLatLng: aroundLatLng,
    aroundRadius,
    filters: filters,
  });

  return {
    props: {
      hits,
      query: context.query,
    },
  };
};
