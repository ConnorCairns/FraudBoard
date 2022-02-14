import { useState, useCallback } from "react";
import { FormGroup, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const SettingsPanel = ({ onApply, type, size }) => {
    const [sizeState, setSize] = useState(size);
    const [typeState, setType] = useState(type);
    const [selectedPaginationValue, setSelectedPaginationValue] = useState(-1);

    const handleSizeChange = useCallback((event) => {
        setSize(Number(event.target.value));
    }, []);

    const handleDatasetChange = useCallback((event) => {
        setType(event.target.value);
    }, []);

    const handlePaginationChange = useCallback((event) => {
        setSelectedPaginationValue(event.target.value);
    }, []);


    const handleApplyChanges = useCallback(() => {
        onApply({
            size: sizeState,
            type: typeState,
            pagesize: selectedPaginationValue,
        });
    }, [sizeState, typeState, selectedPaginationValue, onApply]);

    return (
        <FormGroup className="MuiFormGroup-options" row>
            <FormControl variant="standard">
                <InputLabel>Dataset</InputLabel>
                <Select value={typeState} onChange={handleDatasetChange}>
                    <MenuItem value="Employee">Employee</MenuItem>
                    <MenuItem value="Commodity">Commodity</MenuItem>
                </Select>
            </FormControl>
            <FormControl variant="standard">
                <InputLabel>Rows</InputLabel>
                <Select value={sizeState} onChange={handleSizeChange}>
                    <MenuItem value={100}>10</MenuItem>
                    <MenuItem value={1000}>{Number(100).toLocaleString()}</MenuItem>
                    <MenuItem value={10000}>{Number(1000).toLocaleString()}</MenuItem>
                    <MenuItem value={100000}>{Number(10000).toLocaleString()}</MenuItem>
                </Select>
            </FormControl>
            <FormControl variant="standard">
                <InputLabel>Page Size</InputLabel>
                <Select value={selectedPaginationValue} onChange={handlePaginationChange}>
                    <MenuItem value={-1}>off</MenuItem>
                    <MenuItem value={0}>auto</MenuItem>
                    <MenuItem value={25}>25</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    <MenuItem value={1000}>{Number(1000).toLocaleString()}</MenuItem>
                </Select>
            </FormControl>
            <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={handleApplyChanges}
            >
                <KeyboardArrowRightIcon fontSize="small" /> Apply
            </Button>
        </FormGroup>
    );
}

export default SettingsPanel