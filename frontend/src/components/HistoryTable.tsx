import { useState, useEffect } from "react";
import type { ReviewHistoryItem } from "../types/history";
import { Container, Chip, Stack } from "@mui/material";
import { reviewPointColors } from "../theme";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TablePagination } from "@mui/material";

function HistoryTable({histories}: {histories:ReviewHistoryItem[]}) {
    function formatDate(date: string) {
        const d = new Date(date);
        const year = String(d.getFullYear())
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        const hour = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const second = String(d.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minutes}:${second}`;
    }
    const rowsPerPage = 10;
    const [page, setPage] = useState(0);

    const pagedHistories = histories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    return (
        <Container>
            <TableContainer sx={{ minHeight: 620 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                    <TableRow>
                        <TableCell>言語</TableCell>
                        <TableCell>コード</TableCell>
                        <TableCell>レビュー観点</TableCell>
                        <TableCell>レビュー日時</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {pagedHistories.map((row) => (
                        <TableRow
                        key={row.id.toString()}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {row.language}
                        </TableCell>
                        <TableCell component="th" scope="row">
                            {row.code.length > 50 ? row.code.slice(0,50) + '...' : row.code}
                        </TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap" }}>
                                {row.review_points.map((point) => (
                                    <Chip
                                        key={point}
                                        label={point}
                                        size="small"
                                        sx={{
                                            backgroundColor: reviewPointColors[point].bg,
                                            color: reviewPointColors[point].text,
                                        }}
                                    />
                                ))}
                            </Stack>
                        </TableCell>
                        <TableCell>{formatDate(row.created_at)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={histories.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10]}
            />
        </Container>
    )
}

export default HistoryTable;