import Chip from '@material-ui/core/Chip'
import Avatar from '@material-ui/core/Avatar'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme) => ({
	pchip: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: '20rem',
		color: 'black',
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
		width: '15%',
		height: '12%',
		marginLeft: '1%',
		fontSize: '1.3rem',
	},
}))

export default function Chips({
	label2,
	label3,
	variant,
	color,
	avatar,
	label,
}) {
	const classes = useStyles()
	return (
		<>
			<Chip
				style={{
					width: '100%',
					height: '100%',
					display: 'flex',
				}}
				label={
					<section>
						<div
							style={{ fontSize: '1.5rem', textAlign: 'center' }}
							className={classes.pchip}>
							{label}{' '}
						</div>
						<div
							style={{ fontSize: '1rem', textAlign: 'center' }}
							className={classes.pchip}>
							{label2}{' '}
						</div>
						<div
							style={{ fontSize: '1rem', textAlign: 'center' }}
							className={classes.pchip}>
							{label3}
						</div>
					</section>
				}
				variant='outlined'
				color='primary'
				avatar={
					<Avatar
						style={{
							marginRight: '15%',
							height: '60%',
							width: '20%',
							backgroundColor: 'whitesmoke',
						}}
						aria-label='recipe'>
						{avatar}
					</Avatar>
				}
			/>
		</>
	)
}
