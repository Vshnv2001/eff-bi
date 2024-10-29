import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface LinearProgressWithLabelProps extends LinearProgressProps {
  value: number;
}

function LinearProgressWithLabel({ value, ...props }: LinearProgressWithLabelProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={value} {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}


export default LinearProgressWithLabel;
