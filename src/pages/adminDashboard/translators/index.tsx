import { useEffect, useState } from "react";

function TranslatorsPage() {
  const [openTab, setOpenTab] = useState(1);

  return (
    <div className="col-span-3 rounded-xl">
      <div className="flex flex-wrap">
        <div className="w-full px-8 pt-6">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                  <div className="">
                    <h3 className="text-blue-600 font-bold text-xl">
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

                      <tbody>
                        <tr className=" bg-white hover:bg-gray-200 rounded-table-cell shadow">
                          <td className="py-2 pl-5 last:pr-5">1</td>
                          <td className="py-2 pl-5 last:pr-5">John Doe</td>
                          <td className="py-2 pl-5 last:pr-5">Akan, Ewe</td>
                          <td className="py-2 pl-5 last:pr-5">View Details</td>
                        </tr>

                        <tr className=" bg-white hover:bg-gray-200 rounded-table-cell shadow">
                          <td className="py-2 pl-5 last:pr-5">2</td>
                          <td className="py-2 pl-5 last:pr-5">John Doe</td>
                          <td className="py-2 pl-5 last:pr-5">Akan, Ewe</td>
                          <td className="py-2 pl-5 last:pr-5">View Details</td>
                        </tr>

                        <tr className=" bg-white hover:bg-gray-200 rounded-table-cell shadow">
                          <td className="py-2 pl-5 last:pr-5">3</td>
                          <td className="py-2 pl-5 last:pr-5">John Doe</td>
                          <td className="py-2 pl-5 last:pr-5">Akan, Ewe</td>
                          <td className="py-2 pl-5 last:pr-5">View Details</td>
                        </tr>
                      </tbody>
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

export default TranslatorsPage;
