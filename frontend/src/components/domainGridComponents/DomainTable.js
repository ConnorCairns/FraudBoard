import CostTable from "./CostTable";
import { useReducerContext } from "../../services/ReducerProvider";

const headCells = [
    {
        id: 'colKey',
        numeric: false,
        label: 'Key'
    },
    {
        id: 'value',
        numeric: false,
        label: 'Value'
    }
]

const DomainTable = ({ titleRef }) => {
    const [state,] = useReducerContext()

    const tableData = [
        {
            key: 'registrar',
            colKey: 'Registrar',
            value: state.currDomain.registrar
        },
        {
            key: 'creationDate',
            colKey: 'Domain Creation Date',
            value: state.currDomain.creation_date
        },
        {
            key: 'expirationDate',
            colKey: 'Domain Expiration Date',
            value: state.currDomain.expiration_date
        },
        {
            key: 'name',
            colKey: 'Name',
            value: state.currDomain.name
        },
        {
            key: 'email',
            colKey: 'Email(s)',
            value: Array.isArray(state.currDomain.emails) ? state.currDomain.emails.join(', ') : state.currDomain.emails
        },
        {
            key: 'org',
            colKey: 'Org',
            value: state.currDomain.org
        },
        {
            key: 'address',
            colKey: 'Address',
            value: state.currDomain.address
        },
        {
            key: 'city',
            colKey: 'City',
            value: state.currDomain.city
        },
        {
            key: 'country',
            colKey: 'Country',
            value: state.currDomain.country
        },
        {
            key: 'state',
            colKey: 'State',
            value: state.currDomain.state
        },
        {
            key: 'zipcode',
            colKey: 'Zipcode',
            value: state.currDomain.zipcode
        }
    ]

    return (
        <CostTable headCells={headCells} tableData={tableData} titleRef={titleRef} />
    )
}

export default DomainTable