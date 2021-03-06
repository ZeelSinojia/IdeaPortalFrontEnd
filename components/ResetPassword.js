import Button from '@material-ui/core/Button'
import InputAdornment from '@material-ui/core/InputAdornment'
import EmailIcon from '@material-ui/icons/Email'
import React from 'react'
import userservice from '../services/userservice'
import ErrorSnackbar from './ErrorSnackbar'
import Input from './InputComponent'
import SuccessSnackbar from './SuccessSnackbar'
import TypoComponent from './TypoComponent'

export default function ResetPassword({ closeMe }) {
	const [showsuccess, setShowSuccess] = React.useState(false)
	const [showerror, setShowError] = React.useState(false)
	const [message, setMessage] = React.useState('')
	const [email, setEmail] = React.useState('')
	const [close, setClose] = React.useState(false)

	const closeDialog = () => {
		if (!close) {
			return
		}
	}

	const resetpassword = async (e) => {
		e.preventDefault()
		const userForm = { userEmail: email }
		try {
			const res = await userservice.resetPassword(userForm)
			setEmail('')
			setShowSuccess(true)
			setMessage(res.statusText)
			setClose(true)
		} catch (error) {
			setShowError(true)
			setMessage(error.response.data.message)
			setTimeout(() => setShowError(false), 3000)
		}
	}
	return (
		<>
			{showsuccess ? <SuccessSnackbar message={message} /> : <></>}
			{showerror ? <ErrorSnackbar message={message} /> : <></>}
			<TypoComponent variant='h4' position='center'>
				Reset Password
			</TypoComponent>
			<br />
			<form align='center' onSubmit={(e) => resetpassword(e)}>
				{' '}
				<Input
					id='outlined-basic'
					label='Email '
					variant='outlined'
					fullWidth
					type='email'
					value={email}
					onchangefunc={(e) => setEmail(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<EmailIcon />
							</InputAdornment>
						),
					}}
				/>
				<br />
				<br />
				<Button
					type='submit'
					variant='contained'
					color='primary'
					size='medium'
					onClick={close ? closeMe() : closeDialog()}
					align='center'>
					Send Email
				</Button>
			</form>
		</>
	)
}
