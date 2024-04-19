// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// routes
import { useRouter } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// components
import { Avatar, Box } from '@mui/material';

export default function JwtLoginView() {
  const router = useRouter();

  const renderHead = (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
      <Avatar
        alt="avatar"
        sx={{
          width: 36,
          height: 36,
          border: (theme) => `solid 2px ${theme.palette.background.default}`,
        }}
      />
      <Typography variant="h4">Enter our application</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="button"
        variant="contained"
        onClick={() => {
          router.push(PATH_AFTER_LOGIN);
        }}
      >
        Enter
      </LoadingButton>
    </Stack>
  );

  return (
    <Box>
      {renderHead}

      {renderForm}
    </Box>
  );
}
