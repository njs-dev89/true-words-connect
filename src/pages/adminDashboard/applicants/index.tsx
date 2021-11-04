import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useApplicants from "../../../customHooks/useApplicants";
import { useFirebaseAuth } from "../../../context/authContext";

function ApplicationsPage() {
  const router = useRouter();
  const { dataLoading, applicants } = useApplicants();
  const { authUser, loading } = useFirebaseAuth();
  useEffect(() => {
    if (!loading && !authUser) {
      router.push("/login");
    }
  }, [authUser]);
  if (loading) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="col-span-3 rounded-xl">
        <div className="flex flex-wrap">
          <div className="w-full px-8 pt-6">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6">
              <div className="px-4 py-5 flex-auto">
                <div className="tab-content tab-space">
                  <div className={"block"} id="link1">
                    <div className="">
                      <h3 className="text-blue font-bold text-xl">
                        Applicants
                      </h3>
                      <table className="w-full p-5 text-gray-700 table-bottom-spaced">
                        <thead>
                          <tr className="bg-white rounded-table-cell">
                            <th className="text-left font-bold py-2 pl-5 uppercase">
                              S.No.
                            </th>
                            <th className="text-left font-bold py-2 pl-5 uppercase">
                              Username
                            </th>
                            <th className="text-left font-bold py-2 pl-5 uppercase">
                              Languages
                            </th>
                            <th className="text-left font-bold py-2 pl-5 uppercase">
                              Action
                            </th>
                          </tr>
                        </thead>

                        {dataLoading ? (
                          <tbody>
                            <tr className=" bg-white hover:bg-gray-200 rounded-table-cell shadow">
                              <td className="py-2 pl-5 last:pr-5">loading</td>
                            </tr>
                          </tbody>
                        ) : (
                          <tbody>
                            {applicants.map((applicant) =>
                              console.log(applicant)
                            )}
                            {console.log(typeof [])}
                            {applicants.map((applicant, idx) => (
                              <tr
                                className=" bg-white hover:bg-gray-200 rounded-table-cell shadow"
                                key={applicant.id}
                              >
                                <td className="py-2 pl-5 last:pr-5">
                                  {idx + 1}
                                </td>
                                <td className="py-2 pl-5 last:pr-5">
                                  {applicant.username}{" "}
                                </td>
                                <td className="py-2 pl-5 last:pr-5">
                                  {applicant.languages
                                    .map((lang) => lang.language)
                                    .join(",")}
                                </td>
                                <td className="py-2 pl-5 last:pr-5">
                                  <Link
                                    href={`/adminDashboard/applicants/${applicant.id}`}
                                  >
                                    <a>View Details</a>
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ApplicationsPage;
