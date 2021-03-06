import axios from 'axios'
import useSWR from 'swr'

let token = null

const setToken = (Token) => {
	token = Token
}

const baseUrl = process.env.BASE_URL + '/api/user'
const fetcher = (url) =>
	axios.get(url, { headers: { Authorization: 'Bearer ' + token } })

const createIdea = async (userForm) => {
	const config = {
		headers: { Authorization: 'Bearer ' + token },
	}

	const response = await axios.post(`${baseUrl}/create/idea`, userForm, config)
	return response?.data
}

const getProductManagerIdeas = (userid) => {
	const { data, error } = useSWR(
		[`${baseUrl}/myideas/${userid}`, token],
		fetcher
	)
	return { data, error }
}

export default { createIdea, setToken, getProductManagerIdeas }
