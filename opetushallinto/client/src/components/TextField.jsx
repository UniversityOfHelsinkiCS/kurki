import MuiTextField from '@material-ui/core/TextField';

const TextField = ({ variant = 'outlined', ...props }) => (
  <MuiTextField variant={variant} {...props} />
);

export default TextField;
