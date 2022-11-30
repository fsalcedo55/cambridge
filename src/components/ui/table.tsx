import Link from "next/link"

interface TableProps {
  headers: {
    id: string
    label: any
  }[]
  rows?: IRows[]
}

interface IRows {
  id?: string
  cells:
    | {
        content:
          | string
          | number
          | boolean
          | React.ReactFragment
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        href?: string | undefined
        icon?: boolean
      }[]
}

export default function Table({ rows, headers }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="table w-full">
        {/* <!-- head --> */}
        <thead>
          <tr>
            {headers?.map((header) => (
              <th key={header.id}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* <!-- row --> */}

          {rows?.map((row, idx) => (
            <tr key={idx}>
              {row.cells?.map((cell, cellIdx) =>
                cell.href ? (
                  <Link href={cell.href} key={cellIdx}>
                    <td className="font-bold link link-hover hover:text-primary-500 text-neutral-700">
                      {cell.content}
                    </td>
                  </Link>
                ) : (
                  <td key={cellIdx} className="text-neutral-700">
                    {cell.content}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
