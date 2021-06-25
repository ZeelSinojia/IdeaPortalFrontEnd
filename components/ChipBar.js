import { Grid } from '@material-ui/core'
import Chips from '../components/Chip'
import ls from 'local-storage'
import userservice from '../services/userservice'
import { makeStyles } from '@material-ui/core/styles'
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects'
import BallotIcon from '@material-ui/icons/Ballot'
import React from 'react'
const useStyles = makeStyles((theme) => ({
	pchip: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: '20rem',
	},
	small: {
		width: theme.spacing(3),
		height: theme.spacing(3),
	},
	large: {
		width: theme.spacing(7),
		height: theme.spacing(7),
	},
	chipStyle: {
		width: '100%',
		height: '100%',
		marginLeft: '1%',
		fontSize: '1.3rem',
		color: 'black',
	},
}))

const ChipBar = () => {
	const classes = useStyles()
	const [ideacount, setIdeaCount] = React.useState(0)
	const [themecount, setThemeCount] = React.useState(0)
	const [cpcount, setCpCount] = React.useState(0)
	const [pmcount, setPmCount] = React.useState(0)
	const [empcount, setEmpCount] = React.useState(0)
	React.useEffect(() => {
		const token = ls.get('token')
		async function fetchData() {
			if (token) {
				userservice.setToken(token)
				const themes = await userservice.getNoOfThemes()
				console.log(themes)
				setThemeCount(themes.result)
				const ideas = await userservice.getNoOfIdeas()
				console.log(ideas)
				setIdeaCount(ideas.result)
				const users = await userservice.getNoOfUsers()
				setCpCount(users.result['Client Partner'])
				setPmCount(users.result['Product Manager'])
				setEmpCount(users.result['Employee'])
			} else {
				return
			}
		}
		fetchData()
	})

	return (
		<>
			<br></br>
			<Grid container spacing={2} sm={12} xs={12} justify='center'>
				<Grid item xs={12} sm={2}>
					<Chips label={themecount} label2='Themes' avatar={<BallotIcon />} />
				</Grid>
				<Grid item xs={12} sm={2}>
					<Chips label={ideacount} label2='Ideas' avatar={<EmojiObjectsIcon />}
					/>
				</Grid>
				<Grid item xs={12} sm={2}>
					<Chips label={cpcount} label2='Client' label3='Partners' />
				</Grid>
				<Grid item xs={12} sm={2}>
					<Chips label={pmcount} label2='Product' label3='Managers' />
				</Grid>
				<Grid item xs={12} sm={2}>
					<Chips label={empcount} label2='Employees' />
				</Grid>
			</Grid>
			<br />
		</>
	)
}

export default ChipBar
