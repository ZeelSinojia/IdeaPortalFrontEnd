import { Button } from '@material-ui/core'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles } from '@material-ui/core/styles'
import DescriptionIcon from '@material-ui/icons/Description'
import PostAddIcon from '@material-ui/icons/PostAdd'
import ls from 'local-storage'
import { useRouter } from 'next/router'
import React from 'react'
import productmanagerservice from '../services/productmanagerservice'
import ErrorSnackbar from './ErrorSnackbar'
import Input from './InputComponent'
import SuccessSnackbar from './SuccessSnackbar'
import Heading from './TypoComponent'
const useStyles = makeStyles({
	title: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	title2: {
		fontWeight: 'bold',
	},
	pos: {
		marginBottom: 12,
	},
	paper: {
		border: '5px solid #ff9800',
	},
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
	list: {
		border: '1px solid grey',
		padding: '10px',
		borderRadius: '3px',
		width: 'fit-content',
	},
})

const CreateIdeaFrom = ({ closeMe, themeid }) => {
	const classes = useStyles()
	const [showsuccess, setShowSuccess] = React.useState(false)
	const [showerror, setShowError] = React.useState(false)
	const [message, setMessage] = React.useState('')
	const [close, setClose] = React.useState(false)
	const [ideaname, setIdeaName] = React.useState('')
	const [ideadesc, setIdeaDesc] = React.useState('')
	const [ideadoc, setIdeaDoc] = React.useState([])
	const router = useRouter()

	const closeDialog = () => {
		if (!close) {
			return
		}
	}

	const createIdea = async (e) => {
		e.preventDefault()
		const userForm = new FormData()
		userForm.append('userID', ls.get('userid'))
		userForm.append('themeID', themeid)
		userForm.append('ideaName', ideaname.trim())
		userForm.append('ideaDescription', ideadesc.trim())

		if (ideadoc.length !== 0) {
			for (let i = 0; i < ideadoc.length; i++) {
				userForm.append('files', ideadoc[i])
			}
		}
		try {
			const token = ls.get('token')
			productmanagerservice.setToken(token)
			const res = await productmanagerservice.createIdea(userForm)
			setShowSuccess(true)
			setMessage(res.statusText)
			setClose(true)
			setIdeaName('')
			setIdeaDesc('')
			setIdeaDoc([])
			setTimeout(() => setShowSuccess(false), 3000)
			router.push('/theme/' + router.query.themeid + '/ideas')
		} catch (error) {
			setShowError(true)
			setMessage(error.response.data.message)
			setTimeout(() => setShowError(false), 3000)
		}
	}
	return (
		<div>
			{showsuccess ? <SuccessSnackbar message={message} /> : <></>}
			{showerror ? <ErrorSnackbar message={message} /> : <></>}
			<Heading variant='h4' position='center'>
				Create Idea
			</Heading>
			<br />

			<form method='post' onSubmit={(e) => createIdea(e)}>
				<Input
					variant='outlined'
					id='name'
					label='Idea Name'
					type='text'
					value={ideaname}
					onchangefunc={(e) => setIdeaName(e.target.value)}
					fullWidth
					InputProps={{
						inputProps: { maxLength: 150 },
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
					value={ideadesc}
					rows={5}
					onchangefunc={(e) => setIdeaDesc(e.target.value)}
					label='Idea Description'
					multiline
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
						onChange={(e) => setIdeaDoc(e.target.files)}
						className={classes.file1}
					/>
				</div>
				<br />
				<br />
				<Heading variant='p'>
					Files uploaded : {Object.keys(ideadoc).length}
				</Heading>
				<br />
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
		</div>
	)
}

export default CreateIdeaFrom
