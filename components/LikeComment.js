import { Grid, List, ListItem, ListItemText } from '@material-ui/core'
import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import InputAdornment from '@material-ui/core/InputAdornment'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import CommentIcon from '@material-ui/icons/Comment'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import GroupIcon from '@material-ui/icons/Group'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ls from 'local-storage'
import React from 'react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import ResetPassword from './ResetPassword'
import Dialog from '@material-ui/core/Dialog'
import MuiDialogContent from '@material-ui/core/DialogContent'
import swal from 'sweetalert'
import clientpartnerservice from '../services/clientpartnerservice'
import employeeservice from '../services/employeeservice'
import userservice from '../services/userservice'
import ButtonComponent from './ButtonComponent'
import ErrorSnackbar from './ErrorSnackbar'
import Iconbutton from './Iconbutton'
import Input from './InputComponent'
import SuccessSnackbar from './SuccessSnackbar'
import Heading from './TypoComponent'

const DialogContent = withStyles((theme) => ({
	root: {
		paddingTop: theme.spacing(4),
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
	},
}))(MuiDialogContent)

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: theme.palette.background.paper,
		position: 'relative',
		overflow: 'auto',
		maxHeight: 100,
	},
	listSection: {
		backgroundColor: 'inherit',
	},
	ul: {
		backgroundColor: 'inherit',
		padding: 0,
	},
	commentSection: {
		backgoundColor: '#ff9800',
	},
	giveComment: {
		margin: theme.spacing(2),
	},
	comment: {
		marginLeft: theme.spacing(2),
	},
	acccordion: {
		marginTop: theme.spacing(4),
		marginLeft: theme.spacing(2),
	},
	paper: { border: '5px solid #ff9800' },
}))
export default function LikeComment({ themeid, ideaid }) {
	const classes = useStyles()
	const [popupOpen, setPopupOpen] = React.useState(false)
	const [resetpassopen, setResetPassOpen] = React.useState(false)
	const [openSignUp, setOpenSignUp] = React.useState(false)
	const [showsuccess, setShowSuccess] = React.useState(false)
	const [showerror, setShowError] = React.useState(false)
	const [message, setMessage] = React.useState('')
	const [comment, setComment] = React.useState('')
	const [data, setData] = React.useState([])
	const [show, setShow] = React.useState('likes')

	React.useEffect(() => {
		async function fetchData() {
			let likes = await userservice.getLikesbyIdeaId(ideaid)
			setData(likes)
		}
		fetchData()
	}, [])
	const handleshow = (event, showing) => {
		setShow(showing)
		showDatabyToggle(showing)
	}
	const showDatabyToggle = async (newshow) => {
		if (newshow === 'likes') {
			setShow('likes')
			const likes = await userservice.getLikesbyIdeaId(ideaid)
			setData(likes)
		} else if (newshow === 'dislikes') {
			setShow('dislikes')
			const dislikes = await userservice.getDislikesbyIdeaId(ideaid)
			setData(dislikes)
		} else if (newshow === 'comments') {
			setShow('comments')
			const comments = await userservice.getCommentsbyIdeaId(ideaid)
			setData(comments)
		} else if (newshow === 'participants') {
			const token = ls.get('token')
			clientpartnerservice.setToken(token)
			setShow('participants')
			const participants = await clientpartnerservice.getParticipantsbyIdea(
				ideaid
			)
			setData(participants)
		}
	}

	const confirmRegisteration = () => {
		swal({
			title: 'Are you sure?',
			text: 'Do you want to participate in this idea?',
			icon: 'info',
			buttons: {
				cancel: {
					text: 'No',
					value: false,
					visible: true,
					closeModal: true,
				},
				confirm: {
					text: 'Yes',
					value: true,
					visible: true,
					closeModal: true,
				},
			},
		}).then((value) => {
			if (value) {
				addParticipant()
			}
		})
	}
	const showLoginAndRegister = () => {
		swal({
			title: 'Please Login or Register to continue',
			text: 'Please login if you are already registered or else register',
			icon: 'info',
			buttons: {
				login: {
					text: 'Login',
					value: 'login',
					visible: true,
					closeModal: true,
				},
				register: {
					text: 'Register',
					value: 'register',
					visible: true,
					closeModal: true,
				},
			},
		}).then((value) => {
			if (value === 'register') {
				handleClickOpenSignup()
			} else if (value === 'login') {
				handleClickOpen()
			}
		})
	}

	const addParticipant = async () => {
		const userForm = {
			user: {
				userID: ls.get('userid'),
			},
			idea: {
				ideaID: ideaid,
			},
			theme: {
				themeID: themeid,
			},
		}
		try {
			const token = ls.get('token')
			employeeservice.setToken(token)

			const res = await employeeservice.addParticipant(userForm)
			setShowSuccess(true)
			setMessage(res.statusText)
			if (show === 'likes') {
				const likes = await userservice.getLikesbyIdeaId(ideaid)
				setData(likes)
			} else if (show === 'dislikes') {
				const dislikes = await userservice.getDislikesbyIdeaId(ideaid)
				setData(dislikes)
			} else if (show === 'comments') {
				const comments = await userservice.getCommentsbyIdeaId(ideaid)
				setData(comments)
			} else if (show === 'participants') {
				clientpartnerservice.setToken(token)
				const participants = await clientpartnerservice.getParticipantsbyIdea(
					ideaid
				)
				setData(participants)
			}
		} catch (error) {
			setShowError(true)
			setMessage(error.response.data.message)
			setTimeout(() => setShowError(false), 2000)
		}
	}

	const likeIdea = async () => {
		const userForm = {
			likeValue: 1,
			idea: { ideaID: ideaid },
			user: {
				userID: ls.get('userid'),
			},
		}
		try {
			const token = ls.get('token')
			userservice.setToken(token)
			const res = await userservice.addLike(userForm)
			setShowSuccess(true)
			setMessage(res.statusText)
			if (show === 'likes') {
				const likes = await userservice.getLikesbyIdeaId(ideaid)
				setData(likes)
			} else if (show === 'dislikes') {
				const dislikes = await userservice.getDislikesbyIdeaId(ideaid)
				setData(dislikes)
			} else if (show === 'comments') {
				const comments = await userservice.getCommentsbyIdeaId(ideaid)
				setData(comments)
			} else if (show === 'participants') {
				clientpartnerservice.setToken(token)
				const participants = await clientpartnerservice.getParticipantsbyIdea(
					ideaid
				)
				setData(participants)
			}
			setTimeout(() => setShowSuccess(false), 1000)
		} catch (error) {
			setShowError(true)
			setMessage(error.response.data.message)
			setTimeout(() => setShowError(false), 1000)
		}
	}

	const dislikeIdea = async () => {
		const userForm = {
			likeValue: 0,
			idea: { ideaID: ideaid },
			user: {
				userID: ls.get('userid'),
			},
		}
		try {
			const token = ls.get('token')
			userservice.setToken(token)
			const res = await userservice.addLike(userForm)
			setShowSuccess(true)
			setMessage(res.statusText)
			if (show === 'likes') {
				const likes = await userservice.getLikesbyIdeaId(ideaid)
				setData(likes)
			} else if (show === 'dislikes') {
				const dislikes = await userservice.getDislikesbyIdeaId(ideaid)
				setData(dislikes)
			} else if (show === 'comments') {
				const comments = await userservice.getCommentsbyIdeaId(ideaid)
				setData(comments)
			} else if (show === 'participants') {
				clientpartnerservice.setToken(token)
				const participants = await clientpartnerservice.getParticipantsbyIdea(
					ideaid
				)
				setData(participants)
			}
			setTimeout(() => setShowSuccess(false), 1000)
		} catch (error) {
			setShowError(true)
			setMessage(error.response.data.message)
			setTimeout(() => setShowError(false), 1000)
		}
	}
	const addComment = async () => {
		const userForm = {
			commentValue: comment,
			idea: { ideaID: ideaid },
			user: {
				userID: ls.get('userid'),
			},
		}
		try {
			const token = ls.get('token')
			if (comment === '') {
				setShowError(true)
				setMessage('Enter a comment')
				setTimeout(() => setShowError(false), 1000)
			} else {
				const res = await userservice.addComment(userForm)
				setComment('')
				setShowSuccess(true)
				setMessage(res.statusText)
			}
			if (show === 'likes') {
				const likes = await userservice.getLikesbyIdeaId(ideaid)
				setData(likes)
			} else if (show === 'dislikes') {
				const dislikes = await userservice.getDislikesbyIdeaId(ideaid)
				setData(dislikes)
			} else if (show === 'comments') {
				const comments = await userservice.getCommentsbyIdeaId(ideaid)
				setData(comments)
			} else if (show === 'participants') {
				clientpartnerservice.setToken(token)
				const participants = await clientpartnerservice.getParticipantsbyIdea(
					ideaid
				)
				setData(participants)
			}
			setTimeout(() => setShowSuccess(false), 1000)
		} catch (error) {
			setShowError(true)
			setMessage(error.response.data.message)
			setTimeout(() => setShowError(false), 1000)
		}
	}

	const handleClickClose = () => {
		setPopupOpen(false)
	}
	const handleClickResetPassOpen = () => {
		handleClickClose()
		setResetPassOpen(true)
	}

	const handleClickOpenSignup = () => {
		handleClickClose()
		setOpenSignUp(true)
	}
	const handleClickCloseSignup = () => {
		setOpenSignUp(false)
	}

	const handleClickOpen = () => {
		handleClickCloseSignup()
		setPopupOpen(true)
	}
	const handleCloseOnsubmitLogin = () => {
		setTimeout(() => handleClickClose(), 1000)
	}
	const handleCloseOnsubmitSignup = () => {
		setTimeout(() => handleClickCloseSignup(), 1000)
	}
	const handleCloseOnsubmitResetPass = () => {
		setTimeout(() => handleClickCloseResetPassword(), 1000)
	}
	const handleClickCloseResetPassword = () => {
		setResetPassOpen(false)
	}
	return (
		<>
			{showsuccess ? <SuccessSnackbar message={message} /> : <></>}
			{showerror ? <ErrorSnackbar message={message} /> : <></>}
			<Grid item sm={12} xs={0}></Grid>
			<Grid item sm={12} xs={0}></Grid>
			<Grid item sm={12} xs={12} align='center'>
				<Iconbutton
					clickfunc={() =>
						!ls.get('logged_in') ? showLoginAndRegister() : likeIdea()
					}>
					<ThumbUpIcon style={{color: 'green'}} fontSize='large' />
				</Iconbutton>
				<span> </span>
				<Iconbutton
					clickfunc={() =>
						!ls.get('logged_in') ? showLoginAndRegister() : dislikeIdea()
					}>
					<ThumbDownIcon style={{color: 'red'}} fontSize='large' />
				</Iconbutton>
			</Grid>
			<Grid item container className={classes.commentSection}>
				<Grid item sm={12} xs={12} align='center'>
					<ToggleButtonGroup
						value={show}
						exclusive
						onChange={handleshow}
						aria-label='text alignment'>
						<ToggleButton value='likes' aria-label='left aligned'>
							<ThumbUpIcon />
						</ToggleButton>
						<ToggleButton value='dislikes' aria-label='centered'>
							<ThumbDownIcon />
						</ToggleButton>
						<ToggleButton value='comments' aria-label='right aligned'>
							<CommentIcon />
						</ToggleButton>
						{ls.get('client_partner') ? (
							<ToggleButton value='participants' aria-label='right aligned'>
								<GroupIcon />
							</ToggleButton>
						) : (
							<></>
						)}
					</ToggleButtonGroup>

					<Accordion className={classes.acccordion}>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls='panel1a-content'
							id='panel1a-header'>
							{show === 'likes' ? (
								<Heading>Likes ({data.totalElements})</Heading>
							) : show === 'dislikes' ? (
								<Heading classname={classes.heading}>
									Dislikes ({data.totalElements})
								</Heading>
							) : show === 'comments' ? (
								<Heading classname={classes.heading}>
									Comments ({data.totalElements})
								</Heading>
							) : show === 'participants' ? (
								<Heading classname={classes.heading}>
									Participants ({data.totalElements})
								</Heading>
							) : (
								<></>
							)}
						</AccordionSummary>
						<AccordionDetails>
							<List className={classes.root}>
								{data.result?.map((item) => (
									<ListItem>
										<ListItemText>
											{show === 'likes' ||
											show === 'dislikes' ||
											show === 'participants' ? (
												item.userName
											) : (
												<></>
											)}
											{show === 'comments' ? (
												`${item.user?.userName}: ${item.commentValue}`
											) : (
												<></>
											)}
										</ListItemText>
									</ListItem>
								))}
							</List>
						</AccordionDetails>
					</Accordion>
				</Grid>
			</Grid>
			<br />
			<Grid item sm={12} xs={12} className={classes.comment}>
				<Input
					id='outlined-multiline-static'
					label='Add a Comment'
					style={{ width: '100%' }}
					multiline
					value={comment}
					onchangefunc={(e) => setComment(e.target.value)}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<CommentIcon />
							</InputAdornment>
						),
					}}
					variant='outlined'
				/>
			</Grid>

			<Grid item sm={12} xs={7} align='right'>
				{ls.get('logged_in') && ls.get('employee') ? (
					<ButtonComponent
						variant='contained'
						color='primary'
						style={{ marginTop: '10px' }}
						size='medium'
						clickfunc={confirmRegisteration}>
						Participate
					</ButtonComponent>
				) : (
					<></>
				)}
				<span> </span>

				<ButtonComponent
					variant='contained'
					style={{ marginTop: '10px' }}
					color='primary'
					size='medium'
					clickfunc={() =>
						!ls.get('logged_in') ? showLoginAndRegister() : addComment()
					}>
					Post
				</ButtonComponent>
			</Grid>

			<Dialog
				fullWidth
				classes={{ paper: classes.paper }}
				onClose={handleClickClose}
				aria-labelledby='form-dialog-title'
				open={popupOpen}>
				<DialogContent dividers>
					<LoginForm
						clickMe={handleClickResetPassOpen}
						closeMe={handleCloseOnsubmitLogin}
						type='likeComment'
					/>
				</DialogContent>
			</Dialog>

			<Dialog
				classes={{ paper: classes.paper }}
				fullWidth
				onClose={handleClickCloseSignup}
				aria-labelledby='form-dialog-title'
				open={openSignUp}>
				<DialogContent style={{ overflow: 'hidden' }} dividers>
					<SignupForm closeMe={handleCloseOnsubmitSignup} type='likeComment' />
				</DialogContent>
			</Dialog>
			<Dialog
				classes={{ paper: classes.paper }}
				fullWidth
				onClose={handleClickCloseResetPassword}
				aria-labelledby='form-dialog-title'
				open={resetpassopen}>
				<DialogContent dividers>
					<ResetPassword closeMe={handleCloseOnsubmitResetPass} />
				</DialogContent>
			</Dialog>
		</>
	)
}
