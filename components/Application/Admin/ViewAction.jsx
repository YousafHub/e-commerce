import { ListItemIcon, MenuItem } from '@mui/material'
import Link from 'next/link'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

const ViewAction = ({ href }) => {
  return (
    <MenuItem key='view'>
        <Link className='flex items-center' href={href}>
            <ListItemIcon>
            <RemoveRedEyeIcon />
            </ListItemIcon>
            View
        </Link>
    </MenuItem>
  )
}

export default ViewAction