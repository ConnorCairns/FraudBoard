import { TableRow, TableCell } from '@mui/material';
import { styled } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom';

const ClickableTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': { backgroundColor: 'rgba(0, 0, 0, 0.025)' },
    cursor: 'pointer'
}))


const DomainRow = ({ domainData }) => {
    const navigate = useNavigate()

    return (
        <ClickableTableRow hover={true} onClick={() => navigate(`/domain/${domainData.domain_name.S}`)} key={domainData.domain_name.S}>
            <TableCell>{domainData.domain_name.S}</TableCell>
            <TableCell>{domainData.creation_date.S}</TableCell>
            <TableCell>{domainData.expiration_date.S}</TableCell>
            <TableCell>{domainData.registrar.S}</TableCell>
            <TableCell align="right">${domainData.domain_cost.N}</TableCell>
        </ClickableTableRow>
    )
}

export default DomainRow