import { Button } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

function CallToAction() {
	return (
		<>
			<div className="flex border border-teal-500 p-3 justify-center items-center rounded-tl-3xl rounded-br-3xl flex-col sm:flex-row text-center">
				<div className="flex-1 justify-center flex flex-col">
					<h2 className="text-2xl">
						Want to learn HTML, CSS and JavaScript by building fun and engaging
						projects?
					</h2>
					<p className="text-gray-500 my-2">
						Check our 100 js prjects website and start building your own
						projects
					</p>

					<Button gradientDuoTone="purpleToPink">
						<Link to="https://www.100jsprojects.com/">
							100 JS Projects Website
						</Link>
					</Button>
				</div>
				<div className="flex-1 p-7">
					<img src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221114110410/Top-10-JavaScript-Project-Ideas-For-Beginners-2023.png" />
				</div>
			</div>
		</>
	);
}

export default CallToAction;
