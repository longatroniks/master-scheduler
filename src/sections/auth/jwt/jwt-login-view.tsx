import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useSearchParams, useRouter } from 'src/routes/hooks';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// auth
import { useAuthContext } from 'src/auth/hooks';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { Avatar, Box } from '@mui/material';
import { useMockedUser } from 'src/hooks/use-mocked-user';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  // const { login } = useAuthContext();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  // const LoginSchema = Yup.object().shape({
  //   email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  //   password: Yup.string().required('Password is required'),
  // });

  // const defaultValues = {
  //   email: 'demo@minimals.cc',
  //   password: 'demo1234',
  // };

  // const methods = useForm({
  //   resolver: yupResolver(LoginSchema),
  //   defaultValues,
  // });

  // const {
  //   reset,
  //   handleSubmit,
  //   formState: { isSubmitting },
  // } = methods;

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     // await login?.(data.email, data.password);

  //     router.push('/dashboard');
  //     console.log('pimpac');
  //   } catch (error) {
  //     console.error(error);
  //     reset();
  //     setErrorMsg(typeof error === 'string' ? error : error.message);
  //   }
  // });

  const { user } = useMockedUser();
  const renderHead = (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 5 }}>
      <Avatar
        src={user?.photoURL}
        alt="avatar"
        sx={{
          width: 36,
          height: 36,
          border: (theme) => `solid 2px ${theme.palette.background.default}`,
        }}
      />
      {/* Add your avatar image path */}
      <Typography variant="h4">Enter our application</Typography>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="button"
        variant="contained"
        // loading={isSubmitting}
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
