import React from 'react'
import userservice from '../../../../../services/userservice'
import ErrorComponent from '../../../../../components/ErrorComponent'
import SpinnerComponent from '../../../../../components/SpinnerComponent'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Grid } from '@material-ui/core'
import Headtag from '../../../../../components/Headtag'
import Heading from '../../../../../components/TypoComponent'
import TableforDoc from '../../../../../components/TableForDoc'
const useStyles = makeStyles((theme) => ({
	outerGrid: {
		border: '2px transparent',
		borderImageSlice: 1,
		borderImageSource: 'linear-gradient(to left, red, orange)',
	},
	innerGrid: {
		margin: theme.spacing(2),
		border: '5px solid',
		borderImageSlice: 1,
		padding: theme.spacing(2),
		borderImageSource: 'linear-gradient(to left, red, orange)',
		borderRadius: '5px',
	},
	title: {
		textAlign: 'center',
		padding: '2%',
	},
}))

export default function ThemeDocuments() {
	const router = useRouter()
	const classes = useStyles()
	const { data, error } = userservice.getIdeabyId(router.query.ideaid)
	const documents = data?.data?.result?.artifacts
	const ideaname = data?.data?.result?.ideaName
	console.log(documents)
	if (error) return <ErrorComponent />
	if (!data) return <SpinnerComponent />
	return (
		<>
			<Headtag title={'Idea documents' + router.query.ideaid} />
			{documents.length > 0 ? (
				<Heading variant='h4' classname={classes.title}>
					Documents for {ideaname}
				</Heading>
			) : (
				<div></div>
			)}

			<Card>
				<Grid container className={classes.outerGrid}>
					{documents.length > 0 ? (
						<Grid
							container
							alignItems='center'
							justify='center'
							className={classes.innerGrid}>
							<TableforDoc documents={documents} />
						</Grid>
					) : (
						<Grid container alignItems='center' justify='center'>
							<Heading variant='h5'>
								No documents uploaded for {ideaname}
							</Heading>
						</Grid>
					)}
				</Grid>
			</Card>
		</>
	)
}
