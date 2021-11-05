import FilterSidebar from "../../components/ProvidersSearch/FilterSidebar";
import SearchBar from "../../components/ProvidersSearch/SearchBar";
import SearchResult from "../../components/ProvidersSearch/SearchResult";
import algoliasearch from "algoliasearch/lite";
import { SearchProvider } from "../../context/searchAndFilterContext";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY
);
const index = client.initIndex("providers");

function ProvidersPage({ query, hits }) {
  console.log(hits);
  return (
    <SearchProvider>
      <div className="bg-blue-50 pb-16">
        <div className="container">
          <SearchBar query={query} />
          <div className="grid grid-cols-4 gap-4  mt-16">
            <FilterSidebar query={query} />
            <SearchResult providers={hits.hits} />
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

export default ProvidersPage;

export const getServerSideProps = async (context) => {
  let filtArray = [];
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
  console.log(hits);
  return {
    props: {
      hits,
      query: context.query,
    },
  };
};
