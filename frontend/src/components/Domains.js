import { useTheme } from '@material-ui/core';
import { Link, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import useFetch from '../hooks/useFetch.js';
import DomainRow from './DomainRow.js';

const Domains = () => {
    const URL = "http://localhost:4000/get-domains"
    const [status, domains] = useFetch(URL)

    const theme = useTheme()

    return (
        <>
            {status === 'fetched' ?
                <>
                    <Typography component="h2" variant="h6" color={theme.palette.info.main} gutterBottom>Recent Orders</Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Domain Name</TableCell>
                                <TableCell>Registration Date</TableCell>
                                <TableCell>Expiration Date</TableCell>
                                <TableCell>Registrar</TableCell>
                                <TableCell align="right">Amount Spent</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {domains.map((domain) => (
                                <DomainRow domainData={domain} key={domain.domain_name.S} />
                            ))}
                        </TableBody>
                    </Table>
                    <Link color={theme.palette.info.main} href="#" onClick={(e) => e.preventDefault} sx={{ pt: 3 }}>
                        See more orders
                    </Link>
                </>
                :
                <Typography>Loading ...</Typography>
            }
        </>
    )
}

export default Domains