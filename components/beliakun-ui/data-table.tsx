import * as React from "react"
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface DataTableColumn<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

export interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  searchPlaceholder?: string
  pageSize?: number
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Cari data...",
  pageSize = 5,
}: DataTableProps<T>) {
  const [search, setSearch] = React.useState("")
  const [sortKey, setSortKey] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")
  const [page, setPage] = React.useState(1)

  const filteredData = React.useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some(
        (val) => val && String(val).toLowerCase().includes(search.toLowerCase())
      )
    )
  }, [data, search])

  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey]
      const valB = b[sortKey]
      if (valA < valB) return sortDirection === "asc" ? -1 : 1
      if (valA > valB) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortKey, sortDirection])

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, page, pageSize])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDirection("asc")
    }
  }

  return (
    <div className="space-y-3 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:max-w-xs">
          <Input
            leftIcon={<Search className="w-4 h-4" />}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            onClear={() => {
              setSearch("")
              setPage(1)
            }}
          />
        </div>
        <span className="text-xs font-bold text-[var(--muted-foreground)] self-end sm:self-auto">
          Total: {sortedData.length} data
        </span>
      </div>

      <Table striped>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-1.5 font-extrabold hover:text-blue-600 focus:outline-none min-h-[36px]"
                  >
                    <span>{col.header}</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                  </button>
                ) : (
                  col.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-[var(--muted-foreground)] font-bold">
                Data tidak ditemukan
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]/20 text-xs font-bold text-[var(--muted-foreground)]">
        <span>
          Halaman {page} dari {totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="secondary"
            size="xs"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </Button>
          <Button
            variant="secondary"
            size="xs"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
