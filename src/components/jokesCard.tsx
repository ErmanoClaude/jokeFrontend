import AddModal from "./Modal/addJokeModal";
import axios from "axios";
import { useState, useEffect } from "react";

interface Joke {
	joke: string;
	author: string;
}

function JokesCard() {
	const [jokes, setJokes] = useState<Joke[]>([]);
	const [error, setError] = useState(null);
	const [currentJoke, setCurrentJoke] = useState<Joke | null>(null);
	useEffect(() => {
		fetchJokes();
	}, []);

	// sets random joke to currentjoke
	const setRandomJoke = (jokesArray: Joke[]) => {
		const randomIndex = Math.floor(Math.random() * jokesArray.length);
		setCurrentJoke(jokesArray[randomIndex]);
	};

	// sets the last joke
	const setLastJoke = (jokesArray: Joke[]) => {
		setCurrentJoke(jokesArray[jokesArray.length - 1]);
	};

	// gets random joke from jokes when button is clicked for new joke
	const handleNewJokeClick = async () => {
		await fetchJokes();
		setRandomJoke(jokes);
	};

	// For when joke is added from array
	const handleNewJoke = async (joke: Joke) => {
		setCurrentJoke(joke);
	};

	// fetch jokes from api
	const fetchJokes = async () => {
		try {
			const response = await axios.get("http://18.216.236.149:8000/");

			setJokes(response.data);

			if (response.data.length > 0) {
				setLastJoke(response.data);
			}
		} catch (err) {
			setError(err);
		}
	};

	return (
		<>
			<div className='modal'>
				<h1 className='joke-text'>{currentJoke?.joke}</h1>
				<h4 id='author'>- {currentJoke?.author}</h4>
				<AddModal onJokeAdded={handleNewJoke} />
				<button
					id='new'
					onClick={handleNewJokeClick}
				>
					New Random joke
				</button>
			</div>
		</>
	);
}

export default JokesCard;
