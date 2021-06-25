import { Button, makeStyles } from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment'
import DescriptionIcon from '@material-ui/icons/Description'
import PostAddIcon from '@material-ui/icons/PostAdd'
import ls from 'local-storage'
import { useRouter } from 'next/router'
import React from 'react'
import clientpartnerservice from '../services/clientpartnerservice'
import ErrorSnackbar from './ErrorSnackbar'
import Input from './InputComponent'
import SuccessSnackbar from './SuccessSnackbar'
import Heading from './TypoComponent'
const useStyles = makeStyles((theme) => ({
	
	btn: {
		border: '0',
		padding: '15px 30px',
		backgroundColor: 'transparent',
		borderRadius: '10px',
		color: 'black',
		fontSize: '15px',
		fontWeight: '300',
	},
	buttonContainer: {
		position: 'relative',
		display: 'inline-block',
		backgroundColor: 'orange',
		borderRadius: '3px',
	},
	file1: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		cursor: 'pointer',
		opacity: '0',
		top: '0',
		right: '0',
	},
}))
const CreateThemeFrom = ({ closeMe }) => {
	const classes = useStyles()
	const router = useRouter()
	const [showsuccess, setShowSuccess] = React.useState(false)
	const [showerror, setShowError] = React.useState(false)
	const [message, setMessage] = React.useState('')
	const [themename, setThemeName] = React.useState('')
	const [themedesc, setThemeDesc] = React.useState('')
	const [themedoc, setThemeDoc] = React.useState([])
	const [close, setClose] = React.useState(false)
	const closeDialog = () => {
		if (!close) {
			return
		}
	}

	const createTheme = async (e) => {
		e.preventDefault()
		const userForm = new FormData()
		userForm.append('userID', ls.get('userid'))
		userForm.append('themeName', themename.trim())
		userForm.append('themeDescription', themedesc.trim())
		if (themedoc.length !== 0) {
			for (let i = 0; i < themedoc.length; i++) {
				userForm.append('files', themedoc[i])
			}
		}
		try {
			const token = ls.get('token')
			clientpartnerservice.setToken(token)
			const res = await clientpartnerservice.createTheme(userForm)
			setThemeName('')
			setThemeDesc('')
			setThemeDoc([])
			setClose(true)
			setShowSuccess(true)
			setMessage(res.statusText)
			setTimeout(() => setShowSuccess(false), 3000)
			console.log(router.asPath, router.basePath)
			if (router.pathname === '/') {
				router.reload()
			} else {
				router.push('/')
			}
		} catch (error) {
			console.log(error)
			setShowError(true)
			setMessage(error.response.data.message)
			setTimeout(() => setShowError(false), 3000)
		}
	}
	return (
		<>
			{showsuccess ? <SuccessSnackbar message={message} /> : <></>}
			{showerror ? <ErrorSnackbar message={message} /> : <></>}
			<Heading variant='h4' position='center'>
				Create Theme
			</Heading>
			<br />

			<form method='post' onSubmit={(e) => createTheme(e)}>
				<Input
					variant='outlined'
					id='name'
					label='Theme Name'
					type='text'
					value={themename}
					onchangefunc={(e) => setThemeName(e.target.value)}
					fullWidth
					InputProps={{
						inputProps: { maxLength: 50 },
						startAdornment: (
							<InputAdornment position='start'>
								<PostAddIcon />
							</InputAdornment>
						),
					}}
				/>
				<br />
				<br />
				<Input
					fullWidth
					variant='outlined'
					id='outlined-multiline-flexible'
					value={themedesc}
					onchangefunc={(e) => setThemeDesc(e.target.value)}
					label='Theme Description'
					multiline
					rows={5}
					InputProps={{
						inputProps: { maxLength: 1200 },
						startAdornment: (
							<InputAdornment position='start'>
								<DescriptionIcon />{' '}
							</InputAdornment>
						),
					}}
				/>
				<br />
				<br />
				<div className={classes.buttonContainer}>
					<button className={classes.btn}>Upload file(s)</button>
					<input
						type='file'
						multiple
						onChange={(e) => setThemeDoc(e.target.files)}
						className={classes.file1}
					/>
				</div>
				<br />
				<br />
				<Heading variant='p'>
					Files uploaded : {Object.keys(themedoc).length}
				</Heading>
				<br />
				<br />
				<div style={{ textAlign: 'center' }}>
					<Button
						type='submit'
						size='medium'
						onClick={close ? closeMe() : closeDialog()}
						style={{ width: '30%' }}
						variant='contained'
						color='primary'>
						Submit
					</Button>
				</div>
				<br />
			</form>
		</>
	)
}

export default CreateThemeFrom
