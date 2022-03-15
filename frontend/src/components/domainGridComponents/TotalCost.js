import { Card, CardContent, Typography } from "@mui/material";
import { useTheme } from '@material-ui/core';;

const TotalCost = ({ cost }) => {
    const theme = useTheme()

    console.log(cost)

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Typography color="textSecondary" variant="overline" gutterBottom>
                    TOTAL SPENT
                </Typography>
                <Typography color="textPrimary" variant="h4">
                    ${cost}    
                </Typography>
            </CardContent>
        </Card>
    )
}

export default TotalCost