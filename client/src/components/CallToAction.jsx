import { Button } from "flowbite-react";
import React from "react";
import portfolioImage from "../portfolioImage.png";
import { Link } from "react-router-dom";

function CallToAction() {
	return (
		<>
			<div className="flex border border-teal-500 p-3 justify-center items-center rounded-tl-3xl rounded-br-3xl flex-col sm:flex-row text-center">
				<div className="flex-1 justify-center flex flex-col gap-5">
					<h2 className="text-2xl">
						Explore my portfolio and see the exciting projects I've created.
					</h2>

					<Button gradientDuoTone="purpleToPink">
						<Link to="https://www.100jsprojects.com/">Visit My Portfolio</Link>
					</Button>
				</div>
				<div className="flex-1 p-7">
					<img src={portfolioImage} />
				</div>
			</div>
		</>
	);
}

export default CallToAction;
