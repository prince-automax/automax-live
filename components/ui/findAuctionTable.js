import React from "react";
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";

import {
  SearchIcon,
  SelectorIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from "@heroicons/react/outline";

function Datatable(props) {
 
  const {
    tableColumns,
    tableData,
    onRowClickPath,
    alternateLayout,
    hideSearch,
    wrapperClass,
    rowClass,
  } = props;



  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  return (
    <div>
      {useSortBy}
      {!hideSearch && (
        <div className="mt-0.5 my-6">
          <div className="relative rounded-md shadow-sm max-w-sm space-y-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              value={globalFilter || ""}
              onChange={(e) => setGlobalFilter(e.target.value || undefined)}
              type="text"
              name="text"
              id="text"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search.."
              autoComplete="off"
            />
          </div>
        </div>
      )}

      {!alternateLayout ? (
        <div className="mt-2 ring-1 ring-gray-300 rounded-lg overflow-auto max-w-7xl mx-auto">
          <table
            {...getTableProps()}
            className=" w-full  divide-y divide-gray-300 "
          >
            <thead className="bg-primary rounded-lg ">
              {headerGroups.map((headerGroup, hgidx) => (
                <tr
                  key={hgidx}
                  className="divide-x divide-gray-200"
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {headerGroup.headers.map((column, colIdx) => (
                    <th
                      key={colIdx}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="py-3.5 pl-1 pr-1 text-sm font-semibold text-gray-100 text-left sm:pl-2"
                    >
                      <span className="whitespace-nowrap">
                        {column.render("Header")}
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <SortDescendingIcon className="ml-2 text-yellow-400 inline-flex h-5 w-5" />
                          ) : (
                            <SortAscendingIcon className="ml-2 text-yellow-400 inline-flex h-5 w-5" />
                          )
                        ) : (
                          <SelectorIcon className="ml-2 inline-flex h-5 w-5" />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()} className=" ">
              {page.map((row, rowIdx) => {
                prepareRow(row);
                return (
                  <tr
                    key={rowIdx}
                    {...row.getRowProps()}
                    className={
                      onRowClickPath
                        ? "divide-x divide-gray-200 cursor-pointer hover:bg-indigo-50"
                        : "divide-x divide-gray-200"
                    }
                  >
                    {row.cells.map((cell, cellIdx) => {
                      return (
                        <td
                          key={cellIdx}
                          {...cell.getCellProps()}
                          className="px-6 py-3.5 text-sm text-gray-800 border-t border-gray-200"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div {...getTableBodyProps()} className={wrapperClass}>
          {page.map((row, rIdx) => {
            prepareRow(row);
            return (
              <div
                key={rIdx}
                {...row.getRowProps()}
                className={onRowClickPath ? "cursor-pointer" : ""}
              >
                {row.cells.map((cell, cIdx) => {
                  return (
                    <div
                      key={cIdx}
                      {...cell.getCellProps()}
                      className={rowClass}
                    >
                      {cell.render("Cell")}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      <div className="my-4">
        {pageOptions.length > 1 && (
          <nav
            className="px-4 py-3 flex items-center justify-between sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing page{" "}
                <span className="font-medium"> {pageIndex + 1} </span> of{" "}
                <span className="font-medium">{pageOptions.length}</span> pages
              </p>
            </div>

            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}

Datatable.defaultProps = {
  alternateLayout: false,
  hideSearch: false,
  wrapperClass: "",
  rowClass: "",
};

export default Datatable;
