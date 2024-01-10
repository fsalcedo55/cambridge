import Link from "next/link"

interface TableProps {
  headers: {
    label: any
    importance?: number
  }[]
  rows?: IRows[] | undefined
}

export interface IRows {
  id?: string | undefined
  cells:
    | {
        content:
          | string
          | number
          | boolean
          | React.ReactFragment
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | undefined
        href?: string | undefined
        icon?: boolean | undefined
        importance?: number | undefined
      }[]
    | undefined
}

export default function Table({ rows, headers }: TableProps) {
  if (rows?.length == 0) {
    return <div>No Data</div>
  }
  return (
    <div>
      {/* <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-neutral-900">Users</h1>
          <p className="mt-2 text-sm text-neutral-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            Add user
          </button>
        </div>
      </div> */}
      <div className="mt-2 -mx-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-neutral-300">
          <thead className="bg-neutral-100">
            <tr>
              {headers.map((header, idx) =>
                header.importance === 1 ? (
                  <th
                    key={idx}
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                  >
                    {header.label}
                  </th>
                ) : header.importance === 2 ? (
                  <th
                    key={idx}
                    scope="col"
                    className="hidden sm:table-cell py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                  >
                    {header.label}
                  </th>
                ) : header.importance === 3 ? (
                  <th
                    key={idx}
                    scope="col"
                    className="hidden md:table-cell py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                  >
                    {header.label}
                  </th>
                ) : header.importance === 4 ? (
                  <th
                    key={idx}
                    scope="col"
                    className="hidden lg:table-cell py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                  >
                    {header.label}
                  </th>
                ) : (
                  <th
                    key={idx}
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-neutral-900 sm:pl-6"
                  >
                    {header.label}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y overflow-x divide-neutral-100">
            {rows?.map((row, idx) => (
              <tr key={idx}>
                {row.cells?.map((cell, cellIdx) =>
                  cell.importance === 1 ? (
                    <td
                      key={cellIdx}
                      className="py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 whitespace-nowrap sm:pl-6 "
                    >
                      {cell.href ? (
                        <Link href={cell.href} legacyBehavior>
                          <span className="cursor-pointer hover:underline hover:text-primary-500">
                            {cell.content}
                          </span>
                        </Link>
                      ) : (
                        <span>{cell.content}</span>
                      )}
                    </td>
                  ) : cell.importance === 2 ? (
                    <td
                      key={cellIdx}
                      className="hidden py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 whitespace-nowrap sm:pl-6 sm:table-cell"
                    >
                      {cell.href ? (
                        <Link href={cell.href} legacyBehavior>
                          <span className="cursor-pointer hover:underline hover:text-primary-500">
                            {cell.content}
                          </span>
                        </Link>
                      ) : (
                        <span>{cell.content}</span>
                      )}
                    </td>
                  ) : cell.importance === 3 ? (
                    <td
                      key={cellIdx}
                      className="hidden py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 whitespace-nowrap sm:pl-6 md:table-cell"
                    >
                      {cell.href ? (
                        <Link href={cell.href} legacyBehavior>
                          <span className="cursor-pointer hover:underline hover:text-primary-500">
                            {cell.content}
                          </span>
                        </Link>
                      ) : (
                        <span>{cell.content}</span>
                      )}
                    </td>
                  ) : cell.importance === 4 ? (
                    <td
                      key={cellIdx}
                      className="hidden py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 whitespace-nowrap sm:pl-6 lg:table-cell"
                    >
                      {cell.href ? (
                        <Link href={cell.href} legacyBehavior>
                          <span className="cursor-pointer hover:underline hover:text-primary-500">
                            {cell.content}
                          </span>
                        </Link>
                      ) : (
                        <span>{cell.content}</span>
                      )}
                    </td>
                  ) : (
                    <td
                      key={cellIdx}
                      className="py-4 pl-4 pr-3 text-sm font-medium text-neutral-900 whitespace-nowrap sm:pl-6 "
                    >
                      {cell.href ? (
                        <Link href={cell.href} legacyBehavior>
                          <span className="cursor-pointer hover:underline hover:text-primary-500">
                            {cell.content}
                          </span>
                        </Link>
                      ) : (
                        <span>{cell.content}</span>
                      )}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// export default function Table({ rows, headers }: TableProps) {
//   return (
//     <div className="overflow-x-auto rounded-lg shadow">
//       <table className="table w-full">
//         {/* <!-- head --> */}
//         <thead>
//           <tr>
//             {headers?.map((header) => (
//               <th key={header.id}>{header.label}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {/* <!-- row --> */}

//           {rows?.map((row, idx) => (
//             <tr key={idx}>
//               {row.cells?.map((cell, cellIdx) =>
//                 cell.href ? (
//                   <Link href={cell.href} key={cellIdx}>
//                     <td className="font-bold link link-hover hover:text-primary-500 text-neutral-700 hover:bg-neutral-50">
//                       {cell.content}
//                     </td>
//                   </Link>
//                 ) : (
//                   <td key={cellIdx} className="text-neutral-700">
//                     {cell.content}
//                   </td>
//                 )
//               )}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )
// }
