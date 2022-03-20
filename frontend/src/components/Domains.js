// import { useTheme } from '@material-ui/core';
import { Paper, Typography, Box, Popper } from '@mui/material';
import useFetch from '../hooks/useFetch.js';
import Title from './Title';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { memo, useEffect, useRef, useState } from 'react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { unmarshall } from '../utils/unmarshall'
import { useReducerContext } from '../services/ReducerProvider.js';

function isOverflown(element) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

const GridCellExpand = memo(function GridCellExpand(props) {
  const { width, value } = props;
  const wrapper = useRef(null);
  const cellDiv = useRef(null);
  const cellValue = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFullCell, setShowFullCell] = useState(false);
  const [showPopper, setShowPopper] = useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      // IE11, Edge (prior to using Bink?) use 'Esc'
      if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <Box
      ref={wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={{
        alignItems: 'center',
        lineHeight: '24px',
        width: 1,
        height: 1,
        position: 'relative',
        display: 'flex',
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: 1,
          width,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      <Box
        ref={cellValue}
        sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {value !== true && value}
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}
          >
            <Typography variant="body2" style={{ padding: 8 }}>
              {value}
            </Typography>
          </Paper>
        </Popper>
      )}
    </Box>
  );
});

function renderCellExpand(params) {
  return (
    <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
  );
}

const initialState = {
  "columns": {
    "columnVisibilityModel": {
      "creation_date": false,
      "expiration_date": false,
      "registrar": false,
      "address": false,
      "city": false,
      "country": false,
      "state": false,
      "zipcode": false,
      "dnssec": false,
      "emails": false,
      "name": false,
      "name_servers": false,
      "org": false,
    }
  }
}

const Domains = ({ title = "Domains", DataGridProps, reqLimit = 5 }) => {
  const URL = `http://localhost:4000/get-domains?limit=${reqLimit}`
  const [status, domains] = useFetch(URL)
  const [rows, setRows] = useState();
  const navigate = useNavigate();
  const [, dispatch] = useReducerContext();

  const columns = [
    { field: 'domain_name', headerName: 'Domain Name', flex: 1, minWidth: 280, renderCell: renderCellExpand },
    { field: 'category', headerName: 'Category', flex: 1, align: 'center', minWidth: 100, renderCell: renderCellExpand },
    { field: 'domain_cost', type: 'number', headerName: 'Domain Cost', flex: 0.6, align: 'right', minWidth: 100, valueFormatter: ({ value }) => `$${parseFloat(value).toFixed(2)}` },
    { field: 'hosting_cost', type: 'number', headerName: 'Hosting Cost', flex: 0.6, align: 'right', minWidth: 100, valueFormatter: ({ value }) => `$${parseFloat(value).toFixed(2)}` },
    { field: 'advertising_spend', type: 'number', headerName: 'Advertising Cost', flex: 0.8, align: 'right', minWidth: 130, valueFormatter: ({ value }) => `$${parseFloat(value).toFixed(2)}` },
    { field: 'total_spent', type: 'number', headerName: 'Total Spent', flex: 0.6, align: 'right', minWidth: 100, valueFormatter: ({ value }) => `$${parseFloat(value).toFixed(2)}` },
    { field: 'creation_date', headerName: 'Registration Date', flex: 1, minWidth: 170, renderCell: renderCellExpand },
    { field: 'expiration_date', headerName: 'Expiration Date', flex: 1, minWidth: 170, renderCell: renderCellExpand },
    { field: 'registrar', headerName: 'Registrar', flex: 1, minWidth: 150, overflow: 'auto', renderCell: renderCellExpand },
    { field: 'address', headerName: 'Address', flex: 1, minWidth: 300, renderCell: renderCellExpand },
    { field: 'city', headerName: 'City', flex: 1, minWidth: 150, renderCell: renderCellExpand },
    { field: 'country', headerName: 'Country', flex: 1, minWidth: 150, renderCell: renderCellExpand },
    { field: 'state', headerName: 'State', flex: 1, minWidth: 200, renderCell: renderCellExpand },
    { field: 'zipcode', headerName: 'Zipcode', flex: 1, minWidth: 100, renderCell: renderCellExpand },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 200, renderCell: renderCellExpand },
    { field: 'org', headerName: 'Org', flex: 1, minWidth: 200, renderCell: renderCellExpand },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<OpenInNewIcon />}
          label="Delete"
          onClick={() => {
            dispatch({ type: 'updateDomainHistory', payload: params.id })
            navigate(`/domains/${params.id}`)
          }}
        />,
      ],
    },
  ]

  useEffect(() => {
    if (status === 'fetched') {
      let rows = unmarshall(domains)
      setRows(rows)
    }

  }, [status, domains])

  // const theme = useTheme()

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', mt: '0.5rem' }}>
      <Title title={title} />
      {rows !== undefined ?
        <>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.domain_name}
            onRowClick={(row) => console.log(row)}
            autoHeight
            rowsPerPageOptions={[5, 10, 100]}
            initialState={{
              ...initialState,
            }}
            {...DataGridProps}
          />
        </>
        :
        <Typography>Loading ...</Typography>
      }
    </Paper >
  )
}

export default Domains