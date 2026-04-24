import { IconButton, Tooltip } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { MaterialReactTable, MRT_ShowHideColumnsButton, MRT_ToggleDensePaddingButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, useMaterialReactTable } from "material-react-table";
import Link from "next/link";
import { useState } from "react"
import RecyclingIcon from '@mui/icons-material/Recycling';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import useDeleteMutation from "@/hooks/useDeleteMutation";
import LoadedButton from "../LoadedButton";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { showToast } from "@/lib/showToast";
import { download, generateCsv, mkConfig } from "export-to-csv";

const DataTable = ({
    queryKey,
    fetchUrl,
    columnsConfig,
    initialPageSize = 10,
    exportEndPoint,
    deleteEndPoint,
    deleteType,
    trashView,
    createAction,
}) => {
    // filter , sorting and pagination states
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilters, setGlobalFilters] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: initialPageSize
    });
    const [rowSelection, setRowSelection] = useState({})

    // export loading state

    const [exportLoading, setExportLoading] = useState(false)


    // handle delete method

    const deleteMutation = useDeleteMutation(queryKey, deleteEndPoint)

    const handleDelete = (ids, deleteType) => {
        let c = true;
        if (deleteType === 'PD') {
            c = confirm("Are You Sure you want to delete the data permanently?")
        } else if (deleteType === 'SD') {
            c = confirm("Are You Sure you want put data in trash?")
        }
        if (c) {
            deleteMutation.mutate({ ids, deleteType })
            setRowSelection({});
        }
    }

    // handle export 


    const handleExport = async (selectedRows) => {

        setExportLoading(true);
        try {

            const csvConfig = mkConfig({
                fieldSeparator: ',',
                decimalSeparator: '.',
                useKeysAsHeaders: true,
                filename: 'csv-data',
            })

            let csv
            if (Object.keys(rowSelection).length > 0) {
                // export only selected rows
                const rowData = selectedRows.map((row) => row.original);
                csv = generateCsv(csvConfig)(rowData)
            } else {
                // export all data

                const response = await fetch(exportEndPoint, { method: 'GET' })
                const result = await response.json()
                if (!result.success) {
                    throw new Error(result.message)
                }
                const rowData = result.data
                csv = generateCsv(csvConfig)(rowData)
            }
            download(csvConfig)(csv)

        } catch (error) {
            console.log(error)
            showToast('error', error.message)
        } finally {
            setExportLoading(false)
        }

    }

    // Data fetching logics

    const {
        data: { data = [], meta } = {},
        isError,
        isRefetching,
        isLoading
    } = useQuery({
        queryKey: [queryKey, {
            columnFilters,
            globalFilters,
            pagination,
            sorting
        }],
        queryFn: async () => {
            const url = new URL(fetchUrl, process.env.NEXT_PUBLIC_BASE_URL);
            url.searchParams.set('start', `${pagination.pageIndex * pagination.pageSize}`);
            url.searchParams.set('size', `${pagination.pageSize}`);
            url.searchParams.set('filters', JSON.stringify(columnFilters ?? []));
            url.searchParams.set('globalFilter', globalFilters ?? '');
            url.searchParams.set('sorting', JSON.stringify(sorting ?? []));
            url.searchParams.set('deleteType', deleteType);

            const result = await fetch(url.href, { method: 'GET' });
            return result.json();
        },
        placeholderData: keepPreviousData, //don't go to 0 rows when refetching or paginating to next page

    })
    // initialize Table
    const table = useMaterialReactTable({
        columns: columnsConfig,
        data,
        enableRowSelection: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        enableColumnOrdering: true,
        enableStickyHeader: true,
        enableStickyFooter: true,
        initialState: { showColumnFilters: true },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: isError
            ? {
                color: 'error',
                children: 'Error loading data',
            }
            : undefined,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilters,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        rowCount: meta?.totalRowCount ?? 0,
        onRowSelectionChange: setRowSelection,
        state: {
            columnFilters,
            globalFilters,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
            rowSelection
        },
        getRowId: (originalRow) => originalRow._id,
        renderToolbarInternalActions: ({ table }) => (

            <>
                {/* built in buttons */}
                <MRT_ToggleGlobalFilterButton table={table} />
                <MRT_ShowHideColumnsButton table={table} />
                <MRT_ToggleFullScreenButton table={table} />
                <MRT_ToggleDensePaddingButton table={table} />

                {
                    deleteType !== 'PD'
                    && <Tooltip title='Recycle Bin' >
                        <Link href={trashView}>
                            <IconButton>
                                <RecyclingIcon />
                            </IconButton>
                        </Link>
                    </Tooltip>
                }
                {
                    deleteType === 'SD' &&
                    <Tooltip title="Delete All">
                        <span>
                            <IconButton
                                disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                                onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                }
                {
                    deleteType === 'PD' &&
                    <>
                        <Tooltip title='Restore Data' >
                            <IconButton disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                                onClick={() => handleDelete(Object.keys(rowSelection), 'RSD')}>
                                <RestoreFromTrashIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Permanently Delete Data' >
                            <IconButton disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                                onClick={() => handleDelete(Object.keys(rowSelection), deleteType)}>
                                <DeleteForeverIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                }

            </>
        ),
        enableRowActions: true,
        positionActionsColumn: 'last',
        renderRowActionMenuItems: ({ row }) => createAction(row, deleteType, handleDelete),
        renderTopToolbarCustomActions: ({ table }) => (
            <Tooltip title="Export CSV">
                <LoadedButton
                    text={<>
                        <FileDownloadIcon fontSize="50" /> Export
                    </>}
                    type="button"
                    loading={exportLoading}
                    onClick={() => handleExport(table.getSelectedRowModel().rows)}
                    className='cursor-pointer'
                />
            </Tooltip>
        )
    })

    return (
        <MaterialReactTable table={table} />
    )

}

export default DataTable