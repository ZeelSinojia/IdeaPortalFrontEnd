import { Avatar } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React from 'react'
import BoxComponent from '../components/BoxComponent'

const useStyles = makeStyles({
	root: {
		minWidth: 250,
	},

	title: {
		fontWeight: 'bold',
	},
	title2: {
		fontWeight: 'bold',
	},
	pos: {
		marginBottom: 12,
	},
})

export default function Cards({
	client,
	theme,
	description,
	dateofposting,
	type,
	nolikes,
	nodislikes,
}) {
	const classes = useStyles()
	return (
		<BoxComponent boxshadow={2} m={0.5} p={0.5} bgcolor='primary.main'>
			<Card variant='outlined' className={classes.root}>
				<CardHeader
					className={classes.title2}
					avatar={
						<Avatar
							aria-label='recipe'
							style={{ background: '#ff9800', color: '#1F1C22' }}>
							{client[0]}
						</Avatar>
					}
					title={client}
					subheader={dateofposting}
				/>
				<CardContent>
					<Typography
						className={classes.title2}
						variant='h6'
						component='p'
						noWrap>
						{theme}
					</Typography>
					{type == 'idea' ? (
						<>
							<Typography>Likes: {nolikes}</Typography>
							<Typography>Dislikes: {nodislikes}</Typography>
						</>
					) : (
						<>
							<Typography className={classes.title2}>{description}</Typography>
						</>
					)}
				</CardContent>
			</Card>
		</BoxComponent>
	)
}
