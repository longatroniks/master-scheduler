import { forwardRef } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';
// routes
import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();

    const PRIMARY_LIGHT = theme.palette.primary.light;
    const PRIMARY_MAIN = theme.palette.primary.main;
    const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="public/favicon/images.png" // Set the path to your PNG image
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 90,
          height: 90,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <img
          src="/Users/shmungula/SENIOR/master-scheduler/public/favicon/logo_single2.png" // Set the path to your PNG image// Set the path to your PNG image
          alt="Logo"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
