import React, { useState } from "react";
import "./modal.css";
import axios from "axios";

interface Joke {
	joke: string;
	author: string;
}
interface AddModalProps {
	onJokeAdded: (joke: Joke) => void;
}
export default function AddModal({ onJokeAdded }: AddModalProps) {
	const [modal, setModal] = useState(false);
	const [joke, setJoke] = useState("");
	const [author, setAuthor] = useState("");
	const [error, setError] = useState<string | null>(null);

	const toggleModal = () => {
		setModal(!modal);
	};

	const handleSubmit = async (event: React.FormEvent) => {
		console.log(event.target);
		event.preventDefault();
		if (!joke || !author) {
			setError("Both fields are required.");
			return;
		}

		try {
			const response = await axios.post("http://localhost:8000/add/", {
				joke,
				author,
			});
			console.log(response);
			if (response.data.id) {
				toggleModal();
				onJokeAdded({
					author: response.data.author,
					joke: response.data.joke,
				});
			}
		} catch (err) {
			setError("Failed to add joke. Please try again.");
		}
	};
	if (modal) {
		document.body.classList.add("active-modal");
	} else {
		document.body.classList.remove("active-modal");
	}

	return (
		<>
			<button
				onClick={toggleModal}
				className='btn-modal'
			>
				Add Joke
			</button>

			{modal && (
				<div className='modal'>
					<div
						onClick={toggleModal}
						className='overlay'
					></div>
					<div className='modal-content'>
						<h2>Add a Joke</h2>
						<form onSubmit={handleSubmit}>
							<fieldset>
								<legend>Joke</legend>

								<textarea
									placeholder='Write joke here'
									required
									minLength={1}
									maxLength={300}
									name='joke'
									value={joke}
									onChange={(e) => setJoke(e.target.value)}
								></textarea>

								<label>
									Author:
									<input
										id='author'
										type='text'
										minLength={1}
										maxLength={50}
										title='Author name can only contain letters, spaces, hyphens, apostrophes, and periods.'
										required
										name='author'
										value={author}
										onChange={(e) => setAuthor(e.target.value)}
									/>
								</label>
							</fieldset>
							<button type='submit'>Submit</button>
						</form>

						<button
							className='close-modal'
							onClick={toggleModal}
						>
							CLOSE
						</button>
					</div>
				</div>
			)}
		</>
	);
}
